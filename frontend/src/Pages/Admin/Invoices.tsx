import {useApi} from '../../hooks/useApi';
import TableComponent from '../../components/TableComponent';
import InvoiceModal, {Invoice} from '../../components/InvoiceModal';
import mountComponent from '../../components/mounter.tsx';

const InvoicesPage = () => {
  const {
    data: invoices,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useApi('invoices');
  const {data: invoiceUsersRaw, isLoading: isUsersLoading} =
    useApi('invoice-users');
  const {data: clientsRaw, isLoading: isClientsLoading} = useApi('clients');

  const invoiceUsers = invoiceUsersRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const clients = clientsRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const handleSave = async (invoice: Invoice) => {
    if (invoice.id) {
      await updateMutation.mutateAsync(
        invoice as Record<string, any> & {id: number}
      );
    } else {
      await createMutation.mutateAsync(invoice);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className='p-2'>
      <TableComponent
        columns={[
          {
            key: 'number',
            label: 'Invoice Number',
            sortable: true,
            type: 'number',
          },
          {
            key: 'issue_date',
            label: 'Issue Date',
            sortable: true,
            type: 'date',
          },
          {key: 'due_date', label: 'Due Date', sortable: true, type: 'date'},
          {key: 'client', label: 'Client', sortable: true, type: 'number'},
        ]}
        data={invoices || []}
        onEdit={() => {
          //setCurrentInvoice(invoice);
        }}
        onDelete={(id) => handleDelete(id as number)}
        onCreate={async () => {
          const today = new Date().toISOString().split('T')[0];

          if (isUsersLoading || isClientsLoading)
            return alert('Users and clients are loading');

          const currentInvoice = await mountComponent(InvoiceModal, {
            invoiceUsers,
            clients,
            initialInvoice: {
              number:
                'INV-' + (invoices.length + 1).toString().padStart(5, '0'),
              items: [],
              invoice_appearance: 'ELECTRONIC',
              invoice_delivery_date: today,
              invoice_exchange_rate: 1,
              invoice_issue_date: today,
              invoice_payment_date: today,
              invoice_category: 'SIMPLIFIED',
              invoice_currency: 'HUF',
              invoice_payment_method: 'TRANSFER',
            },
          });
          if (currentInvoice) {
            await handleSave(currentInvoice);
          }
        }}
      />
    </div>
  );
};

export default InvoicesPage;
