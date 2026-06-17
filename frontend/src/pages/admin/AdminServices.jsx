import AdminCRUD from './AdminCRUD';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'icon', label: 'Icon' },
  { key: 'order', label: 'Order' },
];

const formFields = {
  title: { label: 'Title', required: true },
  shortDescription: { label: 'Short Description', type: 'textarea' },
  description: { label: 'Full Description', type: 'textarea' },
  icon: { label: 'Icon Name (e.g. FiCamera)', placeholder: 'FiCamera' },
  image: { label: 'Image', type: 'file' },
  order: { label: 'Order', type: 'number' },
};

export default function AdminServices() {
  return <AdminCRUD title="Services" endpoint="/services" columns={columns} formFields={formFields} />;
}
