import {useState} from 'react';
import {fieldsToColumns} from '../utils.ts';
import TableComponent from './TableComponent.tsx';
import FormModal from './FormModal.tsx';
import {SelectOption, SelectOptions} from './SelectComponent.tsx';
import {useApi} from "../hooks/useApi.ts";

export interface CrudField<T> {
  name: keyof T & string;
  label: string;
  type: string;
  editable?: boolean;
  sortable?: boolean;
  visible?: boolean;
  options?: SelectOptions;
}

interface CrudManagerProps<T extends Record<string, any>> {
  title: string;
  apiEndpoint: string;
  fields: CrudField<T>[];
}

const CrudManager = <T extends Record<string, any>>({
  title,
  apiEndpoint,
  fields,
}: CrudManagerProps<T>) => {
  const [modalData, setModalData] = useState<Partial<T> | false>(false);

  const { data, isLoading, createMutation, deleteMutation, updateMutation } = useApi(apiEndpoint);

  const saveData = async (
    body: Partial<T> & {id?: number}
  ): Promise<boolean> => {
    if (body.id) {
      await updateMutation.mutateAsync({
        id: body.id,
        data: body,
      });
    } else  {
      await createMutation.mutateAsync(body);
    }

    setModalData(false);
    return true;
  };

  if (isLoading) return <p>Loading...</p>;

  const idFilters = fields.filter(
    (field) => field.options?.filter((f) => f && typeof f !== 'string').length
  );

  const processedData: Partial<T>[] = idFilters.length
    ? (data as Partial<T>[]).map((item) => {
        const out = {...item};
        idFilters.forEach((filter) => {
          const key = filter.name;
          if (item[key]) {
            out[key] = ((filter.options as SelectOption[]).find(
              (f: SelectOption) => item[key] === f.value
            )?.label || item[key]) as T[keyof T & string];
          }
        });
        return out;
      })
    : data;


  return (
    <div>
      <TableComponent
        columns={fieldsToColumns(fields)}
        data={processedData}
        onDelete={(id) => deleteMutation.mutate(id as number)}
        onCreate={() => {
          setModalData({});
        }}
        onEdit={async (changes) => {
          for (let i = 0; i < changes.length; i++) {
            const change = changes[i] as Partial<T>;
            await saveData(
              change
            );
          }
        }}
      ></TableComponent>

      {modalData && (
        <FormModal
          title={(modalData.id ? 'Edit ' : 'Create ') + title}
          onClose={() => setModalData(false)}
          fields={fields}
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
