import {configureStore} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {appStateReducer} from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import {userReducer} from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import {LOG_REDUX_ACTIONS} from '../utils/constants';
import {partiesReducer} from './slices/partiesSlice';
import {featureFlagsReducer} from './slices/featureFlagsSlice';
import {bundlesReducer} from './slices/bundlesSlice';
import {paymentsReducer} from './slices/paymentsSlice';
import { stationsReducer } from './slices/stationsSlice';
import { brokersReducer } from './slices/brokersSlide';

const additionalMiddlewares = [LOG_REDUX_ACTIONS ? logger : undefined];

export const createStore = () =>
    configureStore({
        reducer: {
            parties: partiesReducer,
            user: userReducer,
            appState: appStateReducer,
            featureFlags: featureFlagsReducer,
            bundles: bundlesReducer,
            payments: paymentsReducer,
            stations: stationsReducer,
            brokers: brokersReducer,
        },
        middleware: (getDefaultMiddleware) =>
            additionalMiddlewares.reduce(
                (array, middleware) => (middleware ? array.concat(middleware) : array),
                getDefaultMiddleware({serializableCheck: false})
            ),
    });

export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
