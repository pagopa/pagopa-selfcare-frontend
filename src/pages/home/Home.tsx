import { useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Stack, ToggleButton } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Home = () => {
  const [selected, setSelected] = useState(false);

  return (
    <Box width="100%" px={2}>
      <TitleBox
        title="HOME"
        subTitle=""
        mbTitle={0}
        mtTitle={4}
        mbSubTitle={6}
        variantTitle="h4"
        variantSubTitle="body1"
      />

      <br />
      <Card variant="outlined">
        <CardHeader
          disableTypography={true}
          title={
            <>
              Ente <strong>Intesa San Paolo</strong>
            </>
          }
        ></CardHeader>
        <CardContent sx={{ bgcolor: '#edf1f5' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box>Chiave primaria: XXXXXXXXXXXXXXXXXXX</Box>
            <ToggleButton
              value="check"
              selected={selected}
              onChange={() => {
                setSelected(!selected);
              }}
            >
              <VisibilityIcon />
            </ToggleButton>
            <Button variant="outlined">Rigenera</Button>
            <Button variant="contained">Usa questa chiave</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home;
