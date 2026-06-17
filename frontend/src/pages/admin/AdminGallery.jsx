import AdminCRUD from './AdminCRUD';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'location', label: 'Location' },
  { key: 'featured', label: 'Featured', render: (v) => v ? '⭐' : '-' },
];

const formFields = {
  title: { label: 'Title', required: true },
  image: { label: 'Image', type: 'file' },
  location: { label: 'Location' },
  tags: { label: 'Tags (comma separated)' },
  featured: { label: 'Featured', type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
};

export default function AdminGallery() {
  return <AdminCRUD title="Gallery" endpoint="/gallery" columns={columns} formFields={formFields} imageField="image" />;
}
