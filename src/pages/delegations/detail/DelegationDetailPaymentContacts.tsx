import { Divider, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ButtonNaked } from '@pagopa/mui-italia';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CIPaymentContact } from '../../../api/generated/portal/CIPaymentContact';
import { PaddedDrawer } from '../../../components/PaddedDrawer';

export default function DelegationDetailPaymentContacts({
  paymentContacts,
}: {
  paymentContacts: ReadonlyArray<CIPaymentContact> | undefined;
}) {
  const { t } = useTranslation();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        padding: 3,
        minHeight: '310px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="overline">{t('delegationDetailPage.paymentContacts.title')}</Typography>

      {paymentContacts
        ?.filter((_, i) => i < 1)
        ?.map((el) => (
          <Box key={`payment-contact-${el.id}`} mt={1} data-testid="payment-contact-column">
            <Typography variant="body1" color="action.active">
              {t('delegationDetailPage.paymentContacts.name')}
            </Typography>
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
              {el?.name}
            </Typography>
            <Typography variant="body1" color="action.active">
              {t('delegationDetailPage.paymentContacts.surname')}
            </Typography>
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
              {el?.surname}
            </Typography>
            <Typography variant="body1" color="action.active">
              {t('delegationDetailPage.paymentContacts.email')}
            </Typography>
            <Typography variant="body1" fontWeight={'fontWeightMedium'}>
              {el?.email}
            </Typography>
          </Box>
        ))}
      {paymentContacts && paymentContacts.length > 1 && (
        <>
          <ButtonNaked
            size="large"
            component="button"
            onClick={() => setOpenDrawer(true)}
            sx={{ color: 'primary.main', mt: 'auto', justifyContent: 'start' }}
            weight="default"
            data-testid="show-more-payment-contacts-test"
          >
            + {t('general.showMore')}
          </ButtonNaked>
          <PaddedDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}>
            <TitleBox title={t('delegationDetailPage.paymentContacts.title')} variantTitle="h5" />
            {paymentContacts &&
              paymentContacts.map((el, index) => (
                <React.Fragment key={`payment-contact-${el.id}`}>
                  {index !== 0 && <Divider />}
                  <Typography variant="overline">{t('delegationDetailPage.paymentContacts.drawerSubtitle')} {index + 1}</Typography>
                  <Box
                    mb={1}
                    data-testid="payment-contact-drawer-column"
                  >
                    <Typography variant="body1" color="action.active">
                      {t('delegationDetailPage.paymentContacts.name')}
                    </Typography>
                    <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                      {el?.name}
                    </Typography>
                    <Typography variant="body1" color="action.active">
                      {t('delegationDetailPage.paymentContacts.surname')}
                    </Typography>
                    <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                      {el?.surname}
                    </Typography>
                    <Typography variant="body1" color="action.active">
                      {t('delegationDetailPage.paymentContacts.email')}
                    </Typography>
                    <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                      {el?.email}
                    </Typography>
                  </Box>
                </React.Fragment>
              ))}
          </PaddedDrawer>
        </>
      )}
    </Paper>
  );
}
