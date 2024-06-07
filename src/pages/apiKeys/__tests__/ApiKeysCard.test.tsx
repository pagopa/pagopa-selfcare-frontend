import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {render} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../redux/store';
import routes from '../../../routes';
import {mockedKeys} from '../../../services/__mocks__/apiKeyService';
import ApiKeysCard from '../ApiKeysCard';

describe('<ApiKeysCard />', () => {
    test('render component ApiKeysCard', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[routes.APIKEYS]}>
                    <Route path={routes.APIKEYS}>
                        <ThemeProvider theme={theme}>
                            <ApiKeysCard apiKey={mockedKeys.institution_api_key_list![0]}/>
                        </ThemeProvider>{' '}
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });
});
