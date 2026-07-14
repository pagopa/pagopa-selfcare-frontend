import { validateIbanCsvData } from '../iban-csv-to-upload-parser';
import { add, format } from 'date-fns';

describe('iban-csv-to-upload-parser', () => {
    const validFutureDate = format(add(new Date(), { days: 1 }), 'dd/MM/yyyy');
    const pastDate = '01/01/2020';

    it('should validate a valid CREATE operation', () => {
        const csv = `descrizione,iban,dataattivazioneiban,operazione\nTest Create,IT60X0542811101000000123456,${validFutureDate},CREATE`;
        const result = validateIbanCsvData(csv);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.data).toHaveLength(1);
        expect(result.data[0].operazione).toBe('CREATE');
        expect(result.data[0].dataattivazioneiban).not.toBeNull();
    });

    it('should fail CREATE operation if description is empty', () => {
        const csv = `descrizione,iban,dataattivazioneiban,operazione\n,IT60X0542811101000000123456,${validFutureDate},CREATE`;
        const result = validateIbanCsvData(csv);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Riga 2: La descrizione deve essere valorizzata per l\'operazione CREATE');
    });

    it('should fail CREATE operation with past date', () => {
        const csv = `descrizione,iban,dataattivazioneiban,operazione\nTest Past,IT60X0542811101000000123456,${pastDate},CREATE`;
        const result = validateIbanCsvData(csv);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Data attivazione non può essere nel passato');
    });

    it('should fail CREATE operation with empty date', () => {
        const csv = `descrizione,iban,dataattivazioneiban,operazione\nTest Empty,IT60X0542811101000000123456,,CREATE`;
        const result = validateIbanCsvData(csv);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Data attivazione non valida');
    });

    it('should validate a valid UPDATE operation with empty date', () => {
        const csv = `descrizione,iban,dataattivazioneiban,operazione\nTest Update,IT60X0542811101000000123456,,UPDATE`;
        const result = validateIbanCsvData(csv);
        expect(result.valid).toBe(true);
        expect(result.data[0].operazione).toBe('UPDATE');
        expect(result.data[0].dataattivazioneiban).toBeNull();
    });

    it('should fail UPDATE operation if date is present', () => {
        const csv = `descrizione,iban,dataattivazioneiban,operazione\nTest Update,IT60X0542811101000000123456,${validFutureDate},UPDATE`;
        const result = validateIbanCsvData(csv);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Riga 2: La data attivazione non può essere valorizzata per l\'operazione UPDATE');
    });

    it('should validate a valid DELETE operation with empty date', () => {
        const csv = `descrizione,iban,dataattivazioneiban,operazione\n,IT60X0542811101000000123456,,DELETE`;
        const result = validateIbanCsvData(csv);
        expect(result.valid).toBe(true);
        expect(result.data[0].operazione).toBe('DELETE');
        expect(result.data[0].dataattivazioneiban).toBeNull();
    });

    it('should fail DELETE operation if description is present', () => {
        const csv = `descrizione,iban,dataattivazioneiban,operazione\nTest Delete,IT60X0542811101000000123456,,DELETE`;
        const result = validateIbanCsvData(csv);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Riga 2: La descrizione non può essere valorizzata per l\'operazione DELETE');
    });

    it('should fail DELETE operation if date is present', () => {
        const csv = `descrizione,iban,dataattivazioneiban,operazione\n,IT60X0542811101000000123456,${validFutureDate},DELETE`;
        const result = validateIbanCsvData(csv);
        expect(result.valid).toBe(false);
        expect(result.errors[0]).toContain('Riga 2: La data attivazione non può essere valorizzata per l\'operazione DELETE');
    });

    it('should handle headers with extra spaces', () => {
        const csv = ` descrizione , iban , dataattivazioneiban , operazione \nTest Spaces,IT60X0542811101000000123456,,UPDATE`;
        const result = validateIbanCsvData(csv);
        expect(result.valid).toBe(true);
    });
});
