import {ReactNode, useEffect, useRef, useState} from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {Editor as TinyMCEEditor} from 'tinymce';

const RichTextEditor = ({
  text,
  setText,
  children
}: {
  text?: string;
  setText?: (text: string) => void;
  children?: ReactNode;
}) => {
  const editorRef = useRef<TinyMCEEditor>(null);
  const [dirty, setDirty] = useState(false);
  useEffect(() => setDirty(false), [text]);

  const save = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setDirty(false);
      editorRef.current.setDirty(false);
      // an application would save the editor content to the server here
      if (typeof setText === 'function') {
        setText(content);
      }
    }
  };
  return (
    <div className='min-h-[400px]'>
      <Editor
        init={{
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
        }}
        apiKey={import.meta.env.VITE_TINYMCE}
        initialValue={text}
        onInit={(_evt, editor) => (editorRef.current = editor)}
        onDirty={() => setDirty(true)}
      />
      <div className='p-1 flex flex-row justify-between z-10'>
        {children}

        {dirty && <p>You have unsaved content!</p>}

        <button
          className='focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900'
          onClick={save}
          type='button'
        >
          Finalize
        </button>


      </div>
    </div>
  );
};

export default RichTextEditor;
