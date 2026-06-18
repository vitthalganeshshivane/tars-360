import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit2, FiTrash2, FiUpload, FiX, FiLink } from 'react-icons/fi';
import API from '../../api/axios';
import SEO from '../../components/common/SEO';
import { FileUpload } from '../../components/common/FileUpload';

export default function AdminCRUD({ title, endpoint, columns, formFields, imageField = 'image' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [preview, setPreview] = useState(null);
  const [uploadModes, setUploadModes] = useState({});
  const [uploadFiles, setUploadFiles] = useState({});

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`${endpoint}/admin/all`);
      setItems(data.data || data || []);
    } catch {
      try {
        const { data } = await API.get(endpoint);
        setItems(data.data || data || []);
      } catch { setItems([]); }
    }
    finally { setLoading(false); }
  }, [endpoint]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleUpload = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total && onProgress) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        }
      });
      return data.data?.url || data.url || data.file?.url || null;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Upload failed';
      alert(`Upload error: ${msg}`);
      return null;
    }
  };

  const handleFileDrop = (fieldKey, files) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      failed: false,
      fileObject: file,
    }));

    setUploadFiles((prev) => ({
      ...prev,
      [fieldKey]: [...newFiles, ...(prev[fieldKey] || [])],
    }));

    newFiles.forEach(({ id, fileObject }) => {
      handleUpload(fileObject, (progress) => {
        setUploadFiles((prev) => ({
          ...prev,
          [fieldKey]: (prev[fieldKey] || []).map((f) =>
            f.id === id ? { ...f, progress, failed: progress === 100 ? false : f.failed } : f
          ),
        }));
      }).then((url) => {
        if (url) {
          setUploadFiles((prev) => ({
            ...prev,
            [fieldKey]: (prev[fieldKey] || []).map((f) =>
              f.id === id ? { ...f, progress: 100, url } : f
            ),
          }));
          setValue(fieldKey, url);
          setPreview(url);
        } else {
          setUploadFiles((prev) => ({
            ...prev,
            [fieldKey]: (prev[fieldKey] || []).map((f) =>
              f.id === id ? { ...f, failed: true, progress: 0 } : f
            ),
          }));
        }
      });
    });
  };

  const handleFileDelete = (fieldKey, fileId) => {
    setUploadFiles((prev) => ({
      ...prev,
      [fieldKey]: (prev[fieldKey] || []).filter((f) => f.id !== fileId),
    }));
  };

  const handleFileRetry = (fieldKey, fileId) => {
    const file = (uploadFiles[fieldKey] || []).find((f) => f.id === fileId);
    if (!file) return;

    setUploadFiles((prev) => ({
      ...prev,
      [fieldKey]: (prev[fieldKey] || []).map((f) =>
        f.id === fileId ? { ...f, failed: false, progress: 0 } : f
      ),
    }));

    handleUpload(file.fileObject, (progress) => {
      setUploadFiles((prev) => ({
        ...prev,
        [fieldKey]: (prev[fieldKey] || []).map((f) =>
          f.id === fileId ? { ...f, progress } : f
        ),
      }));
    }).then((url) => {
      if (url) {
        setUploadFiles((prev) => ({
          ...prev,
          [fieldKey]: (prev[fieldKey] || []).map((f) =>
            f.id === fileId ? { ...f, progress: 100, url } : f
          ),
        }));
        setValue(fieldKey, url);
        setPreview(url);
      } else {
        setUploadFiles((prev) => ({
          ...prev,
          [fieldKey]: (prev[fieldKey] || []).map((f) =>
            f.id === fileId ? { ...f, failed: true, progress: 0 } : f
          ),
        }));
      }
    });
  };

  const toggleUploadMode = (key) => {
    setUploadModes((prev) => ({ ...prev, [key]: prev[key] === 'url' ? 'file' : 'url' }));
    setValue(key, '');
    setPreview(null);
  };

  const onSubmit = async (data) => {
    let payload = { ...data };

    for (const [key, field] of Object.entries(formFields)) {
      if (field.type !== 'file') continue;

      const mode = uploadModes[key] || 'url';
      if (mode === 'file') {
        const files = uploadFiles[key] || [];
        const completedFile = files.find((f) => f.progress === 100 && f.url && !f.failed);
        if (completedFile) {
          payload[key] = completedFile.url;
        } else if (files.length > 0) {
          alert('Please wait for uploads to complete');
          return;
        } else if (!editing) {
          payload[key] = '';
        }
      }
      // url mode — value is already in the form field via register
    }

    try {
      if (editing) {
        await API.put(`${endpoint}/${editing._id}`, payload);
      } else {
        await API.post(endpoint, payload);
      }
      setShowModal(false);
      setEditing(null);
      reset();
      setPreview(null);
      setUploadModes({});
      setUploadFiles({});
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving');
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    const modes = {};
    Object.keys(formFields).forEach((key) => {
      const value = typeof item[key] === 'object' && item[key]?._id ? item[key]._id : item[key] || '';
      setValue(key, value);
      if (formFields[key].type === 'file') {
        modes[key] = 'url';
        if (item[key]) setPreview(item[key]);
      }
    });
    setUploadModes(modes);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.delete(`${endpoint}/${id}`);
      fetchItems();
    } catch (err) { alert(err.response?.data?.message || 'Error deleting'); }
  };

  const openNew = () => {
    setEditing(null);
    reset();
    setPreview(null);
    setUploadModes({});
    setUploadFiles({});
    setShowModal(true);
  };

  return (
    <>
      <SEO title={`Manage ${title}`} />
      <div className="admin-crud">
        <div className="admin-crud__header">
          <div>
            <h1>{title}</h1>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>{items.length} total items</p>
          </div>
          <button className="btn btn-primary" onClick={openNew}><FiPlus size={18} /> Add New</button>
        </div>

        <div className="admin-crud__table-wrapper">
          <table className="admin-crud__table">
            <thead>
              <tr>
                <th>Image</th>
                {columns.map((col) => <th key={col.key}>{col.label}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: 40 }}>No items found</td></tr>
              ) : items.map((item) => (
                <tr key={item._id}>
                  <td><img src={item[imageField] || 'https://picsum.photos/100/60'} alt="" /></td>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(item[col.key], item) : (item[col.key] || '-')}
                    </td>
                  ))}
                  <td>
                    <div className="admin-crud__actions">
                      <button className="admin-crud__btn admin-crud__btn--edit" onClick={() => handleEdit(item)}><FiEdit2 size={14} /></button>
                      <button className="admin-crud__btn admin-crud__btn--delete" onClick={() => handleDelete(item._id)}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal__header">
                <h2>{editing ? `Edit ${title}` : `Add ${title}`}</h2>
                <button className="admin-modal__close" onClick={() => setShowModal(false)}><FiX size={18} /></button>
              </div>
              <div className="admin-modal__body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="admin-form-grid">
                    {Object.entries(formFields).map(([key, field]) => {
                      if (field.type === 'file') {
                        const mode = uploadModes[key] || 'url';
                        const files = uploadFiles[key] || [];
                        return (
                          <div className={`form-group form-group--full`} key={key}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                              <label className="form-label" style={{ marginBottom: 0 }}>{field.label}</label>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button type="button" className={`upload-toggle ${mode === 'url' ? 'upload-toggle--url' : 'upload-toggle--file'}`} onClick={() => toggleUploadMode(key)}>
                                  {mode === 'url' ? <><FiLink size={14} /> URL</> : <><FiUpload size={14} /> Upload</>}
                                </button>
                              </div>
                            </div>

                            {mode === 'url' ? (
                              <>
                                <input
                                  type="url"
                                  {...register(key, field.required ? { required: `${field.label} is required` } : {})}
                                  placeholder="https://example.com/image.jpg"
                                  onChange={(e) => { setPreview(e.target.value); }}
                                />
                                {preview && <img src={preview} alt="" className="admin-crud__upload-preview" />}
                              </>
                            ) : (
                              <FileUpload.Root>
                                <FileUpload.DropZone
                                  onDropFiles={(dropped) => handleFileDrop(key, dropped)}
                                />
                                <FileUpload.List>
                                  {files.map((file) => (
                                    <FileUpload.ListItemProgressBar
                                      key={file.id}
                                      {...file}
                                      onDelete={() => handleFileDelete(key, file.id)}
                                      onRetry={() => handleFileRetry(key, file.id)}
                                    />
                                  ))}
                                </FileUpload.List>
                              </FileUpload.Root>
                            )}
                            {errors[key] && <p className="form-error">{errors[key].message}</p>}
                          </div>
                        );
                      }
                      if (field.type === 'textarea') {
                        return (
                          <div className={`form-group form-group--full`} key={key}>
                            <label className="form-label">{field.label}</label>
                            <textarea rows={4} {...register(key, field.required ? { required: `${field.label} is required` } : {})} placeholder={field.placeholder || ''} />
                            {errors[key] && <p className="form-error">{errors[key].message}</p>}
                          </div>
                        );
                      }
                      if (field.type === 'select') {
                        return (
                          <div className="form-group" key={key}>
                            <label className="form-label">{field.label}</label>
                            <select {...register(key, field.required ? { required: `${field.label} is required` } : {})}>
                              <option value="">Select...</option>
                              {field.options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                          </div>
                        );
                      }
                      if (field.type === 'number') {
                        return (
                          <div className="form-group" key={key}>
                            <label className="form-label">{field.label}</label>
                            <input type="number" {...register(key, field.required ? { required: `${field.label} is required` } : {})} placeholder={field.placeholder || ''} />
                          </div>
                        );
                      }
                      return (
                        <div className="form-group" key={key}>
                          <label className="form-label">{field.label}</label>
                          <input type={field.type || 'text'} {...register(key, field.required ? { required: `${field.label} is required` } : {})} placeholder={field.placeholder || ''} />
                          {errors[key] && <p className="form-error">{errors[key].message}</p>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="admin-modal__actions">
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={uploading}>
                      {uploading ? 'Uploading...' : editing ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
