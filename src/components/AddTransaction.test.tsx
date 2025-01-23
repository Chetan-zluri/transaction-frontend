import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddTransaction from './AddTransaction';
import { addTransaction } from '../services/transactionService';

jest.mock('../services/transactionService', () => ({
  addTransaction: jest.fn(),
}));

const onAddMock = jest.fn();
const onCloseMock = jest.fn();

describe('AddTransaction Component', () => {
  beforeEach(() => {
    render(<AddTransaction onAdd={onAddMock} onClose={onCloseMock} />);
  });

  it('should render the component', () => {
    expect(screen.getByText('Add Transaction')).toBeInTheDocument();
  });

  it('should show required field error when fields are empty', async () => {
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('All fields are required')).toBeInTheDocument();
    });
  });

  it('should show amount greater than zero error', async () => {
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Currency'), { target: { value: 'USD' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Amount must be greater than zero')).toBeInTheDocument();
    });
  });

  it('should show currency format error', async () => {
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Currency'), { target: { value: '123' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Currency must be in the correct format')).toBeInTheDocument();
    });
  });

  it('should call addTransaction and show success message', async () => {
    (addTransaction as jest.Mock).mockResolvedValueOnce({});

    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Currency'), { target: { value: 'USD' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(addTransaction).toHaveBeenCalledWith({
        date: '2025-01-01',
        description: 'Test Description',
        amount: 100,
        Currency: 'USD',
      });
      expect(screen.getByText('Transaction added successfully')).toBeInTheDocument();
    });

    // Check if onAddMock and onCloseMock are called after a delay
    await waitFor(() => {
      expect(onAddMock).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

//   it('should show transaction already exists error', async () => {
//     (addTransaction as jest.Mock).mockRejectedValueOnce({
//       response: {
//         data: {
//           message: 'Transaction already exists',
//         },
//       },
//     });

//     fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2025-01-01' } });
//     fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
//     fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
//     fireEvent.change(screen.getByLabelText('Currency'), { target: { value: 'USD' } });

//     fireEvent.click(screen.getByText('Save'));

//     await waitFor(() => {
//       expect(screen.getByText('Transaction already exists')).toBeInTheDocument();
//     });
//   });

  it('should show an error for unknown errors', async () => {
    (addTransaction as jest.Mock).mockRejectedValueOnce(new Error('Unknown error'));

    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Currency'), { target: { value: 'USD' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Unknown error occurred')).toBeInTheDocument();
    });
  });

  it('should call onClose when cancel button is clicked', () => {
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCloseMock).toHaveBeenCalled();
  });
});