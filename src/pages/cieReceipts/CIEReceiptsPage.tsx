import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField, TextFieldProps } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import TableSearchBar from '../../components/Table/TableSearchBar';
import CIEReceiptsTable from './list/CIEReceiptsTable';

const today = new Date().getTime();

const renderDatePickerInput = (params: TextFieldProps, dataTestId: string) => (
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
    sx={{
      backgroundColor: '#FFFFFF',
      ml: 1,
      '.MuiOutlinedInput-root': {
        height: '48px',
      },
      '.MuiInputLabel-root': {
        paddingTop: '2px',
      },
    }}
  />
);

export default function CIEReceiptsPage() {
  const { t } = useTranslation();
  const [debtorOrIuvInput, setDebtorOrIuvInput] = useState<string>('');
  const [fromDate, setFromDate] = useState<number | null>(today);
  const [toDate, setToDate] = useState<number | null>(today);

  const [searchTrigger, setSearchTrigger] = useState<boolean>(false);

  const handleSearchTrigger = (filterDebtorOrIuv: string) => {
    setDebtorOrIuvInput(filterDebtorOrIuv);
    setSearchTrigger((prev) => !prev);
  };

  return (
    <SideMenuLayout>
      <TitleBox
        title={t('cieReceiptsPage.title')}
        mbSubTitle={3}
        variantTitle="h4"
        variantSubTitle="body1"
      />
      <TableSearchBar handleSearchTrigger={handleSearchTrigger} componentName="cieReceiptsPage">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label={t('cieReceiptsPage.search.fromDate')}
            views={['year', 'month', 'day']}
            onChange={(value) => setFromDate(value ? value.getTime() : null)}
            value={fromDate ?? null}
            minDate={new Date("01/01/2022")}
            maxDate={new Date()}
            renderInput={(params) => renderDatePickerInput(params, 'select-from-date')}
          />
          <DesktopDatePicker
            label={t('cieReceiptsPage.search.toDate')}
            views={['year', 'month', 'day']}
            onChange={(value) => setToDate(value ? value.getTime() : null)}
            value={toDate ?? null}
            minDate={new Date("01/01/2022")}
            maxDate={new Date()}
            renderInput={(params) => renderDatePickerInput(params, 'select-to-date')}
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
