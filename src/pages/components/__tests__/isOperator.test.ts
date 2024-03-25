import {isOperator} from '../commonFunctions';
import {store} from '../../../redux/store';
import {userActions} from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

jest.mock('../commonFunctions.ts');

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

        (isOperator as jest.Mock).mockReturnValue(true);
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

        (isOperator as jest.Mock).mockReturnValue(false);
        expect(isOperator()).toBe(false);
    });
});
