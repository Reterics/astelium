import {useEffect, useState} from 'react';
import {fieldsToColumns, getFetchOptions} from '../utils.ts';
import TableComponent from './TableComponent.tsx';
import FormModal from './FormModal.tsx';
import {SelectOption, SelectOptions} from './SelectComponent.tsx';

export interface CrudField<T> {
  name: keyof T & string;
  label: string;
  type: string;
  editable?: boolean;
  sortable?: boolean;
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
  const [data, setData] = useState<T[]>([]);
  const [modalData, setModalData] = useState<Partial<T> | false>(false);

  useEffect(() => {
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then(setData);
  }, [apiEndpoint]);

  const refreshData = () => {
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then(setData);
  };

  const uploadData = async (
    url: string,
    method: 'PUT' | 'POST',
    body: string
  ): Promise<boolean> => {
    const response = await fetch(url, {
      ...getFetchOptions(),
      method,
      body: body,
    });
    setModalData(false);
    return response.ok;
  };

  const saveData = async (form: Partial<T>) => {
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `${apiEndpoint}/${form.id}` : apiEndpoint;

    const ok = await uploadData(url, method, JSON.stringify(form));
    if (ok) {
      refreshData();
    }
  };

  const deleteData = (id: number) => {
    fetch(`${apiEndpoint}/${id}`, {
      ...getFetchOptions(),
      method: 'DELETE',
    }).then(() => {
      setData((prev) => prev.filter((item) => item.id !== id));
    });
  };

  const idFilters = fields.filter(
    (field) => field.options?.filter((f) => f && typeof f !== 'string').length
  );

  const processedData = idFilters.length
    ? data.map((item) => {
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
        onDelete={(id) => deleteData(id as number)}
        onCreate={() => {
          setModalData({});
        }}
        onEdit={async (changes) => {
          for (let i = 0; i < changes.length; i++) {
            const change = changes[i];
            await uploadData(
              `${apiEndpoint}/${change.id}`,
              'PUT',
              JSON.stringify(change)
            );
          }
          refreshData();
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
