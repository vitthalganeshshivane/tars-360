import AdminCRUD from './AdminCRUD';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'location', label: 'Location', render: (v, item) => `${v || '-'}, ${item.country || ''}` },
  { key: 'views', label: 'Views' },
  { key: 'featured', label: 'Featured', render: (v) => v ? '⭐' : '-' },
];

const formFields = {
  title: { label: 'Title', required: true, placeholder: 'Photo title' },
  description: { label: 'Description', type: 'textarea', placeholder: 'Description...' },
  thumbnail: { label: 'Thumbnail Image', type: 'file' },
  panoramaImage: { label: 'Panorama Image', type: 'file' },
  location: { label: 'Location', placeholder: 'City' },
  country: { label: 'Country', placeholder: 'Country' },
  tags: { label: 'Tags (comma separated)', placeholder: 'nature, travel, 360' },
  featured: { label: 'Featured', type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
};

export default function AdminPhotos() {
  return <AdminCRUD title="360 Photos" endpoint="/photos" columns={columns} formFields={formFields} imageField="thumbnail" />;
}
