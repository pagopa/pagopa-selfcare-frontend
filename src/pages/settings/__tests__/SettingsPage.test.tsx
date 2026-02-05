import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../redux/store";
import { MemoryRouter } from "react-router-dom";
import {  ThemeProvider } from "@mui/system";
import { theme } from "@pagopa/mui-italia";
import SettingsPage from '../SettingsPage';
import { ConsentEnum } from "../../../api/generated/portal/ServiceConsentInfo";
import { getServicesConsentsResponseMock } from "../../../services/__mocks__/institutionsService";
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


afterEach(cleanup);

describe('SettingPageLoading', () => {
    it('should render page with one service in active state', async () => {
    // Dispatch prima del render
    store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
    
    process.env.SETTINGS_SERVICES_SANP_URL = "test";
    const consent = ConsentEnum.OPT_IN;
    const consentDate = new Date();
    getServiceConsentMock.mockResolvedValue(getServicesConsentsResponseMock(consent, consentDate));

    render(
        <Provider store={store}>
            <MemoryRouter initialEntries={["/ui/settings"]}>
                <ThemeProvider theme={theme}>
                    <SettingsPage />
                </ThemeProvider>
            </MemoryRouter>
        </Provider>
    );

    // DEBUG: vedi cosa sta renderizzando effettivamente in quel millisecondo
    screen.debug(); 

    // USA FIND invece di GET per gestire l'asincronia del mock
    const title = await screen.findByText(/Impostazioni/i);
    expect(title).toBeInTheDocument();

    const taxonomyAlert = await screen.findByTestId("settingsPage.taxonomyAlert");
    expect(taxonomyAlert).toBeVisible();
});


});