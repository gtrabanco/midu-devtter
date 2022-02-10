import { DEFAULT_LANGUAGE } from 'constants/locale';

const isDateTimeSupported = typeof Intl !== 'undefined' && Intl.DateTimeFormat;

const isRelativeTimeFormatSupported =
  typeof Intl !== 'undefined' && Intl.RelativeTimeFormat;

const DATE_UNITS = {
  date: 2419200,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
};

export function dateTimeFormat(date, locale = DEFAULT_LANGUAGE || 'en-GB') {
  try {
    if (isDateTimeSupported) {
      const formater = Intl.DateTimeFormat(locale, { dateStyle: 'short' });

      return formater.format(date);
    }
  } catch (e) {}

  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return date.toLocaleDateString(locale, options);
}

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

export default function timeAgo(date, locale = DEFAULT_LANGUAGE || 'en-GB') {
  try {
    if (isRelativeTimeFormatSupported) {
      const { value = 0, unit = 'second' } = unitValue(date);
      if (unit !== 'date') {
        const formater = new Intl.RelativeTimeFormat(locale, 'short');
        return formater.format(value, unit);
      }
    }
  } catch (e) {}

  return dateTimeFormat(date, locale);
}
