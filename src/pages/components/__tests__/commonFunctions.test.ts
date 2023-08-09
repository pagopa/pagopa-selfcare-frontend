import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { store } from '../../../redux/store';
import { extractStringAndNumber, isOperator, isValidURL, splitURL } from '../commonFunctions';

describe('common function test', () => {
  test('returns true if user is an operator', () => {
    expect(isOperator()).toBe(true);
  });

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

  test('extracts string and number correctly', () => {
    const input = "'example.com' 8080";

    const result = extractStringAndNumber(input);

    expect(result).toEqual({ host: 'example.com', port: 8080 });
  });

  test('returns null for invalid input', () => {
    const invalidInput = 'invalid-input';

    const result = extractStringAndNumber(invalidInput);

    expect(result).toBeNull();
  });
});
function mockUser() {
  throw new Error('Function not implemented.');
}
