import Modal from './Modal';
import React, {useState} from 'react';
import SelectComponent from './SelectComponent.tsx';
import MultiSelectComponent from './MultiSelectComponent.tsx';
import {CrudField} from './CrudManager.tsx';

export interface FormModalProps {
  title: string;
  onClose: () => void;
  editingId?: string;
  fields: CrudField<any>[];
  data: Record<string, unknown>;
  onSave: (form: Record<string, unknown>) => void;
}

const FormModal: React.FC<FormModalProps> = ({
  title,
  onClose,
  fields,
  data,
  onSave,
}) => {
  const [form, setForm] = useState<Record<string, unknown>>(data);

  const handleInputChange = (key: string, value: string | string[]) => {
    setForm((prev) => ({...prev, [key]: value}));
  };

  return (
    <Modal title={title} onClose={onClose}>
      <div className='space-y-3'>
        <div className='grid grid-cols-2 gap-4'>
          {fields.map((field) => (
            <div key={field.name} className='flex flex-col'>
              <label className='text-sm font-medium text-zinc-700'>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <SelectComponent
                  defaultLabel={`Select option`}
                  column={{
                    key: field.name,
                    label: field.label,
                    options: field.options,
                  }}
                  filters={{
                    [field.name]: form[field.name] as string,
                  }}
                  handleFilterChange={(_column, value) => {
                    handleInputChange(field.name, value);
                  }}
                />
              ) : field.type === 'multiselect' ? (
                <MultiSelectComponent
                  defaultLabel={`Select option`}
                  column={{
                    key: field.name,
                    label: field.label,
                    options: field.options,
                  }}
                  filters={{
                    [field.name]: [form[field.name]] as string[],
                  }}
                  handleFilterChange={(_column, value) => {
                    handleInputChange(field.name, value);
                  }}
                />
              ) : (
                <input
                  type={field.type}
                  value={(form[field.name] as string) || ''}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  className='mt-1 p-1 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500'
                />
              )}
            </div>
          ))}
        </div>
        <button
          type='button'
          onClick={() => {
            onSave(form);
          }}
          className='w-full p-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition'
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default FormModal;
