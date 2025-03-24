import {ChangeEvent, Dispatch, SetStateAction, useState} from 'react';
import Modal from '../Modal.tsx';
import FileComponent from '../FileComponent.tsx';
import RichTextEditor from './RichTextEditor.tsx';
import TableComponent from "../TableComponent.tsx";
import {CrudField} from "../CrudManager.tsx";

export interface TemplateRaw {
  file: File;
  html?: string;
  document: Template;
}

export type TemplateFieldTypeKind = 'Text'|'Phone'|'Tax Number'|'Address'|'Signature'

export interface TemplateFieldType {
  id: number;
  name: string;
  type: TemplateFieldTypeKind;
  validation: string;
}

export interface Template {
  id?: number;
  name?: string;
  path?: string;
  content?: string;
  fields: TemplateFieldType[]
}


export interface TemplateModalProps {
  onClose?: () => void;
  onSave?: (template: TemplateRaw) => void;
  selected?: null | Template;

  template: Template;
  setTemplate: Dispatch<SetStateAction<Template | null>>;
}

const TemplateModal = ({
  onClose,
  onSave,
  template,
  setTemplate,
}: TemplateModalProps) => {
  const [file, setFile] = useState<File | null>(null);

  const setFields = (modifier: (prevFields: TemplateFieldType[]) => TemplateFieldType[]) => {
    setTemplate((prevState) => {
      return {
        ...(prevState || {}),
        fields: modifier(prevState?.fields || []),
      }
    })
  }

  const fieldColumns: CrudField[] = [
    {key: 'name', label: 'Name', type: 'text', editable: true},
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      options: ['Text', 'Phone', 'Tax Number', 'Address', 'Signature'],
      editable: true,
    },
    {key: 'validation', label: 'Validation', type: 'text', editable: true},
  ];
  const [openSection, setOpenSection] = useState<'fields' | 'editor' | null>('fields');

  const setText = (text: string) => {
    setTemplate({...template, content: text});
  };

  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    setTemplate((prev) => {
      const value = e.target.value;
      const obj = {...prev} as Template;
      obj.name = value;
      return obj;
    });
  };

  const onClickSaveBtn = () => {
    if (!file && !template.path && !template.content) {
      alert('You need to upload a file for creating a template');
      return;
    }
    const extension = file
      ? file.name.substring(file.name.lastIndexOf('.'))
      : '';

    const rawDocument: TemplateRaw = {
      file: file as File,
      html: template.content,
      document: {
        ...template,
        path: file
          ? 'files/' + (template.name || '') + extension
          : template.path,
      },
    };
    if (typeof onSave === 'function') {
      onSave(rawDocument);
    }
  };

  const close = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };


  return (
    <Modal title={'Template Modal'} onClose={close}>
      <div className='flex flex-col space-y-3 max-h-screen min-h-[80vh] min-w-[90vw]'>
        <div className='flex space-x-2'>
          <div className='relative z-0 w-full group'>
            <label
              htmlFor='name'
              className='block mb-1 text-sm font-medium text-zinc-700'
            >
              Template Name
            </label>
            <input
              id='name'
              type='text'
              name='name'
              value={template.name}
              onChange={(e) => changeName(e)}
              className='w-full p-2 border border-zinc-300 bg-zinc-50 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500'
            />
          </div>

          <FileComponent
            name='model'
            label={
              'Model ' +
              (template.path ? `(${template.path.replace('files/', '')})` : '(Optional)')
            }
            onChange={(file: File) => setFile(file)}
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setOpenSection(openSection === 'fields' ? null : 'fields')}
            className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer ${
              openSection === 'fields'
                ? 'bg-zinc-800 text-white'
                : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
            }`}
          >
            Fields
          </button>
          <button
            onClick={() => setOpenSection(openSection === 'editor' ? null : 'editor')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              openSection === 'editor'
                ? 'bg-zinc-800 text-white'
                : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
            }`}
          >
            Editor
          </button>
        </div>
        { openSection === 'fields' && <div>
          <TableComponent
            columns={fieldColumns}
            data={template.fields}
            onEdit={async (changes) => {
              setFields((prev: TemplateFieldType[]) => {
                return [...prev.map(item => changes.find(c => c.id === item.id) || item )] as TemplateFieldType[]
              });
            }}
            onDelete={(index) => {
              setFields((prevFields) => {
                const newFields = [...prevFields];
                newFields.splice(index as number, 1);
                return newFields;
              });
            }}
            onCreate={() => {
              setFields((prevFields =>
                [...prevFields, { id: prevFields.length + 1, name: 'field_' + (prevFields.length + 1), type: 'Text', validation: '' }]));
            }}
            pagination={false}
          />
        </div> }

        { openSection === 'editor' && <div>
          <div className="flex space-x-2 pb-1 px-1">
            {template.fields.map((field)=>
              field.name &&
              <div
                onClick={()=> setText(`${template.content || ''} {{${field.name}}}`)}
                className="rounded px-2 py-0.5 bg-blue-200 cursor-pointer">{field.name}</div>)}
          </div>
          <RichTextEditor text={template.content || ''} setText={setText}>
            <button
              type='button'
              onClick={onClickSaveBtn}
              className='px-4 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition'
            >
              Save
            </button>
          </RichTextEditor>
        </div> }
      </div>
    </Modal>
  );
};

export default TemplateModal;
