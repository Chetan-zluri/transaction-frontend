import api from "../utils/api";

// Get all transactions with pagination
export const getAllTransactions = async (page: number, limit: number) => {
  const response = await api.get(`/transactions?page=${page}&limit=${limit}`);
  return response.data;
};

// Get a transaction by ID
export const getTransactionById = async (id: number) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

// Add a new transaction
export const addTransaction = async (transaction: {
  date: string;
  description: string;
  amount: number;
  Currency: string;
}) => {
  const response = await api.post("/transactions", transaction);
  return response.data;
};

// Update an existing transaction
export const updateTransaction = async (
  id: number,
  transaction: {
    date: string;
    description: string;
    amount: number;
    Currency: string;
  }
) => {
  const response = await api.put(`/transactions/update/${id}`, transaction);
  return response.data;
};

// Delete a transaction
export const deleteTransaction = async (id: number) => {
  const response = await api.delete(`/transactions/delete/${id}`);
  return response.data;
};

// Upload CSV file
export const uploadCSV = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
