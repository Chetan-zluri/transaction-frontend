import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, Typography, LinearProgress, Box } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { uploadCSV } from '../services/transactionService';
import { validateFile } from '../utils/validations';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface UploadCSVProps {
  onUpload: () => void;
  onClose: () => void;
}

const UploadCSV: React.FC<UploadCSVProps> = ({ onUpload, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
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
      const fileContent = await readFileContent(file!);
      if (!fileContent.trim()) {
        setError('The file content is empty.');
        setLoading(false);
        toast.error('The file content is empty.', { autoClose: 2000 });
        return;
      }

      const { data, error } = await uploadCSV(file!, {
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setLoading(false);
      if (error) {
        setError(error);
        toast.error(error, { autoClose: 2000 });
      } else {
        onUpload();
        if (data.message === "CSV file processed successfully") {
          toast.warn(data.message, { autoClose: 2000 });
          downloadInvalidRows(data.invalidRows, data.duplicateRows);
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

  const downloadInvalidRows = (invalidRows: any[], duplicateRows: any[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Invalid and Duplicate Rows', 14, 22);

    if (invalidRows.length > 0) {
      doc.setFontSize(14);
      doc.text('Invalid Rows:', 14, 30);
      // @ts-ignore
      doc.autoTable({
        startY: 35,
        head: [['Index', 'Row Data']],
        body: invalidRows.map((row, index) => [index + 1, JSON.stringify(row, null, 2)])
      });
    }

    if (duplicateRows.length > 0) {
      const startY = invalidRows.length > 0 ? doc.lastAutoTable.finalY + 10 : 35;
      doc.setFontSize(14);
      doc.text('Duplicate Rows:', 14, startY);
      // @ts-ignore
      doc.autoTable({
        startY: startY + 5,
        head: [['Index', 'Row Data']],
        body: duplicateRows.map((row, index) => [index + 1, JSON.stringify(row, null, 2)])
      });
    }
    doc.save('invalid_duplicate_rows.pdf');
  };

  return (
    <>
      <Dialog open={true} onClose={onClose}>
        <DialogTitle>Upload CSV</DialogTitle>
        <DialogContent>
          {loading && (
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" padding={2}>
              <CircularProgress />
              <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                Uploading... {uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} style={{ width: '100%', marginTop: '10px' }} />
            </Box>
          )}
          {error && <Typography style={{ color: 'red' }}>{error}</Typography>}
          {!loading && (
            <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
              <div 
                style={{
                  border: '2px dashed #ccc',
                  padding: '20px',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  backgroundColor: '#f9f9f9'
                }}
                onClick={() => document.getElementById('upload-file-input')?.click()}
              >
                <CloudUploadIcon style={{ fontSize: '48px', color: '#888' }} />
                <Typography>Drag & Drop or Click to Select a CSV file</Typography>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  id="upload-file-input"
                  style={{ display: 'none' }}
                  data-testid="upload-file-input"
                />
              </div>
              {file && (
                <Typography style={{ marginBottom: '10px' }}>Selected file: {file.name}</Typography>
              )}
              <DialogActions>
                <Button type="submit" color="primary" variant="contained" startIcon={<CloudUploadIcon />}>
                  Upload
                </Button>
                <Button onClick={onClose} color="secondary" variant="outlined">
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