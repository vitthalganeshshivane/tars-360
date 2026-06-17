import AdminCRUD from './AdminCRUD';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'company', label: 'Company' },
  { key: 'rating', label: 'Rating' },
  { key: 'featured', label: 'Featured', render: (v) => v ? '⭐' : '-' },
];

const formFields = {
  name: { label: 'Client Name', required: true },
  role: { label: 'Role' },
  company: { label: 'Company' },
  content: { label: 'Testimonial', type: 'textarea', required: true },
  avatar: { label: 'Avatar', type: 'file' },
  rating: { label: 'Rating (1-5)', type: 'number' },
  featured: { label: 'Featured', type: 'select', options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
};

export default function AdminTestimonials() {
  return <AdminCRUD title="Testimonials" endpoint="/testimonials" columns={columns} formFields={formFields} imageField="avatar" />;
}
