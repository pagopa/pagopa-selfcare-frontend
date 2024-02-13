export const checkInstitutionTypes = (institutionType: string, validInstitutionTypes: Array<string>) => {
     return institutionType && validInstitutionTypes.includes(institutionType);
}