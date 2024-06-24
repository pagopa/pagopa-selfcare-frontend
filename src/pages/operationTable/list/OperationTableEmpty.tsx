<<<<<<< HEAD
import {Add, Search as SearchIcon} from '@mui/icons-material';
import {InputAdornment, TextField, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {useTranslation, Trans} from 'react-i18next';
=======
import {Search as SearchIcon} from '@mui/icons-material';
import {InputAdornment, TextField, Typography} from '@mui/material';
import {Box} from '@mui/system';
import {Trans, useTranslation} from 'react-i18next';
>>>>>>> 3f32cfc3 (Formatting (#542))

const OperationTableEmpty = () => {
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
                    placeholder={t('operationTableListPage.list.search')}
                />
            </Box>
            <Box p={3} mt={3} sx={{backgroundColor: '#EEEEEE'}}>
                <Box p={2} sx={{textAlign: 'center', backgroundColor: '#FFFFFF'}}>
                    <Typography variant="body2">
                        <Trans i18nKey="operationTableListPage.list.noResults">
                            Non sono ancora presenti Tavoli Operativi
                        </Trans>
                    </Typography>
                </Box>
            </Box>
        </>
    );
};
export default OperationTableEmpty;
