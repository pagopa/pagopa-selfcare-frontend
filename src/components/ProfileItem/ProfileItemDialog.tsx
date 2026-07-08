import CloseIcon from '@mui/icons-material/Close';
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
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: 720,
          borderRadius: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
          <Box>
            <Typography id="profile-item-title" variant="h6" fontWeight={700}>
              {t('profileItem.modal.title')}
            </Typography>
            <Typography
              id="profile-item-subtitle"
              variant="body2"
              color="text.secondary"
              mt={0.5}
            >
              {t('profileItem.modal.subtitle')}
            </Typography>
          </Box>
          <IconButton
            aria-label={t('profileItem.modal.closeAriaLabel')}
            onClick={onClose}
            disabled={loading}
            size="small"
            sx={{ color: 'text.primary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, mt: 2 }}>
          <Box
            component="legend"
            sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}
          >
            {t('profileItem.modal.subtitle')}
          </Box>
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
                py: 1.5,
                cursor: loading ? 'default' : 'pointer',
              }}
            >
              <Box minWidth={0}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {option.label}
                </Typography>
                {option.selected && (
                  <Typography variant="caption" color="text.secondary">
                    {t('profileItem.modal.activeCaption')}
                  </Typography>
                )}
              </Box>
              <Radio
                id={`profile-item-${option.roleKey}`}
                checked={selectedRole === option.roleKey}
                onChange={() => onSelectedRoleChange(option.roleKey)}
                value={option.roleKey}
                disabled={loading}
                inputProps={{ 'aria-label': option.label }}
              />
            </Box>
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          disabled={loading || !selectedRole}
          onClick={onConfirm}
          sx={{ mt: 2, borderRadius: 1 }}
        >
          {t('profileItem.modal.confirm')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileItemDialog;
