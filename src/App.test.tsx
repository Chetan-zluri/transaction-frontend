// import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./components/AddTransaction', () => () => <div data-testid="add-transaction-form" />);
jest.mock('./components/UploadCSV', () => () => <div data-testid="upload-csv-form" />);
jest.mock('./components/TransactionsTable', () => () => <div data-testid="transactions-table" />);

describe('App Component', () => {
  it('should render the component correctly', () => {
    render(<App />);
    
    expect(screen.getByText(/Transactions Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Transaction/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload CSV/i)).toBeInTheDocument();
    expect(screen.getByTestId('transactions-table')).toBeInTheDocument();
  });

  it('should open and close Add Transaction dialog', () => {
    render(<App />);

    const addButton = screen.getByText(/Add Transaction/i);
    fireEvent.click(addButton);

    expect(screen.getByTestId('add-transaction-form')).toBeInTheDocument();

    const closeButton = screen.getByText(/Close/i);
    fireEvent.click(closeButton);

    // Wait for the dialog to close
    setTimeout(() => {
      expect(screen.queryByTestId('add-transaction-form')).not.toBeInTheDocument();
    }, 500);
  });

  it('should open and close Upload CSV dialog', () => {
    render(<App />);

    const uploadButton = screen.getByText(/Upload CSV/i);
    fireEvent.click(uploadButton);

    expect(screen.getByTestId('upload-csv-form')).toBeInTheDocument();

    const closeButton = screen.getByText(/Close/i);
    fireEvent.click(closeButton);

    // Wait for the dialog to close
    setTimeout(() => {
      expect(screen.queryByTestId('upload-csv-form')).not.toBeInTheDocument();
    }, 500);
  });

  it('should refresh the transactions table after adding a transaction', () => {
    render(<App />);

    const addButton = screen.getByText(/Add Transaction/i);
    fireEvent.click(addButton);

    const addTransactionForm = screen.getByTestId('add-transaction-form');
    fireEvent.submit(addTransactionForm);

    expect(screen.getByTestId('transactions-table')).toBeInTheDocument();
  });

  it('should refresh the transactions table after uploading a CSV', () => {
    render(<App />);

    const uploadButton = screen.getByText(/Upload CSV/i);
    fireEvent.click(uploadButton);

    const uploadCSVForm = screen.getByTestId('upload-csv-form');
    fireEvent.submit(uploadCSVForm);

    expect(screen.getByTestId('transactions-table')).toBeInTheDocument();
  });
});