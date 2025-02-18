import {useState} from 'react';
import {useApi} from '../../hooks/useApi';
import TableComponent from '../../components/TableComponent';
import InvoiceModal from '../../components/InvoiceModal';

interface Invoice {
  id?: number;
  number: string;
  issue_date: string;
  due_date: string;
  client: string;
  items: any[];
}

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
    <div className=''>
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
          setCurrentInvoice({
            number: '',
            issue_date: '',
            due_date: '',
            client: '',
            items: [],
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
