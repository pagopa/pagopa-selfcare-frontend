import {useSelector} from "react-redux";
import {useEffect} from "react";
import {featureFlagsActions, featureFlagsSelectors} from "../redux/slices/featureFlagsSlice";
import {useFeatureFlags} from "../hooks/useFeatureFlags";
import {useAppDispatch} from "../redux/hooks";

// eslint-disable-next-line @typescript-eslint/ban-types
export type WithFeatureFlagsProps = {};

export default function withFeatureFlags<T extends WithFeatureFlagsProps>(
    WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    const ComponentWithFeatureFlags = (props: Omit<T, keyof WithFeatureFlagsProps>) => {
        const dispatch = useAppDispatch();
        const flags = useSelector(featureFlagsSelectors.selectFeatureFlags);
        const featureFlags = useFeatureFlags();

        useEffect(() => {

            if (!flags) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                featureFlags().then(value => {
                    dispatch(featureFlagsActions.setFeatureFlags(value));
                });
            }

        }, []); // eslint-disable-line react-hooks/exhaustive-deps

        return flags ? <WrappedComponent {...(props as T)} /> : <></>;
    };

    // eslint-disable-next-line functional/immutable-data
    ComponentWithFeatureFlags.displayName = `withFeatureFlags(${displayName})`;

    return ComponentWithFeatureFlags;

}

