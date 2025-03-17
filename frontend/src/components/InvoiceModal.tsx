import {ReactNode, useEffect, useState} from 'react';
import FormModal from './FormModal';
import TableComponent, {TableRow} from './TableComponent';
import {useApi} from '../hooks/useApi.ts';
import {SelectOption} from "./SelectComponent.tsx";
import {lineVatRateNormal, lineVatRateSimplified} from "../utils/invoiceUtils.ts";
import {useTranslation} from "react-i18next";
import {getTranslatedList} from "../i18n/utils.ts";

interface InvoiceItem {
  id?: number;
  lineNatureIndicator: 'SERVICE'|'PRODUCT'|'OTHER';
  product_code_category: 'OWN'|'VTSZ'|'SZJ'|'KN'|'AHK'|'CSK'|'KT'|'EJ'|'TESZOR'|'OTHER';
  product_code_value: string;
  line_description: string;
  quantity: number;
  unit_of_measure: 'PIECE'|'KILOGRAM'|'TON'|'KWH'|'DAY'|'HOUR'|'MINUTE'|'MONTH'|'LITER'|'KILOMETER'|'CUBIC_METER'|'METER'|'LINEAR_METER'|'CARTON'|'PACK'|'OWN';
  unit_price: number;
  line_net_amount: number;
  line_vat_rate: number;
  line_vat_amount: number;
  line_gross_amount: number;
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
  const {t} = useTranslation();
  const translationPrefix = 'invoice.';
  const currencyName = 'Ft';

  const invoiceUsers = invoiceUsersRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const clients = clientsRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const [items, setItems] = useState<InvoiceItem[]>(invoice.items || []);
  const [itemToAdd, setItemToAdd] = useState<TableRow>({})

  const [invoiceCategory, setInvoiceCategory] = useState<'SIMPLIFIED'|'NORMAL'>('SIMPLIFIED');
  const [lineVatRate, setLineVatRate] = useState<SelectOption[]>(lineVatRateSimplified);
  const [summary, setSummary] = useState({
    subTotal: 0,
    tax: 0,
    taxType: lineVatRate[0].label,
    total: 0,
  })

  useEffect(() => {
    setSummary(items.reduce((sum, currentValue)=> {
      sum.subTotal += currentValue.line_net_amount;
      sum.tax += currentValue.line_vat_amount;
      sum.total += currentValue.line_gross_amount;
      const vatRate = lineVatRate
        .find(v=> String(v.value) === String(currentValue.line_vat_rate));
      if (vatRate) {
        sum.taxType = vatRate.label;
      }

      return sum;
    }, {
      subTotal: 0,
      tax: 0,
      taxType: lineVatRate[0].label,
      total: 0,
    }))
  }, [items, lineVatRate])
  if (isUsersLoading || isClientsLoading) return <p>Loading...</p>;

  const deleteItem = (index: number) => {
    const updatedItems = [...invoice.items];
    updatedItems.splice(index, 1);
    setInvoice({...invoice, items: updatedItems});
  };

  const calculateFromUnitPrice = function (form: TableRow) {
    if (form.quantity && form.quantity.includes(",")) {
      form.quantity = form.quantity.replace(",",".");
    }
    if (form.unit_price && form.unit_price.includes(",")) {
      form.unit_price = form.unit_price.replace(",",".");
    }

    const lineNetAmountData = parseInt(form.line_net_amount);
    const lineVatRate = parseFloat(form.line_vat_rate);
    // const ratePercentage  = parseFloat((lineVatRate*100).toFixed(2));

    const quantity = parseFloat(form.quantity);
    const unitPrice = parseInt(form.unit_price);

    if (invoiceCategory === "SIMPLIFIED") {
      if (!Number.isNaN(quantity) && !Number.isNaN(unitPrice)) {
        form.line_gross_amount = quantity * unitPrice
      }
      if (!Number.isNaN(form.line_gross_amount) && !Number.isNaN(lineVatRate)) {
        const vatValue = (form.line_gross_amount * lineVatRate).toFixed(2);
        form.line_vat_amount = vatValue
        form.line_net_amount = form.line_gross_amount - Number(vatValue)
      }
    }else{
      if (!Number.isNaN(quantity) && !Number.isNaN(unitPrice)) {
        form.line_net_amount = quantity * unitPrice
      }

      if (!Number.isNaN(lineNetAmountData) && !Number.isNaN(lineVatRate)) {
        form.line_vat_amount = (lineNetAmountData * lineVatRate).toFixed(2)
      }
      form.line_gross_amount = form.line_net_amount + form.line_vat_amount
    }

    return form;
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
          props: {
            onChange: (value: unknown) => {
              if ((value as string).toLowerCase() === 'simplified') {
                setLineVatRate(lineVatRateSimplified);
              } else {
                setLineVatRate(lineVatRateNormal);
              }
              setInvoiceCategory(value as 'SIMPLIFIED' | 'NORMAL');
            },
          },
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
            options: getTranslatedList(
              ['SERVICE', 'PRODUCT', 'OTHER'],
              t,
              translationPrefix
            ),
          },
          {
            key: 'product_code_category',
            label: 'TESZOR',
            type: 'select',
            options: getTranslatedList(
              [
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
              ],
              t,
              translationPrefix
            ),
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
          {
            key: 'quantity',
            label: 'Quantity',
            type: 'number',
            props: {
              onChange: (_value, form) => calculateFromUnitPrice(form),
            },
          },
          {
            key: 'unit_of_measure',
            label: 'Unit',
            type: 'select',
            options: getTranslatedList(
              [
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
              ],
              t,
              translationPrefix
            ),
          },

          {
            key: 'unit_price',
            label: 'Unit Price',
            type: 'number',
            props: {
              onChange: (_value, form) => calculateFromUnitPrice(form),
            },
          },
          {
            key: 'line_net_amount',
            label: 'Net Amount',
            type: 'number',
          },
          {
            key: 'line_vat_rate',
            label: 'Vat(%)',
            type: 'select',
            options: lineVatRate,
            props: {
              onChange: (_value, form) => {
                setSummary((prevSummary) =>
                  ({...prevSummary, taxType: lineVatRate.find(v => v.value === _value)!.label as ReactNode}))
                return calculateFromUnitPrice(form);
              },
            },
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
        itemToAdd={itemToAdd}
        setItemToAdd={setItemToAdd}
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
          <h2 className='text-lg font-semibold mb-2'>{t('Summary')}</h2>

          <table className='w-full border-collapse border border-zinc-300 mb-4'>
            <tbody>
              <tr>
                <td className='bg-zinc-200 text-left text-sm font-medium text-zinc-900 border border-zinc-300 p-2 cursor-pointer'>
                  {t('Subtotal')}
                </td>
                <td className='p-2 border-b border-zinc-300'>
                  {summary.subTotal} {currencyName}
                </td>
              </tr>
              <tr>
                <td className='bg-zinc-200 text-left text-sm font-medium text-zinc-900 border border-zinc-300 p-2 cursor-pointer'>
                  {t('Tax')}
                </td>
                <td className='p-2 border-b border-zinc-300'>
                  {summary.taxType}
                </td>
              </tr>
              <tr>
                <td className='bg-zinc-200 text-left text-sm font-medium text-zinc-900 border border-zinc-300 p-2 cursor-pointer'>
                  {t('Total')}
                </td>
                <td className='p-2 border-b border-zinc-300'>
                  0 {currencyName}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </FormModal>
  );
};

export default InvoiceModal;
