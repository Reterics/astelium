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
      <div
        className='relative bg-white shadow-lg border border-zinc-200 text-zinc-700 px-4 py-3 rounded-none w-auto max-w-[98vw] max-h-[98vh] overflow-y-auto'
        style={{borderRadius: 0, boxShadow: 'none'}}
      >
        <div className='title-bar cursor-move'>
          <div className='flex items-center justify-between border-b border-zinc-100 pb-1 mb-2'>
            <h2 className='text-base font-semibold text-zinc-800 m-0'>
              {title}
            </h2>
            <button
              className='text-zinc-400 hover:text-zinc-700 transition-colors duration-100 px-1'
              onClick={onClose}
              style={{border: 'none', background: 'none', borderRadius: 0}}
              tabIndex={0}
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        <div className='flex flex-1 overflow-auto p-0.5 text-sm min-w-72'>
          {children}
        </div>

        {!!(leftButtons.length || rightButtons.length) && (
          <div className='flex min-w-72 justify-between pt-2 gap-2'>
            {[leftButtons, rightButtons].map((buttons, idx) => (
              <div key={idx} className='flex gap-1'>
                {buttons.map((button, bIdx) => (
                  <button
                    key={bIdx}
                    className={
                      button.type === 'primary'
                        ? 'flex items-center bg-zinc-800 text-white border border-zinc-200 px-2 py-1 rounded-none text-xs font-medium hover:bg-zinc-700'
                        : 'flex items-center text-zinc-800 bg-white border border-zinc-200 px-2 py-1 rounded-none text-xs font-medium hover:bg-zinc-100'
                    }
                    onClick={() => button.onClick?.() || onClose()}
                    style={{borderRadius: 0}}
                    tabIndex={0}
                  >
                    {button.icon}
                    <div className='ml-1'>{button.text}</div>
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
