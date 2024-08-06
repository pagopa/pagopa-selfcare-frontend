import { Alert } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function SuccessAlertLayout({ children }: { children: React.ReactNode }) {
  const history = useHistory();

  const [alert, setAlert] = useState<string | undefined>(
    history.location.state && (history.location.state as any).alertSuccessMessage
  );

  return (
    <>
      {alert && (
        <div style={{ position: 'fixed', bottom: 25, right: 25, zIndex: 999, maxWidth: '300px' }}>
          <Alert
            severity="success"
            variant="outlined"
            data-testid="alert-test"
            onClose={() => setAlert(undefined)}
          >
            {alert}
          </Alert>
        </div>
      )}
      {children}
    </>
  );
}
