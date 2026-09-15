import useLoading from "@pagopa/selfcare-common-frontend/hooks/useLoading";
import {getFlags} from "../services/featureFlagService";
import {useAppSelector} from "../redux/hooks";
import {LOADING_FEATURE_FLAGS,} from "../utils/constants";
import {FeatureFlags} from "../api/generated/portal/FeatureFlags";
import {featureFlagsSelectors} from "../redux/slices/featureFlagsSlice";

export const useFeatureFlags = (): (() => Promise<FeatureFlags>) => {
    const setLoadingDetails = useLoading(LOADING_FEATURE_FLAGS);

    return () => {
        setLoadingDetails(true);

        return getFlags()
            .finally(() => {
                setLoadingDetails(false);
            })
            .catch((e) => {
                throw e;
            });
    };
};

export const useFlagValue = (name: string): boolean => {
    const featureFlags = useAppSelector(featureFlagsSelectors.selectFeatureFlags);
    return featureFlags ? featureFlags[name] : false;
};
