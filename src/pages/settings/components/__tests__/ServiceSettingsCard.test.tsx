import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../redux/store";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import { theme } from "@pagopa/mui-italia";
import { ConsentEnum, ServiceIdEnum } from "../../../../api/generated/portal/ServiceConsentInfo";
import { partiesActions } from "../../../../redux/slices/partiesSlice";
import { ecAdminSignedDirect, ecOperatorSignedDirect } from "../../../../services/__mocks__/partyService";
import i18n, { configureI18n } from "@pagopa/selfcare-common-frontend/locale/locale-utils";
import ita from '../../../../locale/it.json';
import ServiceSettingsCard, { ChipStatus, rtpServiceChipStatusConf, ServiceInfo, UserFeedback } from "../ServiceSettingsCard";
import { getSaveConsentResponseMock } from "../../../../services/__mocks__/institutionsService";
import { act } from 'react-dom/test-utils';

beforeAll(() => {
    configureI18n({ i18n, ita });

});

afterEach(() => {
    cleanup();
});

const saveServiceConsentSpy = jest.spyOn(require('../../../../services/institutionService'), 'saveServiceConsent');
const rtpServiceStartingDate = jest.spyOn(require('../../utils'), 'rtpServiceStartingTimestamp');
const onAdminPermissionNeededUserFeedbackSpy = jest.spyOn(UserFeedback, "onAdminPermissionNeeded");
const onErrorUserFeedbackSpy = jest.spyOn(UserFeedback, "onError");
const onSuccessUserFeedback = jest.spyOn(UserFeedback, "onSuccess");

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
        const consentDate = new Date();
        // set consent date to yesterday so that it's evalued as consolidated
        consentDate.setHours(-24, 0, 0, 0);
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        const serviceInfo: ServiceInfo = {
            serviceId: ServiceIdEnum.RTP,
            consent: consent,
            consentDate: consentDate
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

        await act(async () => {
            // check for status chip, title and subtitle, buttons... to be rendered (common components for both enabled and disabled service)
            await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-card-title`, `serviceConsent.${serviceInfo.serviceId}.title`);
            await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-card-subtitle`, `serviceConsent.${serviceInfo.serviceId}.description`);
            await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-more-info-link`, `serviceConsent.${serviceInfo.serviceId}.moreInfo`);
            let serviceActionButton;
            // check for buttons to be rendered (specific for both enabled/disabled service)
            if (serviceEnabled) {
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-disableButton`, `serviceConsent.${serviceInfo.serviceId}.disableButtonText`);
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-statusChip`, `serviceConsent.${serviceInfo.serviceId}.statuses.enabled`);
                serviceActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-disableButton`);
            } else {
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-enableButton`, `serviceConsent.${serviceInfo.serviceId}.enableButtonText`);
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-statusChip`, "");
                serviceActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-enableButton`);
            }
            // click on service action button and perform checks on opened modal
            fireEvent.click(serviceActionButton);

            // checks for specific for enabled/disabled service
            if (serviceEnabled) {
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-dialog-title`, `serviceConsent.${serviceInfo.serviceId}.popups.disableService.title`);
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-dialog-message`, `serviceConsent.${serviceInfo.serviceId}.popups.disableService.message`);
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-dialog-disableButton`, `serviceConsent.${serviceInfo.serviceId}.popups.disableService.confirmButton`);
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-dialog-cancelButton`, `serviceConsent.${serviceInfo.serviceId}.popups.disableService.cancelButton`);
            } else {
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-dialog-title`, `serviceConsent.${serviceInfo.serviceId}.popups.enableService.title`);
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-dialog-message`, `serviceConsent.${serviceInfo.serviceId}.popups.enableService.message`);
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-dialog-enableButton`, `serviceConsent.${serviceInfo.serviceId}.popups.enableService.confirmButton`);
                await checkElementToBeVisibleWithText(`settingCard-${serviceInfo.serviceId}-dialog-cancelButton`, `serviceConsent.${serviceInfo.serviceId}.popups.enableService.cancelButton`);
            }
        });
    });

    it.each([
        [ConsentEnum.OPT_IN, true],
        [ConsentEnum.OPT_OUT, false]
    ])('should perform save consent action accordingly to user action for service with consent %s', async (consent: ConsentEnum, serviceEnabled: boolean) => {
        // pre-conditions
        const consentDate = new Date();
        // set consent date to yesterday so that it's evalued as consolidated
        consentDate.setHours(-24, 0, 0, 0);
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        const serviceInfo: ServiceInfo = {
            serviceId: ServiceIdEnum.RTP,
            consent: consent,
            consentDate: consentDate
        }
        rtpServiceStartingDate.mockReturnValue(0);
        saveServiceConsentSpy.mockReturnValue(getSaveConsentResponseMock(consent));
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
        let expectedConsentSentInSaveAction;
        if (serviceEnabled) {
            expectedConsentSentInSaveAction = ConsentEnum.OPT_OUT;
        } else {
            expectedConsentSentInSaveAction = ConsentEnum.OPT_IN;
        }
        await act(async () => {
            let serviceActionButton;
            // search for service enable/disable button
            if (serviceEnabled) {
                serviceActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-disableButton`);
            } else {
                serviceActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-enableButton`);
            }
            // click on service action button and perform checks on opened modal
            fireEvent.click(serviceActionButton);
            const cancelModalButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-dialog-cancelButton`);
            // click on cancel button
            fireEvent.click(cancelModalButton);
            // and check that no api call is performed 
            expect(saveServiceConsentSpy).toHaveBeenCalledTimes(0);
            // re-open modal
            fireEvent.click(serviceActionButton);

            let serviceModalActionButton;

            // search for modal service enable/disable button
            if (serviceEnabled) {
                serviceModalActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-dialog-disableButton`);
                expectedConsentSentInSaveAction = ConsentEnum.OPT_OUT;
            } else {
                serviceModalActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-dialog-enableButton`);
                expectedConsentSentInSaveAction = ConsentEnum.OPT_IN;
            }
            // click on action button
            fireEvent.click(serviceModalActionButton);
        });
        // and check that this time api call is performed with expected request body
        expect(onSuccessUserFeedback).toHaveBeenCalledTimes(1);
        expect(onErrorUserFeedbackSpy).toHaveBeenCalledTimes(0);
        expect(onAdminPermissionNeededUserFeedbackSpy).toHaveBeenCalledTimes(0);
        expect(saveServiceConsentSpy).toHaveBeenCalledTimes(1);
        expect(saveServiceConsentSpy).toHaveBeenNthCalledWith(1, ecAdminSignedDirect.partyId, serviceInfo.serviceId, expectedConsentSentInSaveAction);
    });

    it.each([
        [ConsentEnum.OPT_IN, true],
        [ConsentEnum.OPT_OUT, false]
    ])('should handle error saving consent for service with consent %s', async (consent: ConsentEnum, serviceEnabled: boolean) => {
        // pre-conditions
        const consentDate = new Date();
        // set consent date to yesterday so that it's evalued as consolidated
        consentDate.setHours(-24, 0, 0, 0);
        store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
        const serviceInfo: ServiceInfo = {
            serviceId: ServiceIdEnum.RTP,
            consent: consent,
            consentDate: consentDate
        }
        rtpServiceStartingDate.mockReturnValue(0);
        saveServiceConsentSpy.mockReturnValue(Promise.reject(new Error("communication error")));
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
        );
        let expectedConsentSentInSaveAction;
        // assertions
        if (serviceEnabled) {
            expectedConsentSentInSaveAction = ConsentEnum.OPT_OUT;
        } else {
            expectedConsentSentInSaveAction = ConsentEnum.OPT_IN;
        }
        await act(async () => {
            let serviceActionButton;
            // search for service enable/disable button
            if (serviceEnabled) {
                serviceActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-disableButton`);
            } else {
                serviceActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-enableButton`);
            }
            // click on service action button and perform checks on opened modal
            fireEvent.click(serviceActionButton);
            const cancelModalButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-dialog-cancelButton`);
            // click on cancel button
            fireEvent.click(cancelModalButton);

            // and check that no api call is performed 
            expect(saveServiceConsentSpy).toHaveBeenCalledTimes(0);
            // re-open modal
            fireEvent.click(serviceActionButton);

            let serviceModalActionButton;

            // search for modal service enable/disable button
            if (serviceEnabled) {
                serviceModalActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-dialog-disableButton`);
            } else {
                serviceModalActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-dialog-enableButton`);
            }
            // click on action button
            fireEvent.click(serviceModalActionButton);

        });
        // and check that this time api call is performed with expected request body
        expect(saveServiceConsentSpy).toHaveBeenCalledTimes(1);
        expect(saveServiceConsentSpy).toHaveBeenNthCalledWith(1, ecAdminSignedDirect.partyId, serviceInfo.serviceId, expectedConsentSentInSaveAction);
        expect(onSuccessUserFeedback).toHaveBeenCalledTimes(0);
        expect(onErrorUserFeedbackSpy).toHaveBeenCalledTimes(1);
        expect(onAdminPermissionNeededUserFeedbackSpy).toHaveBeenCalledTimes(0);
    });


    type StatusChipTestData = {
        serviceActivationDate: Date,
        consent: ConsentEnum,
        consentDate: Date,
        serviceId: ServiceIdEnum,
        currentSystemTime: Date,
        expectedChipStatus: ChipStatus

    };

    it.each([
        {
            serviceActivationDate: new Date("2026-03-01"),
            consent: ConsentEnum.OPT_IN,
            consentDate: new Date("2026-02-02"),
            serviceId: ServiceIdEnum.RTP,
            currentSystemTime: new Date("2026-02-02"),
            expectedChipStatus: ChipStatus.ENABLING
        },
        {
            serviceActivationDate: new Date("2026-03-01"),
            consent: ConsentEnum.OPT_IN,
            consentDate: new Date("2026-02-01"),
            serviceId: ServiceIdEnum.RTP,
            currentSystemTime: new Date("2026-02-02"),
            expectedChipStatus: ChipStatus.ENABLED_FROM
        },
        {
            serviceActivationDate: new Date("2026-02-01"),
            consent: ConsentEnum.OPT_IN,
            consentDate: new Date("2026-02-01"),
            serviceId: ServiceIdEnum.RTP,
            currentSystemTime: new Date("2026-02-02"),
            expectedChipStatus: ChipStatus.ENABLED
        },
        {
            serviceActivationDate: new Date("2026-03-01"),
            consent: ConsentEnum.OPT_OUT,
            consentDate: new Date("2026-02-02"),
            serviceId: ServiceIdEnum.RTP,
            currentSystemTime: new Date("2026-02-02"),
            expectedChipStatus: ChipStatus.DISABLING
        },
        {
            serviceActivationDate: new Date("2026-03-01"),
            consent: ConsentEnum.OPT_OUT,
            consentDate: new Date("2026-02-01"),
            serviceId: ServiceIdEnum.RTP,
            currentSystemTime: new Date("2026-02-02"),
            expectedChipStatus: ChipStatus.DISABLED
        }
    ])('should calculate status chip correctly based on service consent status - %s', async (testData: StatusChipTestData) => {
        // pre-conditions
        jest.useFakeTimers().setSystemTime(testData.currentSystemTime);
        try {
            store.dispatch(partiesActions.setPartySelected(ecAdminSignedDirect));
            const serviceInfo: ServiceInfo = {
                serviceId: testData.serviceId,
                consent: testData.consent,
                consentDate: testData.consentDate
            }
            rtpServiceStartingDate.mockReturnValue(testData.serviceActivationDate);
            saveServiceConsentSpy.mockReturnValue(getSaveConsentResponseMock(testData.consent));
            // render page
            render(
                <Provider store={store}>
                    <MemoryRouter initialEntries={["/ui/settings"]}>
                        <ThemeProvider theme={theme}>
                            <ServiceSettingsCard
                                {...serviceInfo}
                            />
                        </ThemeProvider>
                    </MemoryRouter>
                </Provider>
            )
            // assertions
            const chipStatus = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-statusChip`);
            if (testData.expectedChipStatus === ChipStatus.DISABLED) {
                expect(chipStatus).toBeVisible();
                expect(chipStatus.textContent).toBe(""); // div with empty text
            } else {
                expect(chipStatus).toBeVisible();
                expect(chipStatus.textContent).toBe(rtpServiceChipStatusConf[testData.expectedChipStatus]?.label);
            }
        } finally {
            jest.useRealTimers();
        }
    });


    it.each([
        [ConsentEnum.OPT_IN, true],
        [ConsentEnum.OPT_OUT, false]
    ])('should show admin user needed to perform operation for non admin user with consent %s', async (consent: ConsentEnum, serviceEnabled: boolean) => {
        // pre-conditions
        const consentDate = new Date();
        // set consent date to yesterday so that it's evalued as consolidated
        consentDate.setHours(-24, 0, 0, 0);
        store.dispatch(partiesActions.setPartySelected(ecOperatorSignedDirect));
        const serviceInfo: ServiceInfo = {
            serviceId: ServiceIdEnum.RTP,
            consent: consent,
            consentDate: consentDate
        }
        rtpServiceStartingDate.mockReturnValue(0);
        saveServiceConsentSpy.mockReturnValue(getSaveConsentResponseMock(consent));
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

        await act(async () => {
            let serviceActionButton;
            // search for service enable/disable button
            if (serviceEnabled) {
                serviceActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-disableButton`);
            } else {
                serviceActionButton = await screen.findByTestId(`settingCard-${serviceInfo.serviceId}-enableButton`);
            }
            // check that service enable/disable button is visible and enabled
            expect(serviceActionButton).toBeVisible();
            expect(serviceActionButton).toBeEnabled();
            // click on service action button and perform checks on opened modal
            fireEvent.click(serviceActionButton);
        });
        expect(onSuccessUserFeedback).toHaveBeenCalledTimes(0);
        expect(onErrorUserFeedbackSpy).toHaveBeenCalledTimes(0);
        expect(onAdminPermissionNeededUserFeedbackSpy).toHaveBeenCalledTimes(1);
    });
});  