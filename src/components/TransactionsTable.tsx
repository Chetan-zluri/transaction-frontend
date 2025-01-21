// import React, { useEffect, useState } from 'react';
// import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton } from '@mui/material';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
// import { getAllTransactions, updateTransaction, deleteTransaction } from '../services/transactionService';

// const TransactionsTable: React.FC = () => {
//   const [transactions, setTransactions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [editTransactionId, setEditTransactionId] = useState<number | null>(null);
//   const [editFormData, setEditFormData] = useState({
//     date: '',
//     description: '',
//     amount: '',
//     Currency: ''
//   });
//   const [deleteTransactionId, setDeleteTransactionId] = useState<number | null>(null);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       setLoading(true);
//       try {
//         const data = await getAllTransactions(page, limit);
//         setTransactions(data);
//         setError('');
//       } catch (error) {
//         console.error('Error fetching transactions:', error);
//         setError('Failed to fetch transactions. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [page, limit]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toISOString().split('T')[0];
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteTransaction(id);
//       setTransactions(transactions.filter(transaction => transaction.id !== id));
//       setDeleteTransactionId(null);
//     } catch (error) {
//       console.error('Error deleting transaction:', error);
//       setError('Failed to delete transaction. Please try again later.');
//     }
//   };

//   const handleEditClick = (transaction: any) => {
//     setEditTransactionId(transaction.id);
//     setEditFormData({
//       date: formatDate(transaction.date),
//       description: transaction.description,
//       amount: transaction.amount.toString(), // Ensure amount is a string in the form data
//       Currency: transaction.Currency
//     });
//   };

//   const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setEditFormData({
//       ...editFormData,
//       [name]: value
//     });
//   };

//   const handleEditSubmit = async (id: number) => {
//     setError('');
//     setSuccess('');

//     // Validate currency format
//     if (!isNaN(Number(editFormData.Currency))) {
//       setError('Currency must be in the correct format');
//       return;
//     }

//     try {
//       const updatedTransaction = {
//         id,
//         date: editFormData.date,
//         description: editFormData.description,
//         amount: parseFloat(editFormData.amount), // Convert amount to number
//         Currency: editFormData.Currency
//       };
//       await updateTransaction(id, updatedTransaction);
//       setTransactions(transactions.map(transaction => (transaction.id === id ? updatedTransaction : transaction)));
//       setSuccess('Transaction updated successfully');
//       setTimeout(() => {
//         setEditTransactionId(null);
//         setSuccess('');
//       }, 2000);
//     } catch (error) {
//       console.error('Error updating transaction:', error);
//       setError('Error updating transaction');
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!transactions || transactions.length === 0) {
//     return <div>No transactions available.</div>;
//   }

//   return (
//     <div>
//       <table className="transactions-table">
//         <thead>
//           <tr>
//             <th>SL No.</th>
//             <th>Date</th>
//             <th>Description</th>
//             <th>Amount</th>
//             <th>Currency</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((transaction, index) => (
//             <tr key={transaction.id}>
//               <td>{(page - 1) * limit + index + 1}</td> {/* Serial Number */}
//               <td>{formatDate(transaction.date)}</td> {/* Format the date */}
//               <td>{transaction.description}</td>
//               <td>{transaction.amount}</td>
//               <td>{transaction.Currency}</td>
//               <td>
//                 <IconButton onClick={() => handleEditClick(transaction)}>
//                   <FontAwesomeIcon icon={faEdit} />
//                 </IconButton>
//                 <IconButton onClick={() => setDeleteTransactionId(transaction.id)}>
//                   <FontAwesomeIcon icon={faTrash} />
//                 </IconButton>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="pagination">
//         <button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Previous</button>
//         <span>Page {page}</span>
//         <button onClick={() => setPage(prev => prev + 1)}>Next</button>
//       </div>
      
//       {/* Edit Transaction Dialog */}
//       <Dialog open={editTransactionId !== null} onClose={() => setEditTransactionId(null)}>
//         <DialogTitle>Edit Transaction</DialogTitle>
//         <DialogContent>
//           {error && <p style={{ color: 'red' }}>{error}</p>}
//           {success && <p style={{ color: 'green' }}>{success}</p>}
//           <form>
//             <TextField
//               label="Date"
//               type="date"
//               name="date"
//               value={editFormData.date}
//               onChange={handleEditChange}
//               fullWidth
//               margin="normal"
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <TextField
//                 label="Description"
//                 name="description"
//                 value={editFormData.description}
//                 onChange={handleEditChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Amount"
//                 type="number"
//                 name="amount"
//                 value={editFormData.amount}
//                 onChange={handleEditChange}
//                 fullWidth
//                 margin="normal"
//               />
//             </div>
//             <TextField
//               label="Currency"
//               name="Currency"
//               value={editFormData.Currency}
//               onChange={handleEditChange}
//               fullWidth
//               margin="normal"
//             />
//           </form>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => handleEditSubmit(editTransactionId!)} color="primary">
//             Save
//           </Button>
//           <Button onClick={() => setEditTransactionId(null)} color="primary">
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteTransactionId !== null} onClose={() => setDeleteTransactionId(null)}>
//         <DialogTitle>Delete Transaction</DialogTitle>
//         <DialogContent>Are you sure you want to delete this transaction?</DialogContent>
//         <DialogActions>
//           <Button onClick={() => handleDelete(deleteTransactionId!)} color="secondary">
//             Delete
//           </Button>
//           <Button onClick={() => setDeleteTransactionId(null)} color="primary">
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default TransactionsTable;

// import React, { useEffect, useState } from 'react';
// import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton } from '@mui/material';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
// import { getAllTransactions, updateTransaction, deleteTransaction } from '../services/transactionService';

// const TransactionsTable: React.FC = () => {
//   const [transactions, setTransactions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [editTransactionId, setEditTransactionId] = useState<number | null>(null);
//   const [editFormData, setEditFormData] = useState({
//     date: '',
//     description: '',
//     amount: '',
//     Currency: ''
//   });
//   const [deleteTransactionId, setDeleteTransactionId] = useState<number | null>(null);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       setLoading(true);
//       try {
//         const data = await getAllTransactions(page, limit);
//         setTransactions(data);
//         setError('');
//       } catch (error) {
//         console.error('Error fetching transactions:', error);
//         setError('Failed to fetch transactions. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [page, limit]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toISOString().split('T')[0];
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteTransaction(id);
//       setTransactions(transactions.filter(transaction => transaction.id !== id));
//       setDeleteTransactionId(null);
//     } catch (error) {
//       console.error('Error deleting transaction:', error);
//       setError('Failed to delete transaction. Please try again later.');
//     }
//   };

//   const handleEditClick = (transaction: any) => {
//     setEditTransactionId(transaction.id);
//     setEditFormData({
//       date: formatDate(transaction.date),
//       description: transaction.description,
//       amount: transaction.amount.toString(), // Ensure amount is a string in the form data
//       Currency: transaction.Currency
//     });
//   };

//   const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setEditFormData({
//       ...editFormData,
//       [name]: value
//     });
//   };

//   const handleEditSubmit = async (id: number) => {
//     setError('');
//     setSuccess('');

//     // Validate currency format
//     if (!isNaN(Number(editFormData.Currency))) {
//       setError('Currency must be in the correct format');
//       return;
//     }

//     try {
//       const updatedTransaction = {
//         id,
//         date: editFormData.date,
//         description: editFormData.description,
//         amount: parseFloat(editFormData.amount), // Convert amount to number
//         Currency: editFormData.Currency
//       };
//       await updateTransaction(id, updatedTransaction);
//       setTransactions(transactions.map(transaction => (transaction.id === id ? updatedTransaction : transaction)));
//       setSuccess('Transaction updated successfully');
//       setTimeout(() => {
//         setEditTransactionId(null);
//         setSuccess('');
//       }, 2000);
//     } catch (error) {
//       console.error('Error updating transaction:', error);
//       setError('Error updating transaction');
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!transactions || transactions.length === 0) {
//     return <div>No transactions available.</div>;
//   }

//   return (
//     <div>
//       <table className="transactions-table">
//         <thead>
//           <tr>
//             <th>SL No.</th>
//             <th>Date</th>
//             <th>Description</th>
//             <th>Amount</th>
//             <th>Currency</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((transaction, index) => (
//             <tr key={transaction.id}>
//               <td>{(page - 1) * limit + index + 1}</td> {/* Serial Number */}
//               <td>{formatDate(transaction.date)}</td> {/* Format the date */}
//               <td>{transaction.description}</td>
//               <td>{transaction.amount}</td>
//               <td>{transaction.Currency}</td>
//               <td>
//                 <IconButton onClick={() => handleEditClick(transaction)} style={{ color: 'green' }} title="Edit">
//                   <FontAwesomeIcon icon={faEdit} />
//                 </IconButton>
//                 <IconButton onClick={() => setDeleteTransactionId(transaction.id)} style={{ color: 'red' }} title="Delete">
//                   <FontAwesomeIcon icon={faTrash} />
//                 </IconButton>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div className="pagination">
//         <button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Previous</button>
//         <span>Page {page}</span>
//         <button onClick={() => setPage(prev => prev + 1)}>Next</button>
//       </div>
      
//       {/* Edit Transaction Dialog */}
//       <Dialog open={editTransactionId !== null} onClose={() => setEditTransactionId(null)}>
//         <DialogTitle>Edit Transaction</DialogTitle>
//         <DialogContent>
//           {error && <p style={{ color: 'red' }}>{error}</p>}
//           {success && <p style={{ color: 'green' }}>{success}</p>}
//           <form>
//             <TextField
//               label="Date"
//               type="date"
//               name="date"
//               value={editFormData.date}
//               onChange={handleEditChange}
//               fullWidth
//               margin="normal"
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//             <div style={{ display: 'flex', gap: '10px' }}>
//               <TextField
//                 label="Description"
//                 name="description"
//                 value={editFormData.description}
//                 onChange={handleEditChange}
//                 fullWidth
//                 margin="normal"
//               />
//               <TextField
//                 label="Amount"
//                 type="number"
//                 name="amount"
//                 value={editFormData.amount}
//                 onChange={handleEditChange}
//                 fullWidth
//                 margin="normal"
//               />
//             </div>
//             <TextField
//               label="Currency"
//               name="Currency"
//               value={editFormData.Currency}
//               onChange={handleEditChange}
//               fullWidth
//               margin="normal"
//             />
//           </form>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => handleEditSubmit(editTransactionId!)} color="primary">
//             Save
//           </Button>
//           <Button onClick={() => setEditTransactionId(null)} color="primary">
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteTransactionId !== null} onClose={() => setDeleteTransactionId(null)}>
//         <DialogTitle>Delete Transaction</DialogTitle>
//         <DialogContent>Are you sure you want to delete this transaction?</DialogContent>
//         <DialogActions>
//           <Button onClick={() => handleDelete(deleteTransactionId!)} color="secondary">
//             Delete
//           </Button>
//           <Button onClick={() => setDeleteTransactionId(null)} color="primary">
//             Cancel
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default TransactionsTable;

import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Checkbox } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faDownload, faPrint, faSearch } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getAllTransactions, updateTransaction, deleteTransaction } from '../services/transactionService';

const TransactionsTable: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversionRates, setConversionRates] = useState<{ [key: string]: number }>({});
  const [success, setSuccess] = useState('');
  const [editTransactionId, setEditTransactionId] = useState<number | null>(null);
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
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const data = await getAllTransactions(page, limit);
        setTransactions(data);
        setFilteredTransactions(data);
        setTotalPages(Math.ceil(data.totalCount / limit)); // Assuming data.totalCount is the total number of transactions
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
        const response = await fetch(`http://35.154.170.151:8080/2016-01-01`);
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
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter(transaction => transaction.id !== id));
      setFilteredTransactions(filteredTransactions.filter(transaction => transaction.id !== id));
      setDeleteTransactionId(null);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Failed to delete transaction. Please try again later.');
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

  const handleEditSubmit = async (id: number) => {
    setError('');
    setSuccess('');

    // Validate currency format
    if (!isNaN(Number(editFormData.Currency))) {
      setError('Currency must be in the correct format');
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
      await updateTransaction(id, updatedTransaction);
      setTransactions(transactions.map(transaction => (transaction.id === id ? updatedTransaction : transaction)));
      setFilteredTransactions(filteredTransactions.map(transaction => (transaction.id === id ? updatedTransaction : transaction)));
      setSuccess('Transaction updated successfully');
      setTimeout(() => {
        setEditTransactionId(null);
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError('Error updating transaction');
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
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <Tooltip title="Search" arrow>
            <IconButton onClick={handleSearch} style={{ color: 'black' }}>
              <FontAwesomeIcon icon={faSearch} />
            </IconButton>
          </Tooltip>
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
              <td>{(page - 1) * limit + index + 1}</td> {/* Serial Number */}
              <td>{highlightText(formatDate(transaction.date), searchTerm)}</td> {/* Format the date */}
              <td>{highlightText(transaction.description, searchTerm)}</td>
              <td>{highlightText(transaction.amount.toString(), searchTerm)}</td>
              <td>{highlightText(transaction.Currency, searchTerm)}</td>
              <td>{convertToINR(transaction.amount, transaction.Currency)}</td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(prev => prev + 1)}>Next</button>
      </div>

      {/* Edit Transaction Dialog */}
      <Dialog open={editTransactionId !== null} onClose={() => setEditTransactionId(null)}>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogContent>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleEditSubmit(editTransactionId!)} color="primary">
            Save
          </Button>
          <Button onClick={() => setEditTransactionId(null)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteTransactionId !== null} onClose={() => setDeleteTransactionId(null)}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>Are you sure you want to delete this transaction?</DialogContent>
        <DialogActions>
          <Button onClick={() => handleDelete(deleteTransactionId!)} color="secondary">
            Delete
          </Button>
          <Button onClick={() => setDeleteTransactionId(null)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TransactionsTable;