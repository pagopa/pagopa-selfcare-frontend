import {Add, Search as SearchIcon} from '@mui/icons-material';
import {Button, InputAdornment, Link, TextField, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {Trans, useTranslation} from 'react-i18next';
import {generatePath, Link as RouterLink} from 'react-router-dom';
import ROUTES from '../../../routes';

const IbanTableEmpty = () => {
    const {t} = useTranslation();
    return (
        <>
            <Box width="100%" display="flex">
                <TextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="disabled"/>
                            </InputAdornment>
                        ),
                        sx: {height: 48, backgroundColor: '#FFFFFF'},
                    }}
                    fullWidth
                    placeholder={t('ibanPage.list.search')}
                />

                <Button
                    component={RouterLink}
                    to={generatePath(ROUTES.IBAN_ADD)}
                    variant="contained"
                    sx={{ml: 1, whiteSpace: 'nowrap', minWidth: 'auto'}}
                    startIcon={<Add/>}
                >
                    {t('ibanPage.addIban')}
                </Button>
            </Box>
            <Box p={3} mt={3} sx={{backgroundColor: '#EEEEEE'}}>
                <Box p={2} sx={{textAlign: 'center', backgroundColor: '#FFFFFF'}}>
                    <Typography variant="body2">
                        <Trans i18nKey="ibanPage.list.noResultsAddIban">
                            Non sono ancora presenti IBAN
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
                                <strong> Aggiungi IBAN</strong>
                            </Link>
                        </Trans>
                    </Typography>
                </Box>
            </Box>
        </>
    );
};
export default IbanTableEmpty;
