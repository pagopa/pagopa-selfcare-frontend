import {FileDownloadSharp} from '@mui/icons-material';
import {Alert, Box, Button, Card, Stack, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {format} from "date-fns";
import {useEffect, useState} from 'react';
import {Party} from '../../../model/Party';
import {usePermissions} from '../../../hooks/usePermissions';
import {exportCreditorInstitutionToCSV, exportIbanToCSV, getBrokerExportStatus} from '../../../services/ibanService';
import {downloadBlobAsCSV} from '../../../utils/common-utils';

type Props = {
    selectedParty?: Party;
};

const downloadIbansAsCSV = (brokerCode: string) => {
    exportIbanToCSV(brokerCode)
        .then((response) => {
            downloadBlobAsCSV(new Blob([response], {type: 'text/csv'}), 'export-ibans.csv');
        })
        .catch((error) => {
            console.error(error);
        });
};

const downloadCreditorInstitutionsAsCSV = (brokerCode: string) => {
    exportCreditorInstitutionToCSV(brokerCode)
        .then((response) => {
            downloadBlobAsCSV(new Blob([response], {type: 'text/csv'}), 'export-ci.csv');
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

    const {userHasPermission} = usePermissions();
    const canDownloadIBANs = userHasPermission('download-iban');
    const canDownloadCreditorInstitutions = userHasPermission('download-creditor-institutions');
    const canSeeDownloadSection = canDownloadIBANs || canDownloadCreditorInstitutions;
    const [ibanExportUpdatedAt, setIbanExportUpdatedAt] = useState<Date | undefined>();
    const [ciExportUpdatedAt, setCiExportUpdatedAt] = useState<Date | undefined>();

    useEffect(() => {
        getBrokerExportStatus(brokerCode!)
            .then((response) => {
                setIbanExportUpdatedAt(response.broker_ibans_last_update);
                setCiExportUpdatedAt(response.broker_institutions_last_update);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

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
                                        disabled={ibanExportUpdatedAt === undefined}
                                    >
                                        {t('dashboardPage.downloadSection.downloadIbans')}
                                    </Button>

                                    {ibanExportUpdatedAt !== undefined &&
                                        <Alert severity="info" sx={{mb: 3}}>
                                            <>Dati aggiornati al {format(ibanExportUpdatedAt, "dd/MM/yyyy")} alle
                                                ore {format(ibanExportUpdatedAt, "hh:mm")}</>
                                        </Alert>
                                    }

                                    {ibanExportUpdatedAt === undefined &&
                                        <Alert severity="warning" sx={{mb: 3}}>
                                            <>Nessun dato presente</>
                                        </Alert>
                                    }
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
                                        disabled={ciExportUpdatedAt === undefined}
                                    >
                                        {t('dashboardPage.downloadSection.downloadCI')}
                                    </Button>
                                    {ciExportUpdatedAt !== undefined &&
                                        <Alert severity="info" sx={{mb: 3}}>
                                            <>Dati aggiornati al {format(ciExportUpdatedAt, "dd/MM/yyyy")} alle
                                                ore {format(ciExportUpdatedAt, "hh:mm")}</>
                                        </Alert>
                                    }
                                    {ciExportUpdatedAt === undefined &&
                                        <Alert severity="warning" sx={{mb: 3}}>
                                            <>Nessun dato presente</>
                                        </Alert>
                                    }
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
