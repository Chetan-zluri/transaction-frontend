
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { uploadCSV } from '../services/transactionService';
import { validateFile } from '../utils/validations';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UploadCSVProps {
  onUpload: () => void;
  onClose: () => void;
}

const UploadCSV: React.FC<UploadCSVProps> = ({ onUpload, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fileError = validateFile(file);
    if (fileError) {
      setError(fileError);
      setLoading(false);
      toast.error(fileError, { autoClose: 2000 });
      return;
    }

    try {
      const { data, error } = await uploadCSV(file!);
      setLoading(false);
      if (error) {
        setError(error);
        toast.error(error, { autoClose: 2000 });
      } else {
        onUpload();
        if (data.message === "CSV file processed successfully") {
          toast.warn(data.message, { autoClose: 2000 });
          downloadInvalidRows(data.invalidRows);
        } else {
          toast.success('CSV File Processed Successfully', { autoClose: 2000 });
        }
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error({ err });
      setError('Unknown error occurred');
      setLoading(false);
      toast.error('Unknown error occurred', { autoClose: 2000 });
    }
  };

  const downloadInvalidRows = (invalidRows: any[]) => {
    const blob = new Blob([JSON.stringify(invalidRows, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invalid_rows.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Upload CSV</DialogTitle>
        <DialogContent>
          {loading && <CircularProgress />}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <input type="file" accept=".csv" onChange={handleFileChange} style={{ width: '90%' }} data-testid="upload-file-input"/>
              </div>
              <DialogActions>
                <Button type="submit" color="primary" startIcon={<CloudUploadIcon />}>
                  Upload
                </Button>
                <Button onClick={onClose} color="secondary">
                  Cancel
                </Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default UploadCSV;