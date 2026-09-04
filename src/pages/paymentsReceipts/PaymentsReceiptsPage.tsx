import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TitleBox} from '@pagopa/selfcare-common-frontend';
import {DesktopDatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import TableSearchBar from '../../components/Table/TableSearchBar';
import PaymentsReceiptsTable from './list/PaymentsReceiptsTable';

const todaysYear = new Date().getFullYear();

export default function PaymentsReceiptsPage() {
    const {t} = useTranslation();
    const [debtorOrIuvInput, setDebtorOrIuvInput] = useState<string>('');
    const [yearInput, setYearInput] = useState<number | null>(null);

    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [searchTrigger, setSearchTrigger] = useState<boolean>(false);

    function handleSetYear(value: Date | null) {
        if (value) {
            setSelectedYear(value.getFullYear());
        } else {
            setSelectedYear(null);
        }
    }

    const handleSearchTrigger = (filterDebtorOrIuv: string) => {
        setDebtorOrIuvInput(filterDebtorOrIuv);
        setYearInput(selectedYear);
        setSearchTrigger((prev) => !prev);
    };

    return (
        <SideMenuLayout>
            <TitleBox
                title={t('paymentsReceiptsPage.title')}
                mbSubTitle={3}
                variantTitle="h4"
                variantSubTitle="body1"
            />
            <TableSearchBar
                handleSearchTrigger={handleSearchTrigger}
                componentName="paymentsReceiptsPage"
            >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                        label={t('paymentsReceiptsPage.search.yearFilter')}
                        views={['year']}
                        onChange={(value) => handleSetYear(value)}
                        value={selectedYear ? new Date(selectedYear, 0, 1) : null}
                        minDate={new Date(2022, 0, 1)}
                        maxDate={new Date(todaysYear, 0, 1)}
                        slotProps={{
                            textField: {
                                inputProps: {
                                    placeholder: 'aaaa',
                                    'data-testid': 'select-year',
                                },
                                id: 'year',
                                name: 'year',
                                size: 'small',
                                sx: {
                                    backgroundColor: '#FFFFFF',
                                    ml: 1,
                                    '.MuiOutlinedInput-root': {
                                        height: '48px',
                                    },
                                    '.MuiInputLabel-root': {
                                        paddingTop: '2px',
                                    },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
            </TableSearchBar>
            <PaymentsReceiptsTable
                filterDebtorOrIuv={debtorOrIuvInput}
                filterYear={yearInput}
                searchTrigger={searchTrigger}
            />
        </SideMenuLayout>
    );
}
