import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../redux/store";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import { theme } from "@pagopa/mui-italia";
import { ConsentEnum, ServiceIdEnum } from "../../../../api/generated/portal/ServiceConsentInfo";
import { partiesActions } from "../../../../redux/slices/partiesSlice";
import { ecAdminSignedDirect } from "../../../../services/__mocks__/partyService";
import i18n, { configureI18n } from "@pagopa/selfcare-common-frontend/locale/locale-utils";
import ita from '../../../../locale/it.json';
import ServiceSettingsCard, { ServiceInfo } from "../ServiceSettingsCard";
beforeAll(() => {
    configureI18n({ i18n, ita });

});

afterEach(() => {
    cleanup();
});

const saveServiceConsentSpy = jest.spyOn(require('../../../../services/institutionService'), 'saveServiceConsent');
const rtpServiceStartingDate = jest.spyOn(require('../ServiceSettingsCard'), 'rtpServiceStartingTimestamp');
const checkElementToBeVisibleWithText = async (dataTestId: string, elementContent: string) => {
    const element = await screen.findByTestId(dataTestId);
    expect(element).toBeVisible();
    expect(element.textContent).toBe(elementContent);
}

describe('Service setting page card rendering', () => {
    // parametri
    // consent
    it.each([
        [ConsentEnum.OPT_IN, true],
        [ConsentEnum.OPT_OUT, false]
    ])('should render service card and dialog correctly accordingly to user expressed consent %s', async (consent: ConsentEnum, serviceEnabled: boolean) => {
        // pre-conditions
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        const serviceInfo: ServiceInfo = {
            serviceId: ServiceIdEnum.RTP,
            consent: consent,
            consentDate: new Date()
        }
        rtpServiceStartingDate.mockReturnValue(0);
        // render page
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/ui/settings"]}>
                    <ThemeProvider theme={theme}>
                        <ServiceSettingsCard
                            serviceId={serviceInfo.serviceId}
                            consent={serviceInfo.consent}
                            consentDate={serviceInfo.consentDate}
                        />
                    </ThemeProvider>
                </MemoryRouter>
            </Provider>
        )
        // assertions
        // check for status chip, title and subtitle, buttons... to be rendered (common components for both enabled and disabled service)
        await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-card-title`, `serviceConsent.${serviceInfo.serviceId}.title`);
        await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-card-subtitle`, `serviceConsent.${serviceInfo.serviceId}.description`);
        await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-more-info-link`, `serviceConsent.${serviceInfo.serviceId}.moreInfo`);

        // check for buttons to be rendered (specific for both enabled/disabled service)
        if (serviceEnabled) {
            await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-disableButton`, `serviceConsent.${serviceInfo.serviceId}.disableButtonText`);
            await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-statusChip`, `serviceConsent.${serviceInfo.serviceId}.moreInfo`);
        } else {
            await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-enableButton`, `serviceConsent.${serviceInfo.serviceId}.enableButtonText`);
            await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-statusChip`, `serviceConsent.${serviceInfo.serviceId}.moreInfo`);
        }
    });


});