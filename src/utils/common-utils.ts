import { Iban } from "../api/generated/portal/Iban";
import { IbanOnCreation } from "../model/Iban";

export const isIbanValid = (iban?: Iban | IbanOnCreation) : boolean =>
    iban !== undefined && iban.due_date !== undefined && (new Date(iban.due_date) > new Date());

export const isIbanValidityDateEditable = (iban?: Iban | IbanOnCreation) : boolean =>
    iban !== undefined && iban.validity_date !== undefined && (new Date(iban.validity_date) > new Date());

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

export const formatCodeInDoubleDigit = (code: string | undefined) : string => {
    if (code === undefined) {
        return "-";
    }
    const castedCode: number = +code;
    if (castedCode < 10) {
        return "0" + code;
    } else {
        return code;
    }
};
