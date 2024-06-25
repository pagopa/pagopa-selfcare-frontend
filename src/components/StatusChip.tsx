import {Chip} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useUserRole} from '../hooks/useUserRole';
import {WrapperStatusEnum} from '../api/generated/portal/WrapperStationResource';

type Props = {
    status: string;
    size?: 'small' | 'regular';
};
export const StatusChip = ({status, size = 'regular'}: Props) => {
    const {t} = useTranslation();
    const {userIsPagopaOperator} = useUserRole();
    const resolvedChip = resolveWrappedStatusToChipObj(status, userIsPagopaOperator);

    return status ? (
        <Chip
            label={t(`general.WrapperStatus.${resolvedChip.label}${userIsPagopaOperator ? "_OPERATOR" : ""}`)}
            aria-label="Status"
            sx={{
                fontWeight: 'fontWeightMedium',
                color: resolvedChip.color,
                backgroundColor: resolvedChip.backgroundColor,
                ...(size === 'small' && {fontSize: '14px', paddingBottom: '1px', height: '24px'}),
            }}
        />
    ) : null;
};

const resolveWrappedStatusToChipObj = (status: string, userIsPagopaOperator: boolean) => {
    const label = status + (userIsPagopaOperator ? '_OPERATOR' : '');
    switch (status) {
        case WrapperStatusEnum.APPROVED:
            return {label: status, color: '#FFFFFF', backgroundColor: 'primary.main'};
        case WrapperStatusEnum.TO_FIX:
        case WrapperStatusEnum.TO_FIX_UPDATE:
            return {
                label: status,
                color: '#17324D',
                backgroundColor: userIsPagopaOperator ? 'grey.200' : 'warning.light',
            };
        case WrapperStatusEnum.TO_CHECK:
        case WrapperStatusEnum.TO_CHECK_UPDATE:
            return {
                label: status,
                color: '#17324D',
                backgroundColor: userIsPagopaOperator ? 'warning.light' : 'grey.200',
            };
        default:
            return {label, color: '#17324D', backgroundColor: 'grey.200'};
    }
};
