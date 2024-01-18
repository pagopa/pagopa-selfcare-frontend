import {FileDownloadSharp} from '@mui/icons-material';
import {Alert, Box, Button, Card, Stack, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {format} from "date-fns";
import {Party} from '../../../model/Party';
import {usePermissions} from '../../../hooks/usePermissions';
import {exportCreditorInstitutionToCSV, exportIbanToCSV} from '../../../services/ibanService';
import {downloadBlobAsCSV} from '../../../utils/common-utils';

type Props = {
    selectedParty?: Party;
};

const downloadIbansAsCSV = (brokerCode: string) => {
    exportIbanToCSV(brokerCode)
        .then((response) => {
            downloadBlobAsCSV(new Blob([response], {type: 'text/csv'}));
        })
        .catch((error) => {
            console.error(error);
        });
};

const downloadCreditorInstitutionsAsCSV = (brokerCode: string) => {
    exportCreditorInstitutionToCSV(brokerCode)
        .then((response) => {
            downloadBlobAsCSV(new Blob([response], {type: 'text/csv'}));
        })
        .catch((error) => {
            console.error(error);
        });
};

const DownloadSection = ({selectedParty}: Props) => {
    const {t} = useTranslation();

    const brokerCode = selectedParty?.fiscalCode;
    const exportIbanToCSV = () => downloadIbansAsCSV(brokerCode!);
    const downloadCreditorInstitutionToCSV = () => downloadCreditorInstitutionsAsCSV(brokerCode!);

    const {hasPermission} = usePermissions();
    const canDownloadIBANs = hasPermission('download-iban');
    const canDownloadCreditorInstitutions = hasPermission('download-creditor-institutions');
    const canSeeDownloadSection = canDownloadIBANs || canDownloadCreditorInstitutions;

    const today = format(new Date(), "dd/MM/yyyy");
    return (
        <>
            {canSeeDownloadSection && (
                <Card variant="outlined" sx={{border: 0, borderRadius: 0, p: 3, mb: 1}}>
                    <Typography variant="h6" mb={3}>
                        {t('dashboardPage.downloadSection.title')}
                    </Typography>
                    <Box mb={3}>
                        <Stack direction="row" mt={1}>
                            {canDownloadIBANs && (
                                <>
                                    <Button
                                        sx={{mt: 1, mr: 2}}
                                        variant="contained"
                                        size="small"
                                        endIcon={<FileDownloadSharp/>}
                                        onClick={exportIbanToCSV}
                                        data-testid="export-iban-test"
                                    >
                                        {t('dashboardPage.downloadSection.downloadIbans')}
                                    </Button>
                                    <Alert severity="info" sx={{mb: 3}}>
                                        Dati aggiornati al {today} alle ore 03:00 am
                                    </Alert>
                                </>
                            )}
                        </Stack>
                        <Stack direction="row" mt={1}>
                            {canDownloadCreditorInstitutions && (
                                <>
                                    <Button
                                        sx={{mt: 1, mr: 3}}
                                        variant="contained"
                                        size="small"
                                        endIcon={<FileDownloadSharp/>}
                                        onClick={downloadCreditorInstitutionToCSV}
                                        data-testid="export-creditorinstitution-test"
                                    >
                                        {t('dashboardPage.downloadSection.downloadCI')}
                                    </Button>
                                    <Alert severity="info" sx={{mb: 3}}>
                                        Dati aggiornati al {today} alle ore 03:00 am
                                    </Alert>
                                </>
                            )}
                        </Stack>
                    </Box>
                </Card>
            )}
        </>
    );
};

export default DownloadSection;
