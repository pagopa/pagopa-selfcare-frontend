import {ProductEntity, ProductSwitch, ProductSwitchItem,} from '@pagopa/mui-italia';
import {Autocomplete, Box, Chip, Container, IconButton, Paper, Stack, TextField, Typography,} from '@mui/material';
import React, {ReactNode, useEffect, useMemo, useState} from "react";
import {trackEvent} from "@pagopa/selfcare-common-frontend/services/analyticsService";
import {getInstitutions} from "../../services/institutionService";
import {InstitutionDetail} from "../../api/generated/portal/InstitutionDetail";
import {Party} from "../../model/Party";
import {partiesActions} from "../../redux/slices/partiesSlice";
import {useAppDispatch} from "../../redux/hooks";
import {useSigninData} from "../../hooks/useSigninData";

type HeaderProductProps = {
    borderBottom?: number;
    borderColor?: string;
    chipColor?: any;
    chipLabel?: string;
    chipSize?: "small" | "medium";
    productId?: string;
    productsList: Array<ProductEntity>;
    onSelectedProduct?: (product: ProductSwitchItem) => void;
};


/** SelfCare Header component */
const HeaderProduct = ({
                           borderBottom,
                           borderColor,
                           chipColor = "primary",
                           chipLabel,
                           chipSize = "small",
                           productId,
                           productsList,
                           onSelectedProduct = () => {
                           },
                       }: HeaderProductProps) => {
    const selectedProduct = useMemo(
        () =>
            productId
                ? productsList.find((p) => p.id === productId)
                : productsList[0],
        [productId, productsList]
    ) as ProductSwitchItem;
    const [iconSelected, setIconSelected] = useState<ReactNode | null | undefined>(null);
    const [organization, setOrganization] = useState<InstitutionDetail>();
    const [autocompleteValue, setAutocompleteValue] = useState<string>();

    const dispatch = useAppDispatch();
    const updateSigninData = useSigninData();


    useEffect(() => {
        getOptions();
    }, [organization]);

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
            roles: [{
                partyRole: 'OPERATOR',
                roleKey: 'admin'
            }]
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
            .then((value: Array<InstitutionDetail>) => {
                if (value && value.length > 0) {
                    // @ts-ignore
                    const organization: InstitutionDetail = value.at(0);
                    setOrganization(organization);
                }
            })
            .catch(error => {
            });
    };


    const ChipComponent = (
        <Chip
            sx={{
                py: 0,
                "& .MuiChip-labelSmall": {
                    py: "2px",
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
        if (organization) {
            return [organization.tax_code];
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
                backgroundColor: "background.paper",
                borderBottom: borderBottom ?? 1,
                borderColor: borderColor ?? "divider",
                boxSizing: "border-box",
                minHeight: {xs: "auto", md: "80px"},
            }}
        >
            <Container maxWidth={false}>
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{py: 2}}
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
                                {chipLabel && chipLabel !== "" && ChipComponent}
                            </Stack>
                        )}
                        {selectedProduct && productsList.length === 1 && (
                            <Stack spacing={2} direction="row" alignItems="center">
                                <Typography
                                    sx={{fontSize: {xs: 20, sm: 28}, fontWeight: "bold"}}
                                >
                                    {selectedProduct?.title}
                                </Typography>
                                {chipLabel && chipLabel !== "" && ChipComponent}
                            </Stack>
                        )}
                    </Stack>
                    <Box minWidth="20rem">
                        <Autocomplete
                            disablePortal={true}
                            id="org-search"
                            options={getOptions()}
                            onChange={(_event, value) => {
                                console.log('onChange');
                                if (value && value.length > 0 && organization) {
                                    updateState(organization);
                                    setAutocompleteValue(organization.tax_code);
                                }
                            }}
                            onInput={_event => {
                                // searchCreditorInstitutions(_event.target.value ?? '');
                            }}
                            onInputChange={(_event, value) => {
                                console.log('onInputChange');
                                if (value && value.length > 0) {
                                    searchCreditorInstitutions(value);
                                }
                            }}
                            onSubmit={(_event) => {
                            }}
                            value={autocompleteValue ?? ""}
                            fullWidth
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={"Scegli il CF dell'organizzazione"}
                                    sx={{fontWeight: 'medium'}}
                                />
                            )}
                            PaperComponent={({children}) => (
                                <Paper sx={{overflowY: 'auto', mb: 1}}>{children}</Paper>
                            )}
                            noOptionsText={'nessuna organizzazione trovata'}
                            data-testid="org-search"
                        />
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default HeaderProduct;

