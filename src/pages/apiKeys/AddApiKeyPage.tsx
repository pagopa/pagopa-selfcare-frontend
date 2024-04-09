import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import {theme} from '@pagopa/mui-italia';
import {Trans, useTranslation} from 'react-i18next';
import {useFormik} from 'formik';
import {useHistory} from 'react-router-dom';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import ROUTES from '../../routes';
import {LOADING_TASK_API_KEY_GENERATION} from '../../utils/constants';
import {
    API_KEY_PRODUCTS,
    API_KEY_PSP_PRODUCTS,
    AvailableProductKeys,
    ConfiguredProductKeys,
    NODOAUTH,
    ProductKeys,
} from '../../model/ApiKey';
import {useAppSelector} from '../../redux/hooks';
import {partiesSelectors} from '../../redux/slices/partiesSlice';
import {createInstitutionApiKeys, getInstitutionApiKeys} from '../../services/apiKeyService';

function AddApiKeyPage() {
    const {t} = useTranslation();
    const [selectedProduct, setSelectedProduct] = useState<string>();
    const [availableProduct, setAvailableProduct] = useState<Array<AvailableProductKeys>>([]);
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const setLoading = useLoading(LOADING_TASK_API_KEY_GENERATION);
    const addError = useErrorDispatcher();
    const products: Array<ConfiguredProductKeys> =
        selectedParty?.institutionType === 'PSP' ? API_KEY_PSP_PRODUCTS() : API_KEY_PRODUCTS();

    const formik = useFormik({
        initialValues: {
            product: '',
        },
        onSubmit: (_values) => {
        },
    });

    const history = useHistory();

    const goBack = () => {
        history.push(ROUTES.APIKEYS);
    };

    const handleSubmit = () => {
        if (selectedProduct && selectedParty) {
            setLoading(true);
            createInstitutionApiKeys(selectedParty.partyId, selectedProduct)
                .then((_data) => {
                    history.push(ROUTES.APIKEYS, {
                        alertSuccessMessage: t('addApiKeyPage.addForm.successMessage'),
                    });
                })
                .catch((reason) =>
                    addError({
                        id: 'ADD_APIKEY',
                        blocking: false,
                        error: reason,
                        techDescription: `An error occurred while adding api keys`,
                        toNotify: true,
                        displayableTitle: t('general.errorTitle'),
                        displayableDescription: t('addApiKeyPage.addForm.errorMessageDesc'),
                        component: 'Toast',
                    })
                )
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        if (selectedParty) {
            setLoading(true);
            void getInstitutionApiKeys(selectedParty.partyId)
                .then((data) => {
                    if (data) {
                        buildAvailableProduct(data, products, setAvailableProduct);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [selectedParty]);

    return (
        <Box
            justifyContent="center"
            alignItems="center"
            display="flex"
            flexDirection="column"
            px={3}
            mt={3}
            sx={{width: '100%', backgroundColor: 'transparent !important'}}
        >
            <Box justifyContent="center">
                <Grid item xs={12} mb={1} display="flex" justifyContent="center">
                    <Typography variant="h3">
                        <Trans i18nKey="addApiKeyPage.addForm.title">Generazione API Key</Trans>
                    </Typography>
                </Grid>
                <Grid item xs={12} mb={4} display="flex" justifyContent="center">
                    <Typography variant="body1" align="center">
                        <Trans i18nKey="addApiKeyPage.addForm.subTitle">
                            Inserisci le informazioni per generare la coppia di chiavi
                        </Trans>
                    </Typography>
                </Grid>
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                flexGrow={0}
                mb={1}
                sx={{width: '100%', maxWidth: '684px'}}
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
                            <FormControl sx={{width: '100%', minWidth: '100%'}}>
                                <InputLabel
                                    id="select-label-products"
                                    sx={{
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            fontWeight: 'fontWeightMedium',
                                            fontSize: 'fontSize',
                                            whiteSpace: 'nowrap',
                                        },
                                    }}
                                >
                                    {t('addApiKeyPage.addForm.product.title')}
                                </InputLabel>
                                <Select
                                    fullWidth
                                    aria-label="user"
                                    name="products"
                                    value={selectedProduct ? t(`addApiKeyPage.products.${selectedProduct}`) : ''}
                                    labelId="select-label-products"
                                    variant="outlined"
                                    renderValue={(selectedProduct) => (
                                        <Typography sx={{fontSize: 'fontSize', fontWeight: 'fontWeightMedium'}}>
                                            {selectedProduct}
                                        </Typography>
                                    )}
                                    input={<OutlinedInput label={t('addApiKeyPage.addForm.product.title')}/>}
                                >
                                    {availableProduct.map((p) => (
                                        <MenuItem
                                            key={p.id}
                                            value={t(`addApiKeyPage.products.${p.id}`)}
                                            data-testid={`product: ${p.id}`}
                                            sx={{
                                                fontSize: 'fontSize',
                                                fontWeight: 'fontWeightMedium',
                                                color: 'text.primary',
                                            }}
                                            disabled={p.disabled}
                                            onClick={() => setSelectedProduct(p.id)}
                                        >
                                            {p.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </form>
                    </Grid>
                </Paper>
            </Box>
            <Stack direction="row" justifyContent="space-between" mt={5}>
                <Stack display="flex" justifyContent="flex-start" mr={2}>
                    <Button color="primary" variant="outlined" onClick={goBack}>
                        {t('addApiKeyPage.addForm.backButton')}
                    </Button>
                </Stack>
                <Stack display="flex" justifyContent="flex-end">
                    <Button
                        onClick={handleSubmit}
                        // disabled={!formik.dirty || !formik.isValid}
                        disabled={!selectedProduct}
                        color="primary"
                        variant="contained"
                    >
                        {t('addApiKeyPage.addForm.continueButton')}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}

const buildAvailableProduct = (
    data: Array<ProductKeys>,
    products: Array<ConfiguredProductKeys>,
    setAvailableProduct: any
) => {
    if (data.some((el) => el.displayName.includes(NODOAUTH))) {
        // if nodeAuth was created, elements that are present in both lists will be disabled
        setAvailableProduct(
            products.map((p) =>
                data.some((el) => el.displayName.includes(p.key))
                    ? {
                        id: p.id,
                        title: p.key,
                        disabled: true,
                    }
                    : {
                        id: p.id,
                        title: p.key,
                        disabled: false,
                    }
            )
        );
    } else {
        // if no apikeys was created, nodeAuth is the only items enabled
        setAvailableProduct(
            products.map((p) =>
                p.key.includes(NODOAUTH)
                    ? {
                        id: p.id,
                        title: p.key,
                        disabled: false,
                    }
                    : {
                        id: p.id,
                        title: p.key,
                        disabled: true,
                    }
            )
        );
    }
};

export default AddApiKeyPage;
