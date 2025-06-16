import {TransactionChartData} from '../components/visualizations/TransactionChartCard.tsx';

function getAppBasePath(appUrl: string) {
  try {
    const app = new URL(appUrl);
    let base = app.pathname;

    if (!base || base  === '/') return '';
    if (base.endsWith('/')) base = base.slice(0, -1);

    return base;
  } catch {
    return '';
  }
}

export const baseURL = getAppBasePath(
  (window as Window & typeof globalThis & {APP_URL: string}).APP_URL || ''
);

export const getCSRFToken = () => {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match
    ? decodeURIComponent(match[1])
    : document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
};

export const getFetchOptions = (noContentType?: boolean) => {
  const options = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    } as Record<string, string>,
    credentials: 'include',
  };

  if (!noContentType) {
    options.headers['Content-Type'] = 'application/json';
    options.headers['Accept'] = 'application/json';
    options.headers['X-Requested-With'] = 'X-Requested-With';
  }
  return options as RequestInit;
};

export interface AutocompleteData
  extends Record<string, string | number | null> {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}
export const addressAutocomplete = async (q: string) => {
  if (!q.trim()) {
    return [];
  }
  const response = await fetch(
    `/api/address-autocomplete?q=${encodeURIComponent(q)}`,
    {
      ...getFetchOptions(),
    }
  );
  if (response.ok) {
    const data = await response.json();
    if (Array.isArray(data)) {
      return data as AutocompleteData[];
    }
  }
  return [];
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

export function isObjectEmpty(obj: object) {
  for (const _ in obj) return false;
  return true;
}
