import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Box, IconButton, Grid, Stack } from '@mui/material';
import { RemoveCircleOutlineOutlined } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ButtonNaked, theme } from '@pagopa/mui-italia';
import { PSPBundleTaxonomy } from '../../../../api/generated/portal/PSPBundleTaxonomy';

export interface BundleTaxonomiesTableProps {
  tableData?: any;
  deleteTaxonomyAction?: any;
  deleteAreaAction?: any;
}

export const BundleTaxonomiesTable = ({
  tableData,
  deleteTaxonomyAction,
  deleteAreaAction,
}: BundleTaxonomiesTableProps) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Typography variant="overline">
        {t('commissionBundlesPage.addEditCommissionBundle.addTaxonomies.addedServices')}
      </Typography>
      {Object.keys(tableData).map((item, index) => {
        const taxonomyArea = tableData[item];
        return (
          <Box
            sx={{
              borderRadius: 1,
              border: 1,
              borderColor: theme.palette.divider,
              p: 3,
              mt: 3,
              mb: 1,
            }}
            key={`${item}-${index}`}
            data-testid="box-macroarea"
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1">{item}</Typography>
              <Box display="flex" justifyContent="flex-end" alignItems="center">
                <ButtonNaked
                  size="small"
                  component="button"
                  onClick={() => deleteAreaAction(item)}
                  sx={{ color: 'red' }}
                  weight="default"
                  data-testid="delete-all-taxonomies-by-group"
                >
                  <DeleteIcon fontSize="small"/>
                  {t('general.remove')}
                </ButtonNaked>
              </Box>
            </Stack>
            <Typography variant="body2" mb={1}>
              {taxonomyArea[0].ecType}
            </Typography>
            {taxonomyArea.map((taxonomy: PSPBundleTaxonomy) => (
              <Grid container key={taxonomy.specificBuiltInData} my={1} data-testid="grid-taxonomy">
                <Grid item xs={1} display="flex" alignItems={'center'}>
                  <IconButton
                    sx={{
                      width: '100%',
                      '&:hover': { backgroundColor: 'transparent !important' },
                      p: 0
                    }}
                    onClick={(e) =>
                      deleteTaxonomyAction({
                        taxonomy: taxonomy.specificBuiltInData,
                        area: item,
                      })
                    }
                    data-testid="delete-taxonomy-button"
                  >
                    <RemoveCircleOutlineOutlined sx={{ color: 'red', fontSize: '24px' }} />
                  </IconButton>
                </Grid>
                <Grid
                  item
                  xs={11}
                  display="flex"
                  alignItems={'center'}
                  sx={{ borderRadius: 1, border: 1, borderColor: theme.palette.divider, p: 1, px: 2 }}
                >
                  <Typography variant="body1">
                    {taxonomy.specificBuiltInData} - {taxonomy.serviceType}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Box>
        );
      })}
    </React.Fragment>
  );
};

export default BundleTaxonomiesTable;
