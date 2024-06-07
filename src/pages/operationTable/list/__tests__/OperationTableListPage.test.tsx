import React from 'react';
import {render} from '@testing-library/react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import {createStore} from '../../../../redux/store';
import {createMemoryHistory} from 'history';
import OperationTableListPage from '../OperationTableListPage';

let getOperationTableListMocked;

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
    getOperationTableListMocked = jest.spyOn(
        require('../../../../services/operationTable'),
        'getOperationTableList'
    );
});
const renderApp = (
    injectedHistory?: ReturnType<typeof createMemoryHistory>,
    injectedStore?: ReturnType<typeof createStore>
) => {
    const store = injectedStore ? injectedStore : createStore();
    const history = injectedHistory ? injectedHistory : createMemoryHistory();
    render(
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <Provider store={store}>
                    <OperationTableListPage/>
                </Provider>
            </Router>
        </ThemeProvider>
    );
    return {store, history};
};

describe('OperationTableListPage', () => {
    test('Test render OperationTableListPage', async () => {
        const {history} = renderApp();
    });

    test('Test render OperationTableList error', async () => {
        getOperationTableListMocked.mockRejectedValueOnce(new Error('Fetch error'));
        const {history} = renderApp();
    });
});
