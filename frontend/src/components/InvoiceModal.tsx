import {useState} from 'react';
import FormModal from './FormModal';
import TableComponent from './TableComponent';
import {useApi} from '../hooks/useApi.ts';

interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Invoice {
  id?: number;
  number: string;
  issue_date: string;
  due_date: string;
  client: string;
  items: InvoiceItem[];
}

const InvoiceModal = ({
  onClose,
  invoice,
  setInvoice,
  onSave,
}: {
  onClose: () => void;
  invoice: Invoice;
  setInvoice: (invoice: Invoice) => void;
  onSave: () => void;
}) => {
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

  const [items, setItems] = useState<InvoiceItem[]>(invoice.items || []);

  if (isUsersLoading || isClientsLoading) return <p>Loading...</p>;

  const deleteItem = (index: number) => {
    const updatedItems = [...invoice.items];
    updatedItems.splice(index, 1);
    setInvoice({...invoice, items: updatedItems});
  };

  return (
    <FormModal
      title={invoice.id ? 'Edit Invoice' : 'Create Invoice'}
      onClose={onClose}
      data={invoice as Record<string, any>}
      onSave={onSave}
      cols={4}
      fields={[
        {
          key: 'invoice_user_id',
          label: 'Invoice User',
          type: 'select',
          editable: true,
          options: invoiceUsers,
        },
        {
          key: 'client_id',
          label: 'Client',
          type: 'select',
          editable: true,
          options: clients,
        },
        {key: 'number', label: 'Invoice Number', type: 'text', editable: true},
        {
          key: 'invoice_issue_date',
          label: 'Issue Date',
          type: 'date',
          editable: true,
        },
        {
          key: 'invoice_delivery_date',
          label: 'Delivery Date',
          type: 'date',
          editable: true,
        },
        {
          key: 'invoice_payment_date',
          label: 'Payment Date',
          type: 'date',
          editable: true,
        },
        {
          key: 'invoice_category',
          label: 'Category',
          type: 'select',
          editable: true,
          options: ['SIMPLIFIED', 'NORMAL', 'AGGREGATE'].map((d) => ({
            value: d,
            label: d,
          })),
        },
        {
          key: 'invoice_currency',
          label: 'Currency',
          type: 'select',
          editable: true,
          options: ['HUF'].map((d) => ({value: d, label: d})),
        },
        {
          key: 'invoice_payment_method',
          label: 'Payment Method',
          type: 'select',
          editable: true,
          options: ['CASH', 'TRANSFER', 'CARD', 'VOUCHER', 'OTHER'].map(
            (d) => ({value: d, label: d})
          ),
        },
        {
          key: 'invoice_appearance',
          label: 'Appearance',
          type: 'select',
          editable: true,
          options: ['ELECTRONIC', 'PAPER', 'EDI', 'UNKNOWN'].map((d) => ({
            value: d,
            label: d,
          })),
        },
        {
          key: 'invoice_exchange_rate',
          label: 'Exchange Rate',
          type: 'number',
          editable: true,
        },
      ]}
    >
      <h2 className='text-lg font-semibold mb-2'>Invoice Items</h2>
      <TableComponent
        columns={[
          {
            key: 'lineNatureIndicator',
            label: 'Type',
            type: 'select',
            options: ['SERVICE', 'PRODUCT', 'OTHER'].map((d) => ({
              value: d,
              label: d,
            })),
          },
          {
            key: 'product_code_category',
            label: 'TESZOR',
            type: 'select',
            options: [
              'OWN',
              'VTSZ',
              'SZJ',
              'KN',
              'AHK',
              'CSK',
              'KT',
              'EJ',
              'TESZOR',
              'OTHER',
            ].map((d) => ({value: d, label: d})),
          },
          {
            key: 'product_code_value',
            label: 'Code',
            type: 'text',
          },
          {
            key: 'line_description',
            label: 'Description',
            type: 'text',
          },
          {key: 'quantity', label: 'Quantity', type: 'number'},
          {
            key: 'unit_of_measure',
            label: 'Unit',
            type: 'select',
            options: [
              'PIECE',
              'KILOGRAM',
              'TON',
              'KWH',
              'DAY',
              'HOUR',
              'MINUTE',
              'MONTH',
              'LITER',
              'KILOMETER',
              'CUBIC_METER',
              'METER',
              'LINEAR_METER',
              'CARTON',
              'PACK',
              'OWN',
            ].map((d) => ({value: d, label: d})),
          },

          {
            key: 'unit_price',
            label: 'Unit Price',
            type: 'number',
          },
          {
            key: 'line_net_amount',
            label: 'Net Amount',
            type: 'number',
          },
          {
            key: 'line_vat_rate',
            label: 'Vat(%)',
            type: 'number',
          },
          {
            key: 'line_vat_amount',
            label: 'Vat(HUF)',
            type: 'number',
          },
          {key: 'line_gross_amount', label: 'Gross', type: 'number'},
        ]}
        data={items}
        noSearch={true}
        addPerLine={true}
        pagination={false}
        onDelete={(index) => deleteItem(Number(index))}
        onCreate={(item) => {
          if (item) {
            setItems([...items, item as InvoiceItem]);
            return true;
          }
        }}
      />

      <div className='flex flex-row justify-between'>
        <div />
        <div className='p-3 pb-1 shadow-md bg-zinc-50 rounded-lg w-1/4'>
          <h2 className='text-lg font-semibold mb-2'>Summary</h2>

          <table className='w-full border-collapse border border-zinc-300 mb-4'>
            <tbody>
              <tr>
                <td className='bg-zinc-200 text-left text-sm font-medium text-zinc-900 border border-zinc-300 p-2 cursor-pointer'>
                  Subtotal
                </td>
                <td className='p-2 border-b border-zinc-300'>0 Ft</td>
              </tr>
              <tr>
                <td className='bg-zinc-200 text-left text-sm font-medium text-zinc-900 border border-zinc-300 p-2 cursor-pointer'>
                  Tax
                </td>
                <td className='p-2 border-b border-zinc-300'>27%</td>
              </tr>
              <tr>
                <td className='bg-zinc-200 text-left text-sm font-medium text-zinc-900 border border-zinc-300 p-2 cursor-pointer'>
                  Total
                </td>
                <td className='p-2 border-b border-zinc-300'>0 FT</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </FormModal>
  );
};

export default InvoiceModal;
