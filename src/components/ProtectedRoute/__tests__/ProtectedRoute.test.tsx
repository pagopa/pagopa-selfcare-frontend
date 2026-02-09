import React from 'react';
import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router-dom';
import {ProtectedRoute} from '../ProtectedRoute';
import * as usePermissions from '../../../hooks/usePermissions';
import * as useFlagValue from '../../../hooks/useFeatureFlags';
import {store} from '../../../redux/store';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

describe('ProtectedRoute component', () => {
    jest.mock('../../../hooks/usePermissions');

    test('should render children when user has permission', () => {
        jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
            userHasPermission: (_) => true,
        });
        jest.spyOn(useFlagValue, 'useFlagValue').mockReturnValue(true);

        const {getByText} = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/some-route']}>
                    <ProtectedRoute permission="node-signin">
                        <div>Child Component</div>
                    </ProtectedRoute>
                </MemoryRouter>
            </Provider>
        );

        const childComponent = getByText('Child Component');
        expect(childComponent).toBeInTheDocument();
    });
    test("should not render children when user hasn't permission", () => {
        jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
            userHasPermission: (permissionName) => false,
        });
        jest.spyOn(useFlagValue, 'useFlagValue').mockReturnValue(true);

        const {getByText} = render(
            <Provider store={store}>
            <MemoryRouter initialEntries={['/some-route']}>
                <ProtectedRoute permission="node-signin">
                    <div>Child Component</div>
                </ProtectedRoute>
            </MemoryRouter>
            </Provider>
        );

        const childComponent = screen.queryByText('Child Component');
        expect(childComponent).toBeNull();
    });

    test("should not render children when feature flag false", () => {
        jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
            userHasPermission: (permissionName) => true,
        });
        jest.spyOn(useFlagValue, 'useFlagValue').mockReturnValue(false);

        const {getByText} = render(
            <Provider store={store}>
            <MemoryRouter initialEntries={['/some-route']}>
                <ProtectedRoute permission="node-signin" flagValue={"node-signin"}>
                    <div>Child Component</div>
                </ProtectedRoute>
            </MemoryRouter>
            </Provider>
        );

        const childComponent = screen.queryByText('Child Component');
        expect(childComponent).toBeNull();
    });
    
    test("should not render children when org check fails", () => {
        jest.spyOn(usePermissions, 'usePermissions').mockReturnValue({
            userHasPermission: (_) => true,
        });
        jest.spyOn(useFlagValue, 'useFlagValue').mockReturnValue(true);

        render(
            <Provider store={store}>
            <MemoryRouter initialEntries={['/some-route']}>
                <ProtectedRoute permission="node-signin" flagValue={"node-signin"} orgCheckCondition={(_)=>false}>
                    <div>Child Component</div>
                </ProtectedRoute>
            </MemoryRouter>
            </Provider>
        );

        const childComponent = screen.queryByText('Child Component');
        expect(childComponent).toBeNull();
    });
});
