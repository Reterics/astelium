import Modal from './Modal';
import React, {useState} from 'react';
import SelectComponent, {SelectOption} from './SelectComponent.tsx';
import MultiSelectComponent from './MultiSelectComponent.tsx';
import {CrudField} from './CrudManager.tsx';
import FileComponent from './FileComponent.tsx';
import DateComponent from './DateComponent.tsx';
import {defaultModalButtons} from '../utils/reactUtils.tsx';
import AutocompleteComponent from './AutocompleteComponent.tsx';
import WorkingScheduleEditor from './WorkingScheduleEditor.tsx';
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChanges = (values: Record<string, string | string[]>) => {
    const updatedForm = {...form, ...values};
    setForm(updatedForm);
    if (onInputChange) {
      onInputChange(Object.keys(form).join(','), updatedForm);
    }
  };

  const handleInputChange = (key: string, value: string | string[]) => {
    const updatedForm = {...form, [key]: value};
    setForm(updatedForm);

    if (onInputChange) {
      onInputChange(key, updatedForm);
    }

    // Validate the field if it has a validate function
    const field = fields.find((f) => f.key === key);
    if (field?.validate) {
      const result = field.validate(value);
      if (result && !result.isValid) {
        setErrors((prev) => ({...prev, [key]: result.message}));
      } else {
        setErrors((prev) => {
          const newErrors = {...prev};
          delete newErrors[key];
          return newErrors;
        });
      }
    }
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
        // Validate all required fields before saving
        const requiredErrors: Record<string, string> = {};
        let hasErrors = false;

        fields.forEach((field) => {
          // Skip validation for sections or fields that are not visible
          if (
            field.type === 'section' ||
            (typeof field.visible === 'function' && !field.visible(form)) ||
            field.visible === false
          ) {
            return;
          }

          // Validate required fields
          if (field.required && (!form[field.key] || form[field.key] === '')) {
            requiredErrors[field.key] = `${field.label} is required`;
            hasErrors = true;
          }

          // Run custom validation if provided
          if (field.validate && form[field.key]) {
            const result = field.validate(form[field.key]);
            if (!result.isValid) {
              requiredErrors[field.key] = result.message;
              hasErrors = true;
            }
          }
        });

        if (hasErrors) {
          setErrors(requiredErrors);
          return;
        }

        // All validations passed, save the form
        onSave(form);
      })}
    >
      <div className='space-y-3 max-w-full'>
        {/* Separate workingSchedule fields to render them in a separate section */}
        {/* Regular fields grid */}
        <div
          className={
            cols === 4 ? className : 'grid sm:grid-cols-2 md:grid-cols-4 gap-3'
          }
        >
          {fields
            .filter((field) => field.type !== 'workingSchedule')
            .map((field) =>
              field.type === 'section' ? (
                <div key={field.key} className='col-span-full mt-4 mb-2'>
                  <h3 className='text-md font-semibold text-zinc-800 border-b border-zinc-200 pb-1'>
                    {field.label}
                  </h3>
                </div>
              ) : (
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
                        (form[field.key] as string | undefined) ||
                        `Select option`
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
                      name={field.key}
                      onChange={(file: File) => {
                        const updatedForm = {...form, [field.key]: file};
                        setForm(updatedForm);
                        if (onInputChange) {
                          onInputChange(field.key, updatedForm);
                        }
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
                  ) : field.type === 'workingSchedule' ? (
                    <div>
                      {/* WorkingSchedule is now rendered separately in its own section */}
                      <div className='text-gray-500 text-xs'>
                        This field will be displayed in a dedicated section
                        below
                      </div>
                    </div>
                  ) : (
                    <>
                      <input
                        type={field.type}
                        value={(form[field.key] as string) || ''}
                        onChange={(e) => {
                          handleInputChange(field.key, e.target.value);
                          if (field.props?.onChange) {
                            field.props?.onChange(e.target.value, form);
                          }
                        }}
                        placeholder={field.placeholder}
                        className={`px-2 py-1 bg-white border ${errors[field.key] ? 'border-red-500' : 'border-zinc-200'} text-xs font-medium rounded-none focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors duration-100`}
                        style={{borderRadius: 0}}
                      />
                      {errors[field.key] && (
                        <div className='text-red-500 text-xs mt-1'>
                          {errors[field.key]}
                        </div>
                      )}
                      {field.help && !errors[field.key] && (
                        <div className='text-gray-500 text-xs mt-1'>
                          {field.help}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            )}
        </div>

        {/* Working Schedule section */}
        {fields
          .filter((field) => field.type === 'workingSchedule')
          .map((field) => (
            <div key={field.key} className='mt-4 col-span-full'>
              <div className='mb-2'>
                <h3 className='text-md font-semibold text-zinc-800 border-b border-zinc-200 pb-1'>
                  {field.label}
                </h3>
              </div>
              <div className='flex flex-col'>
                <WorkingScheduleEditor
                  value={form[field.key] as any}
                  onChange={(value) => {
                    handleInputChange(field.key, JSON.stringify(value));
                    if (field.props?.onChange) {
                      field.props?.onChange(value, form);
                    }
                  }}
                />
              </div>
            </div>
          ))}

        {children}
      </div>
    </Modal>
  );
};

export default FormModal;
