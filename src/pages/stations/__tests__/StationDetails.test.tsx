import React from 'react';
import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import {store} from '../../../redux/store';
import {createMemoryHistory} from 'history';
import {Provider} from 'react-redux';
import StationDetails from '../detail/components/StationDetails';
import {
  RedirectProtocolEnum,
  StationDetailResource,
  WrapperStatusEnum,
} from '../../../api/generated/portal/StationDetailResource';
import {partiesActions} from '../../../redux/slices/partiesSlice';
import {ecAdminSignedDirect} from '../../../services/__mocks__/partyService';
import {isOperator} from '../../components/commonFunctions';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

jest.mock('../../components/commonFunctions');

afterEach(cleanup);

const nodeCrypto = require('crypto');
window.crypto = {
    getRandomValues: function (buffer) {
        return nodeCrypto.randomFillSync(buffer);
    },
};
const genPassword = crypto.getRandomValues(new Uint32Array(1)).toString();

export const mockedFullStationApproved: StationDetailResource = {
    stationCode: '81001870922_06',
    enabled: true,
    brokerDescription: '',
    version: 1,
    associatedCreditorInstitutions: 0,
    activationDate: new Date('2023-06-07T16:30:26.384Z'),
    createdAt: new Date('2023-06-07T16:30:26.384Z'),
    modifiedAt: new Date('2023-06-07T16:30:26.384Z'),
    redirectIp: '11.22.44',
    redirectPath: 'Stazione/path/redirect/prova',
    redirectPort: 3333,
    redirectQueryString: 'nessuno',
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    brokerCode: '81001870922',
    timeoutA: 7,
    timeoutB: 30,
    timeoutC: 120,
    targetHost: '33.55.66',
    targetPort: 4443,
    targetPath: 'Stazione/path/target/prova',
    primitiveVersion: 1,
    wrapperStatus: WrapperStatusEnum.APPROVED,
    password: genPassword,
};

export const mockedFullStationToCheck: StationDetailResource = {
    stationCode: '81001870922_06',
    enabled: true,
    brokerDescription: '',
    version: 1,
    associatedCreditorInstitutions: 0,
    activationDate: new Date('2023-06-07T16:30:26.384Z'),
    createdAt: new Date('2023-06-07T16:30:26.384Z'),
    modifiedAt: new Date('2023-06-07T16:30:26.384Z'),
    redirectIp: '11.22.44',
    redirectPath: 'Stazione/path/redirect/prova',
    redirectPort: 3333,
    redirectQueryString: 'nessuno',
    redirectProtocol: RedirectProtocolEnum.HTTPS,
    brokerCode: '81001870922',
    timeoutA: 7,
    timeoutB: 30,
    timeoutC: 120,
    targetHost: '33.55.66',
    targetPort: 4443,
    targetPath: 'Stazione/path/target/prova',
    primitiveVersion: 1,
    wrapperStatus: WrapperStatusEnum.TO_CHECK,
};

describe('<StationDetails />', () => {
    const history = createMemoryHistory();

    test('render component StationDetails and exit button test', () => {
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${mockedFullStationToCheck.stationCode}`]}>
                    <Route path="/stations/:stationId">
                        <ThemeProvider theme={theme}>
                            <StationDetails
                                stationDetail={mockedFullStationApproved}
                                // @ts-ignore TODO
                                formatedDate={jest.fn()}
                                goBack={() => jest.fn()}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
        (isOperator as jest.Mock).mockReturnValue(false);
        if (!isOperator()) {
            const backBtn = screen.getByTestId('exit-btn-test');
            fireEvent.click(backBtn);
            expect(history.location.pathname).toBe('/');
        }
    });

    test('Test edit Button with StationDetails in role operator and status approved', async () => {
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${mockedFullStationApproved.stationCode}`]}>
                    <Route path="/stations/:stationId">
                        <ThemeProvider theme={theme}>
                            <StationDetails
                                stationDetail={mockedFullStationApproved}
                                // @ts-ignore TODO
                                formatedDate={jest.fn()}
                                goBack={() => jest.fn()}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
        (isOperator as jest.Mock).mockReturnValue(true);
        if (!isOperator()) {
            const editBtn = await screen.findByTestId('edit-btn-sts-approved');
            fireEvent.click(editBtn);
        }
    });

    test('render component StationDetails', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${mockedFullStationToCheck.stationCode}`]}>
                    <Route path="/stations/:stationId">
                        <ThemeProvider theme={theme}>
                            <StationDetails
                                stationDetail={mockedFullStationToCheck}
                                // @ts-ignore TODO
                                formatedDate={jest.fn()}
                                goBack={() => jest.fn()}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
        (isOperator as jest.Mock).mockReturnValue(false);
        if (!isOperator()) {
            const editBtn = await screen.findByTestId('edit-btn-sts-approved');
            fireEvent.click(editBtn);
        }
    });

    test('render component StationDetails and test ShowHidePassword button', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/stations/${mockedFullStationApproved.stationCode}`]}>
                    <Route path="/stations/:stationId">
                        <ThemeProvider theme={theme}>
                            <StationDetails
                                stationDetail={mockedFullStationApproved}
                                // @ts-ignore TODO
                                formatedDate={jest.fn()}
                                goBack={() => jest.fn()}
                            />
                        </ThemeProvider>
                    </Route>
                </MemoryRouter>
            </Provider>
        );
    });
});
