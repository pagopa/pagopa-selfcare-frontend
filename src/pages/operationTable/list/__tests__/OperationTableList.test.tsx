import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {Provider} from 'react-redux';
<<<<<<< HEAD
import {MemoryRouter, Route, Router} from 'react-router-dom';
import {createStore, store} from '../../../../redux/store';
import {createMemoryHistory} from 'history';
import OperationTableList from '../OperationTableList';
import ROUTES from '../../../../routes';
=======
import {Router} from 'react-router-dom';
import {createStore} from '../../../../redux/store';
import {createMemoryHistory} from 'history';
import OperationTableList from '../OperationTableList';
>>>>>>> 3f32cfc3 (Formatting (#542))
import {operationTableList} from '../../../../services/__mocks__/operationTable';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
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
                    <OperationTableList
                        loading={false}
                        operationTableList={operationTableList}
                        error={false}
                    />
                </Provider>
            </Router>
        </ThemeProvider>
    );
    return {store, history};
};

describe('OperationTableList', () => {
    test('Test render OperationTableList', async () => {
        const {history} = renderApp();
    });

    test('Test render OperationTableList and click on detail button', async () => {
        const {history} = renderApp();

        await waitFor(() => expect(screen.getByText(new RegExp('AAA s.r.l', 'i'))).toBeInTheDocument());
        const detailBtn = screen.getByTestId('open-012345678910');

        await waitFor(() => fireEvent.click(detailBtn));
        await waitFor(() => expect(history.location.pathname).toBe('/ui/operation-table/012345678910'));
    });
});
