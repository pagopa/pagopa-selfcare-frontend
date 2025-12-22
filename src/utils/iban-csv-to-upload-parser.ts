import {isValid, parse} from 'date-fns';
import {isValidIBANNumber} from './common-utils';

export interface IbanCsvRow {
    cf: string;
    iban: string;
    azione: string;
    dataAttivazione: string;
}

export interface ParsedIbanData {
    cf: string;
    iban: string;
    azione: 'censimento' | 'variazione' | 'cancellazione';
    dataAttivazione: Date;
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
    ).current.trim()]);

/**
 * Parse date from string supporting multiple formats
 */
export const parseIbanDate = (dateString: string): Date | null => {
    const formats = ['dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy-MM-dd'];
    
    const parsed = formats
        .map(format => parse(dateString, format, new Date()))
        .find(date => isValid(date));
    
    return parsed ?? null;
};

/**
 * Validate CSV headers
 */
const validateHeaders = (headers: Array<string>): string | null => {
    const expectedHeaders = ['cf', 'iban', 'azione', 'data attivazione iban'];
    const hasAllHeaders = expectedHeaders.every(header => 
        headers.some(h => h.replace(/\s+/g, ' ').trim() === header)
    );
    
    return hasAllHeaders 
        ? null 
        : 'Il file deve contenere le colonne: CF, IBAN, Azione, Data attivazione IBAN';
};

/**
 * Validate CF (Codice Fiscale)
 */
const validateCF = (cf: string, lineNum: number): string | null => {
    if (!cf || cf.trim() === '') {
        return `Riga ${lineNum}: CF mancante`;
    }
    if (cf.length < 11 || cf.length > 16) {
        return `Riga ${lineNum}: CF non valido (lunghezza non corretta)`;
    }
    return null;
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
 * Validate Azione
 */
const validateAzione = (azione: string, lineNum: number): { error: string | null; normalized: string } => {
    const normalized = azione.toLowerCase().trim();
    const validActions = ['censimento', 'variazione', 'cancellazione'];
    
    if (!validActions.includes(normalized)) {
        return {
            error: `Riga ${lineNum}: Azione non valida (deve essere: censimento, variazione o cancellazione)`,
            normalized
        };
    }
    return { error: null, normalized };
};

/**
 * Validate Data Attivazione
 */
const validateDataAttivazione = (dataAttivazione: string, lineNum: number): { error: string | null; date: Date | null } => {
    const parsedDate = parseIbanDate(dataAttivazione.trim());
    
    if (!parsedDate) {
        return {
            error: `Riga ${lineNum}: Data attivazione non valida (formato atteso: dd/MM/yyyy)`,
            date: null
        };
    }
    
    if (parsedDate < new Date()) {
        return {
            error: `Riga ${lineNum}: Data attivazione non può essere nel passato`,
            date: null
        };
    }
    
    return { error: null, date: parsedDate };
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

    const [cf, iban, azione, dataAttivazione] = columns;
    const errors: Array<string> = [];

    const cfError = validateCF(cf, lineNum);
    if (cfError) {
        return { errors: [cfError], data: null };
    }

    const ibanError = validateIBAN(iban, lineNum);
    if (ibanError) {
        return { errors: [ibanError], data: null };
    }

    const azioneValidation = validateAzione(azione, lineNum);
    if (azioneValidation.error) {
        return { errors: [azioneValidation.error], data: null };
    }

    const dateValidation = validateDataAttivazione(dataAttivazione, lineNum);
    if (dateValidation.error || !dateValidation.date) {
        return { errors: [dateValidation.error!], data: null };
    }

    return {
        errors: [],
        data: {
            cf: cf.trim().toUpperCase(),
            iban: iban.trim().toUpperCase(),
            azione: azioneValidation.normalized as 'censimento' | 'variazione' | 'cancellazione',
            dataAttivazione: dateValidation.date
        }
    };
};

/**
 * Calculate summary from parsed data
 */
const calculateSummary = (data: Array<ParsedIbanData>): { toAdd: number; toUpdate: number; toDelete: number } => data.reduce(
        (acc, item) => {
            if (item.azione === 'censimento') {
                return { ...acc, toAdd: acc.toAdd + 1 };
            }
            if (item.azione === 'variazione') {
                return { ...acc, toUpdate: acc.toUpdate + 1 };
            }
            if (item.azione === 'cancellazione') {
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