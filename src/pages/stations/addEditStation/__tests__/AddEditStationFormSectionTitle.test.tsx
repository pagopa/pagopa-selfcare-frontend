import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {Router} from 'react-router-dom';
import {store} from '../../../../redux/store';
import AddEditStationFormSectionTitle from '../AddEditStationFormSectionTitle';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import {MenuBook} from '@mui/icons-material';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

afterEach(cleanup);

describe('<AddEditStationFormSectionTitle />', () => {
    const history = createMemoryHistory();

    test('render component AddEditStationFormSectionTitle Required', () => {
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Router history={history}>
                        <AddEditStationFormSectionTitle
                            icon={<MenuBook/>}
                            title="Test Title"
                            isRequired={true}
                        />
                    </Router>
                </ThemeProvider>
            </Provider>
        );
    });

    test('render component AddEditStationFormSectionTitle not Required', () => {
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <Router history={history}>
                        <AddEditStationFormSectionTitle
                            icon={<MenuBook/>}
                            title="Test Title"
                            isRequired={false}
                        />
                    </Router>
                </ThemeProvider>
            </Provider>
        );
    });
});
