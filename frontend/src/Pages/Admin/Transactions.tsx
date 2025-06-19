import CrudManager from '../../components/CrudManager';
import {useApi} from '../../hooks/useApi.ts';

export interface Transaction {
  id: number;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  date: string;
  description: string;
  related_project_id: number;
  related_client_id: number;
  categories: number[];
}

const Transactions = () => {
  const {data: projectsRaw, isLoading: projectsAreLoading} = useApi('projects');
  const {data: clientsRaw, isLoading: clientsAreLoading} = useApi('clients');
  const {data: categoriesRaw, isLoading: categoriesAreLoading} = useApi('transaction-categories');

  if (projectsAreLoading || clientsAreLoading || categoriesAreLoading) return <p>Loading...</p>;

  const projects = projectsRaw.map((d) => ({
    value: d.id.toString(),
    label: d.name,
  }));

  const clients = clientsRaw.map((d) => ({
    value: d.id.toString(),
    label: d.name,
  }));

  // Format categories for the filter dropdown
  const categoryOptions = categoriesRaw.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  return (
    <CrudManager
      title='Transactions'
      apiEndpoint='transactions'
      fields={[
        {key: 'type', label: 'Type (Income/Outgoing)', type: 'select',
        options: [
          {
            value: 'income',
            label: 'Income'
          },
          {
            value: 'expense',
            label: 'Expense'
          },
          {
            value: 'transfer',
            label: 'Transfer'
          }
        ]},
        {key: 'amount', label: 'Amount', type: 'number'},
        {key: 'date', label: 'Date', type: 'date'},
        {key: 'description', label: 'Description', type: 'text'},
        {
          key: 'related_project_id',
          label: 'Project ID',
          type: 'select',
          editable: true,
          options: projects,
        },
        {
          key: 'related_client_id',
          label: 'Client ID',
          type: 'autocomplete',
          editable: true,
          options: clients,
        },
        {
          key: 'categories',
          label: 'Category',
          type: 'multiselect',
          editable: true,
          creatable: true,
          filterable: true,
          options: categoryOptions
        },
      ]}
    />
  );
};

export default Transactions;
