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

const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;

export const isDateLike = (value: unknown): boolean =>
  typeof value === 'string' && isoDateRegex.test(value);

export const parseDateStringsInItem = (item: Record<string, unknown>, depth = 3) => {
  if (depth <= 0) return item;

  Object.keys(item).forEach(key => {
    if (isDateLike(item[key])) {
      item[key] = new Date(item[key] as string);
    } else if (Array.isArray(item[key]) && depth) {
      item[key].forEach(i => {
        if (i && typeof i === 'object') {
          parseDateStringsInItem(i as Record<string, unknown>, depth - 1);
        }
      });
    } else if (item[key] && typeof item[key] === 'object') {
      parseDateStringsInItem(item[key] as Record<string, unknown>, depth - 1);
    }
  })
  return item;
};

export const parseDateStrings = (items: Record<string, unknown>[]) => {
  items.forEach(parseDateStringsInItem);
  return items;
};
