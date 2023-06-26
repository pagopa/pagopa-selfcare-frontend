import { Box, Grid, Alert, Card, Typography } from '@mui/material';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import { ButtonNaked } from '@pagopa/mui-italia';
import EditIcon from '@mui/icons-material/Edit';
import SideMenu from '../../components/SideMenu/SideMenu';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { IbansResource } from '../../api/generated/portal/IbansResource';
import { LOADING_TASK_IBAN_TABLE } from '../../utils/constants';
import { getIbanList } from '../../services/ibanService';
import IbanTable from './list/IbanTable';

const emptyIbanList: IbansResource = {
  ibanList: [],
};

const IbanPage = () => {
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
  const [ibanList, setIbanList] = useState<IbansResource>(emptyIbanList);

  const fetchIbans = (creditorInstitutionCode: string) => {
    setLoadingStatus(true);

    getIbanList(creditorInstitutionCode)
      .then((r) => (r ? setIbanList(r) : setIbanList(emptyIbanList)))
      .catch((reason) => {
        handleErrors([
          {
            id: `FETCH_STATIONS_ERROR`,
            blocking: false,
            error: reason,
            techDescription: `An error occurred while fetching stations`,
            toNotify: false,
          },
        ]);
        setError(true);
        addError({
          id: 'GET_IBAN_LIST',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while retrieving iban list`,
          toNotify: true,
          displayableTitle: t('ibanPage.error.listErrorTitle'),
          displayableDescription: t('ibanPage.error.listErrorDesc'),
          component: 'Toast',
        });
        setIbanList(emptyIbanList);
      })
      .finally(() => setLoadingStatus(false));
  };

  useEffect(() => {
    if (selectedParty && selectedParty.fiscalCode) {
      fetchIbans(selectedParty.fiscalCode);
    }
  }, [selectedParty]);

  return (
    <Grid container item xs={12} sx={{ backgroundColor: 'background.paper' }}>
      <Grid item xs={2}>
        <Box>
          <SideMenu />
        </Box>
      </Grid>
      <Grid
        item
        xs={10}
        sx={{ backgroundColor: '#F5F6F7' }}
        display="flex"
        justifyContent="center"
        pb={8}
      >
        <Box width="100%" px={2}>
          <TitleBox
            title={t('ibanPage.title')}
            subTitle={t('ibanPage.subtitle')}
            mbTitle={2}
            mtTitle={4}
            mbSubTitle={3}
            variantTitle="h4"
            variantSubTitle="body1"
          />
          {history.location.state && (history.location.state as any).alertSuccessMessage && (
            <Alert severity="success" variant="outlined" sx={{ mb: 4 }}>
              {(history.location.state as any).alertSuccessMessage}
            </Alert>
          )}

          <Grid container spacing={2} mb={4}>
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ border: 0, borderRadius: 0, p: 3, mb: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="overline">{t('ibanPage.standIn')}</Typography>
                    <Typography variant="subtitle1" fontWeight="regular" fontSize={16}>
                      {t('ibanPage.standInDetail')}
                    </Typography>
                    <Typography mt={1} variant="body2" fontWeight="regular">
                      <Typography component="span" mr={4} fontSize={'inherit'}>
                        IBAN
                      </Typography>
                      <Typography
                        component="span"
                        fontSize={'inherit'}
                        fontWeight="fontWeightMedium"
                      >
                        -
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="overline">{t('ibanPage.cup')}</Typography>
                    <Typography variant="subtitle1" fontWeight="regular" fontSize={16}>
                      {t('ibanPage.cupDetail')}
                    </Typography>
                    <Typography mt={1} variant="body2" fontWeight="regular">
                      <Typography component="span" mr={4} fontSize={'inherit'}>
                        IBAN
                      </Typography>
                      <Typography
                        component="span"
                        fontSize={'inherit'}
                        fontWeight="fontWeightMedium"
                      >
                        -
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <ButtonNaked
                      size="small"
                      component="button"
                      disabled={ibanList.ibanList.length <= 0}
                      onClick={() => console.log('cliccato')}
                      endIcon={<EditIcon />}
                      sx={{ color: 'primary.main', fontWeight: 'fontWeightBold' }}
                    >
                      {t('ibanPage.manage')}
                    </ButtonNaked>
                  </Grid>
                </Grid>
              </Card>
              {selectedParty && (
                <IbanTable ibanList={ibanList} error={error} loading={loading}></IbanTable>
              )}
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default IbanPage;
