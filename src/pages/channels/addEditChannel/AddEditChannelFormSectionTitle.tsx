import { Stack, Typography } from '@mui/material';

type Props = {
  icon: JSX.Element;
  title: string;
  isRequired?: boolean;
};

function AddEditChannelFormSectionTitle({ icon, title, isRequired = false }: Props) {
  return (
    <Stack sx={{ alignItems: 'center', flexDirection: 'row' }}>
      {icon}
      <Typography ml={'10px'} lineHeight={1.3} fontWeight={'fontWeightMedium'}>
        {title}
      </Typography>
      {isRequired ? (
        <Typography whiteSpace="pre-wrap" color="red">
          {' *'}
        </Typography>
      ) : (
        ''
      )}
    </Stack>
  );
}

export default AddEditChannelFormSectionTitle;
