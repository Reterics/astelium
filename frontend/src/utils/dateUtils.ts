export const getFormattedDate = (offset: number, date: Date) => {
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
};

export const getTimedDate = (time: string) => {
  const parts = time.trim().split(':');
  const date = new Date();
  date.setHours(Number(parts.shift()));
  date.setMinutes(Number(parts.shift()));
  return date;
};

export const generateTimeSlots = (
  appointmentTimes: string[],
  shift: string[]
) => {
  const shiftDates = [getTimedDate(shift[0]), getTimedDate(shift[1])];

  if (shiftDates[0] > shiftDates[1]) {
    const _temp = shiftDates[0];
    shiftDates[0] = shiftDates[1];
    shiftDates[1] = _temp;
  }

  const slots = [];

  while (shiftDates[0] < shiftDates[1]) {
    const time =
      shiftDates[0].getHours().toString().padStart(2, '0') +
      ':' +
      shiftDates[0].getMinutes().toString().padStart(2, '0');
    const booked = appointmentTimes.includes(time);
    const slot = {
      time: time,
      booked: booked,
      size: 30,
    };
    slots.push(slot);

    shiftDates[0].setTime(shiftDates[0].getTime() + 30 * 60000);
  }

  return slots;
};

export const dateFields = [
  'created_at', 'updated_at',
  'start_date', 'due_date',
  'date',
  'day', 'time',
  'start_time',
  'email_verified_at',
  'invoiceIssueDate', 'invoiceDeliveryDate', 'invoicePaymentDate',
  'created',
]

export const parseDateStringsInItem = (item: Record<string, unknown>) => {
  dateFields.forEach(field => {
    if (item[field]) {
      item[field] = new Date(item[field] as string);
    }
  });
  return item;
};

export const parseDateStrings = (dateStrings: Record<string, unknown>[]) =>
  dateStrings.map(parseDateStringsInItem);
