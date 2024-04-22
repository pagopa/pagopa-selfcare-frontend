import {JwtUser} from '@pagopa/mui-italia';
import {render} from '@testing-library/react';
import CommonHeader from '../CommonHeader';
import {isOperator} from '../../../pages/components/commonFunctions';

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

jest.mock('../../../pages/components/commonFunctions.ts');


describe('<CommonHeader />', () => {
  const mockedUser: JwtUser = {
    id: '0',
    name: 'loggedName',
    surname: 'loggedSurname',
    email: 'loggedEmail@aa.aa',
  };

  test('render CommonHeader component', () => {
    (isOperator as jest.Mock).mockReturnValue(false);
    render(<CommonHeader withSecondHeader={true} loggedUser={mockedUser} />);
  });

  test('render CommonHeader component withSecondHeader false', () => {
    (isOperator as jest.Mock).mockReturnValue(false);
    render(<CommonHeader withSecondHeader={false} loggedUser={mockedUser} />);
  });
});
