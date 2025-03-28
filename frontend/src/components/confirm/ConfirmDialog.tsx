import React, {useRef} from 'react';
import DraggableDiv from "../DraggableDiv.tsx";
import {FiCheck, FiX} from "react-icons/fi";

type ConfirmDialogProps = {
  title?: string;
  children: React.ReactNode;
  onClose: (value: boolean | HTMLDivElement | null) => void;
  confirmMessage?: string;
  cancelMessage?: string;
};

export default function ConfirmDialog(
{
  title,
  children,
  onClose,
  confirmMessage,
  cancelMessage,
}: Readonly<ConfirmDialogProps>) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<{x: number; y: number}>({
    x: window.innerWidth / 2 - 140,
    y: window.innerHeight / 4,
  });

  return (
    <DraggableDiv
      ref={dialogRef}
      pos={posRef}
      handle='.title-bar'
      className='confirmation-modal'
    >
      <div className='relative bg-zinc-50 border border-zinc-400 text-zinc-700 p-3 rounded-md shadow-lg w-auto max-w-screen max-h-screen overflow-y-auto'>
        <div className={`title-bar`}>
          <div className='flex items-center justify-between border-b border-zinc-300 pb-2'>
            <h2 className='text-lg font-semibold text-zinc-800'>{title ?? 'Confirmation'}</h2>
            <button
              className='text-zinc-400 hover:text-zinc-600 transition cursor-pointer'
              onClick={() => onClose(false)}
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className='flex flex-1 overflow-auto p-2'>{children}</div>
        <div className='flex min-w-72 justify-between pt-2'>
          <button
            className='flex items-center bg-zinc-800 text-white px-2 py-1 rounded-xs hover:bg-zinc-700'
            onClick={() => onClose(dialogRef.current)}
          >
            <FiCheck className='mr-1' /> {confirmMessage ?? 'Yes'}
          </button>
          <button
            className='flex items-center text-zinc-800 bg-white border border-zinc-400 px-2 py-1 rounded-xs hover:bg-zinc-200'
            onClick={() => onClose(false)}
          >
            <FiCheck className='mr-1' /> {cancelMessage ?? 'No'}
          </button>
        </div>
      </div>
    </DraggableDiv>
  );
}
