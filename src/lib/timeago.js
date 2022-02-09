const DATE_UNITS = {
  date: 2419200,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

export function secsAgo(date) {
  const dateTimestamp = +date;
  const currentTimestamp = +Date.now();

  return (currentTimestamp - dateTimestamp) / 1000;
}

export function unitValue(date) {
  const secondsElapsed = secsAgo(date);

  for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
    const match = secondsElapsed >= secondsInUnit || unit === 'second';

    if (match) {
      const value = Math.floor(secondsElapsed / secondsInUnit) * -1;

      return { value, unit };
    }
  }
}

export default function timeAgo(date, locale = 'en-GB') {
  const { value = 0, unit = 'second' } = unitValue(date);

  try {
    let formater;
    if (unit === 'date') {
      formater = Intl.DateTimeFormat(locale, { dateStyle: 'short' });
    } else {
      formater = new Intl.RelativeTimeFormat(locale, 'short');
    }

    return formater.format(value, unit);
  } catch (e) {}

  return value;
}
