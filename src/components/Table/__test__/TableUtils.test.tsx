import { render, screen } from '@testing-library/react';
import { GridColumnHeaderParams } from '@mui/x-data-grid';
import { renderCell, renderStatusChip, showCustomHeader } from '../TableUtils';

describe('Table utils components', () => {
  test('Render showCustomHeader', () => {
    const customHeader: GridColumnHeaderParams = {
      field: 'stationCode',
      colDef: {
        computedWidth: 0,
        field: 'stationCode',
        type: '',
        hasBeenResized: undefined,
        groupPath: undefined,
        headerName: 'stationCode',
      },
    };
    render(<>{showCustomHeader(customHeader)}</>);
  });

  test('Render renderCell', () => {
    const cellParam = {
      value: 'value',
    };
    render(<>{renderCell(cellParam)}</>);

    const renderedCell = screen.getByTestId('render-cell');
    expect(renderedCell).toHaveStyle('font-weight: 16px');
  });

  test('Render renderCell as main cell', () => {
    const cellParam = {
      value: 'value',
      mainCell: true,
    };
    render(<>{renderCell(cellParam)}</>);

    const renderedCell = screen.getByTestId('render-cell');
    expect(renderedCell).toHaveStyle('font-weight: 700');
    expect(renderedCell).toHaveStyle('color: rgb(25, 118, 210)');
  });

  test('Render renderCell with custom color', () => {
    const cellParam = {
      value: 'value',
      color: '#c62943',
    };
    render(<>{renderCell(cellParam)}</>);

    const renderedCell = screen.getByTestId('render-cell');
    expect(renderedCell).toHaveStyle('font-weight: 16px');
    expect(renderedCell).toHaveStyle('color: #c62943');
  });

  test('Render renderCell as main cell with custom color', () => {
    const cellParam = {
      value: 'value',
      mainCell: true,
      color: '#c62943',
    };
    render(<>{renderCell(cellParam)}</>);

    const renderedCell = screen.getByTestId('render-cell');
    expect(renderedCell).toHaveStyle('font-weight: 700');
    expect(renderedCell).toHaveStyle('color: #c62943');
  });

  test('Render renderStatusChip', () => {
    render(
      <>
        {renderStatusChip({
          chipLabel: 'chipLabel',
          chipColor: 'success',
        })}
      </>
    );
  });
});
