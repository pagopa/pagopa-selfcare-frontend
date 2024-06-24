import {ThemeProvider} from '@mui/system';
import {theme} from '@pagopa/mui-italia';
import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from '../../../redux/store';
import {mockedCreditorInstitutionInfoArray} from '../../../services/__mocks__/creditorInstitutionService';
import ECSelection from './../ECSelection';

const spyOnCISelected = jest.fn();

beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
    });
    jest.spyOn(console, 'warn').mockImplementation(() => {
    });
});

describe('<ECSelection />', () => {
    test('render component Autocomplete in ECSelection', async () => {
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <ECSelection
                        availableEC={[...mockedCreditorInstitutionInfoArray.creditor_institution_info_list!]}
                        selectedEC={undefined}
                        onECSelectionChange={spyOnCISelected}
                    />
                </ThemeProvider>
            </Provider>
        );

        const autocomplete = screen.getByTestId('ec-selection-id-test');
        expect(autocomplete).toBeInTheDocument();

        const itemSelected = screen.queryByTestId('selected-ec-item-id-test');
        expect(itemSelected).not.toBeInTheDocument();

        const ecSelectionSearch = autocomplete.querySelector('input') as HTMLInputElement;

<<<<<<< HEAD
    fireEvent.mouseDown(ecSelectionSearch);
    fireEvent.select(ecSelectionSearch, {
      target: {
        value: mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName,
      },
    });
    expect(ecSelectionSearch.value).toBe(
      mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].businessName
    );
  });
=======
        fireEvent.mouseDown(ecSelectionSearch);
        fireEvent.select(ecSelectionSearch, {
            target: {value: mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].business_name},
        });
        expect(ecSelectionSearch.value).toBe(mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0].business_name);
    });
>>>>>>> 3f32cfc3 (Formatting (#542))

    test('render component PartyAccountItem ECSelection', () => {
        render(
            <Provider store={store}>
                <ThemeProvider theme={theme}>
                    <ECSelection
                        availableEC={[...mockedCreditorInstitutionInfoArray.creditor_institution_info_list!]}
                        selectedEC={mockedCreditorInstitutionInfoArray.creditor_institution_info_list![0]}
                        onECSelectionChange={spyOnCISelected}
                    />
                </ThemeProvider>
            </Provider>
        );

        const autocomplete = screen.queryByTestId('ec-selection-id-test');
        expect(autocomplete).not.toBeInTheDocument();

        const itemSelected = screen.getByTestId('selected-ec-item-id-test');
        expect(itemSelected).toBeInTheDocument();

        const removeButton = screen.getByTestId('remove-selected-ec-btn-id-test');
        fireEvent.click(removeButton);

        expect(spyOnCISelected).toHaveBeenCalledWith(undefined);
    });
});
