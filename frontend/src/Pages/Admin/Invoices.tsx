import {useState} from 'react';
import {useApi} from '../../hooks/useApi';
import TableComponent from '../../components/TableComponent';
import InvoiceModal, {Invoice} from '../../components/InvoiceModal';


const InvoicesPage = () => {
  const {
    data: invoices,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useApi('invoices');
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  const handleSave = async (invoice: Invoice) => {
    if (invoice.id) {
      await updateMutation.mutateAsync(
        invoice as Record<string, any> & {id: number}
      );
    } else {
      await createMutation.mutateAsync(invoice);
    }
    setCurrentInvoice(null);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="p-2 bg-zinc-50">
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
        onCreate={() => {
          const today = new Date().toISOString().split('T')[0];
          setCurrentInvoice({
            number: 'INV-' + ((invoices.length + 1).toString().padStart(5, '0')),
            items: [],
            invoice_appearance: 'ELECTRONIC',
            invoice_delivery_date: today,
            invoice_exchange_rate: 1,
            invoice_issue_date: today,
            invoice_payment_date: today,
            invoice_category: 'SIMPLIFIED',
            invoice_currency: 'HUF',
            invoice_payment_method: 'TRANSFER'
          });
        }}
      />

      {currentInvoice && (
        <InvoiceModal
          onClose={() => setCurrentInvoice(null)}
          invoice={currentInvoice!}
          setInvoice={setCurrentInvoice}
          onSave={() => handleSave(currentInvoice!)}
        />
      )}
    </div>
  );
};

export default InvoicesPage;
