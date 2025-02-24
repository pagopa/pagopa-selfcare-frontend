import { ArrowDropDownRounded } from '@mui/icons-material';
import { Avatar, Box, Chip, Container, Stack, TextField, Typography } from '@mui/material';
import { ProductEntity, ProductSwitch, ProductSwitchItem } from '@pagopa/mui-italia';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { useEffect, useMemo, useState } from 'react';
import { InstitutionDetail } from '../../api/generated/portal/InstitutionDetail';
import { useSigninData } from '../../hooks/useSigninData';
import { Party } from '../../model/Party';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../redux/slices/partiesSlice';
import { getInstitutionFullDetail, getInstitutions } from '../../services/institutionService';
import { PaddedDrawer } from '../PaddedDrawer';
import { InstitutionBaseResources } from '../../api/generated/portal/InstitutionBaseResources';
import { InstitutionBase } from '../../api/generated/portal/InstitutionBase';

type HeaderProductProps = {
  borderBottom?: number;
  borderColor?: string;
  chipColor?: any;
  chipLabel?: string;
  chipSize?: 'small' | 'medium';
  productId?: string;
  productsList: Array<ProductEntity>;
  onSelectedProduct?: (product: ProductSwitchItem) => void;
};

/** SelfCare Header component */
const HeaderProduct = ({
  borderBottom,
  borderColor,
  chipColor = 'primary',
  chipLabel,
  chipSize = 'small',
  productId,
  productsList,
  onSelectedProduct = () => {},
}: HeaderProductProps) => {
  const selectedProduct = useMemo(
    () => (productId ? productsList.find((p) => p.id === productId) : productsList[0]),
    [productId, productsList]
  ) as ProductSwitchItem;
  const [organizations, setOrganizations] = useState<Array<InstitutionBase>>();
  const [autocompleteValue, setAutocompleteValue] = useState<string>();
  const [drawerIsOpened, setDrawerIsOpened] = useState<boolean>(false);
  const [selectedParty, setSelectedParty] = useState<string>();

  const dispatch = useAppDispatch();
  const updateSigninData = useSigninData();
  const signinData = useAppSelector(partiesSelectors.selectSigninData);

  const updateState = (institution: InstitutionBase) => {
    getInstitutionFullDetail(institution.id)
      .then((orgDetails: InstitutionDetail) => {
        trackEvent('PARTY_SELECTION', {
          party_id: orgDetails.id,
        });
        const setParty = (party?: Party) => dispatch(partiesActions.setPartySelected(party));
        const party: Party = {
          description: orgDetails.name,
          digitalAddress: orgDetails.mail_address!,
          externalId: orgDetails.external_id,
          fiscalCode: orgDetails.tax_code,
          origin: orgDetails.origin,
          originId: orgDetails.origin_id,
          partyId: orgDetails.id,
          registeredOffice: orgDetails.address,
          institutionType: orgDetails.institution_type,
          onboarding: orgDetails.onboarding?.map(el => el),
          status: 'ACTIVE',
          roles: [
            {
              partyRole: 'OPERATOR',
              roleKey: 'admin',
              roleLabel: '',
            },
          ],
        };
        if (orgDetails.psp_data) {
          // eslint-disable-next-line functional/immutable-data
          party.pspData = orgDetails?.psp_data;
        }
        setParty(party);
        setSelectedParty(party.partyId);
        void updateSigninData(party);
        setDrawerIsOpened(false);
      })
      .catch((error) => {});
  };

  const ChipComponent = (
    <Chip
      sx={{
        py: 0,
        '& .MuiChip-labelSmall': {
          py: '2px',
        },
      }}
      color={chipColor}
      label={chipLabel}
      size={chipSize}
    ></Chip>
  );

  const onSelectedProductChangeIcon = (e: ProductEntity) => {
    // setIconSelected(e.icon);
    onSelectedProduct(e);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (autocompleteValue !== undefined && autocompleteValue !== '') {
        getInstitutions(autocompleteValue)
          .then((value: InstitutionBaseResources) => {
            if (value?.institution_base_list && value.institution_base_list.length > 0) {
              setOrganizations([...value.institution_base_list]);
            } else {
              setOrganizations([]);
            }
          })
          .catch((error) => setOrganizations([]));
      } else {
        setOrganizations([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [autocompleteValue]);

  return (
    <>
      <Box
        component="div"
        display="flex"
        alignItems="center"
        sx={{
          backgroundColor: 'background.paper',
          borderBottom: borderBottom ?? 1,
          borderColor: borderColor ?? 'divider',
          boxSizing: 'border-box',
          minHeight: { xs: 'auto', md: '80px' },
        }}
      >
        <Container maxWidth={false}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            spacing={2}
            sx={{ py: 2 }}
          >
            {/* Left side of the component */}
            <Stack alignItems="center" direction="row">
              {productsList.length > 1 && (
                <Stack spacing={2} direction="row" alignItems="center">
                  {/* Switcher Product */}
                  <ProductSwitch
                    currentProductId={selectedProduct.id}
                    products={productsList}
                    onExit={onSelectedProductChangeIcon}
                  ></ProductSwitch>
                  {chipLabel && chipLabel !== '' && ChipComponent}
                </Stack>
              )}
              {selectedProduct && productsList.length === 1 && (
                <Stack spacing={2} direction="row" alignItems="center">
                  <Typography sx={{ fontSize: { xs: 20, sm: 28 }, fontWeight: 'bold' }}>
                    {selectedProduct?.title}
                  </Typography>
                  {chipLabel && chipLabel !== '' && ChipComponent}
                </Stack>
              )}
            </Stack>

            <Container onClick={() => setDrawerIsOpened(true)} sx={{ cursor: 'pointer' }}>
              <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
                <Avatar></Avatar>
                <Stack direction="column" flexWrap={'wrap'} justifyContent={'flex-start'}>
                  <Typography fontWeight={'bolder'}>
                    {signinData?.brokerDetailsResource?.broker_code ??
                      signinData?.creditorInstitutionDetailsResource?.ciTaxCode ??
                      signinData?.paymentServiceProviderDetailsResource?.tax_code ??
                      signinData?.brokerPspDetailsResource?.broker_psp_code ??
                      'No Data'}
                  </Typography>
                  <Typography color={'disabled'}>{'Operatore PagoPA'}</Typography>
                </Stack>
                <ArrowDropDownRounded></ArrowDropDownRounded>
              </Stack>
            </Container>
          </Stack>
        </Container>
      </Box>
      <PaddedDrawer openDrawer={drawerIsOpened} setOpenDrawer={setDrawerIsOpened} paddingX={0}>
        <Box px={2}>
          <TextField
            fullWidth
            id="org-search"
            name="org-search"
            label={"Scegli il CF dell'organizzazione"}
            placeholder={"Scegli il CF dell'organizzazione"}
            size="small"
            sx={{ mb: 1 }}
            value={autocompleteValue ?? ''}
            onChange={(event: any) => {
              setAutocompleteValue(event.target.value);
            }}
            inputProps={{
              'data-testid': 'org-search',
            }}
          />
        </Box>

        {organizations === undefined || organizations.length <= 0 ? (
          <Typography variant="body1" p={2}>
            Nessuna organizzazione trovata
          </Typography>
        ) : (
          organizations?.map((el) => (
            <Box
              key={el.id}
              sx={{
                width: '100%',
                cursor: 'pointer',
                fontWeight: 'medium',
                color: selectedParty === el?.id ? 'rgb(0, 115, 230)' : undefined,
                background: selectedParty === el?.id ? 'rgba(0, 115, 230, 0.08)' : undefined,
                '&:hover': {
                  background: selectedParty === el?.id ? 'rgb(9 92 174 / 12%)' : 'rgb(225 225 225)',
                },
                'box-shadow':
                  selectedParty === el?.id ? 'rgb(0, 115, 230) 2px 0px 0px 0px inset' : undefined,
              }}
              onClick={() => updateState(el)}
              padding={2}
            >
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    mr: 2,
                    padding: 1,
                    borderRadius: '50%',
                    border: '1px solid rgb(227, 231, 235)',
                    height: '50px',
                    width: '50px',
                    background: "white",
                    color: "rgb(162, 173, 184)"
                  }}
                  display="flex"
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <AccountBalanceIcon />
                </Box>
                {el.name}
              </Box>
            </Box>
          ))
        )}
      </PaddedDrawer>
    </>
  );
};

export default HeaderProduct;
