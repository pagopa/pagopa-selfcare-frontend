import React from 'react';
import {render} from '@testing-library/react';
import SideMenuLayout from '../SideMenuLayout';
import {Provider} from 'react-redux';
import {store} from '../../../redux/store';
import {MemoryRouter, Route} from 'react-router-dom';

describe('<SideMenuLayout>', () => {
    test('Test render', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <SideMenuLayout>
                        <></>
                    </SideMenuLayout>
                </MemoryRouter>
            </Provider>
        );
    });
});
