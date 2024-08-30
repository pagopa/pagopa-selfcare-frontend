import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { Box, Stack } from '@mui/system';
import { TitleBox, useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import ROUTES from '../../routes';
import { formatDateToYYYYMMDD } from '../../utils/common-utils';
import GenericModal from '../../components/Form/GenericModal';
import { bundleDetailsSelectors } from '../../redux/slices/bundleDetailsSlice';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import { exportPSPBundleList } from '../../services/bundleService';
import { useAppSelector } from '../../redux/hooks';
import { BundleResource } from '../../model/CommissionBundle';
import { TypeEnum } from '../../api/generated/portal/PSPBundleResource';
import SideMenuLayout from '../../components/SideMenu/SideMenuLayout';
import { useUserRole } from '../../hooks/useUserRole';
import { useOrganizationType } from '../../hooks/useOrganizationType';
import CommissionBundlesTable from './list/CommissionBundlesTable';
import CommissionBundlesSearchBar from './list/CommissionBundlesSearchBar';

type Props = {
  children?: React.ReactNode;
  index: number;
  valueTab: number;
};

const CustomTabPanel = (props: Props) => {
  const { children, index, valueTab, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={valueTab !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {valueTab === index && (
        <Box sx={{ px: 3, width: '100%' }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

function getTabValue(bundle: BundleResource | Record<any, any>) {
  if (bundle?.type === TypeEnum.PRIVATE) {
    return 0;
  } else if (bundle?.type === TypeEnum.PUBLIC) {
    return 1;
  }

  return 2;
}

export const emptyFiltersValues = {
  name: '',
  paymentRange: {
    value: undefined,
    name: 'noOrder',
  },
  paymentAmount: {
    name: 'all',
    paymentAmountMax: undefined,
    paymentAmountMin: undefined,
  },
  state: {
    name: 'all',
    validityBefore: undefined,
    validityAfter: undefined,
    expireBefore: undefined,
    expireAfter: undefined,
  },
};

const getCsvFileName = (pspName: string, bundleType: Array<TypeEnum>): string => {
  // eslint-disable-next-line functional/no-let
  let type = '';
  if (bundleType.length === 3) {
    type = 'tutti';
  } else {
    if (bundleType[0] === TypeEnum.GLOBAL) {
      type = 'per-tutti';
    } else if (bundleType[0] === TypeEnum.PUBLIC) {
      type = 'su-richiesta';
    } else if (bundleType[0] === TypeEnum.PRIVATE) {
      type = 'su-invito';
    }
  }
  return `${pspName}_${formatDateToYYYYMMDD(new Date())}_${type}_bundle-export.csv`;
};

const optionsExportBundleTypes = [
  {
    name: 'all',
    types: [TypeEnum.GLOBAL, TypeEnum.PRIVATE, TypeEnum.PUBLIC],
  },
  {
    name: 'private',
    types: [TypeEnum.PRIVATE],
  },
  {
    name: 'public',
    types: [TypeEnum.PUBLIC],
  },
  {
    name: 'global',
    types: [TypeEnum.GLOBAL],
  },
];

const CommissionBundlesPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const addError = useErrorDispatcher();

  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const { userIsAdmin } = useUserRole();
  const { orgInfo } = useOrganizationType();

  const commissionBundleDetail: BundleResource | Record<any, any> = useAppSelector(
    bundleDetailsSelectors.selectBundleDetails
  );
  const [tabValue, setTabValue] = useState(getTabValue(commissionBundleDetail));
  const [filtersValues, setFiltersValues] = useState(emptyFiltersValues);

  const [loadingExport, setLoadingExport] = useState<boolean>(false);
  const [modalExport, setModalExport] = useState<boolean>(false);
  const [exportBundleTypes, setExportBundleTypes] = useState(optionsExportBundleTypes[0]);

  useEffect(() => {
    window.addEventListener('beforeunload', clearLocationState);
    return () => {
      window.removeEventListener('beforeunload', clearLocationState);
    };
  }, []);

  const clearLocationState = () => {
    window.history.replaceState({}, document.title);
  };

  const exportBundleList = () => {
    setLoadingExport(true);
    exportPSPBundleList({
      pspTaxCode: selectedParty?.fiscalCode ?? '',
      bundleType: exportBundleTypes.types,
    })
      .then((csv: Buffer) => {
        console.log(selectedParty);
        const filename = getCsvFileName(
          selectedParty?.description?.replace(' ', '-') ?? '',
          exportBundleTypes.types
        );
        const download = document.createElement('a');
        const blob = new Blob([csv], { type: 'text/plain' });
        download.setAttribute('href', window.URL.createObjectURL(blob));
        download.setAttribute('download', filename);
        // eslint-disable-next-line functional/immutable-data
        download.dataset.downloadurl = ['text/plain', download.download, download.href].join(':');
        download.click();
      })
      .catch((reason) => {
        addError({
          component: 'Toast',
          id: 'EXPORT_BUNDLE_LIST',
          displayableTitle: t('general.errorTitle'),
          techDescription: 'An error occured exporting the bundle lists',
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: t('commissionBundlesPage.exportError'),
        });
      })
      .finally(() => setLoadingExport(false));
  };

  return (
    <SideMenuLayout>
      <Stack justifyContent="space-between" direction="row">
        <TitleBox
          title={t('commissionBundlesPage.title')}
          subTitle={t('commissionBundlesPage.subtitle')}
          mbSubTitle={3}
          variantTitle="h4"
          variantSubTitle="body1"
        />
        {orgInfo.types.isPsp && userIsAdmin && (
          <>
            <Button
              variant="outlined"
              sx={{ mr: 1, minWidth: '150px', fontWeight: 'bold', padding: 0 }}
              data-testid={'download-bundle-button'}
              onClick={() => setModalExport(true)}
              endIcon={loadingExport ? undefined : <Download />}
            >
              {loadingExport ? (
                <CircularProgress sx={{ p: 0.5 }} />
              ) : (
                t('commissionBundlesPage.list.search.downloadButton')
              )}
            </Button>
            <Button
              component={RouterLink}
              to={generatePath(ROUTES.COMMISSION_BUNDLES_ADD)}
              variant="contained"
              data-testid={'create-bundle-button'}
              sx={{ minWidth: '200px', fontWeight: 'bold', padding: 0 }}
            >
              {t('commissionBundlesPage.list.search.createButton')}
            </Button>
          </>
        )}
      </Stack>

      {history.location.state && (history.location.state as any).alertSuccessMessage && (
        <Alert severity="success" variant="outlined" data-testid="alert-test">
          {(history.location.state as any).alertSuccessMessage}
        </Alert>
      )}
      <CommissionBundlesSearchBar
        setTabValue={setTabValue}
        setFiltersValues={setFiltersValues}
        tabValue={tabValue}
      />
      <CustomTabPanel valueTab={tabValue} index={0}>
        <CommissionBundlesTable
          bundleType={'commissionBundlesPage.privateBundles'}
          filtersValue={filtersValues}
        />
      </CustomTabPanel>
      <CustomTabPanel valueTab={tabValue} index={1}>
        <CommissionBundlesTable
          bundleType={'commissionBundlesPage.publicBundles'}
          filtersValue={filtersValues}
        />
      </CustomTabPanel>
      <CustomTabPanel valueTab={tabValue} index={2}>
        <CommissionBundlesTable
          bundleType={'commissionBundlesPage.globalBundles'}
          filtersValue={filtersValues}
        />
      </CustomTabPanel>
      {modalExport && (
        <GenericModal
          title={t('commissionBundlesPage.exportModal.title')}
          message={t('commissionBundlesPage.exportModal.message')}
          openModal={modalExport}
          onConfirmLabel={t('general.confirm')}
          onCloseLabel={t('general.turnBack')}
          handleCloseModal={() => setModalExport(false)}
          handleConfirm={async () => {
            exportBundleList();
            setModalExport(false);
          }}
        >
          <FormControl sx={{ ml: 1, minWidth: '200px' }}>
            <InputLabel id="export-bundle-type-label">
              {t('commissionBundlesPage.exportModal.select')}
            </InputLabel>
            <Select
              id={'export-bundle-type'}
              name={'export-bundle-type'}
              labelId="export-bundle-type-label"
              label={t('commissionBundlesPage.exportModal.select')}
              size="small"
              value={exportBundleTypes.name}
              onChange={(event) =>
                setExportBundleTypes(
                  optionsExportBundleTypes.find((el) => el.name === event.target.value)!
                )
              }
              data-testid="export-bundle-type"
              sx={{ height: '48px', backgroundColor: '#FFFFFF' }}
            >
              {optionsExportBundleTypes.map((el) => (
                <MenuItem value={el.name} key={el.name}>
                  {t(`commissionBundlesPage.exportModal.options.${el.name}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </GenericModal>
      )}
    </SideMenuLayout>
  );
};

export default CommissionBundlesPage;
