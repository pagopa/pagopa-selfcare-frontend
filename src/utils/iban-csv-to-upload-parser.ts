import { isValid, parse, startOfDay } from 'date-fns';
import { isValidIBANNumber } from './common-utils';

/**
 * TODO: handle translations related to the CSV errors validation
 * in the future initiative dedicated to the aggregati&intermediari
 */
export interface IbanCsvRow {
    descrizione: string;
    iban: string;
    dataattivazioneiban: string;
    operazione: string;
}

export interface ParsedIbanData {
    descrizione: string;
    iban: string;
    dataattivazioneiban: Date | null;
    operazione: 'CREATE' | 'UPDATE' | 'DELETE';
}

export interface ValidationResult {
    valid: boolean;
    errors: Array<string>;
    data: Array<ParsedIbanData>;
    summary: {
        toAdd: number;
        toUpdate: number;
        toDelete: number;
    };
}

/**
 * Parse a CSV line handling commas inside quotes
 */
export const parseCsvLine = (line: string): Array<string> => line.split('').reduce(
    (acc, char) => {
        if (char === '"') {
            return { ...acc, inQuotes: !acc.inQuotes };
        }
        if (char === ',' && !acc.inQuotes) {
            return {
                ...acc,
                result: [...acc.result, acc.current.trim()],
                current: '',
            };
        }
        return { ...acc, current: acc.current + char };
    },
    { result: [] as Array<string>, current: '', inQuotes: false }
).result.concat([line.split('').reduce(
    (acc, char) => {
        if (char === '"') {
            return { ...acc, inQuotes: !acc.inQuotes };
        }
        if (char === ',' && !acc.inQuotes) {
            return { ...acc, current: '' };
        }
        return { ...acc, current: acc.current + char };
    },
    { current: '', inQuotes: false }
).current.trim()]).map((field) => field.trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));

/**
 * Parse date from string supporting multiple formats
 */
export const parseIbanDate = (dateString: string): Date | null => {
    if (!dateString?.trim()) { return null; }

    const formats = ['dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy-MM-dd'];

    return formats
        .map(format => parse(dateString.trim(), format, new Date()))
        .find(date => isValid(date)) ?? null;
};

/**
 * Validate CSV headers
 */
const validateHeaders = (headers: Array<string>): string | null => {
    const expectedHeaders = ['descrizione', 'iban', 'dataattivazioneiban', 'operazione'];
    const hasAllHeaders = expectedHeaders.every(header =>
        headers.some(h => h.replace(/\s+/g, ' ').trim() === header)
    );

    return hasAllHeaders
        ? null
        : 'Il file deve contenere le colonne: descrizione, iban, dataattivazioneiban, operazione';
};

/**
 * Validate IBAN
 */
const validateIBAN = (iban: string, lineNum: number): string | null => {
    if (!iban || iban.trim() === '') {
        return `Riga ${lineNum}: IBAN mancante`;
    }
    if (!isValidIBANNumber(iban.trim(), true)) {
        return `Riga ${lineNum}: IBAN non valido (${iban})`;
    }
    return null;
};

/**
 * Validate Operazione
 */
const validateAzione = (operazione: string, lineNum: number): { error: string | null; normalized: string } => {
    const normalized = operazione.trim();
    const validActions = ['CREATE', 'UPDATE', 'DELETE'];

    if (!validActions.includes(normalized)) {
        return {
            error: `Riga ${lineNum}: operazione non valida (deve essere: CREATE, UPDATE o DELETE)`,
            normalized
        };
    }
    return { error: null, normalized };
};

/**
 * Validate Data Attivazione
 */
const validateDataAttivazione = (
    dataAttivazione: string,
    lineNum: number,
    operazione: string
): { error: string | null; date: Date | null } => {
    const trimmedDate = dataAttivazione.trim();

    if (operazione !== 'CREATE') {
        if (trimmedDate !== '') {
            return {
                error: `Riga ${lineNum}: La data attivazione non può essere valorizzata per l'operazione ${operazione}`,
                date: null
            };
        }
        return { error: null, date: null };
    }

    const parsedDate = parseIbanDate(trimmedDate);

    if (!parsedDate) {
        return {
            error: `Riga ${lineNum}: Data attivazione non valida (formato atteso: dd/MM/yyyy)`,
            date: null
        };
    }

    const today = startOfDay(new Date());
    if (parsedDate < today) {
        return {
            error: `Riga ${lineNum}: Data attivazione non può essere nel passato`,
            date: null
        };
    }

    return { error: null, date: parsedDate };
};

/**
 * Validate Descrizione
 */
const validateDescrizione = (
    descrizione: string,
    lineNum: number,
    operazione: string
): string | null => {
    const trimmedDescrizione = descrizione.trim();

    if ((operazione === 'CREATE' || operazione === 'UPDATE') && trimmedDescrizione === '') {
        return `Riga ${lineNum}: La descrizione deve essere valorizzata per l'operazione ${operazione}`;
    }

    if (operazione === 'DELETE' && trimmedDescrizione !== '') {
        return `Riga ${lineNum}: La descrizione non può essere valorizzata per l'operazione ${operazione}`;
    }

    return null;
};

/**
 * Validate a single CSV row
 */
const validateRow = (
    columns: Array<string>,
    lineNum: number
): { errors: Array<string>; data: ParsedIbanData | null } => {
    if (columns.length !== 4) {
        return {
            errors: [`Riga ${lineNum}: numero di colonne non valido (attese 4, trovate ${columns.length})`],
            data: null
        };
    }

    const [descrizione, iban, dataattivazioneIban, operazione] = columns;
    const errors: Array<string> = [];

    const ibanError = validateIBAN(iban, lineNum);
    if (ibanError) {
        return { errors: [ibanError], data: null };
    }

    const azioneValidation = validateAzione(operazione, lineNum);
    if (azioneValidation.error) {
        return { errors: [azioneValidation.error], data: null };
    }

    const descrizioneError = validateDescrizione(descrizione, lineNum, azioneValidation.normalized);
    if (descrizioneError) {
        return { errors: [descrizioneError], data: null };
    }

    const dateValidation = validateDataAttivazione(dataattivazioneIban, lineNum, azioneValidation.normalized);
    if (dateValidation.error) {
        return { errors: [dateValidation.error], data: null };
    }

    return {
        errors: [],
        data: {
            descrizione: descrizione.trim(),
            iban: iban.trim().toUpperCase(),
            operazione: azioneValidation.normalized as 'CREATE' | 'UPDATE' | 'DELETE',
            dataattivazioneiban: dateValidation.date
        }
    };
};

/**
 * Calculate summary from parsed data
 */
const calculateSummary = (data: Array<ParsedIbanData>): { toAdd: number; toUpdate: number; toDelete: number } => data.reduce(
    (acc, item) => {
        if (item.operazione === 'CREATE') {
            return { ...acc, toAdd: acc.toAdd + 1 };
        }
        if (item.operazione === 'UPDATE') {
            return { ...acc, toUpdate: acc.toUpdate + 1 };
        }
        if (item.operazione === 'DELETE') {
            return { ...acc, toDelete: acc.toDelete + 1 };
        }
        return acc;
    },
    { toAdd: 0, toUpdate: 0, toDelete: 0 }
);

/**
 * Validate CSV data and return structured result
 */
export const validateIbanCsvData = (csvText: string): ValidationResult => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');

    if (lines.length < 2) {
        return {
            valid: false,
            errors: ['Il file CSV deve contenere almeno una riga di intestazione e una riga di dati'],
            data: [],
            summary: { toAdd: 0, toUpdate: 0, toDelete: 0 }
        };
    }

    // Validate headers
    const headers = parseCsvLine(lines[0].toLowerCase());
    const headerError = validateHeaders(headers);

    if (headerError) {
        return {
            valid: false,
            errors: [headerError],
            data: [],
            summary: { toAdd: 0, toUpdate: 0, toDelete: 0 }
        };
    }

    // Process data rows
    const results = lines.slice(1).map((line, index) => {
        const lineNum = index + 2;
        const columns = parseCsvLine(line);
        return validateRow(columns, lineNum);
    });

    const errors = results.flatMap(result => result.errors);
    const data = results
        .filter(result => result.data !== null)
        .map(result => result.data!);

    const summary = calculateSummary(data);

    return {
        valid: errors.length === 0,
        errors,
        data,
        summary
    };
};