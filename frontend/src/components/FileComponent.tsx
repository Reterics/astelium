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
        className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
        htmlFor={name}
      >
        {label || name}
      </label>
      <input
        className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer
            bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600
            dark:placeholder-gray-400'
        id={name}
        type='file'
        name={name}
        onChange={handleFileChange}
        accept={accept}
      />
    </div>
  );
};

export default FileComponent;
