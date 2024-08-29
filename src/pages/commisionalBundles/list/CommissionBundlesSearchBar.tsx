import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { add } from 'date-fns';
import { useFlagValue } from '../../../hooks/useFeatureFlags';
import TableSearchBar from '../../../components/Table/TableSearchBar';
import { useOrganizationType } from '../../../hooks/useOrganizationType';
import { useUserRole } from '../../../hooks/useUserRole';
import { emptyFiltersValues } from '../CommissionBundlesPage';
import { formatDateToYYYYMMDD } from '../../../utils/common-utils';

const paymentRangeOptions = [
  {
    value: undefined,
    name: 'noOrder',
  },
  {
    value: 'DESC',
    name: 'desc',
  },
  {
    value: 'ASC',
    name: 'asc',
  },
];

const paymentAmountOptions = [
  {
    name: 'all',
    paymentAmountMax: undefined,
    paymentAmountMin: undefined,
  },
  {
    name: 'section1',
    paymentAmountMax: 100,
    paymentAmountMin: undefined,
  },
  {
    name: 'section2',
    paymentAmountMax: 250,
    paymentAmountMin: 100,
  },
  {
    name: 'section3',
    paymentAmountMax: 500,
    paymentAmountMin: 250,
  },
  {
    name: 'section4',
    paymentAmountMax: undefined,
    paymentAmountMin: 500,
  },
];

const stateOptions = [
  {
    name: 'all',
    validityBefore: undefined,
    validityAfter: undefined,
    expireBefore: undefined,
    expireAfter: undefined,
  },
  {
    name: 'active',
    validityBefore: formatDateToYYYYMMDD(new Date()),
    validityAfter: undefined,
    expireBefore: undefined,
    expireAfter: formatDateToYYYYMMDD(new Date()),
  },
  {
    name: 'toBeActivated',
    validityBefore: undefined,
    validityAfter: formatDateToYYYYMMDD(new Date()),
    expireBefore: undefined,
    expireAfter: formatDateToYYYYMMDD(new Date()),
  },
  {
    name: 'expiring',
    validityBefore: formatDateToYYYYMMDD(new Date()),
    validityAfter: undefined,
    expireBefore: formatDateToYYYYMMDD(add(new Date(), { days: 7 })),
    expireAfter: undefined,
  },
  {
    name: 'deleting',
    validityBefore: formatDateToYYYYMMDD(new Date()),
    validityAfter: undefined,
    expireBefore: formatDateToYYYYMMDD(add(new Date(), { days: 1 })),
    expireAfter: undefined,
  },
];

const componentPath = 'commissionBundlesPage.list.search';
export default function CommissionBundlesSearchBar({
  tabValue,
  setFiltersValues,
  setTabValue,
}: Readonly<{
  tabValue: any;
  setFiltersValues: (value: any) => void;
  setTabValue: (value: any) => void;
}>) {
  const { t } = useTranslation();

  const { userIsAdmin } = useUserRole();
  const { orgInfo } = useOrganizationType();

  const isPrivateEnabled = useFlagValue('commission-bundles-private');
  const isPublicEnabled = useFlagValue('commission-bundles-public');

  const [paymentRangeFilter, setPaymentRangeFilter] = useState(paymentRangeOptions[0]);
  const [paymentAmountFilter, setPaymentAmountFilter] = useState(paymentAmountOptions[0]);
  const [stateFilter, setStateFilter] = useState(stateOptions[0]);
  const [bundleNameInput, setBundleNameInput] = useState<string>('');

  const resetFilter = () => {
    setPaymentRangeFilter(paymentRangeOptions[0]);
    setPaymentAmountFilter(paymentAmountOptions[0]);
    setStateFilter(stateOptions[0]);
    setFiltersValues(emptyFiltersValues);
  };

  return (
    <TableSearchBar
      componentName="commissionBundlesPage.list"
      setExternalSearchInput={setBundleNameInput}
      setActiveTab={(value) => {
        setTabValue(value);
      }}
      handleSearchTrigger={() =>
        setFiltersValues({
          name: bundleNameInput,
          paymentRange: paymentRangeFilter,
          paymentAmount: paymentAmountFilter,
          state: stateFilter,
        })
      }
      activeTab={tabValue}
      resetFilters={resetFilter}
      listTabFilter={[
        {
          label: t('commissionBundlesPage.privateBundles'),
          disabled: !isPrivateEnabled,
          'data-testid': 'private',
        },
        {
          label: t('commissionBundlesPage.publicBundles'),
          disabled: !isPublicEnabled,
          'data-testid': 'public',
        },
        {
          label: t('commissionBundlesPage.globalBundles'),
          'data-testid': 'global',
        },
      ]}
    >
      {orgInfo.types.isPsp && userIsAdmin ? (
        <>
          <FormControl sx={{ ml: 1, minWidth: '200px' }}>
            <InputLabel id="payment-range-filter-label">
              {t(`${componentPath}.paymentRangeFilter`)}
            </InputLabel>
            <Select
              id={'payment-range-filter'}
              name={'payment-range-filter'}
              labelId="payment-range-filter-label"
              label={t(`${componentPath}.paymentRangeFilter`)}
              size="small"
              value={paymentRangeFilter.name}
              onChange={(event) =>
                setPaymentRangeFilter(
                  paymentRangeOptions.find((el) => el.name === event.target.value)!
                )
              }
              data-testid="payment-range-filter"
              sx={{ height: '48px', backgroundColor: '#FFFFFF' }}
            >
              {paymentRangeOptions.map((el) => (
                <MenuItem value={el.name} key={el.name}>
                  {t(`${componentPath}.paymentRangeOptions.${el.name}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ ml: 1, minWidth: '200px' }}>
            <InputLabel id="payment-amount-filter-label">
              {t(`${componentPath}.paymentAmountFilter`)}
            </InputLabel>
            <Select
              id={'payment-amount-filter'}
              name={'payment-amount-filter'}
              labelId="payment-amount-filter-label"
              label={t(`${componentPath}.paymentAmountFilter`)}
              size="small"
              value={paymentAmountFilter.name}
              onChange={(event) =>
                setPaymentAmountFilter(
                  paymentAmountOptions.find((el) => el.name === event.target.value)!
                )
              }
              data-testid="payment-amount-filter"
              sx={{ height: '48px', backgroundColor: '#FFFFFF' }}
            >
              {paymentAmountOptions.map((el) => (
                <MenuItem value={el.name} key={el.name}>
                  {t(`${componentPath}.paymentAmountOptions.${el.name}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ ml: 1, minWidth: '200px' }}>
            <InputLabel id="state-filter-label"> {t(`${componentPath}.stateFilter`)}</InputLabel>
            <Select
              id={'state-filter'}
              name={'state-filter'}
              labelId="state-filter-label"
              label={t(`${componentPath}.stateFilter`)}
              size="small"
              value={stateFilter.name}
              onChange={(event) =>
                setStateFilter(stateOptions.find((el) => el.name === event.target.value)!)
              }
              data-testid="state-filter"
              sx={{ height: '48px', backgroundColor: '#FFFFFF' }}
            >
              {stateOptions.map((el) => (
                <MenuItem value={el.name} key={el.name}>
                  {t(`${componentPath}.stateOptions.${el.name}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      ) : (
        <></>
      )}
    </TableSearchBar>
  );
}
