import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import FormModal from '../../FormModal.tsx';
import TableComponent from '../../TableComponent.tsx';
import {useAppointmentFields} from '../appointmentUtils.ts';
import {TimeSlot} from '../client/ClientAppointmentCalendar.tsx';

const AdminAppointmentTable = ({
  appointments,
  onSave,
  onDelete,
}: {
  appointments: TimeSlot[];
  onSave: (form: TimeSlot) => void | Promise<void>;
  onDelete: (id: number) => void;
}) => {
  const {t} = useTranslation();
  const [modalData, setModalData] = useState<TimeSlot | false>(false);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const appointmentFieldProps = useAppointmentFields(
    t,
    appointments,
    undefined,
    modalData ? (modalData?.day as string) : undefined
  );

  // Add additional admin-only fields
  const adminFields = [
    ...appointmentFieldProps.fields,
    {
      key: 'status',
      label: t('status'),
      type: 'select',
      options: [
        {value: 'confirmed', label: t('confirmed')},
        {value: 'pending', label: t('pending')},
        {value: 'canceled', label: t('canceled')},
        {value: 'completed', label: t('completed')},
      ],
    },
  ];

  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter((appointment) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'day' && value) {
        return appointment.day?.includes(value as string);
      }
      return appointment[key as keyof TimeSlot] === value;
    });
  });

  return (
    <div className='bg-white shadow-md rounded-lg p-4'>
      <h2 className='text-xl font-semibold mb-4'>
        {t('appointment_management')}
      </h2>

      <div className='mb-4 grid grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {t('date_filter')}
          </label>
          <input
            type='date'
            className='w-full p-2 border rounded'
            onChange={(e) => setFilters({...filters, day: e.target.value})}
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {t('name_filter')}
          </label>
          <input
            type='text'
            className='w-full p-2 border rounded'
            placeholder={t('search_by_name')}
            onChange={(e) =>
              setFilters({...filters, name: e.target.value || undefined})
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {t('status_filter')}
          </label>
          <select
            className='w-full p-2 border rounded'
            onChange={(e) =>
              setFilters({...filters, status: e.target.value || undefined})
            }
          >
            <option value=''>{t('all_statuses')}</option>
            <option value='confirmed'>{t('confirmed')}</option>
            <option value='pending'>{t('pending')}</option>
            <option value='canceled'>{t('canceled')}</option>
            <option value='completed'>{t('completed')}</option>
          </select>
        </div>
      </div>

      <TableComponent
        columns={adminFields
          .filter((f) => f.visible !== false)
          .map((f) => {
            return {...f, type: 'text'};
          })}
        data={filteredAppointments}
        onDelete={(id) => onDelete(id as number)}
        onCreate={() => {
          setModalData({});
        }}
        onEdit={(appointment) => {
          setModalData(appointment as TimeSlot);
        }}
      />

      {modalData && (
        <FormModal
          title={modalData.id ? t('edit_appointment') : t('create_appointment')}
          onClose={() => setModalData(false)}
          fields={adminFields}
          onInputChange={appointmentFieldProps.onInputChange}
          data={modalData as Record<string, unknown>}
          onSave={(form) => {
            return onSave(form as TimeSlot);
          }}
        />
      )}
    </div>
  );
};

export default AdminAppointmentTable;
