import {JwtUser} from '@pagopa/mui-italia';
import {render} from '@testing-library/react';
import CommonHeader from '../CommonHeader';
import * as useUserRole from "../../../hooks/useUserRole";
import {ROLE} from "../../../model/RolePermission";

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

jest.mock('../../../pages/components/commonFunctions.ts');
jest.mock("../../../hooks/useUserRole");


describe('<CommonHeader />', () => {
    const mockedUser: JwtUser = {
        id: '0',
        name: 'loggedName',
        surname: 'loggedSurname',
        email: 'loggedEmail@aa.aa',
    };

    test('render CommonHeader component', () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PSP_ADMIN,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: false,
            userIsAdmin: false
        });
        render(<CommonHeader withSecondHeader={true} loggedUser={mockedUser}/>);
    });

    test('render CommonHeader component withSecondHeader false', () => {
        jest.spyOn(useUserRole, 'useUserRole').mockReturnValue({
            userRole: ROLE.PSP_ADMIN,
            userIsPspAdmin: false,
            userIsEcAdmin: false,
            userIsPspDirectAdmin: false,
            userIsPagopaOperator: false,
            userIsAdmin: true
        });
        render(<CommonHeader withSecondHeader={false} loggedUser={mockedUser}/>);
    });
});
