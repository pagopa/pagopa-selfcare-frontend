import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import PSPSelectionSearchItemContainer from '../PSPSelectionSearchItemContainer';

describe('<PSPSelectionSearchItemContainer />', () => {
    test('render component PSPSelectionSearchItemContainer', async () => {
        render(
            <PSPSelectionSearchItemContainer title={undefined} subTitle={undefined} image={undefined}/>
        );
    });

    test('render component PSPSelectionSearchItemContainer with disabled prop', () => {
        render(
            <PSPSelectionSearchItemContainer
                title={'PSP Test'}
                subTitle={'Già associato'}
                image={undefined}
                disabled={true}
            />
        );
        const container = screen.getByTestId('PartyItemContainer: PSP Test');
        expect(container).toBeInTheDocument();
        expect(container).toHaveStyle({opacity: '0.5', pointerEvents: 'none'});
    });

    test('render component PSPSelectionSearchItemContainer enabled does not have disabled styles', () => {
        const mockAction = jest.fn();
        render(
            <PSPSelectionSearchItemContainer
                title={'PSP Enabled'}
                subTitle={''}
                image={undefined}
                disabled={false}
                action={mockAction}
            />
        );
        const container = screen.getByTestId('PartyItemContainer: PSP Enabled');
        expect(container).toBeInTheDocument();
        expect(container).not.toHaveStyle({opacity: '0.5'});
    });

    test('disabled PSPSelectionSearchItemContainer does not trigger action on keydown', () => {
        const mockAction = jest.fn();
        render(
            <PSPSelectionSearchItemContainer
                title={'PSP Disabled'}
                subTitle={'Già associato'}
                image={undefined}
                disabled={true}
                action={mockAction}
            />
        );
        const container = screen.getByTestId('PartyItemContainer: PSP Disabled');
        fireEvent.keyDown(container, {key: 'Enter'});
        expect(mockAction).not.toHaveBeenCalled();
    });

    test('enabled PSPSelectionSearchItemContainer triggers action on keydown Enter', () => {
        const mockAction = jest.fn();
        render(
            <PSPSelectionSearchItemContainer
                title={'PSP Active'}
                subTitle={''}
                image={undefined}
                disabled={false}
                action={mockAction}
            />
        );
        const container = screen.getByTestId('PartyItemContainer: PSP Active');
        fireEvent.keyDown(container, {key: 'Enter'});
        expect(mockAction).toHaveBeenCalled();
    });

    test('default disabled is false when not provided', () => {
        const mockAction = jest.fn();
        render(
            <PSPSelectionSearchItemContainer
                title={'PSP Default'}
                subTitle={''}
                image={undefined}
                action={mockAction}
            />
        );
        const container = screen.getByTestId('PartyItemContainer: PSP Default');
        expect(container).not.toHaveStyle({opacity: '0.5', pointerEvents: 'none'});
    });
});
