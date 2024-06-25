import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { generatePath } from 'react-router-dom';
import { WrapperChannelsResource } from '../../../api/generated/portal/WrapperChannelsResource';
import TableDataGrid from '../../../components/Table/TableDataGrid';
import { useUserRole } from '../../../hooks/useUserRole';
import { ConfigurationStatus } from '../../../model/Station';
import { useAppSelector } from '../../../redux/hooks';
import { partiesSelectors } from '../../../redux/slices/partiesSlice';
import ROUTES from '../../../routes';
import { getChannels } from '../../../services/channelService';
import { LOADING_TASK_CHANNELS_LIST } from '../../../utils/constants';
import { buildColumnDefs } from './ChannelsTableColumns';

const rowHeight = 64;
const headerHeight = 56;

const emptyChannelsResource: WrapperChannelsResource = {
  channels: [],
  page_info: {},
};
const componentPath = 'channelsPage';
export default function ChannelsTable({
  channelCodeFilter,
  statusFilter,
}: Readonly<{ channelCodeFilter: string; statusFilter: ConfigurationStatus }>) {
  const { t } = useTranslation();
  const history = useHistory();
  const { userIsPagopaOperator } = useUserRole();
  const addError = useErrorDispatcher();
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);

  const onRowClick = (channelIdRow: string) => {
    history.push(generatePath(`${ROUTES.CHANNEL_DETAIL}`, { channelId: channelIdRow }));
  };

  const columns: Array<GridColDef> = buildColumnDefs(t, onRowClick);
  const setLoadingOverlay = useLoading(LOADING_TASK_CHANNELS_LIST);

  const [channels, setChannels] = useState<WrapperChannelsResource>(emptyChannelsResource);
  const [page, setPage] = useState(0);
  const [pageLimit, setPageLimit] = useState<number>(10);

  const brokerCode = typeof selectedParty !== 'undefined' ? selectedParty.fiscalCode : '';

  useEffect(() => {
    fetchChannels(0);
  }, [statusFilter, brokerCode, channelCodeFilter, pageLimit]);

  const fetchChannels = (pageParam: number) => {
    if (brokerCode) {
      setLoadingOverlay(true);
      if(pageParam){
        setPage(pageParam);
      }
      getChannels({
        status: statusFilter,
        channelCode: channelCodeFilter,
        brokerCode,
        limit: pageLimit,
        page: pageParam ?? page,
      })
        .then((r) => {
          setChannels(r);
        })
        .catch((reason) => {
          addError({
            id: `FETCH_CHANNELS_ERROR`,
            blocking: false,
            error: reason,
            techDescription: `An error occurred while fetching channels`,
            toNotify: true,
          });
          setChannels(emptyChannelsResource);
        })
        .finally(() => setLoadingOverlay(false));
    }
  };

  return (
    <Box id="ChannelsSearchTableBox">
      <TableDataGrid
        componentPath={componentPath}
        linkToRedirect={!userIsPagopaOperator ? ROUTES.CHANNEL_ADD : undefined}
        rows={channels?.channels ? [...channels.channels] : []}
        columns={columns}
        totalPages={channels?.page_info?.total_pages}
        page={page}
        handleChangePage={(newPage: number) => fetchChannels(newPage)}
        pageLimit={pageLimit}
        setPageLimit={setPageLimit}
        getRowId={(r) => r.channel_code}
      />
    </Box>
  );
}
