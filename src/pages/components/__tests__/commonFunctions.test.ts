import {isValidURL, splitURL} from '../commonFunctions';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
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
