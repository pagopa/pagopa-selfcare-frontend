// import isEmpty from 'lodash/isEmpty';
import {useDispatch} from 'react-redux';
import {CONFIG} from '@pagopa/selfcare-common-frontend/config/env';
import {User} from '@pagopa/selfcare-common-frontend/model/User';
import {useHistory} from 'react-router-dom';
import {userActions} from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import {storageTokenOps, storageUserOps} from '@pagopa/selfcare-common-frontend/utils/storage';
import {parseJwt} from '../utils/jwt-utils';
import {JWTUser} from '../model/JwtUser';
import {fetchPagoPAToken} from '../services/tokenExchangeService';

const mockedUser = {
    uid: '0',
    taxCode: '11111111111',
    name: 'loggedName',
    surname: 'loggedSurname',
    email: 'loggedEmail@aa.aa',
};

export const userFromJwtToken: (token: string) => User = function (token: string) {
    const jwtUser: JWTUser = parseJwt(token);
    return {
        uid: jwtUser.uid,
        taxCode: jwtUser.fiscal_number,
        name: jwtUser.name,
        surname: jwtUser.family_name,
        email: jwtUser.email,
    };
};

/** A custom hook used to obtain a function to check if there is a valid JWT token, loading into redux the logged user object */
export const useLogin = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const setUser = (user: User) => dispatch(userActions.setLoggedUser(user));

    const couldSetTokenFromSelfCareIdentityToken = async (identity_token: string) => {
        // Use Self Care identity token to obtain a PagoPA session token
        const resp = await fetchPagoPAToken(identity_token);

        // If there is an error in fetching the token, go back to login page
        if (resp.status !== 200) {
            return false;
        }

        // Set Selfcare session token
        const responseBody = await resp.text();
        const sessionToken = responseBody.toString();
        storageTokenOps.write(sessionToken ?? '');

        return true;
    };

    const attemptSilentLogin = async () => {
        // 1. Check if there is a mock token: only used for dev purposes
        if (CONFIG.MOCKS.MOCK_USER && process.env.REACT_APP_API_MOCK_TOKEN === 'true') {
            setUser(mockedUser);
            storageTokenOps.write(CONFIG.TEST.JWT);
            storageUserOps.write(mockedUser);
            return;
        }

        // used for testing. During integration test we inject the JWT in the localStorage
        const logged = window.location.hash.search('#logged=forced');
        if (logged === -1) {

            // 2. Check if we are coming from Self Care and have a new token
            const newSelfCareIdentityToken = window.location.hash.replace('#id=', '');
            if (newSelfCareIdentityToken) {
                // Remove token from hash
                const {pathname, search} = history.location;
                history.replace({pathname, search, hash: ''});

                await couldSetTokenFromSelfCareIdentityToken(newSelfCareIdentityToken);

            }

            const token = storageTokenOps.read();
            const jwt = JSON.parse(atob(token.split('.')[1]));

            // If there are no credentials, it is impossible to get the user, so
            if (!token || (jwt.exp * 1000) < Date.now()) {
                // Remove any partial data that might have remained, just for safety
                storageUserOps.delete();
                // Go to the login view
                window.location.assign(CONFIG.URL_FE.LOGIN);
                // This return is necessary
                return;
            }

            const user: User = userFromJwtToken(token);
            storageUserOps.write(user);
            setUser(user);
        }
    };

    return {attemptSilentLogin};
};
