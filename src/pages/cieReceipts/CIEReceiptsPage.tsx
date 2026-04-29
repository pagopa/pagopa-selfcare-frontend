import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField, TextFieldProps } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { it } from 'date-fns/locale';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import TableSearchBar from '../../components/Table/TableSearchBar';
import CIEReceiptsTable from './list/CIEReceiptsTable';

const today = new Date();

const renderDatePickerInput = (params: TextFieldProps, dataTestId: string, error: string) => (
  <TextField
    {...params}
    inputProps={{
      ...params.inputProps,
      placeholder: 'gg/mm/aaaa',
      'data-testid': dataTestId,
    }}
    id="date"
    name="date"
    size="small"
    error={!!error}
    helperText={error}
    sx={{
      ml: 1,
      '.MuiOutlinedInput-root': {
        backgroundColor: '#FFFFFF',
        height: '48px',
      },
      '.MuiInputLabel-root': {
        paddingTop: '2px',
      },
      '.MuiFormHelperText-root': {
        position: 'absolute',
        marginTop: '48px',
        marginLeft: '5px',
      },
    }}
  />
);

export default function CIEReceiptsPage() {
  const { t } = useTranslation();
  const [debtorOrIuvInput, setDebtorOrIuvInput] = useState<string>('');
  const [fromDate, setFromDate] = useState<Date>(today);
  const [toDate, setToDate] = useState<Date>(today);
  const [dateError, setDateError] = useState<string>('');

  const [searchTrigger, setSearchTrigger] = useState<boolean>(false);

  const validateDates = (from: Date, to: Date) => {
    if (from > to) {
      setDateError(t('cieReceiptsPage.search.dateError'));
    } else {
      setDateError('');
    }
  };

  const handleFromDateChange = (value: Date | null) => {
    const newFrom = value ?? today;
    setFromDate(newFrom);
    validateDates(newFrom, toDate);
  };

  const handleToDateChange = (value: Date | null) => {
    const newTo = value ?? today;
    setToDate(newTo);
    validateDates(fromDate, newTo);
  };

  const handleSearchTrigger = (filterDebtorOrIuv: string) => {
    if (dateError === '') {
      setDebtorOrIuvInput(filterDebtorOrIuv);
      setSearchTrigger((prev) => !prev);
    }
  };

  return (
    <SideMenuLayout>
      <TitleBox
        title={t('cieReceiptsPage.title')}
        mbSubTitle={3}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      <TableSearchBar
        handleSearchTrigger={handleSearchTrigger}
        componentName="cieReceiptsPage"
        endButtonDisabled={dateError !== ''}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
          <DesktopDatePicker
            label={t('cieReceiptsPage.search.fromDate')}
            views={['year', 'month', 'day']}
            onChange={handleFromDateChange}
            value={fromDate ?? null}
            minDate={new Date('01/01/2022')}
            maxDate={new Date()}
            renderInput={(params) => renderDatePickerInput(params, 'select-from-date', dateError)}
          />
          <DesktopDatePicker
            label={t('cieReceiptsPage.search.toDate')}
            views={['year', 'month', 'day']}
            onChange={handleToDateChange}
            value={toDate ?? null}
            minDate={new Date('01/01/2022')}
            maxDate={new Date()}
            renderInput={(params) => renderDatePickerInput(params, 'select-to-date', '')}
          />
        </LocalizationProvider>
      </TableSearchBar>
      <CIEReceiptsTable
        filterDebtorOrIuv={debtorOrIuvInput}
        fromDate={fromDate}
        toDate={toDate}
        searchTrigger={searchTrigger}
      />
    </SideMenuLayout>
  );
}
