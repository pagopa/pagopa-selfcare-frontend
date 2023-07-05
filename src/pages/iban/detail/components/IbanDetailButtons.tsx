/* eslint-disable sonarjs/no-identical-functions */
import { Stack, Button } from '@mui/material';
import { Link, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ROUTES from '../../../../routes';
import { IbanStatus, IbanFormAction } from '../../../../model/Iban';

type Props = {
  status: IbanStatus | undefined;
  iban: string;
};

const IbanDetailButtons = ({ status, iban }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
      {status !== IbanStatus.ACTIVE ? (
        <>
          <Button
            component={Link}
            to={''}
            color="error"
            variant="outlined"
            disabled={true}
            // onClick={() => ''}
          >
            {t('ibanDetailPage.buttons.delete')}
          </Button>
          <Button
            component={Link}
            to={() =>
              generatePath(ROUTES.IBAN_EDIT, {
                ibanId: iban,
                actionId: IbanFormAction.Edit,
              })
            }
            variant="outlined"
            data-testid="button Edit"
          >
            {t('ibanDetailPage.buttons.edit')}
          </Button>
        </>
      ) : (
        <>
          <Button
            component={Link}
            to={''}
            color="error"
            variant="outlined"
            disabled={true}
            // onClick={() => ''}
          >
            {t('ibanDetailPage.buttons.delete')}
          </Button>
          <Button component={Link} to={''} variant="outlined" disabled={true}>
            {t('ibanDetailPage.buttons.deactivate')}
          </Button>
          <Button
            component={Link}
            to={() =>
              generatePath(ROUTES.IBAN_EDIT, {
                ibanId: iban,
                actionId: IbanFormAction.Edit,
              })
            }
            variant="outlined"
            data-testid="button Edit"
          >
            {t('ibanDetailPage.buttons.edit')}
          </Button>
        </>
      )}
    </Stack>
  );
};

export default IbanDetailButtons;
