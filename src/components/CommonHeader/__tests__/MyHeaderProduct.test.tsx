import React from 'react';
import MyHeaderProduct from '../MyHeaderProduct';
import {Provider} from 'react-redux';
import { render } from '@testing-library/react';
import { store } from '../../../redux/store';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('<MyHeaderProduct />', () => {
  test('render MyHeaderProduct component', () => {
    render(  <Provider store={store}><MyHeaderProduct productsList={[]} /></Provider>);
  });
});
