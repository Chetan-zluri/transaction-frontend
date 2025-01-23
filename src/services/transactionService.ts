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
  try {
    const response = await api.put(`/transactions/update/${id}`, transaction);
    return { data: response.data, error: null };
  } catch (error: any) {
    const { response, status } = error;
    let errorMessage = "An error occurred";

    if (status === 400) {
      errorMessage = response?.data?.message || "Invalid data";
    } else if (status === 404) {
      errorMessage = response?.data?.message || "Transaction not found";
    } else if (status === 409) {
      errorMessage = response?.data?.message || "Transaction already exists";
    } else {
      errorMessage = response?.data?.message || "Failed to update transaction";
    }

    return { data: null, error: errorMessage };
  }
};

// Delete a transaction
export const deleteTransaction = async (id: number) => {
  try {
    const response = await api.delete(`/transactions/delete/${id}`);
    return { data: response.data, error: null };
  } catch (error: any) {
    const { response, status } = error;
    let errorMessage = "An error occurred";

    if (status === 404) {
      errorMessage = response?.data?.message || "Transaction not found";
    } else if (status === 500) {
      errorMessage = response?.data?.message || "Error deleting transaction";
    } else {
      errorMessage = response?.data?.message || "Failed to delete transaction";
    }

    return { data: null, error: errorMessage };
  }
};

// Delete multiple transactions
export const deleteTransactions = async (ids: number[]) => {
  try {
    const response = await api.delete(`/transactions/delete-multiple`, {
      data: { ids },
    });
    return { data: response.data, error: null };
  } catch (error: any) {
    const { response, status } = error;
    let errorMessage = "An error occurred";

    if (status === 400) {
      errorMessage =
        response?.data?.message || "Invalid input: Array of IDs is required";
    } else if (status === 500) {
      errorMessage = response?.data?.message || "Error deleting transactions";
    } else {
      errorMessage = response?.data?.message || "Failed to delete transactions";
    }

    return { data: null, error: errorMessage };
  }
};

// Upload CSV file

export const uploadCSV = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data;

    if (data.message === "Transactions are already Updated.") {
      return { data: null, error: data.message };
    }

    return { data, error: null };
  } catch (error: any) {
    const { response, status } = error;
    let errorMessage = "An error occurred";

    if (status === 400) {
      errorMessage = response?.data?.message || "Invalid file";
    } else if (status === 500) {
      errorMessage = response?.data?.message || "Error processing CSV file";
    } else {
      errorMessage = response?.data?.message || "Failed to upload file";
    }

    return { data: null, error: errorMessage };
  }
};
