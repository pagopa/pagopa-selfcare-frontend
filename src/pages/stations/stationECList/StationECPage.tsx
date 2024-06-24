<<<<<<< HEAD
import { Add, ArrowBack, FileDownload } from '@mui/icons-material';
import { Alert, Box, Breadcrumbs, Button, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
=======
import {ArrowBack, FileDownload} from '@mui/icons-material';
import {Alert, Box, Breadcrumbs, Button, Grid, Stack, Typography} from '@mui/material';
import {ButtonNaked} from '@pagopa/mui-italia';
import {TitleBox} from '@pagopa/selfcare-common-frontend';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useParams} from 'react-router';
>>>>>>> 3f32cfc3 (Formatting (#542))
import SideMenuLayout from '../../../components/SideMenu/SideMenuLayout';
import ROUTES from '../../../routes';
import TableSearchBar from '../../../components/Table/TableSearchBar';
// import { mockedStationECs } from '../../../services/__mocks__/stationService';
import { CreditorInstitutionInfoResource } from '../../../api/generated/portal/CreditorInstitutionInfoResource';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { getAvailableCreditorInstitutionsForStation } from '../../../services/creditorInstitutionService';
import StationECTable from './StationECTable';

const StationECListPage = () => {
<<<<<<< HEAD
  const { t } = useTranslation();
  const history = useHistory();
  const { stationId } = useParams<{ stationId: string }>();
  const [alertMessage, setAlertMessage] = useState('');
  const goBack = () => history.push(ROUTES.STATIONS);
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const addError = useErrorDispatcher();
  const [ciNameOrFiscalCodeInput, setCiNameInput] = useState<string>('');
  const [ciNameOrFiscalCodeFilter, setCiNameOrFiscalCodeFilter] = useState<string>('');
  const [noValidCi, setNoValidCi] = useState<boolean | undefined>();
=======
    const {t} = useTranslation();
    const history = useHistory();
    const {stationId} = useParams<{ stationId: string }>();
    const [alertMessage, setAlertMessage] = useState('');
    const goBack = () => history.push(ROUTES.STATIONS);

    const [ciNameOrFiscalCodeInput, setCiNameInput] = useState<string>('');
    const [ciNameOrFiscalCodeFilter, setCiNameOrFiscalCodeFilter] = useState<string>('');
>>>>>>> 3f32cfc3 (Formatting (#542))

    useEffect(() => {
        const setSearchValue = setTimeout(() => {
            setCiNameOrFiscalCodeFilter(ciNameOrFiscalCodeInput);
        }, 500);

        return () => clearTimeout(setSearchValue);
    }, [ciNameOrFiscalCodeInput]);

    useEffect(() => {
        if (history.location.state && (history.location.state as any).alertSuccessMessage) {
            setAlertMessage((history.location.state as any).alertSuccessMessage);
            window.history.replaceState({}, document.title);
        }
    }, []);

<<<<<<< HEAD
  useEffect(() => {
    if (selectedParty?.partyId) {
      getAvailableCreditorInstitutionsForStation({
        stationCode: stationId,
        brokerId: selectedParty.partyId,
      })
        .then((data: CreditorInstitutionInfoResource) => {
          if (
            data?.creditor_institution_info_list &&
            data.creditor_institution_info_list.length > 0
          ) {
            setNoValidCi(false);
          } else {
            setNoValidCi(true);
          }
        })
        .catch((reason) =>
          addError({
            id: 'GET_AVAILABLE_DELEGATED_EC_LIST',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while getting delegated ec list`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(
              'stationAssociateECPage.associationForm.errorMessageDelegatedEd'
            ),
            component: 'Toast',
          })
        );
    }
  }, []);

  setTimeout(() => setAlertMessage(''), 6000);
=======
    setTimeout(() => setAlertMessage(''), 6000);
>>>>>>> 3f32cfc3 (Formatting (#542))

    const downloadCSV = () => {
        // TODO: fetch form station service
    };

    return (
        <SideMenuLayout>
            <Stack direction="row" mb={3}>
                <ButtonNaked
                    size="small"
                    component="button"
                    onClick={goBack}
                    startIcon={<ArrowBack/>}
                    sx={{color: 'primary.main', mr: '20px', fontWeight: 700}}
                    weight="default"
                >
                    {t('general.back')}
                </ButtonNaked>
                <Breadcrumbs>
                    <Typography fontSize={16}>{stationId}</Typography>
                    <Typography fontWeight={'fontWeightMedium'}>{t('stationECList.title')}</Typography>
                </Breadcrumbs>
            </Stack>

            <Stack direction="row" justifyContent={'space-between'}>
                <Box>
                    <TitleBox
                        title={t('stationECList.title')}
                        subTitle={t('stationECList.subtitle')}
                        mbTitle={2}
                        mbSubTitle={3}
                        variantTitle="h4"
                        variantSubTitle="body1"
                    />
                </Box>
                <Box>
                    <Button
                        variant="outlined"
                        sx={{display: 'none'}}
                        startIcon={<FileDownload/>}
                        onClick={() => downloadCSV()}
                    >
                        {t('stationECList.csvDownload')}
                    </Button>
                </Box>
            </Stack>

<<<<<<< HEAD
      {alertMessage && (
        <Alert
          sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
          severity="success"
          variant="outlined"
        >
          {alertMessage}
        </Alert>
      )}
      {noValidCi && (
        <Box mb={2}>
          <Alert severity={'warning'} data-testid="alert-warning-test" variant="outlined">
            {t('stationAssociateECPage.alert.noDelegations')}
          </Alert>
        </Box>
      )}

      <TableSearchBar
        componentName="stationECList"
        setExternalSearchInput={setCiNameInput}
        customEndButton={
          <Button
            component={Link}
            to={generatePath(ROUTES.STATION_ASSOCIATE_EC, {
              stationId,
            })}
            variant="contained"
            sx={{ ml: 1, whiteSpace: 'nowrap', minWidth: 'auto' }}
            startIcon={<Add />}
            disabled={noValidCi ?? true}
          >
            {t('stationECList.associateEcButtonLabel')}
          </Button>
        }
      />
      <StationECTable
        ciNameOrFiscalCodeFilter={ciNameOrFiscalCodeFilter}
        setAlertMessage={setAlertMessage}
      />
    </SideMenuLayout>
  );
=======
            {alertMessage && (
                <Alert
                    sx={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000,
                    }}
                    severity="success"
                    variant="outlined"
                >
                    {alertMessage}
                </Alert>
            )}

            <StationECTableSearchBar
                stationId={stationId}
                ciNameOrFiscalCodeInput={ciNameOrFiscalCodeInput}
                setCiNameInput={setCiNameInput}
            />
            <Box display="flex" width="100%" mt={0}>
                <Box pt={0} display="flex" width="100%">
                    <StationECTable
                        ciNameOrFiscalCodeFilter={ciNameOrFiscalCodeFilter}
                        setAlertMessage={setAlertMessage}
                    />
                </Box>
            </Box>
        </SideMenuLayout>
    );
>>>>>>> 3f32cfc3 (Formatting (#542))
};

export default StationECListPage;
