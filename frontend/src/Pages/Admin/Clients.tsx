import CrudManager from '../../components/CrudManager';

const Clients = () => {
  return (
    <CrudManager
      title='Clients'
      apiEndpoint='clients'
      fields={[
        {key: 'name', label: 'Client Name', type: 'text', editable: true},
        {key: 'email', label: 'Email', type: 'text', editable: true},
        {key: 'phone', label: 'Phone', type: 'text', editable: true},
        {key: 'company', label: 'Company', type: 'text', editable: true},
        {
          key: 'type',
          label: 'Type',
          type: 'select',
          editable: true,
          options: [
            {
              value: 'PERSON',
              label: 'Person',
            },
            {
              value: 'COMPANY_HU',
              label: 'HU Company',
            },
            {
              value: 'COMPANY_EU',
              label: 'EU Company',
            },
            {
              value: 'COMPANY',
              label: 'Company',
            },
          ],
        },
        {
          key: 'vat_status',
          label: 'Vat Status',
          type: 'select',
          editable: true,
          options: [
            {
              value: 'PRIVATE_PERSON',
              label: 'Private Person',
            },
            {
              value: 'DOMESTIC',
              label: 'Domestic',
            },
            {
              value: 'OTHER',
              label: 'Other',
            },
          ],
        },
      ]}
    />
  );
};

export default Clients;
