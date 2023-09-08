/* eslint-disable sonarjs/no-identical-functions */
import { Stack, Button } from '@mui/material';
import { Link, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ROUTES from '../../../../routes';
import { IbanFormAction } from '../../../../model/Iban';

type Props = {
  active: boolean | undefined;
  iban: string;
  deleteIban: () => Promise<void>;
};

const IbanDetailButtons = ({ active, iban, deleteIban }: Props) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
      <Button
        color="error"
        variant="outlined"
        onClick={() => deleteIban()}
        data-testid="delete-button-test"
      >
        {t('ibanDetailPage.buttons.delete')}
      </Button>
      {!active ? (
        <Button
          component={Link}
          to={() =>
            generatePath(ROUTES.IBAN_EDIT, {
              ibanId: iban,
              actionId: IbanFormAction.Edit,
            })
          }
          variant="contained"
          data-testid="button Edit"
        >
          {t('ibanDetailPage.buttons.edit')}
        </Button>
      ) : (
        <>
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
            variant="contained"
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
