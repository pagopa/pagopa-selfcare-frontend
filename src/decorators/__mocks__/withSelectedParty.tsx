import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { RootState } from '../../redux/store';
import { pspOperatorSignedDirect } from '../../services/__mocks__/partyService';

export const verifyMockExecution = (state: RootState) => {
  expect(state.parties.selected).toMatchObject(pspOperatorSignedDirect);
};

export default (WrappedComponent: React.ComponentType<any>) => (props: any) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(partiesActions.setPartySelected(pspOperatorSignedDirect));
  }, []);
  return <WrappedComponent {...props} />;
};
