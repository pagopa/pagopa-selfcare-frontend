import { getIbanList as getIbanListMocked } from './__mocks__/ibanService';

export const getIbanList = (istitutionId: string): Promise<any> => getIbanListMocked(istitutionId);
/* istanbul ignore if */
/* if (process.env.REACT_APP_API_MOCK_PORTAL === 'true') {
    return getIbanListMocked(psp);
  } else {
    return PortalApi.getIbanList(psp).then((resources) => resources);
  }
}; */
