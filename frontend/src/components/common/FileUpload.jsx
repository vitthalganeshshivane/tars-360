import { useState, useRef, createContext, useContext } from 'react';
import { FiUploadCloud, FiX, FiRefreshCw, FiFile, FiImage, FiFilm, FiFileText } from 'react-icons/fi';
import './FileUpload.css';

const FileUploadContext = createContext();

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(type) {
  if (!type) return <FiFile size={16} />;
  if (type.startsWith('image/')) return <FiImage size={16} />;
  if (type.startsWith('video/')) return <FiFilm size={16} />;
  if (type.includes('pdf')) return <FiFileText size={16} />;
  return <FiFile size={16} />;
}

function getFileExtension(name) {
  return name.split('.').pop()?.toUpperCase() || '';
}

// Root
function Root({ children }) {
  return <div className="file-upload">{children}</div>;
}

// DropZone
function DropZone({ onDropFiles, isDisabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDisabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isDisabled && e.dataTransfer.files.length > 0) {
      onDropFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (!isDisabled) inputRef.current?.click();
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      onDropFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div
      className={`file-upload__dropzone ${isDragging ? 'file-upload__dropzone--dragging' : ''} ${isDisabled ? 'file-upload__dropzone--disabled' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <div className="file-upload__dropzone-icon">
        <FiUploadCloud size={28} />
      </div>
      <div className="file-upload__dropzone-text">
        <span className="file-upload__dropzone-primary">Click to upload</span> or drag and drop
      </div>
      <div className="file-upload__dropzone-hint">Images and videos up to 100MB</div>
    </div>
  );
}

// List
function List({ children }) {
  if (!children || (Array.isArray(children) && children.every(c => !c))) return null;
  return <div className="file-upload__list">{children}</div>;
}

// ListItemProgressBar
function ListItemProgressBar({ id, name, type, size, progress, failed, onDelete, onRetry }) {
  const ext = getFileExtension(name);
  const isComplete = progress === 100 && !failed;
  const isFailed = failed;

  return (
    <div className={`file-upload__item ${isFailed ? 'file-upload__item--failed' : ''} ${isComplete ? 'file-upload__item--complete' : ''}`}>
      <div className="file-upload__item-icon">
        {getFileIcon(type)}
      </div>
      <div className="file-upload__item-info">
        <div className="file-upload__item-header">
          <span className="file-upload__item-name">{name}</span>
          <span className="file-upload__item-meta">
            {ext && <span className="file-upload__item-ext">{ext}</span>}
            {size && <span className="file-upload__item-size">{formatFileSize(size)}</span>}
          </span>
        </div>
        {!isFailed && (
          <div className="file-upload__progress">
            <div className="file-upload__progress-track">
              <div
                className={`file-upload__progress-bar ${isComplete ? 'file-upload__progress-bar--complete' : ''}`}
                style={{ width: `${progress || 0}%` }}
              />
            </div>
            <span className="file-upload__progress-text">{progress || 0}%</span>
          </div>
        )}
        {isFailed && (
          <div className="file-upload__item-error">Upload failed</div>
        )}
      </div>
      <div className="file-upload__item-actions">
        {isFailed && onRetry && (
          <button className="file-upload__item-btn file-upload__item-btn--retry" onClick={onRetry} title="Retry">
            <FiRefreshCw size={14} />
          </button>
        )}
        {onDelete && (
          <button className="file-upload__item-btn file-upload__item-btn--delete" onClick={onDelete} title="Remove">
            <FiX size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

const FileUpload = { Root, DropZone, List, ListItemProgressBar };

export { FileUpload, formatFileSize, getFileIcon };
export default FileUpload;
