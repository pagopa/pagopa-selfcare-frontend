import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { LOADING_TASK_COMMISSION_BUNDLE_LIST } from '../../../utils/constants';
import { useAppSelector } from '../../../redux/hooks';
import ROUTES from '../../../routes';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import TableDataGrid from '../../../components/Table/TableDataGrid';
import { getBundleListByPSP, getCisBundles } from '../../../services/bundleService';
import { useOrganizationType } from '../../../hooks/useOrganizationType';
import {
  BundleResource,
  BundlesResource,
  SubscriptionStateType,
} from '../../../model/CommissionBundle';
import { TypeEnum } from '../../../api/generated/portal/PSPBundleResource';
import { buildColumnDefs } from './CommissionBundlesTableColumns';

type Props = {
  bundleNameFilter?: string;
  bundleType: string;
  bundleStatus?: SubscriptionStateType;
};

const rowHeight = 64;
const headerHeight = 56;

const emptyCommissionBundleList: BundlesResource = {
    bundles: [],
    pageInfo: {
        items_found: 0,
        limit: 0,
        page: 0,
        total_pages: 0,
    },
};

const mapBundle = (bundleType: string) => {
    switch (bundleType) {
        case 'commissionBundlesPage.globalBundles':
            return 'GLOBAL';
        case 'commissionBundlesPage.publicBundles':
            return 'PUBLIC';
        case 'commissionBundlesPage.privateBundles':
            return 'PRIVATE';
        default:
            return '';
    }
};

const componentPath = 'commissionBundlesPage.list';
const CommissionBundlesTable = ({ bundleNameFilter, bundleType, bundleStatus }: Props) => {
  const { t } = useTranslation();
  const { orgInfo } = useOrganizationType();
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_LIST);
  const columns: Array<GridColDef> = buildColumnDefs(t, orgInfo.types.isPsp, orgInfo.types.isEc);

  const brokerCode = selectedParty?.fiscalCode ?? '';
  const mappedBundleType = mapBundle(bundleType);

  const [listFiltered, setListFiltered] = useState<BundlesResource>(emptyCommissionBundleList);
  const [page, setPage] = useState<number>(0);
  const [pageLimit, setPageLimit] = useState<number>(5);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

    const setLoadingStatus = (status: boolean) => {
        setLoading(status);
    };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const getBundleList = (newPage?: number) => {
    setLoadingStatus(true);
    if (isFirstRender) {
      setIsFirstRender(false);
    }
    if (newPage !== undefined) {
      setPage(newPage);
    }
    // eslint-disable-next-line functional/no-let
    let promise;
    if (orgInfo.types.isPsp) {
      promise = getBundleListByPSP({
        bundleType: mappedBundleType,
        pageLimit,
        bundleName: bundleNameFilter ?? undefined,
        page: newPage ?? page,
        pspCode: brokerCode,
      });
    } else if (orgInfo.types.isEc) {
      promise = getCisBundles({
        bundleType: mappedBundleType,
        pageLimit,
        bundleName: bundleNameFilter ?? undefined,
        page: newPage ?? page,
        ciTaxCode: mappedBundleType === TypeEnum.GLOBAL ? undefined : brokerCode,
        bundleStatus: mappedBundleType === TypeEnum.PRIVATE ? bundleStatus : undefined,
      });
    }
    if (promise) {
      promise
        .then((res) => {
          if (res?.bundles) {
            const formattedBundles = res.bundles?.map((el: BundleResource) => ({
              ...el,
              touchpoint: el.touchpoint ?? 'ANY',
              paymentType: el.paymentType ?? 'ANY',
            }));
            setListFiltered({
              bundles: formattedBundles,
              pageInfo: res.pageInfo,
            });
          } else {
            setListFiltered([]);
          }
        })
        .catch((reason) =>
          addError({
            id: 'COMMISSION_BUNDLES_RETRIEVE_BUNDLES',
            blocking: false,
            error: reason as Error,
            techDescription: `An error occurred while retrieving bundles`,
            toNotify: true,
            displayableTitle: t('general.errorTitle'),
            displayableDescription: t(
              `${componentPath}.error.retrieveCommissionBundlesErrorMessage`
            ),
            component: 'Toast',
          })
        )
        .finally(() => setLoadingStatus(false));
    }
  };

  useEffect(() => {
    if (!isFirstRender) {
      const identifier = setTimeout(() => {
        getBundleList(0);
      }, 500);
      return () => {
        clearTimeout(identifier);
      };
    }
    return () => {};
  }, [bundleNameFilter, brokerCode]);

  useEffect(() => {
    getBundleList(0);
  }, [bundleStatus, pageLimit]);

  return (
    <Box
      id="commissionBundlesTable"
      data-testid={`table-${mappedBundleType}`}
      sx={{
        position: 'relative',
        width: '100% !important',
        border: 'none',
      }}
      justifyContent="start"
    >
      <TableDataGrid
        componentPath={componentPath}
        translationArgs={{ bundleType: t(bundleType) }}
        linkToRedirect={orgInfo.types.isPsp ? ROUTES.COMMISSION_BUNDLES_ADD : undefined}
        rows={listFiltered?.bundles ? [...listFiltered.bundles] : []}
        columns={columns}
        totalPages={listFiltered?.pageInfo?.total_pages}
        page={page}
        handleChangePage={(newPage: number) => getBundleList(newPage)}
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        getRowId={(el) => el.idBundle}
      />
    </Box>
  );
};

export default CommissionBundlesTable;
