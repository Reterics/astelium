import {CrudField} from './components/CrudManager.tsx';
import {TableColumn} from './components/TableComponent.tsx';
import {TransactionChartData} from './components/visualizations/TransactionChartCard.tsx';

export const getCSRFToken = () => {
  return document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');
};

export const getXsrfToken = () => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const getFetchOptions = () =>
  ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      /*'X-CSRF-TOKEN': getCSRFToken() || '',
      'X-XSRF-TOKEN': getXsrfToken() || '',
      'X-Inertia': 'true',*/
    },
    credentials: 'include',
  }) as RequestInit;

export const fieldsToColumns = (fields: CrudField<any>[]) => {
  return fields
    .filter((field) => field.visible !== false)
    .map((field) => ({
      key: field.name,
      name: field.name,
      label: field.label,
      sortable: !!field.sortable,
      editable: !!field.editable,
      type: field.type,
      options: field.options || [],
    })) as TableColumn[];
};

export function transformTransactionData(
  transactions: Record<string, any>[]
): TransactionChartData[] {
  if (transactions.length === 0) return [];

  // Sort transactions chronologically
  transactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Determine the earliest transaction date
  const earliestDate = new Date(
    Math.min(...transactions.map((t) => new Date(t.date).getTime()))
  );

  const currentDate = new Date();
  const allMonths: string[] = [];

  // Generate all months from the earliest transaction to the current date
  for (
    let year = earliestDate.getFullYear();
    year <= currentDate.getFullYear();
    year++
  ) {
    const startMonth =
      year === earliestDate.getFullYear() ? earliestDate.getMonth() + 1 : 1;
    const endMonth =
      year === currentDate.getFullYear() ? currentDate.getMonth() + 1 : 12;

    for (let month = startMonth; month <= endMonth; month++) {
      allMonths.push(`${year}-${String(month).padStart(2, '0')}`);
    }
  }

  let runningBalance = 0; // Ensures balance is carried forward

  // Group transactions by "YYYY-MM"
  const monthlyData = allMonths.map((time) => {
    const [year, month] = time.split('-').map(Number);

    const monthlyTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });

    const income = monthlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const outgoing = monthlyTransactions
      .filter((t) => t.type === 'outgoing')
      .reduce((sum, t) => sum + t.amount, 0);

    runningBalance += income - outgoing; // Accumulate balance

    return {
      time,
      income,
      outgoing,
      balance: runningBalance, // Keeps cumulative balance
    };
  });

  return monthlyData;
}
