// import React, { useState } from 'react';
// import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
// import AddTransaction from './components/AddTransaction';
// import UploadCSV from './components/UploadCSV';
// import TransactionsTable from './components/TransactionsTable';

// import './App.css';

// const App: React.FC = () => {
//   const [openAddTransaction, setOpenAddTransaction] = useState(false);
//   const [openUploadCSV, setOpenUploadCSV] = useState(false);
//   const [refresh, setRefresh] = useState(0);

//   const handleUpdate = () => {
//     setRefresh((prev) => prev + 1);
//   };

//   const handleDelete = () => {
//     setRefresh((prev) => prev + 1);
//   };

//   const handleOpenAddTransaction = () => setOpenAddTransaction(true);
//   const handleCloseAddTransaction = () => setOpenAddTransaction(false);

//   const handleOpenUploadCSV = () => setOpenUploadCSV(true);
//   const handleCloseUploadCSV = () => setOpenUploadCSV(false);

//   return (
//     <div className="App">
//       <header>
//         <h1>Transactions Management</h1>
//       </header>
//       <main>
//         <div className="action-buttons">
//           <Button variant="contained" color="primary" onClick={handleOpenAddTransaction}>
//             Add Transaction
//           </Button>
//           <Button variant="contained" color="secondary" onClick={handleOpenUploadCSV}>
//             Upload CSV
//           </Button>
//         </div>
//         <Dialog open={openAddTransaction} onClose={handleCloseAddTransaction}>
//           <DialogContent>
//             <AddTransaction onAdd={handleUpdate} onClose={handleCloseAddTransaction} />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseAddTransaction} color="primary">
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Dialog open={openUploadCSV} onClose={handleCloseUploadCSV}>
//           <DialogContent>
//             <UploadCSV onUpload={handleUpdate} />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseUploadCSV} color="primary">
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <section className="section">
//           <h2>Transactions List</h2>
//           <TransactionsTable key={refresh} />
//         </section>
//       </main>
//     </div>
//   );
// };

// export default App;

import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Add as AddIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material'; // Import Add and Upload icons
import AddTransaction from './components/AddTransaction';
import UploadCSV from './components/UploadCSV';
import TransactionsTable from './components/TransactionsTable';

import './App.css';

const App: React.FC = () => {
  const [openAddTransaction, setOpenAddTransaction] = useState(false);
  const [openUploadCSV, setOpenUploadCSV] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handleUpdate = () => {
    setRefresh((prev) => prev + 1);
  };

  // const handleDelete = () => {
  //   setRefresh((prev) => prev + 1);
  // };

  const handleOpenAddTransaction = () => setOpenAddTransaction(true);
  const handleCloseAddTransaction = () => setOpenAddTransaction(false);

  const handleOpenUploadCSV = () => setOpenUploadCSV(true);
  const handleCloseUploadCSV = () => setOpenUploadCSV(false);

  return (
    <div className="App">
      <header>
        <h1>Transactions Management</h1>
      </header>
      <main>
        <div className="action-buttons">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />} // Add the Add icon here
            onClick={handleOpenAddTransaction}
          >
            Add Transaction
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudUploadIcon />} // Add the Upload icon here
            onClick={handleOpenUploadCSV}
          >
            Upload CSV
          </Button>
        </div>
        <Dialog open={openAddTransaction} onClose={handleCloseAddTransaction}>
          <DialogContent>
            <AddTransaction onAdd={handleUpdate} onClose={handleCloseAddTransaction} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddTransaction} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openUploadCSV} onClose={handleCloseUploadCSV}>
          <DialogContent>
            <UploadCSV onUpload={handleUpdate} onClose={handleCloseUploadCSV} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseUploadCSV} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <section className="section">
          <h2>Transactions</h2>
          <TransactionsTable key={refresh} />
        </section>
      </main>
    </div>
  );
};

export default App;