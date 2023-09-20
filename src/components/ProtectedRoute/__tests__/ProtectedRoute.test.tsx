import React from 'react';
import { queryAllByText, queryByText, render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import * as usePermissions from '../../../hooks/usePermissions';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('ProtectedRoute component', () => {
  jest.mock('../../../hooks/usePermissions');

  test('should render children when user has permission', () => {
    // Mock the usePermissions hook to return true for the specified permission
    jest
      .spyOn(usePermissions, 'usePermissions')
      .mockReturnValue({ hasPermission: (permissionName) => true });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/some-route']}>
        <ProtectedRoute permission="node-signin">
          <div>Child Component</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    const childComponent = getByText('Child Component');
    expect(childComponent).toBeInTheDocument();
  });
  test("should not render children when user hasn't permission", () => {
    // Mock the usePermissions hook to return true for the specified permission
    jest
      .spyOn(usePermissions, 'usePermissions')
      .mockReturnValue({ hasPermission: (permissionName) => false });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/some-route']}>
        <ProtectedRoute permission="node-signin">
          <div>Child Component</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    const childComponent = screen.queryByText('Child Component');
    expect(childComponent).toBeNull();
  });
});
