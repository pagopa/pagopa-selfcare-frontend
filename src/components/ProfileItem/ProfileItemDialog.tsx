import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Radio,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProfileOption } from '../../utils/profile-utils';

type Props = {
  open: boolean;
  options: Array<ProfileOption>;
  selectedRole: string;
  loading?: boolean;
  error?: string;
  onSelectedRoleChange: (role: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

const ProfileItemDialog = ({
  open,
  options,
  selectedRole,
  loading = false,
  error,
  onSelectedRoleChange,
  onClose,
  onConfirm,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="profile-item-title"
      aria-describedby="profile-item-subtitle"
      maxWidth={false}
      BackdropProps={{
        sx: { backgroundColor: 'rgba(14, 15, 19, 0.2)' },
      }}
      PaperProps={{
        sx: {
          width: { xs: 'calc(100vw - 32px)', sm: 600 },
          maxWidth: 'calc(100vw - 32px)',
          m: 0,
          borderRadius: '16px',
          boxShadow: '0 4px 32px rgba(14, 15, 19, 0.1)',
          overflow: 'visible',
        },
      }}
    >
      <DialogContent sx={{ p: 3, overflow: 'visible', '&:last-child': { pb: 3 } }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
          <Box>
            <Typography
              id="profile-item-title"
              component="h2"
              sx={{ color: 'text.primary', fontSize: 24, fontWeight: 700, lineHeight: '28px' }}
            >
              {t('profileItem.modal.title')}
            </Typography>
            <Typography
              id="profile-item-subtitle"
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1, lineHeight: '24px' }}
            >
              {t('profileItem.modal.subtitle')}
            </Typography>
          </Box>
          <IconButton
            aria-label={t('profileItem.modal.closeAriaLabel')}
            onClick={onClose}
            disabled={loading}
            size="small"
            sx={{ width: 24, height: 24, p: 0, color: 'text.primary' }}
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          role="radiogroup"
          aria-describedby="profile-item-subtitle"
          sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}
        >
          {options.map((option) => (
            <Box
              key={option.roleKey}
              component="label"
              htmlFor={`profile-item-${option.roleKey}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                minHeight: 56,
                cursor: loading ? 'default' : 'pointer',
              }}
            >
              <Box minWidth={0}>
                <Typography
                  variant="body1"
                  sx={{ color: 'text.primary', fontWeight: 700, lineHeight: '24px' }}
                >
                  {option.label}
                </Typography>
                {option.selected && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5, lineHeight: '20px' }}
                  >
                    {t('profileItem.modal.activeCaption')}
                  </Typography>
                )}
              </Box>
              <Radio
                id={`profile-item-${option.roleKey}`}
                name="profile-item-role"
                checked={selectedRole === option.roleKey}
                onChange={() => onSelectedRoleChange(option.roleKey)}
                value={option.roleKey}
                disabled={loading}
                inputProps={{ 'aria-label': option.label }}
                icon={<RadioButtonUncheckedIcon sx={{ fontSize: 24, color: 'text.primary' }} />}
                checkedIcon={<CheckCircleIcon sx={{ fontSize: 24 }} />}
                sx={{ p: 0 }}
              />
            </Box>
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          disabled={loading || !selectedRole}
          onClick={onConfirm}
          sx={{ mt: 4, minHeight: 48, borderRadius: '8px', fontWeight: 700 }}
        >
          {t('profileItem.modal.confirm')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileItemDialog;
