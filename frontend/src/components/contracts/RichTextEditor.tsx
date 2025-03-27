import {ReactNode, useCallback, useEffect, useRef} from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {Editor as TinyMCEEditor} from 'tinymce';

const DEBOUNCE_MS = 10000;

const RichTextEditor = ({
  text,
  setText,
  children,
}: {
  text?: string;
  setText?: (text: string) => void;
  children?: ReactNode;
}) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const saveContent = useCallback((content: string) => {
    if (typeof setText === 'function') {
      setText(content);
    }
    editorRef.current?.setDirty(false);
  }, [setText]);

  const handleEditorChange = (content: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (content !== text) {
        saveContent(content);
      }
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <div className='min-h-[400px]'>
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE}
        initialValue={text}
        onInit={(_evt, editor) => {
          editorRef.current = editor;
        }}
        onEditorChange={handleEditorChange}
        onBlur={() => {
          const content = editorRef.current?.getContent();
          if (content && content !== text) {
            saveContent(content);
          }
        }}
      />

      <div className='p-1 flex flex-row justify-between z-10'>
        {children}
      </div>
    </div>
  );
};

export default RichTextEditor;
