import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { WrapperStatusEnum } from '../api/generated/portal/WrapperStationResource';

type Props = {
  status: string;
  size?: 'small' | 'regular';
};
export const StatusChip = ({ status, size = 'regular' }: Props) => {
  const { t } = useTranslation();
  const resolvedChip = resolveWrappedStatusToChipObj(status);

  return (
    <Chip
      label={t(`general.WrapperStatus.${resolvedChip.label}`)}
      aria-label="Status"
      sx={{
        fontWeight: 'fontWeightMedium',
        color: resolvedChip.color,
        backgroundColor: resolvedChip.backgroundColor,
        ...(size === 'small' && { fontSize: '14px', paddingBottom: '1px', height: '24px' }),
      }}
    ></Chip>
  );
};

const resolveWrappedStatusToChipObj = (status: string) => {
  switch (status) {
    case WrapperStatusEnum.APPROVED:
      return { label: status, color: '#FFFFFF', backgroundColor: 'primary.main' };
    case WrapperStatusEnum.TO_FIX:
    case WrapperStatusEnum.TO_FIX_UPDATE:
      return { label: status, color: '#17324D', backgroundColor: 'warning.light' };
    case WrapperStatusEnum.TO_CHECK:
    case WrapperStatusEnum.TO_CHECK_UPDATE:
      return { label: status, color: '#17324D', backgroundColor: 'grey.200' };
    default:
      return { label: status, color: '#17324D', backgroundColor: 'grey.200' };
  }
};
