import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, CircularProgress } from '@mui/material';
import { addTransaction } from '../services/transactionService';
import axios, { AxiosError } from 'axios';
interface AddTransactionProps {
  onAdd: () => void;
  onClose: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAdd, onClose }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // Start loading

    // Validate fields
    if (!date || !description || !amount || !currency) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Validate currency format
    if (!isNaN(Number(currency))) {
      setError('Currency must be in the correct format');
      setLoading(false);
      return;
    }

    try {
      await addTransaction({
        date,
        description,
        amount: parseFloat(amount),
        Currency: currency,
      });
      setSuccess('Transaction added successfully');
      onAdd(); // Call the onAdd prop after adding the transaction
      setTimeout(() => {
        setLoading(false);
        onClose(); // Close the dialog after adding the transaction
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response && err.response.data && err.response.data.message === 'Transaction already exists') {
          setError('Transaction already exists');
        } else {
          setError('Error adding transaction');
        }
      } else {
        setError('Unknown error occurred');
      }
      setLoading(false);
    }
  };


  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add Transaction</DialogTitle>
      <DialogContent>
        {loading && <CircularProgress />}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {!loading && (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                margin="normal"
              />
            </div>
            <TextField
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button type="submit" color="primary">
                Save
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

export default AddTransaction;