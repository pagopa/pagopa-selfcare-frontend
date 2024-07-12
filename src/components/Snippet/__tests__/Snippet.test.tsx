import {render} from '@testing-library/react';
import React from 'react';
import Snippet from '../Snippet';
import tosJson from '../../../data/tos.json';
import { rewriteLinks } from '../../../utils/onetrust-utils';
import routes from '../../../routes';

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

describe('<Snippet />', () => {
    test('render component Snippet', () => {
        render(<Snippet 
            html={tosJson.html}
            waitForElementCondition={'.otnotice-content'} 
            waitForElementFunction={() => {
                rewriteLinks(routes.TOS, '.otnotice-content a');}}
        />);
    });
});
