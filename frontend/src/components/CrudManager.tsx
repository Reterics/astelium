import TableComponent, {TableAction, TableRow} from './TableComponent.tsx';
import FormModal from './FormModal.tsx';
import {SelectOption, SelectOptions} from './SelectComponent.tsx';
import {useApi} from '../hooks/useApi.ts';
import {confirm} from './confirm';
import mountComponent from './mounter.tsx';

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
  actions,
}: CrudManagerProps) => {
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
    <div className='p-2 bg-zinc-50'>
      {!childOnly && (
        <TableComponent
          columns={fields.filter((f) => f.visible !== false)}
          data={processedData}
          onDelete={async (id) => {
            const response = await confirm(
              'Are you sure to delete this component?'
            );
            if (response) {
              deleteMutation.mutate(id as number);
            }
          }}
          onCreate={async () => {
            const form = await mountComponent(FormModal, {
              title: 'Create ' + title,
              fields: fields.filter((filter) => filter.creatable !== false),
              data: {},
            });
            if (form) {
              await saveData(form as Partial<T>);
            }
          }}
          onEdit={async (changesArray) => {
            const changedKeysSet = new Set<string>();

            const updatedRows = changesArray.map((row) => {
              const originalRow = processedData.find((r) => r.id === row.id);
              const changedFields = Object.keys(row) as (keyof TableRow)[];

              const result: Record<string, any> = {
                id: row.id,
              };

              changedFields.forEach((key) => {
                changedKeysSet.add(key as string);

                result[`original_${key}`] = originalRow?.[key];
                result[key] = row[key];
              });

              return result;
            });

            const changedFields: CrudField[] = [];

            fields.forEach((field) => {
              if (changedKeysSet.has(field.key)) {
                changedFields.push(
                  {
                    ...field,
                    key: `original_${field.key}`,
                    label: `Original ${field.label}`,
                    editable: false,
                  },
                  {
                    ...field,
                    key: field.key,
                    label: `New ${field.label}`,
                  }
                );
              }
            });

            const content = (
              <div className='min-w-[50vw]'>
                <div className='pb-1'>
                  Are you sure to apply the following changes?
                </div>
                <div className='overflow-y-auto max-h-[40vh]'>
                  <TableComponent
                    noSearch={true}
                    pagination={false}
                    columns={changedFields}
                    data={updatedRows}
                  ></TableComponent>
                </div>
              </div>
            );
            const response = await confirm(content);
            if (response) {
              for (let i = 0; i < changesArray.length; i++) {
                const change = changesArray[i] as Partial<T>;
                await saveData(change);
              }
            }
          }}
          actions={actions}
        ></TableComponent>
      )}

      {children}
    </div>
  );
};

export default CrudManager;
