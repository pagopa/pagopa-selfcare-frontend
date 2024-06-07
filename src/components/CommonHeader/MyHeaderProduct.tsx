import {ArrowDropDownRounded} from '@mui/icons-material';
import {
    Autocomplete,
    Avatar,
    Box,
    Chip,
    Container,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {ProductEntity, ProductSwitch, ProductSwitchItem} from '@pagopa/mui-italia';
import {trackEvent} from '@pagopa/selfcare-common-frontend/services/analyticsService';
import {ReactNode, useEffect, useMemo, useState} from 'react';
import {InstitutionDetail} from '../../api/generated/portal/InstitutionDetail';
import {InstitutionDetailResource} from '../../api/generated/portal/InstitutionDetailResource';
import {useSigninData} from '../../hooks/useSigninData';
import {Party} from '../../model/Party';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {partiesActions, partiesSelectors} from '../../redux/slices/partiesSlice';
import {getInstitutions} from '../../services/institutionService';
import {PaddedDrawer} from '../PaddedDrawer';

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
  const [iconSelected, setIconSelected] = useState<ReactNode | null | undefined>(null);
  const [organizations, setOrganizations] = useState<Array<InstitutionDetail>>();
  const [organization, setOrganization] = useState<InstitutionDetail>();
  const [autocompleteValue, setAutocompleteValue] = useState<string>();
  const [drawerIsOpened, setDrawerIsOpened] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const updateSigninData = useSigninData();
  const signinData = useAppSelector(partiesSelectors.selectSigninData);

  useEffect(() => {
    getOptions();
  }, [organizations]);

  const updateState = (orgDetails: InstitutionDetail) => {
    trackEvent('PARTY_SELECTION', {
      party_id: orgDetails!.id,
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
      registeredOffice: orgDetails.address!,
      institutionType: orgDetails.institution_type,
      status: 'ACTIVE',
      roles: [
        {
          partyRole: 'OPERATOR',
          roleKey: 'admin',
        },
      ],
    };
    if (orgDetails.psp_data) {
      // eslint-disable-next-line functional/immutable-data
      party.pspData = orgDetails?.psp_data;
    }
    setParty(party);
    void updateSigninData(party);
  };

  const searchCreditorInstitutions = (taxCode: string) => {
    getInstitutions(taxCode)
      .then((value: InstitutionDetailResource) => {
        if (value?.institution_detail_list && value.institution_detail_list.length > 0) {
          // @ts-ignore
          setOrganizations(value.institution_detail_list);
        }
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

  function getOptions(): Array<string> {
    if (organizations) {
      return organizations.map((elem) => `${elem.tax_code} - ${elem.name}`);
    } else {
      return [];
    }
  }

  return (
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
            {!!iconSelected && <IconButton>{iconSelected}</IconButton>}
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
                    signinData?.creditorInstitutionDetailsResource?.creditorInstitutionCode ??
                    signinData?.paymentServiceProviderDetailsResource?.tax_code ??
                    signinData?.brokerPspDetailsResource?.broker_psp_code ??
                    'No Data'}
                </Typography>
                <Typography color={'disabled'}>{'Operatore PagoPA'}</Typography>
              </Stack>
              <ArrowDropDownRounded></ArrowDropDownRounded>
            </Stack>
          </Container>
          <PaddedDrawer openDrawer={drawerIsOpened} setOpenDrawer={setDrawerIsOpened}>
            <Box minWidth="20rem">
              <Autocomplete
                disablePortal={true}
                id="org-search"
                options={getOptions()}
                onChange={(_event, value) => {
                  if (value && value.length > 0 && organizations) {
                    const index = organizations.findIndex((elem) =>
                      elem.name  === (value.split('- ')[1])
                    );
                    const organization: InstitutionDetail = organizations.at(index)!;
                    updateState(organization);
                    setAutocompleteValue(organization.tax_code);
                    setOrganization(organization);
                  }
                }}
                onInputChange={(_event, value) => {
                  if (value && value.length > 0) {
                    searchCreditorInstitutions(value);
                  }
                }}
                value={autocompleteValue ?? ''}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Scegli il CF dell'organizzazione"}
                    sx={{ fontWeight: 'medium' }}
                  />
                )}
                PaperComponent={({ children }) => (
                  <Paper sx={{ overflowY: 'auto', mb: 1 }}>{children}</Paper>
                )}
                noOptionsText={'nessuna organizzazione trovata'}
                data-testid="org-search"
              />
            </Box>
          </PaddedDrawer>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeaderProduct;
