import { isOperator, isValidURL, splitURL } from '../commonFunctions';
import { store } from '../../../redux/store';
import { userActions } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('common function test', () => {
  it('isOperator with operator mail -> true', async () => {
    const userOP = {
      email: 'pagopaOperator@pagopa.it',
      name: '',
      uid: '',
      taxCode: '',
      surname: '',
    };
    await store.dispatch(userActions.setLoggedUser(userOP));

    expect(isOperator()).toBe(true);
  });

  it('isOperator with !operator mail -> false', async () => {
    const userNotOP = {
      email: 'aaa@bbb.it',
      name: '',
      uid: '',
      taxCode: '',
      surname: '',
    };
    await store.dispatch(userActions.setLoggedUser(userNotOP));

    expect(isOperator()).toBe(false);
  });
});

describe('common function test', () => {
  test('splits a valid URL correctly', () => {
    const targetURL = 'https://www.example.com:8080/path';

    const result = splitURL(targetURL);

    expect(result).toEqual({
      protocolSplit: 'https:',
      hostSplit: 'www.example.com',
      portSplit: 8080,
      pathSplit: '/path',
    });
  });

  test('returns default values for an invalid URL', () => {
    const invalidURL = 'invalid-url';

    const result = splitURL(invalidURL);

    expect(result).toEqual({
      protocolSplit: '',
      hostSplit: '',
      portSplit: 0,
      pathSplit: '',
    });
  });

  test('valid URL returns true', () => {
    expect(isValidURL('https://www.example.com')).toBe(true);
  });

  test('invalid URL returns false', () => {
    expect(isValidURL('invalid-url')).toBe(false);
  });
});
