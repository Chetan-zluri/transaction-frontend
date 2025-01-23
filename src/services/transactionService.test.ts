import {
  getAllTransactions,
  getTransactionById,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  deleteTransactions,
  uploadCSV,
} from "../services/transactionService";
import api from "../utils/api";

jest.mock("../utils/api");

describe("Transaction Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all transactions with pagination", async () => {
    const mockData = { transactions: [], totalPages: 1 };
    (api.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await getAllTransactions(1, 10);
    expect(result).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith("/transactions?page=1&limit=10");
  });

  it("should get a transaction by ID", async () => {
    const mockData = { id: 1, description: "Test transaction" };
    (api.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await getTransactionById(1);
    expect(result).toEqual(mockData);
    expect(api.get).toHaveBeenCalledWith("/transactions/1");
  });

  it("should add a new transaction", async () => {
    const mockData = { id: 1, description: "New transaction" };
    const newTransaction = {
      date: "2025-01-01",
      description: "New transaction",
      amount: 100,
      Currency: "USD",
    };
    (api.post as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await addTransaction(newTransaction);
    expect(result).toEqual(mockData);
    expect(api.post).toHaveBeenCalledWith("/transactions", newTransaction);
  });

  it("should update an existing transaction", async () => {
    const mockData = { id: 1, description: "Updated transaction" };
    const updatedTransaction = {
      date: "2025-01-01",
      description: "Updated transaction",
      amount: 150,
      Currency: "USD",
    };
    (api.put as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await updateTransaction(1, updatedTransaction);
    expect(result).toEqual({ data: mockData, error: null });
    expect(api.put).toHaveBeenCalledWith(
      "/transactions/update/1",
      updatedTransaction
    );
  });

  it("should return an error when updating a transaction with invalid data", async () => {
    const mockError = {
      response: { data: { message: "Invalid data" }, status: 400 },
    };
    (api.put as jest.Mock).mockRejectedValue(mockError);

    const updatedTransaction = {
      date: "2025-01-01",
      description: "Updated transaction",
      amount: 150,
      Currency: "USD",
    };
    const result = await updateTransaction(1, updatedTransaction);
    expect(result).toEqual({ data: null, error: "Invalid data" });
  });

  it("should return an error when updating a transaction that does not exist", async () => {
    const mockError = {
      response: { data: { message: "Transaction not found" }, status: 404 },
    };
    (api.put as jest.Mock).mockRejectedValue(mockError);

    const updatedTransaction = {
      date: "2025-01-01",
      description: "Updated transaction",
      amount: 150,
      Currency: "USD",
    };
    const result = await updateTransaction(1, updatedTransaction);
    expect(result).toEqual({ data: null, error: "Transaction not found" });
  });

  it("should return an error when updating a transaction that already exists", async () => {
    const mockError = {
      response: {
        data: { message: "Transaction already exists" },
        status: 409,
      },
    };
    (api.put as jest.Mock).mockRejectedValue(mockError);

    const updatedTransaction = {
      date: "2025-01-01",
      description: "Updated transaction",
      amount: 150,
      Currency: "USD",
    };
    const result = await updateTransaction(1, updatedTransaction);
    expect(result).toEqual({ data: null, error: "Transaction already exists" });
  });

  it("should delete a transaction", async () => {
    const mockData = { message: "Transaction deleted" };
    (api.delete as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await deleteTransaction(1);
    expect(result).toEqual({ data: mockData, error: null });
    expect(api.delete).toHaveBeenCalledWith("/transactions/delete/1");
  });

  it("should return an error when deleting a transaction that does not exist", async () => {
    const mockError = {
      response: { data: { message: "Transaction not found" }, status: 404 },
    };
    (api.delete as jest.Mock).mockRejectedValue(mockError);

    const result = await deleteTransaction(1);
    expect(result).toEqual({ data: null, error: "Transaction not found" });
  });

  it("should delete multiple transactions", async () => {
    const mockData = { message: "Transactions deleted" };
    const ids = [1, 2, 3];
    (api.delete as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await deleteTransactions(ids);
    expect(result).toEqual({ data: mockData, error: null });
    expect(api.delete).toHaveBeenCalledWith("/transactions/delete-multiple", {
      data: { ids },
    });
  });

  it("should return an error when deleting multiple transactions with invalid input", async () => {
    const mockError = {
      response: {
        data: { message: "Invalid input: Array of IDs is required" },
        status: 400,
      },
    };
    (api.delete as jest.Mock).mockRejectedValue(mockError);

    const ids = [1, 2, 3];
    const result = await deleteTransactions(ids);
    expect(result).toEqual({
      data: null,
      error: "Invalid input: Array of IDs is required",
    });
  });

  it("should upload a CSV file", async () => {
    const mockData = { message: "File uploaded" };
    const file = new File(["dummy content"], "test.csv", { type: "text/csv" });
    const formData = new FormData();
    formData.append("file", file);
    (api.post as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await uploadCSV(file);
    expect(result).toEqual({ data: mockData, error: null });
    expect(api.post).toHaveBeenCalledWith("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  });

  it("should return an error when uploading an invalid CSV file", async () => {
    const mockError = {
      response: { data: { message: "Invalid file" }, status: 400 },
    };
    (api.post as jest.Mock).mockRejectedValue(mockError);

    const file = new File(["dummy content"], "test.csv", { type: "text/csv" });
    const result = await uploadCSV(file);
    expect(result).toEqual({ data: null, error: "Invalid file" });
  });

  it("should return an error when all transactions in CSV are duplicates", async () => {
    const mockData = { message: "Transactions are already Updated." };
    const file = new File(["dummy content"], "test.csv", { type: "text/csv" });
    (api.post as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await uploadCSV(file);
    expect(result).toEqual({
      data: null,
      error: "Transactions are already Updated.",
    });
  });

  it("should return an error when there is an error processing the CSV file", async () => {
    const mockError = {
      response: { data: { message: "Error processing CSV file" }, status: 500 },
    };
    (api.post as jest.Mock).mockRejectedValue(mockError);

    const file = new File(["dummy content"], "test.csv", { type: "text/csv" });
    const result = await uploadCSV(file);
    expect(result).toEqual({ data: null, error: "Error processing CSV file" });
  });
});
