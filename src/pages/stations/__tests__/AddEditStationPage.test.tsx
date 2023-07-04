import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render} from '@testing-library/react';
import {Router} from 'react-router-dom';
import {store} from '../../../redux/store';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import AddEditStationPage from '../addEditStation/AddEditStationPage';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(cleanup);

describe('<AddEditChannelPage />', () => {
  const history = createMemoryHistory();

  test('render component AddEditChannelPage', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Router history={history}>
            <AddEditStationPage />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  });
});
