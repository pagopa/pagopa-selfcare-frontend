import {Box, Pagination} from '@mui/material';
import {GridColDef} from '@mui/x-data-grid';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useErrorDispatcher, useLoading} from '@pagopa/selfcare-common-frontend';
import {LOADING_TASK_COMMISSION_BUNDLE_LIST} from '../../../utils/constants';
import {useAppSelector} from '../../../redux/hooks';
import {partiesSelectors} from '../../../redux/slices/partiesSlice';
import {TypeEnum} from '../../../api/generated/portal/BundleResource';
import {CustomDataGrid} from '../../../components/Table/CustomDataGrid';
import {BundlesResource} from '../../../api/generated/portal/BundlesResource';
import {getBundleListByPSP, getCisBundles} from '../../../services/bundleService';
import {useOrganizationType} from "../../../hooks/useOrganizationType";
import {useUserRole} from "../../../hooks/useUserRole";
import {buildColumnDefs} from './CommissionBundlesTableColumns';
import CommissionBundlesEmpty from './CommissionBundlesEmpty';

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

const CommissionBundlesTable = ({bundleNameFilter, bundleType}: Props) => {
    const {t} = useTranslation();
    const {userIsAdmin} = useUserRole();
    const {orgInfo} = useOrganizationType();
    const addError = useErrorDispatcher();
    const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
    const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_LIST);
    const columns: Array<GridColDef> = buildColumnDefs(t, orgInfo.types.isPsp, orgInfo.types.isEc);
    const [listFiltered, setListFiltered] = useState<BundlesResource>(emptyCommissionBundleList);
    const [page, setPage] = useState(0);
    const brokerCode = selectedParty?.fiscalCode ?? '';
    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

    const setLoadingStatus = (status: boolean) => {
        setLoading(status);
    };

    const pageLimit = 5;
    const getBundleList = (newPage?: number) => {
        setLoadingStatus(true);
        if (isFirstRender) {
            setIsFirstRender(false);
        }
        const mappedBundleType = mapBundle(bundleType);
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
        } else {
            promise = new Promise<BundlesResource>((resolve) => resolve({}));
            addError({
                id: 'COMMISSION_BUNDLES_RETRIEVE_BUNDLES',
                blocking: false,
                error: {} as Error,
                techDescription: `An error occurred while retrieving bundles`,
                toNotify: true,
                displayableTitle: t('general.errorTitle'),
                displayableDescription: t(
                    'commissionBundlesPage.list.error.retrieveCommissionBundlesErrorMessage'
                ),
                component: 'Toast',
            });
        }
        promise
            .then((res) => {
                if (res?.bundles) {
                    const formattedBundles = res?.bundles?.map((el, ind) => ({
                        ...el,
                        id: `bundle-${ind}`,
                        touchpoint: el.touchpoint ?? 'ANY',
                        paymentType: el.paymentType ?? 'ANY',
                    }));
                    setListFiltered({bundles: formattedBundles, pageInfo: res.pageInfo});
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
                        'commissionBundlesPage.list.error.retrieveCommissionBundlesErrorMessage'
                    ),
                    component: 'Toast',
                })
            )
            .finally(() => setLoadingStatus(false));
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
            sx={{
                position: 'relative',
                width: '100% !important',
                border: 'none',
            }}
            justifyContent="start"
        >
            {listFiltered?.bundles?.length === 0 ? (
                <CommissionBundlesEmpty bundleType={t(bundleType)}/>
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
                                <>
                                    <Pagination
                                        color="primary"
                                        count={listFiltered?.pageInfo?.total_pages ?? 1}
                                        page={page + 1}
                                        onChange={(_event: ChangeEvent<unknown>, value: number) =>
                                            handleChangePage(value)
                                        }
                                    />
                                </>
                            ),
                        }}
                        componentsProps={{
                            toolbar: {
                                quickFilterProps: {debounceMs: 500},
                            },
                        }}
                        headerHeight={headerHeight}
                        hideFooterSelectedRowCount={true}
                        paginationMode="client"
                        rowCount={listFiltered?.bundles?.length}
                        rowHeight={rowHeight}
                        rows={listFiltered?.bundles ?? []}
                        sortingMode="client"
                        // onSortModelChange={handleSortModelChange}
                    />
                </div>
            )}
        </Box>
    );
};

export default CommissionBundlesTable;
