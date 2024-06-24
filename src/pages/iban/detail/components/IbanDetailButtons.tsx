/* eslint-disable sonarjs/no-identical-functions */
<<<<<<< HEAD
import {Stack, Button} from '@mui/material';
import {Link, generatePath} from 'react-router-dom';
=======
import {Button, Stack} from '@mui/material';
import {generatePath, Link} from 'react-router-dom';
>>>>>>> 3f32cfc3 (Formatting (#542))
import {useTranslation} from 'react-i18next';
import {Dispatch, SetStateAction} from 'react';
import ROUTES from '../../../../routes';
import {IbanFormAction} from '../../../../model/Iban';

type Props = {
    active: boolean | undefined;
    iban: string;
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
};

const IbanDetailButtons = ({active, iban, setShowDeleteModal}: Props) => {
    const {t} = useTranslation();

    return (
        <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
            <Button
                color="error"
                variant="outlined"
                onClick={() => setShowDeleteModal(true)}
                data-testid="delete-button-test"
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
                variant="contained"
                data-testid="button Edit"
            >
                {t('ibanDetailPage.buttons.edit')}
            </Button>
            {/* TODO: fix when iban deactivation will be available
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
        */}
        </Stack>
    );
};

export default IbanDetailButtons;
