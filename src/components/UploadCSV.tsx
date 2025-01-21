import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, IconButton } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'; // Import upload icon
import { uploadCSV } from '../services/transactionService';
import { validateFile } from '../utils/validations';

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
    setLoading(true); // Start loading

    const fileError = validateFile(file);
    if (fileError) {
      setError(fileError);
      setLoading(false);
      return;
    }

    try {
      await uploadCSV(file!);
      onUpload(); // Call the onUpload prop after successful upload
      setTimeout(() => {
        setLoading(false);
        onClose(); // Close the dialog after successful upload
      }, 2000);
    } catch (err) {
      setError('Error uploading file');
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Upload CSV</DialogTitle>
      <DialogContent>
        {loading && <CircularProgress />}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <input type="file" accept=".csv" onChange={handleFileChange} style={{ width: '90%' }} />
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
  );
};

export default UploadCSV;