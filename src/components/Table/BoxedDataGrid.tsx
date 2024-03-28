import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

export default function BoxedDataGrid({
  dataGrid: DataGrid,
  emptyState: EmptyState = undefined,
  error = false,
  loading = false,
  showEmptyState = false,
}: {
  dataGrid: React.FC;
  emptyState?: React.FC;
  error?: boolean;
  loading?: boolean;
  showEmptyState?: boolean;
}) {
  return (
    <Box
      id="ChannelsSearchTableBox"
      sx={{
        position: 'relative',
        width: '100% !important',
        border: 'none',
      }}
      justifyContent="start"
    >
      {error && !loading ? (
        <>{error}</>
      ) : !error && !loading && showEmptyState && EmptyState ? (
        <EmptyState />
      ) : (
        <div data-testid="data-grid">{<DataGrid />}</div>
      )}
    </Box>
  );
}
