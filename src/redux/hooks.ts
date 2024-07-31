import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppSelectorWithRedirect = ({
  selector,
  routeToRedirect,
  conditionToRedirect,
  callback,
}: {
  selector: (state: RootState) => any;
  routeToRedirect?: string;
  conditionToRedirect?: (value: any) => boolean;
  callback?: (state: any) => any;
}) => {
  const selectedReduxState = useAppSelector(selector);
  const history = useHistory();
  const conditionResults = conditionToRedirect ? conditionToRedirect(selectedReduxState) : false;
  if (
    routeToRedirect &&
    (!selectedReduxState ||
      (typeof selectedReduxState === 'object' && Object.keys(selectedReduxState).length === 0) ||
      conditionResults)
  ) {
    history.push(routeToRedirect);
  }
  if (callback) {
    callback(selectedReduxState);
  }
  return selectedReduxState;
};
