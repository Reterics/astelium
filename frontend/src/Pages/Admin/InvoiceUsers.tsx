import CrudManager from '../../components/CrudManager';

const InvoiceUsers = () => {
  return (
    <CrudManager
      title='Invoice Users'
      apiEndpoint='invoice-users'
      fields={[
        {
          name: 'supplierName',
          label: 'Supplier Name',
          type: 'text',
          editable: true,
        },
        {
          name: 'supplierTaxNumber',
          label: 'Tax Number',
          type: 'text',
          editable: true,
        },
        {
          name: 'supplierAddress',
          label: 'Address',
          type: 'text',
          editable: true,
        },
        {
          name: 'supplierCountry',
          label: 'Country',
          type: 'text',
          editable: true,
        },
        {
          name: 'supplierBankAccountNumber',
          label: 'Bank Account',
          type: 'text',
          editable: true,
        },
      ]}
    />
  );
};

export default InvoiceUsers;
