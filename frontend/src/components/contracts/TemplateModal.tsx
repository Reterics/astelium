import {useState} from 'react';
import Modal from '../Modal.tsx';
import FileComponent from '../FileComponent.tsx';
import RichTextEditor from './RichTextEditor.tsx';

export interface TemplateRaw {
  file: File;
  html?: string;
  document: Template;
}

export interface Template {
  id: string;
  name?: string;
  path?: string;
  content?: string;
}

export interface TemplateModalProps {
  onClose?: (templateRaw: false | TemplateRaw) => void;
  selected?: null | Template;
}

const TemplateModal = ({onClose, selected}: TemplateModalProps) => {
  const [template, setTemplate] = useState<Template>(selected || {id: ''});
  const [file, setFile] = useState<File | null>(null);

  const setText = (text: string) => {
    setTemplate({...template, content: text});
  };

  const changeType = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const value = e.target.value;
    setTemplate((currentTemplate: any) => {
      const obj = {...currentTemplate};
      obj[key] = value;
      return obj;
    });
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const uploadAndClose = () => {
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
    if (typeof onClose === 'function') {
      onClose(rawDocument);
    }
  };

  const close = () => {
    if (typeof onClose === 'function') {
      onClose(false);
    }
  };

  return (
    <Modal title={'Template Modal'} onClose={close}>
      <div
        className='w-full max-w-screen-lg p-6 bg-white border border-gray-200 rounded-lg shadow
                        dark:bg-gray-800 dark:border-gray-700 mr-1 pt-9 pb-2'
      >
        <div className='grid gap-6 mb-6 md:grid-cols-2'>
          <div className='mt-4'>
            <input
              type='text'
              name='name'
              value={template.name}
              onChange={(e) => changeType(e, 'name')}
            />
          </div>
          <FileComponent
            name='model'
            label={
              'Model ' +
              (template.path
                ? '(' + template.path.replace('files/', '') + ')'
                : '')
            }
            onChange={(file: File) => setFile(file)}
          />
        </div>
        <RichTextEditor text={template.content || ''} setText={setText} />
      </div>
    </Modal>
  );
};

export default TemplateModal;
