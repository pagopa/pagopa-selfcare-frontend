import { Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { StatusEnum } from '../../../../api/generated/portal/WrapperStationDetailsDto';
import { WrapperEntitiesOperations } from '../../../../api/generated/portal/WrapperEntitiesOperations';

type Props = {
  stationDetail?: WrapperEntitiesOperations;
};

const DetailButtons = ({ stationDetail }: Props) => {
  const selectedParty = useAppSelector(partiesSelectors.selectPartySelected);
  const isOperator = selectedParty?.roles[0].roleKey === 'operator';
  const { t } = useTranslation();

  return (
    <Stack spacing={2} direction="row" flexWrap={'wrap'} justifyContent={'flex-end'}>
      {isOperator && stationDetail?.status === StatusEnum.APPROVED ? (
        <>
          <Button
            component={Link}
            to={() => ''}
            variant="contained"
            // TBD
          >
            {t('channelDetailPage.edit')}
          </Button>
        </>
      ) : isOperator && stationDetail?.status === (StatusEnum.TO_CHECK || StatusEnum.TO_FIX) ? (
        <>
          <Button component={Link} to={''} color="error" variant="outlined" onClick={() => ''}>
            {t('channelDetailPage.correctionRequired')}
          </Button>
          <Button
            component={Link}
            to={() => ''}
            variant="contained"
            // TBD
          >
            {t('channelDetailPage.configure')}
          </Button>
        </>
      ) : stationDetail?.status === StatusEnum.APPROVED ? (
        <>
          <Button component={Link} to={''} color="error" variant="outlined" onClick={() => ''}>
            {t('channelDetailPage.deleteRequired')}
          </Button>
          <Button
            component={Link}
            to={() => ''}
            variant="contained"
            // TBD
          >
            {t('channelDetailPage.duplicate')}
          </Button>
          <Button
            component={Link}
            to={() => ''}
            variant="contained"
            // TBD
          >
            {t('channelDetailPage.edit')}
          </Button>
        </>
      ) : stationDetail?.status === StatusEnum.TO_FIX ? (
        <>
          <Button
            component={Link}
            to={() => ''}
            variant="contained"
            // TBD
          >
            {t('channelDetailPage.correctStation')}
          </Button>
        </>
      ) : (
        <>
          <Button
            component={Link}
            to={() => ''}
            variant="contained"
            // TBD
          >
            {t('channelDetailPage.edit')}
          </Button>
        </>
      )}
    </Stack>
  );
};

export default DetailButtons;
