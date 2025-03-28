import {useState} from 'react';
import TableComponent, {TableAction, TableRow} from './TableComponent.tsx';
import FormModal from './FormModal.tsx';
import {SelectOption, SelectOptions} from './SelectComponent.tsx';
import {useApi} from '../hooks/useApi.ts';
import {confirm} from "./confirm";

export type FieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'password'
  | 'datetime-local'
  | 'image';

export interface CrudField {
  key: string;
  label: string;
  type: FieldType;
  editable?: boolean;
  creatable?: boolean;
  sortable?: boolean;
  visible?: boolean;
  options?: SelectOptions;
  props?: {
    onChange?: (value: unknown, row: TableRow) => any;
  };
}

interface CrudManagerProps {
  title: string;
  apiEndpoint: string;
  fields: CrudField[];
  children?: React.ReactNode;
  childOnly?: boolean;
  actions?: TableAction[];
}

const CrudManager = <T extends Record<string, any>>({
  title,
  apiEndpoint,
  fields,
  children,
  childOnly,
  actions
}: CrudManagerProps) => {
  const [modalData, setModalData] = useState<Partial<T> | false>(false);

  const {data, isLoading, createMutation, deleteMutation, updateMutation} =
    useApi(apiEndpoint);

  const saveData = async (
    body: Partial<T> & {id?: number}
  ): Promise<boolean> => {
    if (body.id) {
      await updateMutation.mutateAsync(body as Partial<T> & {id: number});
    } else {
      await createMutation.mutateAsync(body);
    }

    setModalData(false);
    return true;
  };

  if (isLoading) return <p>Loading...</p>;

  const idFilters = fields.filter(
    (field) => field.options?.filter((f) => f && typeof f === 'object').length
  );

  const processedData: Partial<T>[] = idFilters.length
    ? data.map((item: Record<string, any>) => {
        const out = {...item};
        idFilters.forEach((filter) => {
          const key = filter.key;
          if (item[key] && !filter.editable) {
            out[key] = ((filter.options as SelectOption[]).find(
              (f: SelectOption) => String(item[key]) === String(f.value)
            )?.label || item[key]) as T[keyof T & string];
          } else if (
            item[key] &&
            filter.editable &&
            filter.type === 'multiselect' &&
            !Array.isArray(item[key])
          ) {
            out[key] = item[key].toString().split(', ');
          } else if (Array.isArray(item[key]) && item[key].length) {
            // TODO: Remove this temporary workaround
            out[key] = item[key].map((f: {id: number} | string) =>
              typeof f === 'object' ? f.id.toString() : f
            );
          }
        });
        return out as Partial<T>;
      })
    : (data as Partial<T>[]);

  return (
    <div>
      {!childOnly && (
        <TableComponent
          columns={fields.filter((f) => f.visible !== false)}
          data={processedData}
          onDelete={(id) => deleteMutation.mutate(id as number)}
          onCreate={() => {
            setModalData({});
          }}
          onEdit={async (changes) => {
            const response = await confirm('Are you sure to save?');
            if (response) {
              for (let i = 0; i < changes.length; i++) {
                const change = changes[i] as Partial<T>;
                await saveData(change);
              }
            }
          }}
          actions={actions}
        ></TableComponent>
      )}

      {children}

      {modalData && (
        <FormModal
          title={(modalData.id ? 'Edit ' : 'Create ') + title}
          onClose={() => setModalData(false)}
          fields={fields.filter((filter) => filter.creatable !== false)}
          data={modalData}
          onSave={(form) => {
            return saveData(form as Partial<T>);
          }}
        />
      )}
    </div>
  );
};

export default CrudManager;
