import AdminCRUD from './AdminCRUD';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'location', label: 'Location', render: (v, item) => `${v || '-'}, ${item.country || ''}` },
  { key: 'views', label: 'Views' },
  { key: 'featured', label: 'Featured', render: (v) => v ? '⭐' : '-' },
];

const formFields = {
  title: { label: 'Title', required: true },
  description: { label: 'Description', type: 'textarea' },
  coverImage: { label: 'Cover Image', type: 'file' },
  tourUrl: { label: 'Tour Embed URL', placeholder: 'YouTube/Vimeo URL or 360° tour embed link' },
  location: { label: 'Location' },
  country: { label: 'Country' },
  tags: { label: 'Tags (comma separated)' },
  featured: { label: 'Featured', type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
};

export default function AdminTours() {
  return <AdminCRUD title="Virtual Tours" endpoint="/tours" columns={columns} formFields={formFields} imageField="coverImage" />;
}
