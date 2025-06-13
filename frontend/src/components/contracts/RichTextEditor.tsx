import {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {Editor as TinyMCEEditor} from 'tinymce';

// Reduced debounce time for better responsiveness
const DEBOUNCE_MS = 1000;

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
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  const saveContent = useCallback(
    (content: string) => {
      if (typeof setText === 'function') {
        setText(content);
      }
      editorRef.current?.setDirty(false);
    },
    [setText]
  );

  const handleEditorChange = (content: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      if (content !== text) {
        saveContent(content);
      }
    }, DEBOUNCE_MS);
  };

  const toggleHtmlMode = () => {
    if (editorRef.current) {
      const newMode = !isHtmlMode;
      setIsHtmlMode(newMode);

      // If we're switching to HTML mode, we need to save the content first
      if (newMode) {
        const content = editorRef.current.getContent();
        if (content && content !== text) {
          saveContent(content);
        }
      }
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <div className='min-h-[400px]'>
      {isHtmlMode ? (
        <div className="border border-gray-300 rounded-md p-2">
          <textarea
            className="w-full h-[400px] font-mono text-sm p-2"
            value={text}
            onChange={(e) => setText && setText(e.target.value)}
          />
        </div>
      ) : (
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
          init={{
            height: 400,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | code | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
      )}

      <div className='p-1 flex flex-row justify-between z-10'>
        <button
          onClick={toggleHtmlMode}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md mr-2"
        >
          {isHtmlMode ? 'Visual Editor' : 'HTML Mode'}
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default RichTextEditor;
