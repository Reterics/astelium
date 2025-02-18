import CrudManager from '../../components/CrudManager';

const InvoiceUsers = () => {
  return (
    <CrudManager
      title='Invoice Users'
      apiEndpoint='invoice-users'
      fields={[
        {
          key: 'supplierName',
          label: 'Supplier Name',
          type: 'text',
          editable: true,
        },
        {
          key: 'supplierTaxNumber',
          label: 'Tax Number',
          type: 'text',
          editable: true,
        },
        {
          key: 'supplierAddress',
          label: 'Address',
          type: 'text',
          editable: true,
        },
        {
          key: 'supplierCountry',
          label: 'Country',
          type: 'text',
          editable: true,
        },
        {
          key: 'supplierBankAccountNumber',
          label: 'Bank Account',
          type: 'text',
          editable: true,
        },
      ]}
    />
  );
};

export default InvoiceUsers;
