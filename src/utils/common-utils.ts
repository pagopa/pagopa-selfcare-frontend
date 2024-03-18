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

export const formatCurrencyEur = (value: number): string =>
  value.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });

export const formatBooleanValueToYesOrNo = (value: boolean, t: TFunction<'translation'>): string =>
  value ? t('general.yes') : t('general.no');

export const formatDateToDDMMYYYY = (value: any): string => value.toLocaleDateString('en-GB');

export const formatDateToDDMMYYYYhhmm = (value: any): string =>
  value.toLocaleString('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const dateDifferenceInDays = (dateInitial: Date, dateFinal: Date) =>
  (dateFinal.getTime() - dateInitial.getTime()) / (1000 * 60 * 60 * 24);
