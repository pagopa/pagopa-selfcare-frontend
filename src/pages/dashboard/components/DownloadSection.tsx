import {FileDownloadSharp} from '@mui/icons-material';
import {Box, Button, Card, Stack, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useState} from "react";
import {Party} from '../../../model/Party';
import {usePermissions} from '../../../hooks/usePermissions';
import {exportIbanToCSV} from '../../../services/ibanService';
import {downloadBlobAsCSV} from '../../../utils/common-utils';

type Props = {
    selectedParty?: Party;
};

const DownloadSection = ({selectedParty}: Props) => {
    const {t} = useTranslation();

    const partyId = selectedParty?.partyId;

    const {hasPermission} = usePermissions();
    const canDownloadIBANs = hasPermission('download-iban');
    const canDownloadCreditorInstitutions = hasPermission('download-creditor-institutions');
    const canSeeDownloadSection = canDownloadIBANs || canDownloadCreditorInstitutions;
    const [downloadDisabled, setDownloadDisabled] = useState<boolean>(false);

    const downloadCreditorInstitutionAsCSV = () => {
    };

    const downloadIbansAsCSV = () => {
        setDownloadDisabled(true);
        exportIbanToCSV(partyId!)
            .then((response) => {
                downloadBlobAsCSV(new Blob([response], {type: 'text/csv'}));
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setDownloadDisabled(false);
            });
    };

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
                                <Stack display="flex" mr={1}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        endIcon={<FileDownloadSharp/>}
                                        onClick={downloadIbansAsCSV}
                                        data-testid="export-iban-test"
                                        disabled={downloadDisabled}
                                    >
                                        {t('dashboardPage.downloadSection.downloadIbans')}
                                    </Button>
                                </Stack>
                            )}
                            {canDownloadCreditorInstitutions && (
                                <Stack display="flex" mr={1}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        endIcon={<FileDownloadSharp/>}
                                        onClick={downloadCreditorInstitutionAsCSV}
                                        data-testid="export-creditorinstitution-test"
                                    >
                                        {t('dashboardPage.downloadSection.downloadCI')}
                                    </Button>
                                </Stack>
                            )}
                        </Stack>
                    </Box>
                </Card>
            )}
        </>
    );
};

export default DownloadSection;
