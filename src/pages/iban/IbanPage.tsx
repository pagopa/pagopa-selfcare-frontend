<<<<<<< HEAD
import {Alert, Box, Grid} from '@mui/material';
=======
import {Alert} from '@mui/material';
>>>>>>> 3f32cfc3 (Formatting (#542))
import {TitleBox, useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {handleErrors} from '@pagopa/selfcare-common-frontend/services/errorService';
import {add} from 'date-fns';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import {useAppSelector} from '../../redux/hooks';
import {partiesSelectors} from '../../redux/slices/partiesSlice';
import {Ibans} from '../../api/generated/portal/Ibans';
import {LOADING_TASK_IBAN_TABLE} from '../../utils/constants';
import {IbanOnCreation} from '../../model/Iban';
import {getIbanList} from '../../services/ibanService';
import StandInAndCupForm from './StandInAndCupForm/StandInAndCupForm';

const emptyIbanList: Ibans = {
    ibans_enhanced: [],
};

export const emptyIban: IbanOnCreation = {
    iban: '',
    description: '',
    validity_date: add(new Date(), {days: 1}),
    due_date: add(new Date(), {years: 1}),
    creditor_institution_code: '',
    is_active: true,
    labels: [],
};

const IbanPage = () => {
    const {t} = useTranslation();
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
        <SideMenuLayout>
            <TitleBox
                title={t('ibanPage.title')}
                subTitle={t('ibanPage.subtitle')}
                mbSubTitle={3}
                variantTitle="h4"
                variantSubTitle="body1"
            />
            {history.location.state && (history.location.state as any).alertSuccessMessage && (
                <Alert severity="success" variant="outlined" sx={{mb: 4}}>
                    {(history.location.state as any).alertSuccessMessage}
                </Alert>
            )}

            <StandInAndCupForm ibanList={ibanList} error={error} loading={loading}/>
        </SideMenuLayout>
    );
};

export default IbanPage;
