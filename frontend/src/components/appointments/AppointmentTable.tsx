import {useState} from 'react';
import {TimeSlot} from './AppointmentCalendar.tsx';
import {useAppointmentFields} from './appointmentUtils.ts';
import {useTranslation} from 'react-i18next';
import FormModal from '../FormModal.tsx';
import TableComponent from '../TableComponent.tsx';

const AppointmentTable = ({
  title,
  appointments,
  onSave,
  onDelete,
}: {
  title?: string;
  appointments: TimeSlot[];
  onSave?: (form: TimeSlot) => void;
  onDelete?: (id: number) => void;
}) => {
  const {t} = useTranslation();
  const [modalData, setModalData] = useState<TimeSlot | false>(false);

  const appointmentFieldProps = useAppointmentFields(
    t,
    appointments,
    undefined,
    modalData ? (modalData?.day as string) : undefined
  );

  return (
    <div>
      <TableComponent
        columns={appointmentFieldProps.fields
          .filter((f) => f.visible !== false)
          .map((f) => {
            return {...f, type: 'text'};
          })}
        data={appointments}
        onDelete={(id) => onDelete && onDelete(id as number)}
        onCreate={() => {
          setModalData({});
        }}
      ></TableComponent>

      {modalData && (
        <FormModal
          title={(modalData.id ? 'Edit ' : 'Create ') + title}
          onClose={() => setModalData(false)}
          {...appointmentFieldProps}
          data={modalData as Record<string, unknown>}
          onSave={(form) => {
            return onSave && onSave(form as TimeSlot);
          }}
        />
      )}
    </div>
  );
};

export default AppointmentTable;
