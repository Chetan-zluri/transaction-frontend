import React, {useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { addTransaction } from '../services/transactionService';
import axios from 'axios';

interface AddTransactionProps {
  onAdd: () => void;
  onClose: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onAdd, onClose }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://freeexchange.onrender.com/2020-01-01');
        setCurrencies(Object.keys(response.data));
      } catch (error) {
        console.error('Error fetching currencies:', error);
        setError('Failed to fetch currencies. Please try again later.');
      }
    };

    fetchCurrencies();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    console.log({description})
    const trimmeddescription= description.trim().replace(/\s+/g," ");
    const minAllowedDate = new Date('1980-01-01');
    if (!date || !trimmeddescription || !amount || !currency) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than zero');
      setLoading(false);
      return;
    }
    if (!isNaN(Number(currency))) {
      setError('Currency must be in the correct format');
      setLoading(false);
      return;
    }
    if (date > today) {
      setError('Invalid Date');
      setLoading(false);
      return;
    } 
    if (new Date(date) < minAllowedDate) {
      setError('Date cannot be before January 1, 1980');
      setLoading(false);
      return;
    }
    try {
      await addTransaction({
        date,
        description:trimmeddescription,
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
    }finally {
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
        {!loading && !success &&(
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
              inputProps={{
                max: today, // Set the maximum selectable date to today
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as string)}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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