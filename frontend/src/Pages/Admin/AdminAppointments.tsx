import {useState} from 'react';
import {useApi} from '../../hooks/useApi.ts';
import AdminAppointmentCalendar from '../../components/appointments/admin/AdminAppointmentCalendar.tsx';
import AdminAppointmentTable from '../../components/appointments/admin/AdminAppointmentTable.tsx';
import {TimeSlot} from '../../components/appointments/client/ClientAppointmentCalendar.tsx';
import {useTranslation} from 'react-i18next';

const AdminAppointments = () => {
  const {t} = useTranslation();
  const [view, setView] = useState<'calendar' | 'table'>('calendar');

  const {
    data: appointments,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useApi('appointments');

  if (isLoading) return <p>{t('loading')}...</p>;

  return (
    <div className='p-4 bg-zinc-50 flex flex-col space-y-4 mb-4'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>{t('appointment_management')}</h1>
        <div className='flex space-x-2'>
          <button
            className={`px-4 py-2 rounded ${
              view === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setView('calendar')}
          >
            {t('calendar_view')}
          </button>
          <button
            className={`px-4 py-2 rounded ${
              view === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setView('table')}
          >
            {t('table_view')}
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <AdminAppointmentCalendar
          appointments={appointments as TimeSlot[]}
          onSave={async (form: TimeSlot) => {
            if (form.id) {
              await updateMutation.mutateAsync(
                form as Record<string, any> & {id: number}
              );
            } else {
              await createMutation.mutateAsync(form);
            }
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      ) : (
        <AdminAppointmentTable
          appointments={appointments as TimeSlot[]}
          onSave={async (form: TimeSlot) => {
            if (form.id) {
              await updateMutation.mutateAsync(
                form as Record<string, any> & {id: number}
              );
            } else {
              await createMutation.mutateAsync(form);
            }
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}
    </div>
  );
};

export default AdminAppointments;
