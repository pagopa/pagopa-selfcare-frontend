import { Box, Grid, Alert } from '@mui/material';
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { handleErrors } from '@pagopa/selfcare-common-frontend/services/errorService';
import SideMenu from '../../components/SideMenu/SideMenu';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { Ibans } from '../../api/generated/portal/Ibans';
import { LOADING_TASK_IBAN_TABLE } from '../../utils/constants';
import { IbanOnCreation } from '../../model/Iban';
import { getIbanList } from '../../services/ibanService';
import StandInAndCupForm from './StandInAndCupForm/StandInAndCupForm';

const emptyIbanList: Ibans = {
  ibans_enhanced: [],
};

export const emptyIban: IbanOnCreation = {
  iban: '',
  description: '',
  validityDate: new Date(),
  dueDate: new Date(),
  creditorInstitutionCode: '',
  active: true,
  labels: [],
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
  const [ibanList, setIbanList] = useState<Ibans>(emptyIbanList);

  useEffect(() => {
    if (selectedParty && selectedParty.fiscalCode) {
      setLoadingStatus(true);
      getIbanList(selectedParty.fiscalCode)
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
    }
  }, [selectedParty?.fiscalCode]);

  return (
    <>
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

            <StandInAndCupForm ibanList={ibanList} error={error} loading={loading} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default IbanPage;
