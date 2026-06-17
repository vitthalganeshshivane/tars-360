import AdminCRUD from './AdminCRUD';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'website', label: 'Website' },
  { key: 'order', label: 'Order' },
];

const formFields = {
  name: { label: 'Client Name', required: true },
  logo: { label: 'Logo', type: 'file' },
  website: { label: 'Website URL' },
  order: { label: 'Order', type: 'number' },
};

export default function AdminClients() {
  return <AdminCRUD title="Clients" endpoint="/clients" columns={columns} formFields={formFields} imageField="logo" />;
}
