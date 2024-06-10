import React from 'react';
import {render} from '@testing-library/react';
import AddEditIbanFormSectionTitle from '../components/AddEditIbanFormSectionTitle';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import {store} from '../../../../redux/store';
import {createMemoryHistory} from 'history';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

describe('AddEditIbanFormSectionTitle', (injectedHistory?: ReturnType<
    typeof createMemoryHistory
>) => {
    const history = injectedHistory ? injectedHistory : createMemoryHistory();

    it('Test render AddEditIbanFormSectionTitle no Required', () => {
        render(
            <Provider store={store}>
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <AddEditIbanFormSectionTitle icon={<></>} title={''}/>
                    </ThemeProvider>
                </Router>
            </Provider>
        );
    });

    it('Test render AddEditIbanFormSectionTitle Required', () => {
        render(
            <Provider store={store}>
                <Router history={history}>
                    <ThemeProvider theme={theme}>
                        <AddEditIbanFormSectionTitle icon={<></>} title={''} isRequired={true}/>
                    </ThemeProvider>
                </Router>
            </Provider>
        );
    });
});
