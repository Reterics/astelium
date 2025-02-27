import React from 'react';
import {FiX} from 'react-icons/fi';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string|React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({children, onClose, title}) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-zinc-900/50'>
      <div className='relative bg-zinc-100 text-zinc-700 p-4 rounded-md shadow-lg w-auto max-w-screen'>
        <div className='flex items-center justify-between border-b border-zinc-300 pb-2 mb-3'>
          <h2 className='text-lg font-semibold text-zinc-800'>{title}</h2>
          <button
            className='text-zinc-400 hover:text-zinc-600 transition cursor-pointer'
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </div>
        <div className='text-sm'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
