import {useEffect} from 'react';
import {useAppDispatch} from '../../redux/hooks';
import {partiesActions} from '../../redux/slices/partiesSlice';
import {RootState} from '../../redux/store';
import {mockedPartyProducts} from '../../services/__mocks__/productService';

export const verifyMockExecution = (state: RootState) => {
    expect(state.parties.selectedProducts).toMatchObject(mockedPartyProducts);
};

export default (WrappedComponent: React.ComponentType<any>) => (props: any) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(partiesActions.setPartySelectedProducts(mockedPartyProducts));
    }, []);
    return <WrappedComponent {...props} />;
};
