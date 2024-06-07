import {Box, Pagination} from '@mui/material';
import {GridColDef} from '@mui/x-data-grid';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {LOADING_TASK_COMMISSION_BUNDLE_LIST} from '../../../utils/constants';
import {useAppSelector} from '../../../redux/hooks';
import ROUTES from '../../../routes';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import TableEmptyState from '../../../components/Table/TableEmptyState';
import {CustomDataGrid} from '../../../components/Table/TableDataGrid';
import {getBundleListByPSP, getCisBundles} from '../../../services/bundleService';
import {useOrganizationType} from '../../../hooks/useOrganizationType';
import {BundleResource, BundlesResource} from '../../../model/CommissionBundle';
import {TypeEnum} from '../../../api/generated/portal/PSPBundleResource';
import {buildColumnDefs} from './CommissionBundlesTableColumns';

type Props = {
    bundleNameFilter: string;
    bundleType: string;
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
const CommissionBundlesTable = ({bundleNameFilter, bundleType}: Props) => {
    const {t} = useTranslation();
    const {orgInfo} = useOrganizationType();
    const addError = useErrorDispatcher();
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_LIST);
    const columns: Array<GridColDef> = buildColumnDefs(t, orgInfo.types.isPsp, orgInfo.types.isEc);
    const [listFiltered, setListFiltered] = useState<BundlesResource>(emptyCommissionBundleList);
    const [page, setPage] = useState(0);
    const brokerCode = selectedParty?.fiscalCode ?? '';
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const mappedBundleType = mapBundle(bundleType);

    const setLoadingStatus = (status: boolean) => {
        setLoading(status);
    };

    const pageLimit = 5;
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const getBundleList = (newPage?: number) => {
        setLoadingStatus(true);
        if (isFirstRender) {
            setIsFirstRender(false);
        }
        // eslint-disable-next-line functional/no-let
        let promise;
        if (orgInfo.types.isPsp) {
            promise = getBundleListByPSP(
                mappedBundleType,
                pageLimit,
                bundleNameFilter,
                newPage ?? page,
                brokerCode
            );
        } else if (orgInfo.types.isEc) {
            promise = getCisBundles(
                mappedBundleType,
                pageLimit,
                bundleNameFilter,
                newPage ?? page,
                mappedBundleType === TypeEnum.GLOBAL ? undefined : brokerCode
            );
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
        const identifier = setTimeout(
            () => {
                getBundleList();
            },
            isFirstRender ? 0 : 500
        );
        return () => {
            clearTimeout(identifier);
        };
    }, [bundleNameFilter, brokerCode]);

    function handleChangePage(value: number) {
        const newPage = value - 1;
        setPage(newPage);
        getBundleList(newPage);
    }

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
            {listFiltered?.bundles?.length === 0 ? (
                <TableEmptyState
                    componentName={componentPath}
                    translationArgs={{bundleType: t(bundleType)}}
                    linkToRedirect={orgInfo.types.isPsp ? ROUTES.COMMISSION_BUNDLES_ADD : undefined}
                />
            ) : (
                <div data-testid="data-grid">
                    <CustomDataGrid
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        disableSelectionOnClick
                        autoHeight={true}
                        className="CustomDataGrid"
                        columnBuffer={5}
                        columns={columns}
                        components={{
                            Pagination: () => (
                                <Pagination
                                    color="primary"
                                    count={listFiltered?.pageInfo?.total_pages ?? 1}
                                    page={page + 1}
                                    onChange={(_event: ChangeEvent<unknown>, value: number) =>
                                        handleChangePage(value)
                                    }
                                />
                            ),
                        }}
                        headerHeight={headerHeight}
                        hideFooterSelectedRowCount={true}
                        paginationMode="client"
                        rowCount={listFiltered?.bundles?.length}
                        rowHeight={rowHeight}
                        rows={listFiltered?.bundles ?? []}
                        sortingMode="client"
                        getRowId={(el) => el.idBundle}
                        // onSortModelChange={handleSortModelChange}
                    />
                </div>
            )}
        </Box>
    );
};

export default CommissionBundlesTable;

const PrivateBundleEmptyStateCTA = ({
  setBundleStatus,
  bundleStatus,
}: {
  setBundleStatus: (value: any) => void;
  bundleStatus: SubscriptionStateType;
}) => {
  const { t } = useTranslation();
  return (
    <ButtonNaked
      size="medium"
      component="button"
      onClick={() =>
        setBundleStatus(
          bundleStatus === SubscriptionStateType.Accepted
            ? SubscriptionStateType.Waiting
            : SubscriptionStateType.Accepted
        )
      }
      sx={{ color: 'primary.main', ml: 1 }}
      weight="default"
      data-testid="private-bundle-cta"
    >
      {t(`${componentPath}.table.cta.${bundleStatus}`)}
    </ButtonNaked>
  );
};
