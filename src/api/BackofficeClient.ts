import {ReactNode} from 'react';
import {storageTokenOps} from '@pagopa/selfcare-common-frontend/utils/storage';
import {appStateActions} from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import {buildFetchApi, extractResponse} from '@pagopa/selfcare-common-frontend/utils/api-utils';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import {store} from '../redux/store';
import {ENV} from '../utils/env';
import {ProductKeys} from '../model/ApiKey';
import {NodeOnSignInPSP} from '../model/Node';
import {PSPDirectDTO} from '../model/PSP';
import {StationOnCreation} from '../model/Station';
import {ChannelsResource} from './generated/portal/ChannelsResource';
import {createClient, WithDefaultsT} from './generated/portal/client';
import {PspChannelsResource} from './generated/portal/PspChannelsResource';
import {ChannelDetailsResource} from './generated/portal/ChannelDetailsResource';
import {PspChannelPaymentTypes} from './generated/portal/PspChannelPaymentTypes';
import {StationsResource} from './generated/portal/StationsResource';
import {PspChannelPaymentTypesResource} from './generated/portal/PspChannelPaymentTypesResource';
import {StationCodeResource} from './generated/portal/StationCodeResource';
import {CreditorInstitutionStationDto} from './generated/portal/CreditorInstitutionStationDto';
import {StationDetailResource} from './generated/portal/StationDetailResource';
import {InstitutionDetail} from './generated/portal/InstitutionDetail';
import {Institution} from './generated/portal/Institution';
import {CreditorInstitutionStationEditResource} from './generated/portal/CreditorInstitutionStationEditResource';
import {ChannelCodeResource} from './generated/portal/ChannelCodeResource';
import {ChannelPspListResource} from './generated/portal/ChannelPspListResource';
import {CreditorInstitutionDto} from './generated/portal/CreditorInstitutionDto';
import {CreditorInstitutionDetailsResource} from './generated/portal/CreditorInstitutionDetailsResource';
import {WrapperStationsResource} from './generated/portal/WrapperStationsResource';
import {CreditorInstitutionsResource} from './generated/portal/CreditorInstitutionsResource';
import {WrapperStationDetailsDto} from './generated/portal/WrapperStationDetailsDto';
import {StationDetailsDto, StatusEnum} from './generated/portal/StationDetailsDto';
import {WrapperEntitiesOperations} from './generated/portal/WrapperEntitiesOperations';
import {ChannelDetailsDto, Payment_modelEnum, ProtocolEnum,} from './generated/portal/ChannelDetailsDto';
import {UpdateCreditorInstitutionDto} from './generated/portal/UpdateCreditorInstitutionDto';
import {Redirect_protocolEnum, WrapperChannelDetailsDto,} from './generated/portal/WrapperChannelDetailsDto';
import {WfespPluginConfs} from './generated/portal/WfespPluginConfs';
import {WrapperChannelsResource} from './generated/portal/WrapperChannelsResource';
import {WrapperChannelDetailsResource} from './generated/portal/WrapperChannelDetailsResource';
import {CreditorInstitutionAssociatedCodeList} from './generated/portal/CreditorInstitutionAssociatedCodeList';
import {BrokerOrPspDetailsResource} from './generated/portal/BrokerOrPspDetailsResource';
import {BrokerAndEcDetailsResource} from './generated/portal/BrokerAndEcDetailsResource';
import {BrokerPspDetailsResource} from './generated/portal/BrokerPspDetailsResource';
import {BrokerDto} from './generated/portal/BrokerDto';
import {BrokerPspDetailsDto} from './generated/portal/BrokerPspDetailsDto';
import {BrokerResource} from './generated/portal/BrokerResource';
import {PaymentServiceProviderDetailsResource} from './generated/portal/PaymentServiceProviderDetailsResource';
import {PaymentServiceProvidersResource} from './generated/portal/PaymentServiceProvidersResource';
import {TavoloOpDto} from './generated/portal/TavoloOpDto';
import {TavoloOpOperations} from './generated/portal/TavoloOpOperations';
import {TavoloOpResource} from './generated/portal/TavoloOpResource';
import {TavoloOpResourceList} from './generated/portal/TavoloOpResourceList';
import {Iban} from './generated/portal/Iban';
import {Ibans} from './generated/portal/Ibans';
import {IbanCreate} from './generated/portal/IbanCreate';
import {Product} from "./generated/portal/Product";
import {PaymentType} from "./generated/portal/PaymentType";
import { Delegation } from './generated/portal/Delegation';

const withBearer: WithDefaultsT<'JWT'> = (wrappedOperation) => (params: any) => {
    const token = storageTokenOps.read();
    return wrappedOperation({
        ...params,
        JWT: `Bearer ${token}`,
    });
};

export const backofficeClient = createClient({
    baseUrl: ENV.URL_API.BACKOFFICE,
    basePath: '',
    fetchApi: buildFetchApi(ENV.API_TIMEOUT_MS.BACKOFFICE) as any,
    withDefaults: withBearer,
});

const onRedirectToLogin = () =>
    store.dispatch(
        appStateActions.addError({
            id: 'tokenNotValid',
            error: new Error(),
            techDescription: 'token expired or not valid',
            toNotify: false,
            blocking: false,
            displayableTitle: i18n.t('session.expired.title'),
            displayableDescription: i18n.t('session.expired.message') as ReactNode,
        })
    );

const channelBody = (channel: ChannelDetailsDto) => ({
    agid: false,
    broker_description: channel.broker_description,
    broker_psp_code: channel.broker_psp_code,
    card_chart: false,
    channel_code: channel.channel_code,
    digital_stamp_brand: channel.digital_stamp_brand,
    enabled: true,
    flag_io: channel.flag_io,
    flagPspCp: false,
    ip: channel.ip,
    new_password: '',
    nmp_service: channel.nmp_service,
    on_us: false,
    password: channel.password,
    payment_model: Payment_modelEnum.IMMEDIATE,
    payment_types: channel.payment_types,
    port: channel.port,
    primitive_version: channel.primitive_version,
    protocol: ProtocolEnum.HTTPS,
    proxy_host: channel.proxy_host,
    proxy_port: channel.proxy_port,
    proxy_enabled: channel.proxy_enabled,
    recovery: false,
    redirect_protocol: Redirect_protocolEnum.HTTPS,
    redirect_port: undefined,
    redirect_ip: '',
    redirect_path: '',
    redirect_query_string: '',
    rt_push: false,
    serv_plugin: undefined,
    service: channel.service,
    status: StatusEnum.TO_CHECK_UPDATE,
    target_host: channel.target_host,
    target_path: channel.target_path,
    target_port: channel.target_port,
    thread_number: 1,
    timeout_a: channel.timeout_a,
    timeout_b: channel.timeout_b,
    timeout_c: channel.timeout_c,
    validationUrl: ''
});

export const BackofficeApi = {
    getInstitutions: async (): Promise<Array<InstitutionDetail>> => {
        const result = await backofficeClient.getInstitutions({});
        
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getInstitution: async (institutionId: string): Promise<Institution> => {
        const result = await backofficeClient.getInstitution({
            'institution-id': institutionId,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getProducts: async (institutionId: string): Promise<Array<Product>> => {
        const result = await backofficeClient.getInstitutionProducts({'institution-id': institutionId});
        
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getInstitutionApiKeys: async (institutionId: string): Promise<Array<ProductKeys>> => {
        const result = await backofficeClient.getInstitutionApiKeys({'institution-id': institutionId});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    createInstitutionApiKeys: async (
        institutionId: string,
        subscriptionCode: string
    ): Promise<Array<ProductKeys>> => {
        const result = await backofficeClient.createInstitutionApiKeys({
            'institution-id': institutionId,
            'subscription-code': subscriptionCode,
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    regeneratePrimaryKey: async (subscriptionid: string): Promise<string> => {
        const result = await backofficeClient.regeneratePrimaryKey({'subscription-id': subscriptionid});
        return extractResponse(result, 204, onRedirectToLogin);
    },

    regenerateSecondaryKey: async (subscriptionid: string): Promise<string> => {
        const result = await backofficeClient.regenerateSecondaryKey({'subscription-id': subscriptionid});
        return extractResponse(result, 204, onRedirectToLogin);
    },

    getBrokerAndPspDetails: async (code: string): Promise<BrokerOrPspDetailsResource> => {
        const result = await backofficeClient.getBrokerAndPspDetails({'psp-code': code});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getPSPBrokerDetails: async (brokerpspcode: string): Promise<BrokerPspDetailsResource> => {
        const result = await backofficeClient.getBrokerPsp({'broker-code': brokerpspcode});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getPSPDetails: async (pspcode: string): Promise<PaymentServiceProviderDetailsResource> => {
        const result = await backofficeClient.getBrokerAndPspDetails({'psp-code':pspcode});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getPaymentServiceProviders: async (
        page: number,
        name?: string,
        limit?: number,
        pspCode?: string,
        taxCode?: string
    ): Promise<PaymentServiceProvidersResource> => {
        const result = await backofficeClient.getPaymentServiceProviders({
            page,
            name,
            limit,
            'psp-code':pspCode,
            'tax-code':taxCode,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getBrokerAndEcDetails: async (code: string): Promise<BrokerAndEcDetailsResource> => {
        const result = await backofficeClient.getBrokerAndEcDetails({'ci-code':code});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    createPSPDirect: async (psp: NodeOnSignInPSP): Promise<PSPDirectDTO> => {
        const result = await backofficeClient.createPSP({
            direct: true,
            body: {
                abi: psp.abiCode,
                agid_psp: false,
                bic: psp.bicCode,
                business_name: psp.businessName,
                enabled: true,
                my_bank_code: '',
                psp_code: psp.pspCode,
                stamp: psp.digitalStamp,
                tax_code: psp.fiscalCode,
                vat_number: psp.fiscalCode,
            },
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    createPspBroker: async (broker: BrokerPspDetailsDto): Promise<BrokerPspDetailsResource> => {
        const result = await backofficeClient.createBroker({
            body: {
                broker_psp_code: broker.broker_psp_code,
                description: broker.description,
                enabled: broker.enabled,
                extended_fault_bean: broker.extended_fault_bean,
            },
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    createPSPIndirect: async (
        psp: NodeOnSignInPSP
    ): Promise<PaymentServiceProviderDetailsResource> => {
        const result = await backofficeClient.createPSP({
            body: {
                abi: psp.abiCode,
                agid_psp: false,
                bic: psp.bicCode,
                business_name: psp.businessName,
                enabled: true,
                my_bank_code: '',
                psp_code: psp.pspCode,
                stamp: psp.digitalStamp,
                tax_code: psp.fiscalCode,
                vat_number: psp.fiscalCode,
            },
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    updatePaymentServiceProvider: async (
        pspcode: string,
        psp: NodeOnSignInPSP
    ): Promise<PaymentServiceProviderDetailsResource> => {
        const result = await backofficeClient.updatePSP({
            'psp-code':pspcode,
            body: {
                business_name: psp.businessName,
                enabled: true,
                psp_code: psp.pspCode,
                agid_psp: false,
                bic: psp.bicCode,
                my_bank_code: '',
                stamp: psp.digitalStamp,
                tax_code: psp.fiscalCode,
                vat_number: psp.fiscalCode,
            },
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getChannels: async (page: number): Promise<ChannelsResource> => {
        const result = await backofficeClient.getChannels({page});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getChannelsMerged: async (
        page: number,
        brokerCode: string,
        channelcodefilter?: string,
        limit?: number,
        sorting?: string
    ): Promise<WrapperChannelsResource> => {
        const result = await backofficeClient.getAllChannelsMerged({
            limit,
            channelcodefilter,
            brokerCode,
            page,
            sorting,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    // retrive of channel detail before on db and then on the node
    getChannelDetail: async (channelcode: string): Promise<ChannelDetailsResource> => {
        const result = await backofficeClient.getChannelDetail({'channel-code':channelcode});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getPSPChannels: async (pspcode: string): Promise<PspChannelsResource> => {
        const result = await backofficeClient.getPspChannels({'psp-code':pspcode});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getChannelPSPs: async (
        channelcode: string,
        page: number,
        limit?: number
    ): Promise<ChannelPspListResource> => {
        // return all PSP associated to the channel
        const result = await backofficeClient.getChannelPaymentServiceProviders({
            page,
            'channel-code':channelcode,
            limit,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getWfespPlugins: async (): Promise<WfespPluginConfs> => {
        const result = await backofficeClient.getWfespPlugins({});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    createChannel: async (channel: ChannelDetailsDto): Promise<WrapperChannelDetailsResource> => {
        const channelBody2Send = channelBody(channel);
        const result = await backofficeClient.createChannel({
            body: {...channelBody2Send, status: StatusEnum.APPROVED},
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    createWrapperChannelDetails: async (
        channel: WrapperChannelDetailsDto,
        validationUrl: string
    ): Promise<WrapperEntitiesOperations> => {
        const result = await backofficeClient.createWrapperChannelDetails({
            body: {
                broker_psp_code: channel.broker_psp_code,
                broker_description: channel.broker_description,
                channel_code: channel.channel_code,
                redirect_protocol: Redirect_protocolEnum.HTTPS,
                redirect_port: undefined,
                redirect_ip: '',
                redirect_path: '',
                redirect_query_string: '',
                target_host: channel.target_host,
                target_path: channel.target_path,
                target_port: channel.target_port,
                payment_types: channel.payment_types,
                validationUrl,
                status: StatusEnum.TO_CHECK,
            },
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    updateChannel: async (
        code: string,
        channel: ChannelDetailsDto
    ): Promise<ChannelDetailsResource> => {
        const channelBody2Send = channelBody(channel);
        const result = await backofficeClient.updateChannel({
            'channel-code': code,
            body: {...channelBody2Send, status: StatusEnum.APPROVED},
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    updateWrapperChannelDetailsToCheck: async (
        channel: ChannelDetailsDto,
        validationUrl: string
    ): Promise<WrapperEntitiesOperations> => {
        const channelBody2Send = channelBody(channel);
        const result = await backofficeClient.updateWrapperChannelDetails({
            body: {
                ...channelBody2Send,
                status: StatusEnum.APPROVED,
                validationUrl,
            },
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    updateWrapperChannelDetailsToCheckUpdate: async (
        channel: ChannelDetailsDto,
        validationUrl: string
    ): Promise<WrapperEntitiesOperations> => {
        const channelBody2Send = channelBody(channel);
        const result = await backofficeClient.updateWrapperChannelDetails({
            body: {
                ...channelBody2Send,
                validationUrl,
            },
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    updateWrapperChannelDetailsByOpt: async (
        channel: ChannelDetailsDto,
        validationUrl: string
    ): Promise<WrapperEntitiesOperations> => {
        const channelBody2Send = channelBody(channel);
        const result = await backofficeClient.updateWrapperChannelDetailsByOpt({
            body: {
                ...channelBody2Send,
                status: StatusEnum.APPROVED,
                validationUrl,
            },
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getPaymentTypes: async (): Promise<PaymentType> => {
        const result = await backofficeClient.getPaymentTypes({});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getChannelCode: async (pspcode: string): Promise<ChannelCodeResource> => {
        const result = await backofficeClient.getFirstValidChannelCode({'psp-code': pspcode});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getDelegatedPSPbyBroker: async (brokerId: string): Promise<Array<Delegation>> => {
        const institutionId = '';
        const result = await backofficeClient.getBrokerDelegation({'institution-id': institutionId, brokerId});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    associatePSPtoChannel: async (
        channelcode: string,
        pspcode: string,
        payment_types: PspChannelPaymentTypes
    ): Promise<PspChannelPaymentTypesResource> => {
        const payment_types_array = payment_types as any;
        const result = await backofficeClient.updatePaymentServiceProvidersChannels({
            'channel-code': channelcode,
            'psp-code': pspcode,
            body: {payment_types: payment_types_array},
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    dissociatePSPfromChannel: async (channelcode: string, pspcode: string): Promise<void> => {
        const result = await backofficeClient.deletePSPChannels({
            'channel-code': channelcode,
            'psp-code': pspcode,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    createStation: async (station: StationOnCreation): Promise<StationDetailResource> => {
        const result = await backofficeClient.createStation({body: {...station,} as any,
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    getStations: async (
        page: number,
        creditorInstitutionCode?: string,
        stationCode?: string,
        limit?: number,
        ordering?: string
    ): Promise<StationsResource> => {
        const result = await backofficeClient.getStations({
            page,
            creditorInstitutionCode,
            stationCode,
            limit,
            ordering,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getStationsMerged: async (
        page: number,
        brokerCode: string,
        stationcodefilter?: string,
        limit?: number,
        sorting?: string
    ): Promise<WrapperStationsResource> => {
        const result = await backofficeClient.getAllStationsMerged({
            limit,
            stationcodefilter,
            brokerCode,
            page,
            sorting,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getStationCode: async (ecCode: string): Promise<StationCodeResource> => {
        const result = await backofficeClient.getStationCode({'ec-code': ecCode});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    associateEcToStation: async (
        ecCode: string,
        station: CreditorInstitutionStationDto
    ): Promise<CreditorInstitutionStationEditResource> => {
        const result = await backofficeClient.associateStationToCreditorInstitution({
            'ci-code': ecCode,
            body: {
                auxDigit: station.auxDigit,
                segregationCode: station.segregationCode,
                stationCode: station.stationCode,
                broadcast: station.broadcast,
            },
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    dissociateECfromStation: async (ecCode: string, stationcode: string): Promise<void> => {
        const result = await backofficeClient.deleteCreditorInstitutionStationRelationship({
            'ci-code' : ecCode,
            'station-code' : stationcode,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getECListByStationCode: async (
        stationcode: string,
        page: number,
        limit?: number
    ): Promise<CreditorInstitutionsResource> => {
        const result = await backofficeClient.getCreditorInstitutionsByStationCode({
            'station-code':stationcode,
            limit,
            page,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    createECAndBroker: async (
        ec: CreditorInstitutionDto
    ): Promise<CreditorInstitutionDetailsResource> => {
        const result = await backofficeClient.createCreditorInstitutionAndBroker({
            'ci-code': '',
            body: {
                brokerDto: {
                    broker_code: ec.creditorInstitutionCode,
                    description: ec.businessName,
                },
                creditorInstitutionDto: {
                    address: ec.address,
                    businessName: ec.businessName,
                    creditorInstitutionCode: ec.creditorInstitutionCode,
                    enabled: ec.enabled,
                    pspPayment: ec.pspPayment,
                    reportingFtp: ec.reportingFtp,
                    reportingZip: ec.reportingZip,
                },
            },
        });

        return extractResponse(result, 201, onRedirectToLogin);
    },

    createEcBroker: async (broker: BrokerDto): Promise<BrokerResource> => {
        const result = await backofficeClient.createBroker({
            body: {
                broker_psp_code: broker.broker_code!,
                description: broker.description!,
                enabled: true,
                extended_fault_bean: false
            },
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    createECIndirect: async (
        ec: CreditorInstitutionDto
    ): Promise<CreditorInstitutionDetailsResource> => {
        const result = await backofficeClient.createCreditorInstitution({
            body: {
                address: ec.address,
                businessName: ec.businessName,
                creditorInstitutionCode: ec.creditorInstitutionCode,
                enabled: ec.enabled,
                pspPayment: ec.pspPayment,
                reportingFtp: ec.reportingFtp,
                reportingZip: ec.reportingZip,
            },
        });

        return extractResponse(result, 201, onRedirectToLogin);
    },

    updateCreditorInstitution: async (
        ecCode: string,
        ec: UpdateCreditorInstitutionDto
    ): Promise<CreditorInstitutionDetailsResource> => {
        const result = await backofficeClient.updateCreditorInstitutionDetails({
            'ci-code':ecCode,
            body: {
                address: ec.address,
                businessName: ec.businessName,
                creditorInstitutionCode: ec.creditorInstitutionCode,
                enabled: ec.enabled,
                pspPayment: ec.pspPayment,
                reportingFtp: ec.reportingFtp,
                reportingZip: ec.reportingZip,
            },
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getWrapperEntities: async (code: string): Promise<WrapperEntitiesOperations> => {
        const result = await backofficeClient.getStation({'station-code': code});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    createWrapperStation: async (
        station: WrapperStationDetailsDto,
    ): Promise<WrapperEntitiesOperations> => {
        const result = await backofficeClient.createWrapperStationDetails({
            body: {
                brokerCode: station.brokerCode,
                broker_description: station.broker_description,
                version: 1,
                enabled: station.enabled,
                stationCode: station.stationCode,
                primitiveVersion: station.primitiveVersion,
                redirectProtocol: station.redirectProtocol,
                redirectPort: station.redirectPort,
                redirectIp: station.redirectIp,
                redirectPath: station.redirectPath,
                redirectQueryString: station.redirectQueryString,
                targetHost: station.targetHost ? station.targetHost : undefined,
                targetPath: station.targetPath ? station.targetPath : undefined,
                targetPort: station.targetPort ? station.targetPort : undefined,
                validationUrl: station.validationUrl
            },
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    updateWrapperStationToCheck: async (
        stationCode: string,
        station: StationDetailsDto,
    ): Promise<WrapperEntitiesOperations> => {
        const result = await backofficeClient.updateWrapperStationDetails({
            'station-code': stationCode,
            body: {
                ...station,
                status: StatusEnum.TO_CHECK
            },
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    updateWrapperStationToCheckUpdate: async (
        stationCode: string,
        station: StationDetailsDto
    ): Promise<WrapperEntitiesOperations> => {
        const result = await backofficeClient.updateWrapperStationDetails({
            'station-code': stationCode,
            body: {
                ...station,
                status: StatusEnum.TO_CHECK_UPDATE,
            },
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    updateWrapperStationByOpt: async (
        station: StationDetailsDto
    ): Promise<WrapperEntitiesOperations> => {
        const result = await backofficeClient.updateWrapperStationDetailsByOpt({
            body: {
                ...station,
                status: StatusEnum.TO_CHECK_UPDATE,
            },
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    updateStation: async (
        station: StationDetailsDto,
        stationcode: string
    ): Promise<StationDetailResource> => {
        const result = await backofficeClient.updateStation({
            body: {
                ...station,
                status: StatusEnum.APPROVED,
            },
            'station-code': stationcode,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getWrapperEntitiesStation: async (code: string): Promise<WrapperEntitiesOperations> => {
        const result = await backofficeClient.getWrapperEntitiesStation_1({'station-code': code});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    // before tries to get the detail from the DB, if it doesn't find anything, will try to get the detail form apim
    getStationDetail: async (stationId: string): Promise<StationDetailResource> => {
        const result = await backofficeClient.getStation({'station-code': stationId});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    // get the detail directly from apim
    getStation: async (stationId: string): Promise<StationDetailResource> => {
        const result = await backofficeClient.getStation({'station-code': stationId});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getCreditorInstitutionIbans: async (
        creditorinstitutioncode: string,
        labelName?: string
    ): Promise<Ibans> => {
        const result = await backofficeClient.getCreditorInstitutionIbans({
            'ci-code': creditorinstitutioncode,
            labelName,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    createIban: async (
        creditorinstitutioncode: string,
        ibanBody: IbanCreate
    ): Promise<Iban> => {
        const result = await backofficeClient.createCreditorInstitutionIbans({
            'ci-code': creditorinstitutioncode,
            body: {
                iban: ibanBody.iban,
                description: ibanBody.description,
                validity_date: ibanBody.validity_date,
                due_date: ibanBody.due_date,
                is_active: ibanBody.is_active,
            },
        });
        return extractResponse(result, 201, onRedirectToLogin);
    },

    updateIban: async (
        creditorinstitutioncode: string,
        ibanBody: IbanCreate
        ): Promise<Iban> => {
        const result = await backofficeClient.updateCreditorInstitutionIbans({
            'ci-code': creditorinstitutioncode,
            'iban-value': ibanBody.iban!,
            body: {
                iban: ibanBody.iban,
                description: ibanBody.description,
                validity_date: ibanBody.validity_date,
                due_date: ibanBody.due_date,
                labels: ibanBody.labels?.length === 0 ? undefined : ibanBody.labels,
                is_active: ibanBody.is_active,
            },
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    deleteIban: async (creditorinstitutioncode: string, ibanValue: string): Promise<void> => {
        const result = await backofficeClient.deleteCreditorInstitutionIbans({
            'ci-code': creditorinstitutioncode,
            'iban-value': ibanValue,
        });
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getCreditorInstitutionSegregationcodes: async (
        ecCode: string
    ): Promise<CreditorInstitutionAssociatedCodeList> => {
        const result = await backofficeClient.getCreditorInstitutionSegregationcodes({'ci-code': ecCode});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getStationAvailableEc: async (
        institutionId: string
    ): Promise<ChannelCodeResource> => {
        const result = await backofficeClient.getFirstValidChannelCode({'psp-code': institutionId});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getOperationTableList: async (): Promise<TavoloOpResourceList> => {
        const result = await backofficeClient.getOperativeTables({});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    createOperationTable: async (operationTableDto: TavoloOpDto): Promise<TavoloOpOperations> => {
        const result = await backofficeClient.insertOperativeTable({body: operationTableDto});
        return extractResponse(result, 201, onRedirectToLogin);
    },

    updateOperationTable: async (ecCode: string, operationTableDto: TavoloOpDto): Promise<TavoloOpOperations> => {
        const result = await backofficeClient.updateOperativeTable({'ci-code': ecCode, body: operationTableDto});
        return extractResponse(result, 200, onRedirectToLogin);
    },

    getOperationTableDetails: async (ecCode: string): Promise<TavoloOpResource> => {
        const result = await backofficeClient.getOperativeTable({'ci-code': ecCode});
        return extractResponse(result, 200, onRedirectToLogin);
    },
};
