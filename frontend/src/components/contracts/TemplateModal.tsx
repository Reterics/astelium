import {ChangeEvent, useState} from 'react';
import Modal from '../Modal.tsx';
import FileComponent from '../FileComponent.tsx';
import RichTextEditor from './RichTextEditor.tsx';

export interface TemplateRaw {
  file: File;
  html?: string;
  document: Template;
}

export interface Template {
  id?: number;
  name?: string;
  path?: string;
  content?: string;
}

export interface TemplateModalProps {
  onClose?: () => void;
  onSave?: (template: TemplateRaw) => void;
  selected?: null | Template;

  template: Template;
  setTemplate: (template: Template) => void;
}

const TemplateModal = ({
  onClose,
  onSave,
  template,
  setTemplate,
}: TemplateModalProps) => {
  const [file, setFile] = useState<File | null>(null);

  const setText = (text: string) => {
    setTemplate({...template, content: text});
  };

  const changeType = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const value = e.target.value;
    const obj = {...template} as Record<string, any>;
    obj[key as keyof Template] = value;
    setTemplate(obj);
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
      <div className='grid gap-4 mb-4 md:grid-cols-2'>
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
            onChange={(e) => changeType(e, 'name')}
            className='w-full p-2 border border-zinc-300 bg-zinc-50 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500'
          />
        </div>

        <FileComponent
          name='model'
          label={
            'Model ' +
            (template.path ? `(${template.path.replace('files/', '')})` : '')
          }
          onChange={(file: File) => setFile(file)}
        />
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
    </Modal>
  );
};

export default TemplateModal;
