import { Box, Paper } from '@mui/material';
import { TitleBox } from '@pagopa/selfcare-common-frontend';

const Home = () => (
  <Box width="100%" px={2}>
    <TitleBox
      title="HOME"
      subTitle="subtitle"
      mbTitle={0}
      mtTitle={4}
      mbSubTitle={6}
      variantTitle="h4"
      variantSubTitle="body1"
    />
    <Paper sx={{ padding: '16px' }}>Some content</Paper>
  </Box>
);

export default Home;
