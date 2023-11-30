import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation, Trans } from 'react-i18next';
import { Box } from '@mui/system';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useFormik } from 'formik';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';
import ROUTES from '../../../routes';
import { LOADING_TASK_PSP_AVAILABLE } from '../../../utils/constants';
import {
  associatePSPtoChannel,
  getDelegatedPSPbyBroker,
  getChannelDetail,
} from '../../../services/channelService';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import { ChannelDetailsResource } from '../../../api/generated/portal/ChannelDetailsResource';
import { Party } from '../../../model/Party';
import { Delegation } from '../../../api/generated/portal/Delegation';
import { PaymentServiceProvidersResource } from '../../../api/generated/portal/PaymentServiceProvidersResource';
import { getPSPDetails, getPaymentServiceProviders } from '../../../services/nodeService';
import PSPSelectionSearch from './PSPSelectionSearch';

function ChannelAssociatePSPPage() {
  const { t } = useTranslation();
  const setLoading = useLoading(LOADING_TASK_PSP_AVAILABLE);
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  const { channelId } = useParams<{ channelId: string }>();

  const [selectedPSP, setSelectedPSP] = useState<Delegation | undefined>();
  const [availablePSP, setAvailablePSP] = useState<Array<Delegation>>([]);
  const [channelDetail, setChannelDetail] = useState<ChannelDetailsResource>();

  const formik = useFormik({
    initialValues: {
      product: '',
    },
    onSubmit: (_values) => {},
  });

  const history = useHistory();

  const goBack = () => {
    history.push(
      generatePath(ROUTES.CHANNEL_PSP_LIST, {
        channelId,
      })
    );
  };

  const handleSubmit = async () => {
    if (selectedPSP && selectedPSP.institution_id) {
      setLoading(true);

      const pspsByTaxCode: PaymentServiceProvidersResource = await getPaymentServiceProviders(
        0,
        undefined,
        undefined,
        undefined,
        selectedPSP.tax_code
      );
      const pspToBeAssociatedDetails =
        pspsByTaxCode &&
        pspsByTaxCode.payment_service_providers &&
        pspsByTaxCode.payment_service_providers[0].psp_code
          ? await getPSPDetails(pspsByTaxCode.payment_service_providers[0].psp_code)
          : null;

      if (pspToBeAssociatedDetails?.psp_code) {
        associatePSPtoChannel(
          channelId,
          pspToBeAssociatedDetails.psp_code,
            (channelDetail?.payment_types ?? []) as any
        )
          .then((_data) => {
            history.push(
              generatePath(ROUTES.CHANNEL_PSP_LIST, {
                channelId,
              }),
              {
                alertSuccessMessage: t('channelAssociatePSPPage.associationForm.successMessage'),
              }
            );
          })
          .catch((reason) =>
            addError({
              id: 'ASSOCIATE_PSP',
              blocking: false,
              error: reason,
              techDescription: `An error occurred while psp association`,
              toNotify: true,
              displayableTitle: t('channelAssociatePSPPage.associationForm.errorMessageTitle'),
              displayableDescription: t('channelAssociatePSPPage.associationForm.errorMessageDesc'),
              component: 'Toast',
            })
          )
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    if (selectedParty) {
      getChannelDetail(channelId)
        .then((channel) => setChannelDetail(channel))
        .catch((reason) => console.error(reason));

      getDelegatedPSPbyBroker(selectedParty?.fiscalCode)
        .then((data) => {
          if (data && selectedParty) {
            // A PSP that is a broker can associate itself to the channel
            const availablePSPfromService = addCurrentPSP(data, selectedParty);

            setAvailablePSP(availablePSPfromService);
          }
        })
        .catch((reason) => console.error(reason))
        .finally(() => setLoading(false));
    }

    setLoading(false);
  }, [selectedParty]);

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
      px={3}
      mt={3}
      sx={{ width: '100%', backgroundColor: 'transparent !important' }}
    >
      <Box justifyContent="center">
        <Grid item xs={12} mb={1} display="flex" justifyContent="center">
          <Typography variant="h3">
            <Trans i18nKey="channelAssociatePSPPage.associationForm.title">Associa PSP</Trans>
          </Typography>
        </Grid>
        <Grid item xs={12} mb={4} display="flex" justifyContent="center">
          <Typography variant="body1" align="center">
            <Trans i18nKey="channelAssociatePSPPage.associationForm.subTitle">
              Digita il nome del nuovo PSP da associare al canale
            </Trans>{' '}
            <Typography component="span" fontWeight={'fontWeightMedium'}>
              {channelId}
            </Typography>
          </Typography>
        </Grid>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        flexGrow={0}
        mb={1}
        sx={{ width: '100%', maxWidth: '684px' }}
      >
        <Paper
          elevation={8}
          sx={{
            minWidth: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.spacing(2),
          }}
        >
          <Grid item xs={12} p={3}>
            <form onSubmit={formik.handleSubmit}>
              <FormControl sx={{ width: '100%', minWidth: '100%' }}>
                <PSPSelectionSearch
                  iconColor={'#17324D'}
                  label={t('channelAssociatePSPPage.associationForm.PSPSelectionInputPlaceholder')}
                  availablePSP={availablePSP}
                  selectedPSP={selectedPSP}
                  onPSPSelectionChange={(selectedPSP: Delegation | undefined) => {
                    setSelectedPSP(selectedPSP);
                  }}
                />
              </FormControl>
            </form>
          </Grid>
        </Paper>
      </Box>

      <Stack direction="row" justifyContent="space-between" mt={5}>
        <Stack display="flex" justifyContent="flex-start" mr={2}>
          <Button color="primary" variant="outlined" onClick={goBack} data-testid="back-btn-test">
            {t('channelAssociatePSPPage.associationForm.backButton')}
          </Button>
        </Stack>
        <Stack display="flex" justifyContent="flex-end">
          <Button
            onClick={handleSubmit}
            // disabled={!formik.dirty || !formik.isValid}
            disabled={!selectedPSP}
            color="primary"
            variant="contained"
            data-testid="confirm-btn-test"
          >
            {t('channelAssociatePSPPage.associationForm.confirmButton')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ChannelAssociatePSPPage;

const addCurrentPSP = (availablePSP: Array<Delegation>, selectedParty: Party) => {
  const value = {
    institutionName: selectedParty?.description ?? '',
    institutionId: selectedParty.partyId,
    taxCode: selectedParty.fiscalCode,
  };

  const index = availablePSP.findIndex(
    (object) => object.institution_id === selectedParty.partyId ?? ''
  );

  if (index === -1) {
    // eslint-disable-next-line functional/immutable-data
    availablePSP.push(value);
  }

  return availablePSP;
};
