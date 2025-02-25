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
      <label
        htmlFor={name}
        className='block mb-1 text-sm font-medium text-zinc-700'
      >
        {label || name}
      </label>
      <input
        id={name}
        type='file'
        name={name}
        onChange={handleFileChange}
        accept={accept}
        className='block w-full text-sm p-2 text-zinc-900 border border-zinc-300 rounded-md cursor-pointer bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500'
      />
    </div>
  );
};

export default FileComponent;
