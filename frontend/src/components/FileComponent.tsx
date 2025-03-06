import {ChangeEvent} from 'react';

export interface FileComponentProps {
  name: string;
  label?: string;
  onChange: (file: File) => void;
  accept?: string;
}

const FileComponent = ({name, label, onChange, accept}: FileComponentProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className='relative z-0 w-full group'>
      {label && (
        <label
          htmlFor={name}
          className='block mb-1 text-sm font-medium text-zinc-700'
        >
          {label}
        </label>
      )}
      <input
        id={name}
        type='file'
        name={name}
        onChange={handleFileChange}
        accept={accept}
        className='p-1 border border-zinc-300 rounded-xs truncate max-w-full cursor-pointer'
      />
    </div>
  );
};

export default FileComponent;
