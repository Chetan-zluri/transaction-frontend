import React, { useEffect, useState } from 'react';
import { Dialog,CircularProgress, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Checkbox } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faDownload, faPrint, faSearch } from '@fortawesome/free-solid-svg-icons';
import { getAllTransactions, updateTransaction, deleteTransaction,deleteTransactions } from '../services/transactionService';
// import { Bar, Pie } from 'react-chartjs-2';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
// import { Chart, registerables } from 'chart.js';
// Chart.register(...registerables);
interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  Currency: string;
}

const TransactionsTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversionRates, setConversionRates] = useState<{ [key: string]: number }>({});
  const [success, setSuccess] = useState('');
  const [editTransactionId, setEditTransactionId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [EditLoading, setEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    date: '',
    description: '',
    amount: '',
    Currency: ''
  });
  const [deleteTransactionId, setDeleteTransactionId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const today = new Date().toISOString().split('T')[0];
  // const [chartDialogOpen, setChartDialogOpen] = useState(false);
  // const [ChartDate,setChartDate] = useState('');
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { transactions, totalPages } = await getAllTransactions(page, limit);
        setTransactions(transactions);
        setFilteredTransactions(transactions);
        setTotalPages(totalPages);
        setError('');
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Failed to fetch transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchConversionRates = async () => {
      try {
        const response = await fetch(`http://35.154.170.151:8080/2019-01-01`);
        console.log("response",response);
        const data = await response.json();
        setConversionRates(data || {});
      } catch (error) {
        console.error('Error fetching conversion rates:', error);
        setError('Failed to fetch conversion rates. Please try again later.');
      }
    };

    fetchTransactions();
    fetchConversionRates();
  }, [page, limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertToINR = (amount: number, Currency: string) => {
    const rate = conversionRates[Currency.toUpperCase()];
    return rate ? (amount * rate).toFixed(2) : 'N/A';
  };

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    try {
      const {error } = await deleteTransaction(id);
      if (error) {
        setError(error);
      } else {
        setTransactions(transactions.filter(transaction => transaction.id !== id));
        setFilteredTransactions(filteredTransactions.filter(transaction => transaction.id !== id));
        setSuccess('Transaction deleted successfully');
        setTimeout(() => {
          setDeleteTransactionId(null);
          setSuccess('');
        }, 1000);
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('An unexpected error occurred while deleting the transaction. Please try again later.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // const generateChartData = () => {
  //   const aggregatedData: { [date: string]: number } = {};
  //   const currencyCount: { [currency: string]: number } = {};
  
  //   filteredTransactions.forEach(transaction => {
  //     // Convert amount to INR
  //     const amountInINR = parseFloat(convertToINR(transaction.amount, transaction.Currency));
  
  //     // Aggregate amounts by date for the bar chart
  //     if (aggregatedData[transaction.date]) {
  //       aggregatedData[transaction.date] += amountInINR;
  //     } else {
  //       aggregatedData[transaction.date] = amountInINR;
  //     }
  
  //     // Count occurrences of each currency for the pie chart
  //     if (currencyCount[transaction.Currency]) {
  //       currencyCount[transaction.Currency]++;
  //     } else {
  //       currencyCount[transaction.Currency] = 1;
  //     }
  //   });
  
  //   const barData = {
  //     labels: Object.keys(aggregatedData),
  //     datasets: [
  //       {
  //         label: 'Amount (INR)',
  //         data: Object.values(aggregatedData),
  //         backgroundColor: 'rgba(75, 192, 192, 0.6)',
  //         borderColor: 'rgba(75, 192, 192, 1)',
  //         borderWidth: 1,
  //       },
  //     ],
  //   };
  
  //   const pieData = {
  //     labels: Object.keys(currencyCount),
  //     datasets: [
  //       {
  //         data: Object.values(currencyCount),
  //         backgroundColor: Object.keys(currencyCount).map(
  //           () => `hsl(${Math.random() * 360}, 100%, 75%)`
  //         ),
  //       },
  //     ],
  //   };
  
  //   return { barData, pieData };
  // };
  
  const handleDeleteMultiple = async () => {
    setDeleteLoading(true);
    try {
      const {error } = await deleteTransactions(selectedTransactions);
      if (error) {
        setError(error);
      } else {
        setTransactions(transactions.filter(transaction => !selectedTransactions.includes(transaction.id)));
        setFilteredTransactions(filteredTransactions.filter(transaction => !selectedTransactions.includes(transaction.id)));
        setSuccess('Transactions deleted successfully');
        setTimeout(() => {
        setDeleteDialogOpen(false);
        setSelectedTransactions([]);
        setSuccess('');
      }, 1000);
      }
    } catch (err) {
      console.error('Error deleting transactions:', err);
      setError('An unexpected error occurred while deleting the transactions. Please try again later.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = (transaction: any) => {
    setEditTransactionId(transaction.id);
    setEditFormData({
      date: formatDate(transaction.date),
      description: transaction.description,
      amount: transaction.amount.toString(), // Ensure amount is a string in the form data
      Currency: transaction.Currency
    });
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // const handleOpenChartDialog = (date: string) => {
  //   setChartDate(date);
  //   setChartDialogOpen(true);
  // };

  const handleEditSubmit = async (id: number) => {
    setError('');
    setSuccess('');
    setEditLoading(true);
    if (!isNaN(Number(editFormData.Currency))) {
      setError('Currency must be in the correct format');
      setEditLoading(false);
      return;
    }
    if (parseFloat(editFormData.amount) <= 0) {
      setError('Amount must be greater than zero');
      setEditLoading(false);
      return;
    }
    try {
      const updatedTransaction = {
        id,
        date: editFormData.date,
        description: editFormData.description,
        amount: parseFloat(editFormData.amount), // Convert amount to number
        Currency: editFormData.Currency
      };
      const { data, error } = await updateTransaction(id, updatedTransaction);

    if (error) {
        setError(error);
    }
      else {
      setTransactions(transactions.map(transaction => (transaction.id === id ? data.transaction : transaction)));
      setFilteredTransactions(filteredTransactions.map(transaction => (transaction.id === id ? data.transaction : transaction)));
      setSuccess('Transaction updated successfully');
      setTimeout(() => {
        setEditTransactionId(null);
        setSuccess('');
      }, 1000);
    }
  } catch (err) {
    console.error('Error updating transaction:', err);
    setError('An unexpected error occurred');
  } finally {
    setEditLoading(false); // Stop loading
  }
};

  const generatePDF = (print = false) => {
    const doc = new jsPDF();
    // @ts-ignore
    doc.autoTable({
      head: [['SL No.', 'Date', 'Description', 'Amount', 'Currency']],
      body: filteredTransactions.map((transaction, index) => [
        (page - 1) * limit + index + 1,
        formatDate(transaction.date),
        transaction.description,
        transaction.amount,
        transaction.Currency
      ])
    });
    if (print) {
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    } else {
      doc.save('transactions.pdf');
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeLimit = (event: SelectChangeEvent<number>) => {
    setLimit(event.target.value as number);
    setPage(1); // Reset page number to 1 when changing the limit
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const searchResults = transactions.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(transaction.date).toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm) ||
        transaction.Currency.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTransactions(searchResults);
    }
    setSearchDialogOpen(false);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <mark key={index} style={{ backgroundColor: 'yellow' }}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = filteredTransactions.map(transaction => transaction.id);
      setSelectedTransactions(allIds);
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleRowSelect = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (event.target.checked) {
      setSelectedTransactions([...selectedTransactions, id]);
    } else {
      setSelectedTransactions(selectedTransactions.filter(selectedId => selectedId !== id));
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;  
    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Button
            key={i}
            onClick={() => handleChangePage(i)}
            disabled={page === i}
            style={{
              margin: '0 5px',
              color: page === i ? 'white' : 'black',
              backgroundColor: page === i ? '#007bff' : '#e9ecef',
              borderColor: '#ced4da',
              borderRadius: '8px',
              borderWidth: 1,
              borderStyle: 'solid',
              minWidth: '40px',
              height: '40px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {i}
          </Button>
        );
      }
    } else {
      let startPage = Math.max(page - Math.floor(maxPageNumbersToShow / 2), 1);
      let endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);
  
      if (endPage - startPage < maxPageNumbersToShow - 1) {
        startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
      } 
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <Button
            key={i}
            onClick={() => handleChangePage(i)}
            disabled={page === i}
            style={{
              margin: '0 5px',
              color: page === i ? 'white' : 'black',
              backgroundColor: page === i ? '#007bff' : '#e9ecef',
              borderColor: '#ced4da',
              borderRadius: '8px',
              borderWidth: 1,
              borderStyle: 'solid',
              minWidth: '40px',
              height: '40px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {i}
          </Button>
        );
      } 
      if (startPage > 1) {
        pageNumbers.unshift(
          <Button
            key={1}
            onClick={() => handleChangePage(1)}
            style={{
              margin: '0 5px',
              color: 'black',
              backgroundColor: '#e9ecef',
              borderColor: '#ced4da',
              borderRadius: '8px',
              borderWidth: 1,
              borderStyle: 'solid',
              minWidth: '40px',
              height: '40px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            1
          </Button>
        );
        pageNumbers.unshift(<span key="start-ellipsis" style={{ margin: '0 5px' }}>...</span>);
      }
      if (endPage < totalPages) {
        pageNumbers.push(<span key="end-ellipsis" style={{ margin: '0 5px' }}>...</span>);
        pageNumbers.push(
          <Button
            key={totalPages}
            onClick={() => handleChangePage(totalPages)}
            style={{
              margin: '0 5px',
              color: 'black',
              backgroundColor: '#e9ecef',
              borderColor: '#ced4da',
              borderRadius: '8px',
              borderWidth: 1,
              borderStyle: 'solid',
              minWidth: '40px',
              height: '40px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            {totalPages}
          </Button>
        );
      }
    }
    return pageNumbers;
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!filteredTransactions || filteredTransactions.length === 0) {
    return <div>No transactions available.</div>;
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Rows per page</InputLabel>
          <Select value={limit} onChange={handleChangeLimit} label="Rows per page">
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
        <div>
        {renderPageNumbers()}
          <Tooltip title="Search" arrow>
            <IconButton onClick={() => setSearchDialogOpen(true)} style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faSearch} />
            </IconButton>
          </Tooltip>
          {selectedTransactions.length > 0 && (
            <Tooltip title="Delete Selected" arrow>
              <IconButton onClick={() => setDeleteDialogOpen(true)} style={{ color: 'black' }}>
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Download PDF" arrow>
            <IconButton onClick={() => generatePDF(false)} style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faDownload} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print PDF" arrow>
            <IconButton onClick={() => generatePDF(true)} style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faPrint} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>
              <Checkbox
                checked={selectedTransactions.length === filteredTransactions.length}
                onChange={handleSelectAll}
                color="primary"
                sx={{
                  '& .MuiSvgIcon-root': { fontSize: 20 }, // Decrease the size
                  '&.Mui-checked': {
                    color: 'white', // Tick mark color
                    '& .MuiSvgIcon-root': {
                      color: 'black', // Checkbox background color
                    },
                  },
                }}
              />
            </th>
            <th>SL No.</th>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Amount(INR)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction, index) => (
            <tr key={transaction.id}>
              <td>
                <Checkbox
                  checked={selectedTransactions.includes(transaction.id)}
                  onChange={(e) => handleRowSelect(e, transaction.id)}
                  color="primary"
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 20 }, // Decrease the size
                    '&.Mui-checked': {
                      color: 'white', // Tick mark color
                      '& .MuiSvgIcon-root': {
                        color: 'black', // Checkbox background color
                      },
                    },
                  }}
                />
              </td>
              <td style={{ padding: '4px', width: '50px' }}>{(page - 1) * limit + index + 1}</td> {/* Serial Number */}
              <td style={{ padding: '4px', width: '100px' }}>{highlightText(formatDate(transaction.date), searchTerm)}</td> {/* Format the date */}
              <td style={{ padding: '4px', minWidth: '150px' }}>{highlightText(transaction.description, searchTerm)}</td>
              <td style={{ padding: '4px', width: '100px' }}>{highlightText(transaction.amount.toString(), searchTerm)}</td>
              <td style={{ padding: '4px', width: '100px' }}>{highlightText(transaction.Currency, searchTerm)}</td>
              <td style={{ padding: '4px', width: '100px' }}>{convertToINR(transaction.amount, transaction.Currency)}</td>
              <td>
                <Tooltip title="Edit" arrow>
                  <IconButton onClick={() => handleEditClick(transaction)} style={{ color: 'green' }}>
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                  <IconButton onClick={() => setDeleteTransactionId(transaction.id)} style={{ color: 'red' }}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title="View Charts" arrow>
            <IconButton onClick={() => handleOpenChartDialog(transaction.date)} style={{ color: 'blue' }}>
              <FontAwesomeIcon icon={faChartBar} />
            </IconButton>
          </Tooltip> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
      <Button
      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
      disabled={page === 1}
      style={{
        backgroundColor: page === 1 ? '#e9ecef' : '#007bff',
        color: page === 1 ? 'black' : 'white',
        borderColor: '#ced4da',
        borderRadius: '8px',
        borderWidth: 1,
        borderStyle: 'solid',
        minWidth: '80px',
        height: '40px',
        fontSize: '14px',
        fontWeight: 'bold',
      }}
        >
          Previous
        </Button>
        <span>Page {page} of {totalPages}</span>
        <Button
          onClick={() => setPage(prev => prev + 1)}
          disabled={page === totalPages}
          style={{
            backgroundColor: page === totalPages ? '#e9ecef' : '#007bff',
            color: page === totalPages ? 'black' : 'white',
            borderColor: '#ced4da',
            borderRadius: '8px',
            borderWidth: 1,
            borderStyle: 'solid',
            minWidth: '80px',
            height: '40px',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Next
        </Button>
      </div>
      {/* Edit Transaction Dialog */}
      <Dialog open={editTransactionId !== null} onClose={() => setEditTransactionId(null)}>
  <DialogTitle>Edit Transaction</DialogTitle>
  <DialogContent>
    {EditLoading ? (
      <CircularProgress />
    ) : (
      <>
        <form>
          <TextField
            label="Date"
            type="date"
            name="date"
            value={editFormData.date}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ max: today }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <TextField
              label="Description"
              name="description"
              value={editFormData.description}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Amount"
              type="number"
              name="amount"
              value={editFormData.amount}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
          </div>
          <TextField
            label="Currency"
            name="Currency"
            value={editFormData.Currency}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => handleEditSubmit(editTransactionId!)} color="primary" disabled={deleteLoading}>
      Save
    </Button>
    <Button onClick={() => setEditTransactionId(null)} color="primary" disabled={deleteLoading}>
      Cancel
    </Button>
  </DialogActions>
</Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteTransactionId !== null} onClose={() => setDeleteTransactionId(null)}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          {deleteLoading ? (
            <CircularProgress />
          ) : success ?(
            <p style={{ color: 'green' }}>{success}</p>
          ) : (
            <>
              <p>Are you sure you want to delete this transaction?</p>
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {!deleteLoading && !success && (
            <>
              <Button onClick={() => handleDelete(deleteTransactionId!)} color="secondary" disabled={deleteLoading}>
                Delete
              </Button>
              <Button onClick={() => setDeleteTransactionId(null)} color="primary" disabled={deleteLoading}>
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>


      <Dialog open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)}>
        <DialogTitle>Search Transactions</DialogTitle>
        <DialogContent>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSearch} color="primary">
            Search
          </Button>
          <Button onClick={() => setSearchDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>     

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Transactions</DialogTitle>
        <DialogContent>
          {deleteLoading ? (
            <CircularProgress />
          ) : (
            <>
              <p>Are you sure you want to delete these transactions?</p>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {success && <p style={{ color: 'green' }}>{success}</p>}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteMultiple} color="secondary" disabled={deleteLoading}>
            Delete
          </Button>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary" disabled={deleteLoading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Dialog open={chartDialogOpen} onClose={() => setChartDialogOpen(false)} maxWidth="lg" fullWidth>
  <DialogTitle>Transactions Chart</DialogTitle>
  <DialogContent>
    <Bar data={generateChartData().barData} />
    <Pie data={generateChartData().pieData} />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setChartDialogOpen(false)} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog> */}

    </div>    
  );
}
export default TransactionsTable