import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import { theme } from "@pagopa/mui-italia";
import SettingsPage from '../SettingsPage';
import { ConsentEnum, ServiceIdEnum } from "../../../api/generated/portal/ServiceConsentInfo";
import { partiesActions } from "../../../redux/slices/partiesSlice";
import { ecAdminSignedDirect } from "../../../services/__mocks__/partyService";
import i18n, { configureI18n } from "@pagopa/selfcare-common-frontend/locale/locale-utils";
import ita from '../../../locale/it.json';

const getServiceConsentMock = jest.spyOn(require('../../../services/institutionService'), 'getServiceConsents');

beforeAll(() => {
    configureI18n({ i18n, ita });

});

afterEach(() => {
    cleanup();
});


describe('Services settings page rendering', () => {
    it('should render page with multiple services', async () => {
        // pre-conditions
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        const consent = ConsentEnum.OPT_IN;
        const consentDate = new Date();
        const mockedServicesResponse = {
            services: [{
                consent: consent,
                consentDate: consentDate,
                serviceId: ServiceIdEnum.RTP,
            },
            {
                consent: consent,
                consentDate: consentDate,
                serviceId: "service2" as ServiceIdEnum,
            }],
        };
        const mockedServiceConsentList = Promise.resolve(mockedServicesResponse);
        getServiceConsentMock.mockResolvedValue(mockedServiceConsentList);
        // render page
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/ui/settings"]}>
                    <ThemeProvider theme={theme}>
                        <SettingsPage />
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>
        )
        // assertions
        // check for title box and alert to be rendered on the page
        const titleBox = await screen.findByTestId("settingsPage.title");
        expect(titleBox).toBeVisible();
        expect(titleBox.textContent).toBe("settingsPage.titlesettingsPage.subtitle");
        const taxonomyAlert = await screen.findByTestId("settingsPage.taxonomyAlertTitle");
        expect(taxonomyAlert).toBeVisible();
        expect(taxonomyAlert.textContent).toBe("settingsPage.warningAlerts.rtp.taxonomyAlertTitle");
        // check that each service in the list is rendered
        for (const service of mockedServicesResponse.services) {
            const card = await screen.findByTestId(`settingCard-${service.serviceId}-card`);
            expect(card).toBeVisible();
        }
        // expect get services consent to have been called 1 time with correct institution id
        expect(getServiceConsentMock).toHaveBeenCalledTimes(1);
        expect(getServiceConsentMock).toHaveBeenNthCalledWith(1, ecAdminSignedDirect.partyId);
    });

    it('should handle undefined party selected', async () => {
        // pre-conditions
        store.dispatch(partiesActions.setPartySelected(undefined));
        // render page
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/ui/settings"]}>
                    <ThemeProvider theme={theme}>
                        <SettingsPage />
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>
        )
        // assertions
        // check for title box and alert to be rendered on the page
        const titleBox = await screen.findByTestId("settingsPage.title");
        expect(titleBox).toBeVisible();
        expect(titleBox.textContent).toBe("settingsPage.titlesettingsPage.subtitle");
        const taxonomyAlert = await screen.findByTestId("settingsPage.taxonomyAlertTitle");
        expect(taxonomyAlert).toBeVisible();
        expect(taxonomyAlert.textContent).toBe("settingsPage.warningAlerts.rtp.taxonomyAlertTitle");
        // expect get services consent to have not being called
        expect(getServiceConsentMock).toHaveBeenCalledTimes(0);
        const emptyListErrorMessage = await screen.findByTestId("settingsPage.emptyListError");
        expect(emptyListErrorMessage).toBeVisible();
    });

    it('should handle error retrieving services consents list', async () => {
        // pre-conditions
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        const error = new Error("test error");
        const mockedServiceConsentList = Promise.reject(error);
        getServiceConsentMock.mockResolvedValue(mockedServiceConsentList);
        // render page
        render(
            <Provider store={store}> 
                <MemoryRouter initialEntries={["/ui/settings"]}>
                    <ThemeProvider theme={theme}>
                        <SettingsPage />
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>
        )
        // assertions
        // check for title box and alert to be rendered on the page
        const titleBox = await screen.findByTestId("settingsPage.title");
        expect(titleBox).toBeVisible();
        expect(titleBox.textContent).toBe("settingsPage.titlesettingsPage.subtitle");
        const taxonomyAlert = await screen.findByTestId("settingsPage.taxonomyAlertTitle");
        expect(taxonomyAlert).toBeVisible();
        expect(taxonomyAlert.textContent).toBe("settingsPage.warningAlerts.rtp.taxonomyAlertTitle");
        // expect get services consent to have been called 1 time with correct institution id
        expect(getServiceConsentMock).toHaveBeenCalledTimes(1);
        expect(getServiceConsentMock).toHaveBeenNthCalledWith(1, ecAdminSignedDirect.partyId);
    });

});