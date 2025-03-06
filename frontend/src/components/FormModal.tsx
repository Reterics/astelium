import Modal from './Modal';
import React, {useState} from 'react';
import SelectComponent from './SelectComponent.tsx';
import MultiSelectComponent from './MultiSelectComponent.tsx';
import {CrudField} from './CrudManager.tsx';
import FileComponent from './FileComponent.tsx';

export interface FormModalProps {
  title: string;
  onClose: () => void;
  editingId?: string;
  fields: CrudField[];
  data: Record<string, unknown>;
  onSave: (form: Record<string, unknown>) => void;
  children?: React.ReactNode;
  cols?: 2 | 4;
  onInputChange?: (key: string, form: Record<string, unknown>) => void;
}

const FormModal: React.FC<FormModalProps> = ({
  title,
  onClose,
  fields,
  data,
  onSave,
  children,
  cols,
  onInputChange,
}) => {
  const [form, setForm] = useState<Record<string, unknown>>(data);

  const handleInputChange = (key: string, value: string | string[]) => {
    setForm((prev) => {
      const data = {...prev, [key]: value};
      if (onInputChange) {
        onInputChange(key, data);
      }
      return data;
    });
  };

  return (
    <Modal title={title} onClose={onClose}>
      <div className='space-y-3'>
        <div
          className={
            cols === 4 ? 'grid grid-cols-4 gap-4' : 'grid grid-cols-2 gap-4'
          }
        >
          {fields.map((field) => (
            <div key={field.key} className='flex flex-col'>
              <label className='text-sm font-medium text-zinc-700'>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <SelectComponent
                  defaultLabel={`Select option`}
                  column={field}
                  filters={{
                    [field.key]: form[field.key] as string,
                  }}
                  handleFilterChange={(_column, value) => {
                    handleInputChange(field.key, value);
                  }}
                />
              ) : field.type === 'multiselect' ? (
                <MultiSelectComponent
                  defaultLabel={`Select option`}
                  column={field}
                  filters={{
                    [field.key]: form[field.key] as string[],
                  }}
                  handleFilterChange={(_column, value) => {
                    handleInputChange(field.key, value);
                  }}
                />
              ) : field.type === 'image' ? (
                <FileComponent
                  name='model'
                  onChange={(file: File) => {
                    setForm((prev) => {
                      const data = {...prev, image: file};
                      if (onInputChange) {
                        onInputChange('image', data);
                      }
                      return data;
                    });
                  }}
                  accept={'image/*'}
                />
              ) : (
                <input
                  type={field.type}
                  value={(form[field.key] as string) || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className='mt-1 p-1 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500'
                />
              )}
            </div>
          ))}
        </div>
        {children}
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
