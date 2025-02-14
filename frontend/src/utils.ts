import {CrudField} from './components/CrudManager.tsx';
import {TableColumn} from './components/TableComponent.tsx';

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
