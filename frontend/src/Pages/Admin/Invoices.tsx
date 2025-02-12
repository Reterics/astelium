import CrudManager from '../../components/CrudManager';
import { useApi } from "../../hooks/useApi.ts";

const Invoices = () => {
  const { data: invoiceUsers, isLoading: isLoadingUsers } = useApi('invoice-users');
  const { data: clients, isLoading: isLoadingClients } = useApi('clients');

  if (isLoadingUsers || isLoadingClients) return <p>Loading...</p>;

  const invoiceUserOptions = invoiceUsers.map((u: { id: any; supplierName: any }) => ({
    value: u.id,
    label: u.supplierName,
  }));

  const clientOptions = clients.map((c: { id: any; customerName: any }) => ({
    value: c.id,
    label: c.customerName,
  }));

  return (
    <CrudManager
      title="Invoices"
      apiEndpoint="invoices"
      fields={[
        { name: "supplier_id", label: "Supplier", type: "select", options: invoiceUserOptions },
        { name: "customer_id", label: "Customer", type: "select", options: clientOptions },
        { name: "invoiceNumber", label: "Invoice Number", type: "text", editable: true },
        { name: "invoiceCategory", label: "Category", type: "select", options: ['SIMPLIFIED', 'NORMAL', 'AGGREGATE'], editable: true },
        { name: "invoiceIssueDate", label: "Issue Date", type: "date", editable: true },
        { name: "invoicePaymentMethod", label: "Payment Method", type: "select", options: ['CASH', 'TRANSFER', 'CARD', 'VOUCHER'], editable: true },
        { name: "invoiceGrossAmount", label: "Total Amount", type: "number", editable: true },
      ]}
    />
  );
};

export default Invoices;
