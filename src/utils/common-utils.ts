import { Iban } from "../api/generated/portal/Iban";

export const isIbanValid = (iban?: Iban) : boolean =>
    iban && iban.due_date && (new Date(iban.due_date) > new Date()) || false;

export const downloadBlobAsCSV = (data: any) : void => {
    const objectTempURL = window.URL.createObjectURL(data);
    
    // eslint-disable-next-line no-var
    var tempLink = document.createElement('a');
    // eslint-disable-next-line functional/immutable-data
    tempLink.href = objectTempURL;
    tempLink.setAttribute('download', 'export-ibans.csv');
    
    document.body.appendChild(tempLink);
    tempLink.click();
    tempLink.parentNode?.removeChild(tempLink);
};