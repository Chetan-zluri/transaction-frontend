// import React, { useState } from 'react';
// import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
// import { Add as AddIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material'; // Import Add and Upload icons
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
//   const handleOpenAddTransaction = () => setOpenAddTransaction(true);
//   const handleCloseAddTransaction = () => setOpenAddTransaction(false);
//   const handleOpenUploadCSV = () => setOpenUploadCSV(true);
//   const handleCloseUploadCSV = () => setOpenUploadCSV(false);

//   return (
//     <div className="App">
//       <header>
//         <h1>Expense Orchestrator</h1>
//       </header>
//       <main>
//         <div className="action-buttons">
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />} // Add the Add icon here
//             onClick={handleOpenAddTransaction}
//           >
//             Add Transaction
//           </Button>
//           <Button
//             variant="contained"
//             color="secondary"
//             startIcon={<CloudUploadIcon />} // Add the Upload icon here
//             onClick={handleOpenUploadCSV}
//           >
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
//             <UploadCSV onUpload={handleUpdate} onClose={handleCloseUploadCSV} />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseUploadCSV} color="primary">
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <section className="section">
//           <h2>Transactions</h2>
//           <TransactionsTable key={refresh} />
//         </section>
//       </main>
//     </div>
//   );
// };

// export default App;

import React, { useState,useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { Add as AddIcon, CloudUpload as CloudUploadIcon} from '@mui/icons-material'; // Import icons
import AddTransaction from './components/AddTransaction';
import UploadCSV from './components/UploadCSV';
import TransactionsTable from './components/TransactionsTable';

import './App.css';

const App: React.FC = () => {
  const [openAddTransaction, setOpenAddTransaction] = useState(false);
  const [openUploadCSV, setOpenUploadCSV] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [showMainPage, setShowMainPage] = useState(false); // To toggle between intro and main page

  const handleUpdate = () => {
    setRefresh((prev) => prev + 1);
  };
  const handleOpenAddTransaction = () => setOpenAddTransaction(true);
  const handleCloseAddTransaction = () => setOpenAddTransaction(false);
  const handleOpenUploadCSV = () => setOpenUploadCSV(true);
  const handleCloseUploadCSV = () => setOpenUploadCSV(false);// Show main page

  useEffect(() => {
    const savedState = localStorage.getItem('showMainPage');
    if (savedState === 'true') {
      setShowMainPage(true);
    }
  }, []);

  // Handle page navigation
  const handleShowMainPage = () => {
    setShowMainPage(true);
    localStorage.setItem('showMainPage', 'true'); 
    document.body.style.overflow = 'auto';// Persist state
  };

  const handleShowIntroPage = () => {
    setShowMainPage(false);
    localStorage.setItem("showMainPage", "false");
    document.body.style.overflow = 'hidden';
  };

  

  return (
    <div className="App">
      {!showMainPage ? (
        // Intro Section
        <div className="intro-section">
           <button className="top-right-button" onClick={handleShowMainPage}>
          Table
        </button>

        <div className="money-animation">
          <span className="money-icon" style={{ fontSize: '3rem' }}>💵</span>
          <span className="money-icon" style={{ fontSize: '3rem' }}>💰</span>
        </div>
          <div className="intro-text">
            <h1>
             EXPENSE ORCHESTRATOR
            </h1>
            <p>The only place for all transactions</p>
          </div>
        </div>
      ) : (
        // Main Page
        <>
          <header>
            <h1>Expense Orchestrator</h1>
            <button className="top-right-button" onClick={handleShowIntroPage}>
              Home
              </button>
          </header>
          <main>
            <div className="action-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenAddTransaction}
              >
                Add Transaction
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CloudUploadIcon />}
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
        </>
      )}
    </div>
  );
};

export default App;
