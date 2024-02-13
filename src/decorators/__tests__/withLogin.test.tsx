// import { render, waitFor } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';
// import { User } from '@pagopa/selfcare-common-frontend/model/User';
// import { createStore } from '../../redux/store';
// import withLogin from '../withLogin';
// import { testToken } from '../../utils/constants';
// import React from 'react';
//
// const oldWindowLocation = global.window.location;
// const mockedLocation = {
//   assign: jest.fn(),
//   pathname: '',
//   origin: 'MOCKED_ORIGIN',
//   search: '',
//   hash: '',
// };
//
// beforeAll(() => {
//   Object.defineProperty(window, 'location', { value: mockedLocation });
// });
// afterAll(() => {
//   Object.defineProperty(window, 'location', { value: oldWindowLocation });
// });
//
// // clean storage after each test
// afterEach(() => {
//   storageUserOps.delete();
//   mockedLocation.assign.mockReset();
// });
//
// const renderApp = () => {
//   const store = createStore();
//   const Component = () => <></>;
//   const DecoratedComponent = withLogin(Component);
//   render(
//     <Provider store={store}>
//       <DecoratedComponent />
//     </Provider>
//   );
//   return store;
// };
//
// const mockUser = (): User => {
//   const user: User = {
//     uid: '5096e4c6-25a1-45d5-9bdf-2fb974a7c1c8',
//     name: 'Anselmo',
//     surname: 'Sartori',
//     email: 'furiovitale@martino.it',
//     // @ts-ignore
//     taxCode: undefined,
//   };
//
//   storageUserOps.write(user);
//   storageTokenOps.write(testToken);
//
//   return user;
// };
//
// test('Test no auth session', async () => {
//   renderApp();
//   await waitFor(() => expect(global.window.location.assign).toBeCalledWith('/auth/login'));
// });
//
// test('Test auth session', async () => {
//   const user = mockUser();
//   const store = renderApp();
//   await waitFor(() => {
//     expect(global.window.location.assign).not.toBeCalled();
//     expect(store.getState().user.logged).toMatchObject(user);
//   });
// });
