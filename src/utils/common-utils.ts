/* eslint-disable functional/no-let */
import { TFunction } from 'react-i18next';
import { Iban } from '../api/generated/portal/Iban';
import { IbanOnCreation } from '../model/Iban';

export const isIbanValid = (iban?: Iban | IbanOnCreation): boolean =>
  iban !== undefined && iban.due_date !== undefined && new Date(iban.due_date) > new Date();

export const isIbanValidityDateEditable = (iban?: Iban | IbanOnCreation): boolean =>
  iban !== undefined &&
  iban.validity_date !== undefined &&
  new Date(iban.validity_date) > new Date();

export const datePlusDays = (startDate: Date, days: number): Date => {
  const result: Date = new Date(startDate);
  result.setDate(startDate.getDate() + days);
  return result;
};

export const downloadBlobAsCSV = (data: any, name: string): void => {
  const objectTempURL = window.URL.createObjectURL(data);

  // eslint-disable-next-line no-var
  var tempLink = document.createElement('a');
  // eslint-disable-next-line functional/immutable-data
  tempLink.href = objectTempURL;
  tempLink.setAttribute('download', name);

  document.body.appendChild(tempLink);
  tempLink.click();
  tempLink.parentNode?.removeChild(tempLink);
};

export const formatCodeInDoubleDigit = (code: string | undefined): string => {
  if (code === undefined) {
    return '-';
  }
  const castedCode: number = +code;
  if (castedCode < 10) {
    return '0' + code;
  } else {
    return code;
  }
};

export const formatCurrencyEur = (value: number | undefined): string => {
  if (value === undefined) {
    return '';
  }
  const newValue = value / 100;
  return newValue.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });
};

export const formatCurrencyWithoutSymbol = (value: number | undefined): string => {
  if (value === undefined) {
    return '';
  }
  const newValue = value / 100;
  return newValue.toLocaleString('it-IT', {
    minimumFractionDigits: 2,
  });
};

export const formatBooleanValueToYesOrNo = (value: boolean, t: TFunction<'translation'>): string =>
  value ? t('general.yes') : t('general.no');

export const formatDateToDDMMYYYY = (value: any): string => value.toLocaleDateString('en-GB');

export const removeDateZoneInfo = (value: Date | undefined): Date | undefined => {
  if (!value) {
    return value;
  }
  const userTimezoneOffset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - userTimezoneOffset);
};

export const removeDateZoneInfoGMT2 = (value: Date | undefined): Date | undefined => {
  if (!value) {
    return value;
  }
  const userTimezoneOffset = (value.getTimezoneOffset() + 120) * 60000;
  return new Date(value.getTime() - userTimezoneOffset);
};

export const formatDateToDDMMYYYYhhmm = (value: any): string =>
  value.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDateTohhmm = (value: any): string =>
  value.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDateToDDMMYYYYhhmmWithTimezone = (value: any): string =>
  value.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Rome',
  });

export const formatDateToYYYYMMDD = (value: any): string => {
  const offset = value.getTimezoneOffset();
  const date = new Date(value.getTime() - offset * 60 * 1000);
  return date.toISOString().split('T')[0];
};

export function fromHoursFormattedToNumbers(hour: string): number {
  const separator = hour.indexOf(':');
  if (separator >= 0) {
    const subStringHours = hour.substring(0, separator);
    const subStringMinutes = hour.substring(separator + 1);

    const numberMinutes = Number(subStringMinutes) / 60;
    return Number(subStringHours) + numberMinutes;
  }
  return Number(hour);
}

export const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const dateDifferenceInDays = (dateInitial: Date, dateFinal: Date) =>
  (dateFinal.getTime() - dateInitial.getTime()) / (1000 * 60 * 60 * 24);

const CODE_LENGTHS_ALL: any = {
  AD: 24,
  AE: 23,
  AL: 28,
  AT: 20,
  AZ: 28,
  BA: 20,
  BE: 16,
  BG: 22,
  BH: 22,
  BI: 27,
  BR: 29,
  BY: 28,
  CH: 21,
  CR: 22,
  CY: 28,
  CZ: 24,
  DE: 22,
  DJ: 27,
  DK: 18,
  DO: 28,
  EE: 20,
  EG: 29,
  ES: 24,
  FI: 18,
  FK: 18,
  FO: 18,
  FR: 27,
  GB: 22,
  GE: 22,
  GI: 23,
  GL: 18,
  GR: 27,
  GT: 28,
  HR: 21,
  HU: 28,
  IE: 22,
  IL: 23,
  IQ: 23,
  IS: 26,
  IT: 27,
  JO: 30,
  KW: 30,
  KZ: 20,
  LB: 28,
  LC: 32,
  LI: 21,
  LT: 20,
  LU: 20,
  LV: 21,
  LY: 25,
  MC: 27,
  MD: 24,
  ME: 22,
  MK: 19,
  MN: 20,
  MR: 27,
  MT: 31,
  MU: 30,
  NI: 28,
  NL: 18,
  NO: 15,
  OM: 23,
  PK: 24,
  PL: 28,
  PS: 29,
  PT: 25,
  QA: 29,
  RO: 24,
  RS: 22,
  RU: 33,
  SA: 24,
  SC: 31,
  SD: 18,
  SE: 24,
  SI: 19,
  SK: 24,
  SM: 27,
  SO: 23,
  ST: 25,
  SV: 28,
  TL: 23,
  TN: 24,
  TR: 26,
  UA: 29,
  VA: 22,
  VG: 24,
  XK: 20,
};

const CODE_LENGTHS_SEPA: any = {
  AD: 24,
  AT: 20,
  BE: 16,
  BG: 22,
  CH: 21,
  CY: 28,
  CZ: 24,
  DE: 22,
  DK: 18,
  EE: 20,
  ES: 24,
  FI: 18,
  FR: 27,
  GB: 22,
  GI: 23,
  GR: 27,
  HR: 21,
  HU: 28,
  IE: 22,
  IS: 26,
  IT: 27,
  LI: 21,
  LT: 20,
  LU: 20,
  LV: 21,
  MC: 27,
  MT: 31,
  NL: 18,
  NO: 15,
  PL: 28,
  PT: 25,
  RO: 24,
  SE: 24,
  SI: 19,
  SK: 24,
  SM: 27,
  VA: 22,
};

export function isValidIBANNumber(input: string, onlySepa: boolean) {
  const CODE_LENGTHS = onlySepa ? CODE_LENGTHS_SEPA : CODE_LENGTHS_ALL;
  const iban = String(input).toUpperCase().trim(); // replace empty spaces
  const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/); // match and capture (1) the country code, (2) the check digits, and (3) the rest
  // check syntax and length
  if (!code || iban.length !== CODE_LENGTHS[code[1] as string]) {
    return false;
  }
  // rearrange country code and check digits, and convert chars to ints
  const digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (letter: string) =>
    String(letter.charCodeAt(0) - 55)
  );
  // final check
  let checksum: number = Number(digits.slice(0, 2));
  let fragment;
  for (let offset = 2; offset < digits.length; offset += 7) {
    fragment = String(checksum) + digits.substring(offset, offset + 7);
    checksum = parseInt(fragment, 10) % 97;
  }
  return checksum === 1;
}

export function isValidArray(array: any) {
  return (
    array &&
    typeof array === 'object' &&
    array.length > 0 &&
    (array.length === 1
      ? typeof array[0] === 'string'
        ? array[0].trim()
        : isNaN(array[0])
          ? Object.entries(array[0]).length > 0
          : true
      : true)
  );
}
