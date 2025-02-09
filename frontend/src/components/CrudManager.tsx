import {useEffect, useState} from 'react';
import Modal from './Modal.tsx';
import {fieldsToColumns, getFetchOptions} from '../utils.ts';
import TableComponent from './TableComponent.tsx';

export interface CrudField<T> {
  name: keyof T & string;
  label: string;
  type: string;
  editable?: boolean;
  sortable?: boolean;
  options?: string[];
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
  const [form, setForm] = useState<Partial<T>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then(setData);
  }, [apiEndpoint]);

  const handleInputChange = (key: keyof T, value: string) => {
    setForm((prev) => ({...prev, [key]: value}));
  };

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
    setEditingId(null);
    setForm({});
    setModalOpen(false);
    return response.ok;
  };

  const saveData = () => {
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${apiEndpoint}/${editingId}` : apiEndpoint;

    return uploadData(url, method, JSON.stringify(form)).then((ok: boolean) => {
      if (ok) {
        refreshData();
      }
    });
  };

  const deleteData = (id: number) => {
    fetch(`${apiEndpoint}/${id}`, {
      ...getFetchOptions(),
      method: 'DELETE',
    }).then(() => {
      setData((prev) => prev.filter((item) => item.id !== id));
    });
  };

  return (
    <div>
      <TableComponent
        columns={fieldsToColumns(fields)}
        data={data}
        onDelete={(id) => deleteData(id as number)}
        onCreate={() => {
          setForm({});
          setEditingId(null);
          setModalOpen(true);
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

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h2>
            {editingId ? 'Edit' : 'Create'} {title}
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveData();
            }}
          >
            {fields.map((field) => (
              <div key={field.name}>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  value={(form[field.name] as string) || ''}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                />
              </div>
            ))}
            <button type='submit'>Save</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CrudManager;
