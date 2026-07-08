import '@mui/material/Button';
import '@mui/material/Typography';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    naked: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    sidenav: true;
  }
}
