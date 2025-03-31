import React, {useRef} from 'react';
import {FiX} from 'react-icons/fi';
import DraggableDiv from "./DraggableDiv.tsx";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string | React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({children, onClose, title}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableDiv
      ref={dialogRef}
      handle='.title-bar'
      className='draggable-modal'
    >
      <div className='relative bg-zinc-100 text-zinc-700 p-3 rounded-md shadow-lg w-auto max-w-screen max-h-screen overflow-y-auto'>
        <div className={`title-bar`}>
          <div className='flex items-center justify-between border-b border-zinc-300 pb-2 mb-3'>
            <h2 className='text-lg font-semibold text-zinc-800'>{title}</h2>
            <button
              className='text-zinc-400 hover:text-zinc-600 transition cursor-pointer'
              onClick={onClose}
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <div className='text-sm min-w-72'>{children}</div>
      </div>
    </DraggableDiv>
  );
};

export default Modal;
