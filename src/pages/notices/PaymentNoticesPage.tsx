import { Alert, Box, Grid } from '@mui/material';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { generatePath, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { getInstitutionUploadData } from '../../services/noticesService';


import { InstitutionUploadData } from '../../../api/generated/portal/InstitutionUploadData';

const PaymentNoticesPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const setLoadingOverlay = useLoading(LOADING_TASK_IBAN_TABLE);
  const setLoadingStatus = (status: boolean) => {
    setLoading(status);
    setLoadingOverlay(status);
  };
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const [institutionUploadData, setInstitutionUploadData] = useState<InstitutionUploadData>(null);
  const [file, setFile] = useState<File>(null);

  const addEditData = () => {
    history.push(ROUTES.PAYMENT_NOTICES_ADDEDIT);
  };

  useEffect(() => {
    if (selectedParty && selectedParty.fiscalCode) {
      setLoadingStatus(true);
      getInstitutionUploadData(selectedParty.fiscalCode)
        .then((r) => (r ? setInstitutionUploadData(r) : setInstitutionUploadData(null)))
        .catch((err) => {

            const problemJson = extractProblemJson(err);

            if (problemJson?.status !== 404) {
                setError(true);
                addError({
                  id: 'GET_NOTICE_DATA',
                  blocking: false,
                  error: reason,
                  techDescription: `An error occurred while retrieving notice ci data`,
                  toNotify: true,
                  displayableTitle: t('noticesPage.error.getNoticeTitle'),
                  displayableDescription: t('noticesPage.error.getNoticeDesc'),
                  component: 'Toast',
                });
            }

        }).finally(() => setLoadingStatus(false));
    }
  }, [selectedParty?.fiscalCode]);

  return (
    <SideMenuLayout>
        <Stack direction="row" justifyContent="space-between" mt={5}>
            <Stack display="flex" justifyContent="flex-start" mr={2}>
              <TitleBox
                title={t('noticesPage.title')}
                subTitle={t('noticesPage.subtitle')}
                mbSubTitle={3}
                variantTitle="h4"
                variantSubTitle="body1"
              />
          </Stack>
          <Stack display="flex" justifyContent="flex-end">
            <Button
                  variant="contained"
                  onClick={addEditData}
                  startIcon={<AddIcon />}
                  color="primary"
                  sx={{
                    border: `2px solid ${theme.palette.primary.main}`,
                    borderRadius: theme.spacing(0.5),
                    px: 2,
                    py: 1.5,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {t(institutionUploadData === null ?
                    'paymentNoticesPage.addData' :
                    'paymentNoticesPage.editData'
                  )}
            </Button>
          </Stack>
      </Grid>
      {history.location.state && (history.location.state as any).alertWarningMessage && (
        <Alert severity="warning" variant="outlined" data-testid="alert-test">
          {(history.location.state as any).alertWarningMessage}
        </Alert>
      )}

      {institutionUploadData === null ?
        (
          <Box
            id="StationsSearchTableBox"
            sx={{
                position: 'relative',
                width: '100% !important',
                border: 'none',
            }}
            justifyContent="start"
          >
              <Box p={3} mt={3} sx={{ backgroundColor: '#EEEEEE' }}>
                <Box p={2} sx={{ textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                  <Typography variant="body2">
                    <Trans i18nKey="paymentNoticesPage.notConfigured">
                      Il modello non è stato ancora configurato
                      <Link
                        component={RouterLink}
                        sx={{
                          color: 'primary.main',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          whiteSpace: 'pre',
                        }}
                        to={generatePath(ROUTES.IBAN_ADD)}
                      >
                        <strong> Configura Modello </strong>
                      </Link>
                    </Trans>
                  </Typography>
                </Box>
              </Box>
          </Box>
        )
      :
        (<PaymentNoticesDetail data={institutionUploadData}>)
      }
    </SideMenuLayout>
  );
};

export default PaymentNoticesPage;
