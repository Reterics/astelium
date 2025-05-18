import Modal from './Modal';
import React, {useState} from 'react';
import SelectComponent, {SelectOption} from './SelectComponent.tsx';
import MultiSelectComponent from './MultiSelectComponent.tsx';
import {CrudField} from './CrudManager.tsx';
import FileComponent from './FileComponent.tsx';
import DateComponent from './DateComponent.tsx';
import {defaultModalButtons} from '../utils/reactUtils.tsx';
import AutocompleteComponent from './AutocompleteComponent.tsx';
import {addressAutocomplete} from '../utils/utils.ts';

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

  const handleInputChanges = (values: Record<string, string | string[]>) => {
    setForm((prev) => {
      const data = {...prev, ...values};
      if (onInputChange) {
        onInputChange(Object.keys(form).join(','), data);
      }
      return data;
    });
  };

  const handleInputChange = (key: string, value: string | string[]) => {
    setForm((prev) => {
      const data = {...prev, [key]: value};
      if (onInputChange) {
        onInputChange(key, data);
      }
      return data;
    });
  };
  const className =
    fields.length > 5
      ? 'grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3'
      : fields.length > 4
        ? 'grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3'
        : fields.length > 3
          ? 'grid sm:grid-cols-2 md:grid-cols-4 gap-3'
          : fields.length > 2
            ? 'grid sm:grid-cols-2 md:grid-cols-3 gap-3'
            : 'grid sm:grid-cols-2 gap-3';

  return (
    <Modal
      title={title}
      onClose={onClose}
      buttons={defaultModalButtons(() => {
        onSave(form);
      })}
    >
      <div className='space-y-3 max-w-full'>
        <div
          className={
            cols === 4 ? className : 'grid sm:grid-cols-2 md:grid-cols-4 gap-3'
          }
        >
          {fields.map((field) => (
            <div key={field.key} className='flex flex-col'>
              <label className='text-sm font-medium text-zinc-700 mb-1'>
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
                    if (field.props?.onChange) {
                      field.props?.onChange(value, form);
                    }
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
                    if (field.props?.onChange) {
                      field.props?.onChange(value, form);
                    }
                  }}
                />
              ) : field.type === 'autocomplete' ? (
                <AutocompleteComponent
                  defaultLabel={`Select option`}
                  column={field}
                  filters={{
                    [field.key]: form[field.key] as string,
                  }}
                  handleFilterChange={(_column, value) => {
                    handleInputChange(field.key, value);
                    if (field.props?.onChange) {
                      field.props?.onChange(value, form);
                    }
                  }}
                />
              ) : field.type === 'address' ? (
                <AutocompleteComponent
                  defaultLabel={
                    (form[field.key] as string | undefined) || `Select option`
                  }
                  column={field}
                  filter={async (input: string) => {
                    return await addressAutocomplete(input).then(
                      (autoCompleteData) => {
                        return autoCompleteData.map(
                          (data) =>
                            ({
                              label: data.display_name,
                              value: `{"lat":${data.lat},"lng":${data.lon}, "address":"${data.display_name}"}`,
                            }) as SelectOption
                        );
                      }
                    );
                  }}
                  filters={{
                    [field.key]: form[field.key] as string,
                  }}
                  handleFilterChange={(_column, value) => {
                    if (!value) {
                      return;
                    }
                    const data = JSON.parse(value);
                    handleInputChanges(data);
                    if (field.props?.onChange) {
                      field.props?.onChange(data, form);
                    }
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
              ) : field.type === 'date' ? (
                <DateComponent
                  value={form[field.key] as string | undefined}
                  onChange={(e) => {
                    handleInputChange(field.key, e.target.value);
                    if (field.props?.onChange) {
                      field.props?.onChange(e.target.value, form);
                    }
                  }}
                />
              ) : (
                <input
                  type={field.type}
                  value={(form[field.key] as string) || ''}
                  onChange={(e) => {
                    handleInputChange(field.key, e.target.value);
                    if (field.props?.onChange) {
                      field.props?.onChange(e.target.value, form);
                    }
                  }}
                  className='px-2 py-1 bg-white border border-zinc-200 text-xs font-medium rounded-none focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-100'
                  style={{borderRadius: 0}}
                />
              )}
            </div>
          ))}
        </div>
        {children}
      </div>
    </Modal>
  );
};

export default FormModal;
