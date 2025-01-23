// import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/'; // Import the jest-dom matchers
import UploadCSV from './UploadCSV';
import { uploadCSV } from '../services/transactionService';
import { validateFile } from '../utils/validations';
import { toast } from 'react-toastify';

// Mocking the services and utilities
jest.mock('../services/transactionService', () => ({
  uploadCSV: jest.fn(),
}));
jest.mock('../utils/validations', () => ({
  validateFile: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warn: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

const mockUploadCSV = uploadCSV as jest.Mock;
const mockValidateFile = validateFile as jest.Mock;

describe('UploadCSV', () => {
  const onUpload = jest.fn();
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the upload dialog', () => {
    render(<UploadCSV onUpload={onUpload} onClose={onClose} />);
    expect(screen.getByText('Upload CSV')).toBeInTheDocument();
    expect(screen.getByTestId('upload-file-input')).toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(<UploadCSV onUpload={onUpload} onClose={onClose} />);
    const fileInput = screen.getByTestId('upload-file-input') as HTMLInputElement;

    const file = new File(['file content'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files![0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  it('shows error if file validation fails', async () => {
    mockValidateFile.mockReturnValue('Invalid file format');

    render(<UploadCSV onUpload={onUpload} onClose={onClose} />);
    const fileInput = screen.getByTestId('upload-file-input') as HTMLInputElement;
    const file = new File(['file content'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.submit(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(mockValidateFile).toHaveBeenCalledWith(file);
      expect(toast.error).toHaveBeenCalledWith('Invalid file format', { autoClose: 2000 });
    });
  });

  // it('uploads file successfully', async () => {
  //   mockValidateFile.mockReturnValue('');
  //   mockUploadCSV.mockResolvedValue({ data: { message: 'CSV file processed successfully', invalidRows: [] }, error: null });

  //   render(<UploadCSV onUpload={onUpload} onClose={onClose} />);
  //   const fileInput = screen.getByTestId('upload-file-input') as HTMLInputElement;
  //   const file = new File(['file content'], 'test.csv', { type: 'text/csv' });
  //   fireEvent.change(fileInput, { target: { files: [file] } });

  //   fireEvent.submit(screen.getByRole('button', { name: /upload/i }));

  //   await waitFor(() => {
  //     expect(mockUploadCSV).toHaveBeenCalledWith(file);
  //     expect(toast.warn).toHaveBeenCalledWith('CSV file processed successfully', { autoClose: 2000 });
  //     expect(onUpload).toHaveBeenCalled();
  //     expect(onClose).toHaveBeenCalled();
  //   });
  // });

  it('shows error if upload fails', async () => {
    mockValidateFile.mockReturnValue('');
    mockUploadCSV.mockResolvedValue({ data: null, error: 'Upload failed' });

    render(<UploadCSV onUpload={onUpload} onClose={onClose} />);
    const fileInput = screen.getByTestId('upload-file-input') as HTMLInputElement;
    const file = new File(['file content'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.submit(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(mockUploadCSV).toHaveBeenCalledWith(file);
      expect(toast.error).toHaveBeenCalledWith('Upload failed', { autoClose: 2000 });
    });
  });
});