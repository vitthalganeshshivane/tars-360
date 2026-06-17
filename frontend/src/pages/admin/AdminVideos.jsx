import AdminCRUD from './AdminCRUD';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'location', label: 'Location', render: (v, item) => `${v || '-'}, ${item.country || ''}` },
  { key: 'views', label: 'Views' },
  { key: 'duration', label: 'Duration' },
  { key: 'featured', label: 'Featured', render: (v) => v ? '⭐' : '-' },
];

const formFields = {
  title: { label: 'Title', required: true, placeholder: 'Video title' },
  description: { label: 'Description', type: 'textarea' },
  thumbnail: { label: 'Thumbnail', type: 'file' },
  videoUrl: { label: 'Video URL', placeholder: 'YouTube/Vimeo URL or embed link' },
  duration: { label: 'Duration', placeholder: '3:45' },
  location: { label: 'Location', placeholder: 'City' },
  country: { label: 'Country' },
  tags: { label: 'Tags (comma separated)' },
  featured: { label: 'Featured', type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
};

export default function AdminVideos() {
  return <AdminCRUD title="360 Videos" endpoint="/videos" columns={columns} formFields={formFields} imageField="thumbnail" />;
}
