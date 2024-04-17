import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField, TextFieldProps } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import TableSearchBar from '../../components/Table/TableSearchBar';
import PaymentsReceiptsTable from './list/PaymentsReceiptsTable';

const todaysYear = new Date().getFullYear();

export default function PaymentsReceiptsPage() {
  const { t } = useTranslation();
  const [debtorOrIuvInput, setDebtorOrIuvInput] = useState<string>('');
  const [yearInput, setYearInput] = useState<number | null>(null);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchTrigger, setSearchTrigger] = useState<boolean>(false);

  function handleSetYear(value: string | null) {
    if (value) {
      setSelectedYear(new Date(value).getFullYear());
    } else {
      setSelectedYear(null);
    }
  }

  const handleSearchTrigger = () => {
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
        setSearchInput={setDebtorOrIuvInput}
        componentName="paymentsReceiptsPage"
        handleExtraTrigger={handleSearchTrigger}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label={t('paymentsReceiptsPage.search.yearFilter')}
            views={['year']}
            onChange={(value) => handleSetYear(value)}
            value={selectedYear ? `01/01/${selectedYear}` : null}
            minDate="01/01/2022"
            maxDate={`01/01/${todaysYear}`}
            renderInput={(params: TextFieldProps) => (
              <TextField
                {...params}
                inputProps={{
                  ...params.inputProps,
                  placeholder: 'aaaa',
                  'data-testid': 'select-year',
                }}
                id="year"
                name="year"
                type="date"
                size="small"
                sx={{
                  ml: 1,
                  '.MuiOutlinedInput-root': {
                    height: '48px',
                  },
                  '.MuiInputLabel-root': {
                    paddingTop: '2px',
                  },
                }}
              />
            )}
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
