import {useApi} from '../hooks/useApi.ts';
import ClientAppointmentCalendar from '../components/appointments/client/ClientAppointmentCalendar.tsx';
import {TimeSlot} from '../components/appointments/client/ClientAppointmentCalendar.tsx';
import {useTranslation} from 'react-i18next';

const ClientAppointments = () => {
  const {t} = useTranslation();
  const {
    data: appointments,
    isLoading,
    createMutation,
  } = useApi('appointments');

  if (isLoading) return <p>{t('loading')}...</p>;

  return (
    <div className='p-4 bg-zinc-50 flex flex-col space-y-4 mb-4 text-zinc-700'>
      <ClientAppointmentCalendar
        appointments={appointments as TimeSlot[]}
        onSave={async (form: TimeSlot) => {
          await createMutation.mutateAsync(form);
        }}
      />
    </div>
  );
};

export default ClientAppointments;
