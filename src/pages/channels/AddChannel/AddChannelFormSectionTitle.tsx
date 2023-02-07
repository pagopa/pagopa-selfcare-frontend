import { Stack, Typography } from '@mui/material';

type Props = {
  icon: JSX.Element;
  title: string;
  isRequired?: boolean;
};

function AddChannelFormSectionTitle({ icon, title, isRequired = false }: Props) {
  return (
    <Stack sx={{ alignItems: 'center', flexDirection: 'row' }}>
      {icon}
      <Typography ml={'10px'} lineHeight={1.3} fontWeight={600}>
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

export default AddChannelFormSectionTitle;
