import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastContainer } from 'react-toastify';
import UploadCSV from './UploadCSV';
import { uploadCSV } from '../services/transactionService';
import { validateFile } from '../utils/validations';

jest.mock('../services/transactionService');
jest.mock('../utils/validations');

// Mock window.URL.createObjectURL
global.URL.createObjectURL = jest.fn();

describe('UploadCSV Component', () => {
  const mockOnUpload = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<UploadCSV onUpload={mockOnUpload} onClose={mockOnClose} />);
    expect(screen.getByText(/Upload CSV/i)).toBeInTheDocument();
    expect(screen.getByTestId('upload-file-input')).toBeInTheDocument();
  });

  // it('displays validation error if file is invalid', async () => {
  //   (validateFile as jest.Mock).mockReturnValue('Invalid file format');
  //   render(<UploadCSV onUpload={mockOnUpload} onClose={mockOnClose} />);

  //   const input = screen.getByTestId('upload-file-input');
  //   const file = new File(['invalid content'], 'invalid.txt', { type: 'text/plain' });

  //   fireEvent.change(input, { target: { files: [file] } });

  //   const submitButton = screen.getByRole('button', { name: /Upload/i });
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(screen.getByText('Invalid file format')).toBeInTheDocument();
  //   });
  // });

  it('calls uploadCSV service with valid file', async () => {
    const mockFile = new File(['valid content'], 'valid.csv', { type: 'text/csv' });
    const mockResponse = { data: { message: 'CSV file processed successfully', invalidRows: [] }, error: null };
    (validateFile as jest.Mock).mockReturnValue(null);
    (uploadCSV as jest.Mock).mockResolvedValue(mockResponse);

    render(<UploadCSV onUpload={mockOnUpload} onClose={mockOnClose} />);

    const input = screen.getByTestId('upload-file-input');
    fireEvent.change(input, { target: { files: [mockFile] } });

    const submitButton = screen.getByRole('button', { name: /Upload/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(uploadCSV).toHaveBeenCalledWith(mockFile);
      expect(mockOnUpload).toHaveBeenCalled();
    });
  });

  it('displays error when uploadCSV fails', async () => {
    const mockFile = new File(['valid content'], 'valid.csv', { type: 'text/csv' });
    const mockError = 'Upload failed';
    (validateFile as jest.Mock).mockReturnValue(null);
    (uploadCSV as jest.Mock).mockResolvedValue({ data: null, error: mockError });

    render(<UploadCSV onUpload={mockOnUpload} onClose={mockOnClose} />);

    const input = screen.getByTestId('upload-file-input');
    fireEvent.change(input, { target: { files: [mockFile] } });

    const submitButton = screen.getByRole('button', { name: /Upload/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(mockError)).toBeInTheDocument();
    });
  });

  // it('downloads invalid rows if provided in response', async () => {
  //   const mockFile = new File(['valid content'], 'valid.csv', { type: 'text/csv' });
  //   const invalidRows = [{ row: 1, error: 'Invalid data' }];
  //   const mockResponse = { data: { message: 'CSV file processed successfully', invalidRows }, error: null };
  //   (validateFile as jest.Mock).mockReturnValue(null);
  //   (uploadCSV as jest.Mock).mockResolvedValue(mockResponse);

  //   const mockCreateElement = jest.spyOn(document, 'createElement');
  //   const mockAppendChild = jest.spyOn(document.body, 'appendChild');
  //   const mockRemoveChild = jest.spyOn(document.body, 'removeChild');
  //   mockCreateElement.mockReturnValue(document.createElement('a'));

  //   render(<UploadCSV onUpload={mockOnUpload} onClose={mockOnClose} />);

  //   const input = screen.getByTestId('upload-file-input');
  //   fireEvent.change(input, { target: { files: [mockFile] } });

  //   const submitButton = screen.getByRole('button', { name: /Upload/i });
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(mockCreateElement).toHaveBeenCalled();
  //     expect(mockAppendChild).toHaveBeenCalled();
  //     expect(mockRemoveChild).toHaveBeenCalled();
  //   });

  //   mockCreateElement.mockRestore();
  //   mockAppendChild.mockRestore();
  //   mockRemoveChild.mockRestore();
  // });
});