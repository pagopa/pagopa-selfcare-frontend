import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';
import { ThemeProvider } from '@mui/system';
import routes from '../../../routes';
import ApiKeysCard from '../ApiKeysCard';
import { getInstitutionApiKeys } from '../../../services/__mocks__/apiKeyService';
import { ProductKeys } from '../../../model/ApiKey';

//SNAPSHOT TESTING
it('renders correctly', () => {
  getInstitutionApiKeys('').then((data) => {
    const tree = render(<ApiKeysCard apiKey={data[0]} />);
    expect(tree).toMatchSnapshot();
  });
});
