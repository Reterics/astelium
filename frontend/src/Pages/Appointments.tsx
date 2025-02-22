import AppointmentCalendar, {
  TimeSlot,
} from '../components/appointments/AppointmentCalendar.tsx';
import {useApi} from '../hooks/useApi.ts';
import AppointmentTable from '../components/appointments/AppointmentTable.tsx';

const Appointments = () => {
  const {
    data: appointments,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useApi('appointments');

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='flex flex-col space-y-4 mb-4'>
      <AppointmentTable
        appointments={appointments}
        onDelete={(id) => deleteMutation.mutate(id as number)}
        onSave={async (form: TimeSlot) => {
          if (form.id) {
            await updateMutation.mutateAsync(
              form as Record<string, any> & {id: number}
            );
          } else {
            await createMutation.mutateAsync(form);
          }
        }}
      />
      <AppointmentCalendar
        appointments={appointments as TimeSlot[]}
        onSave={async (form: TimeSlot) => {
          await createMutation.mutateAsync(form);
        }}
      />
    </div>
  );
};

export default Appointments;
