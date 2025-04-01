import {FiCheck, FiArrowRight} from 'react-icons/fi';
import {ModalButton} from '../components/Modal.tsx';

export const defaultModalButtons = (
  onSave?: (result: unknown) => unknown,
  onCancel?: () => void
): ModalButton[] => {
  return [
    {
      icon: <FiCheck />,
      text: 'Save',
      onClick: onSave,
      type: 'primary',
    },
    {
      icon: <FiArrowRight />,
      text: 'Cancel',
      onClick: onCancel,
      type: 'secondary',
    },
  ];
};
