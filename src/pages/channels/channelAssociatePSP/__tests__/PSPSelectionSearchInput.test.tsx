import React from 'react';
import {render} from '@testing-library/react';
import PSPSelectionSearchInput from '../PSPSelectionSearchInput';


describe('<PSPSelectionSearchInput />', () => {
    test('render component PSPSelectionSearchInput', async () => {
        render(<PSPSelectionSearchInput onChange={() => ''} input={''}/>);
    });
});
