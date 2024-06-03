import { Box, Divider, Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { InstitutionUploadData } from '../../../api/generated/portal/InstitutionUploadData';
import React from 'react';

type Props = {
  data?: InstitutionUploadData;
};

// eslint-disable-next-line complexity, sonarjs/cognitive-complexity
const PaymentNoticesDetailPage = ({
  data
}: // eslint-disable-next-line sonarjs/cognitive-complexity
Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Grid container justifyContent={'center'}>
      <Grid item p={3} xs={8}>

        <Paper
          elevation={5}
          sx={{
            mt: 2,
            borderRadius: 4,
            p: 4,
          }}
        >
          <Grid container item spacing={2}>
           <Grid container xs={6}>
            <>
              <Grid item xs={12}>
                <Typography variant="sidenav">
                  {t('addEditInstitutionsData.detail.registry')}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">
                  {t('addEditInstitutionsData.detail.fields.logo')}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  <img src={data?.logo} />
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">
                  {t('addEditInstitutionsData.detail.fields.name')}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {data?.fullName}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">
                  {t('addEditInstitutionsData.detail.fields.taxCode')}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {data?.taxCode}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">
                  {t('addEditInstitutionsData.detail.fields.organization')}
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                  {data?.organization}
                </Typography>
              </Grid>
            </>
            </Grid>
            <Grid container xs={6}>
                <Grid item xs={12}>
                  <Typography variant="sidenav">
                    {t('addEditInstitutionsData.detail.registry')}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    {data?.info}
                  </Typography>
                </Grid>
            </Grid>
          </Grid>
          {data?.webChannel || data?.appChannel ?
              (
                <React.Fragment>
                  <Divider sx={{ mt: 3 }}></Divider>
                  <Grid container item spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="sidenav">
                          {t('addEditInstitutionsData.detail.wherePay')}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2">
                          {t('addEditInstitutionsData.detail.fields.paymentChannel')}
                        </Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                          {t(data.webChannel ?
                            data.appChannel ? 'addEditInstitutionsData.detail.webApp' :
                             'addEditInstitutionsData.detail.onlyWeb'
                            : 'addEditInstitutionsData.detail.onlyApp')}
                        </Typography>
                      </Grid>
                  </Grid>
                </React.Fragment>
              ) : (<Box></Box>)
          }

          {data?.posteAuth ?
              (
                <React.Fragment>
                  <Divider sx={{ mt: 3 }}></Divider>
                  <Grid container item spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="sidenav">
                          {t('addEditInstitutionsData.detail.poste')}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2">
                          {t('addEditInstitutionsData.detail.fields.posteName')}
                        </Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                          {data?.posteName}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2">
                          {t('addEditInstitutionsData.detail.fields.accountNumber')}
                        </Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                          {data?.posteAccountNumber}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="body2">
                          {t('addEditInstitutionsData.detail.fields.posteAuth')}
                        </Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body2" fontWeight={'fontWeightMedium'}>
                          {data?.posteAccountNumber}
                        </Typography>
                      </Grid>
                  </Grid>      
                </React.Fragment>
              ) : (<Box></Box>)
          }

        </Paper>

      </Grid>
    </Grid>
  );
};
export default PaymentNoticesDetailPage;