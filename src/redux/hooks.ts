import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppSelectorWithRedirect = (
  selector: (state: RootState) => any,
  routeToRedirect?: string
) => {
  const selectedReduxState = useAppSelector(selector);
  const history = useHistory();
  if (
    routeToRedirect &&
    (!selectedReduxState ||
      (typeof selectedReduxState === 'object' && Object.keys(selectedReduxState).length === 0))
  ) {
    history.push(routeToRedirect);
  }
  return selectedReduxState;
};
