"use client";

import React from "react";
import { TitleBox, useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend';
import { useTranslation } from 'react-i18next';

import { Typography, Box, Tooltip, IconButton, Grid, Paper, Stack } from "@mui/material";
import { RemoveCircleOutlineOutlined, DeleteOutlined } from '@mui/icons-material';

import {theme} from '@pagopa/mui-italia';
import FormSectionTitle from '../../../../components/Form/FormSectionTitle';

export interface BundleTaxonomiesTableProps {
    tableData?: any;
    deleteTaxonomyAction?: any;
    deleteAreaAction?: any;
}

export const BundleTaxonomiesTable= ({
    tableData,
    deleteTaxonomyAction,
    deleteAreaAction
}: BundleTaxonomiesTableProps) => {

  const inputGroupStyle = {
    borderRadius: 1,
    border: 1,
    borderColor: theme.palette.divider,
    p: 3,
    mb: 3,
  };

  const { t } = useTranslation();
  // const setLoading = useLoading(LOADING_TASK_COMMISSION_BUNDLE_SELECT_DATAS);
  const addError = useErrorDispatcher();

  return (
    <React.Fragment>
        <Typography variant="h6" mt={3}>
            {t('commissionBundlesPage.commissionBundleDetail.taxonomies')}
        </Typography>
       {Object.keys(tableData).map((item) => {
           const taxonomyArea = tableData[item];
           return (
               <Paper
                key={item}
                elevation={0}
                sx={{
                  borderRadius: 1,
                  p: 3,
                  minWidth: '80%',
                  mb: 4,
                }}
              >
                <Box>
                    <Box sx={inputGroupStyle}>
                        <Stack direction="row" justifyContent="space-between">
                            <Box>
                            <Typography variant="body1" mb={1}>
                                {item}
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                {taxonomyArea[0].ci_type}
                            </Typography>
                            </Box>
                                <Box
                                     display="flex"
                                     justifyContent="flex-end"
                                     width="5%"

                                 >

                                   <IconButton
                                     sx={{
                                       width: '100%',
                                       '&:hover': { backgroundColor: 'transparent !important' },
                                     }}
                                     onClick={(e) => deleteAreaAction(item)}
                                   >
                                     <DeleteOutlined sx={{ color: 'red', fontSize: '24px' }} />
                                   </IconButton>
                                </Box>
                        </Stack>
                        {
                            taxonomyArea.map((taxonomy: any) => (
                                <React.Fragment key={taxonomy.specific_built_in_data}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Box
                                            display="flex"
                                            justifyContent="flex-start"
                                            width="5%"
                                        >
                                          <IconButton
                                            sx={{
                                              width: '100%',
                                              '&:hover': { backgroundColor: 'transparent !important' },
                                            }}
                                            onClick={(e) => deleteTaxonomyAction(
                                                {"taxonomy":taxonomy.specific_built_in_data,"area":item})
                                            }
                                          >
                                            <RemoveCircleOutlineOutlined sx={{ color: 'red', fontSize: '24px' }} />
                                          </IconButton>
                                        </Box>
                                        <Box sx={inputGroupStyle} width="95%">
                                            {taxonomy.specific_built_in_data}
                                        </Box>
                                    </Stack>
                                </React.Fragment>
                            ))
                        }
                    </Box>
                </Box>
              </Paper>);}
           )
       }
    </React.Fragment>
  );
};