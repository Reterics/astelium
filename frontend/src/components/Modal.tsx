import React, {useRef} from 'react';
import {FiX} from 'react-icons/fi';
import DraggableDiv from './DraggableDiv.tsx';

export interface ModalButton {
  icon?: React.ReactNode;
  text: string;
  onClick?: (result?: unknown) => void;
  type?: 'primary' | 'secondary';
  position?: 'left' | 'right';
}

export interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string | React.ReactNode;
  buttons?: ModalButton[];
}

const Modal: React.FC<ModalProps> = ({children, onClose, title, buttons}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  const leftButtons =
    buttons?.filter(
      (button) =>
        button.position === 'left' ||
        (button.position === undefined && button.type === 'primary')
    ) || [];
  const rightButtons =
    buttons?.filter(
      (button) =>
        button.position === 'right' ||
        (button.position === undefined && button.type === 'secondary')
    ) || [];

  return (
    <DraggableDiv
      ref={dialogRef}
      handle='.title-bar'
      className='draggable-modal'
    >
      <div className='relative bg-zinc-50 border border-zinc-400 text-zinc-700 p-3 rounded-md shadow-lg w-auto max-w-[98vw] max-h-[98vh] overflow-y-auto'>
        <div className={`title-bar cursor-move`}>
          <div className='flex items-center justify-between border-b border-zinc-300 pb-2 mb-1'>
            <h2 className='text-lg font-semibold text-zinc-800'>{title}</h2>
            <button
              className='text-zinc-400 hover:text-zinc-600 transition cursor-pointer'
              onClick={onClose}
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        <div className='flex flex-1 overflow-auto p-1 text-sm min-w-72'>
          {children}
        </div>
        {!!(leftButtons.length || rightButtons.length) && (
          <div className='flex min-w-72 justify-between pt-2'>
            {[leftButtons, rightButtons].map((buttons) => (
              <div>
                {buttons.map((button) => (
                  <button
                    className={
                      button.type === 'primary'
                        ? 'flex items-center bg-zinc-800 text-white border border-zinc-400 px-2 py-1 rounded-xs hover:bg-zinc-700'
                        : 'flex items-center text-zinc-800 bg-white border border-zinc-400 px-2 py-1 rounded-xs hover:bg-zinc-200'
                    }
                    onClick={() => button.onClick?.() || onClose()}
                  >
                    {button.icon} <div className='ms-1'>{button.text}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </DraggableDiv>
  );
};

export default Modal;
