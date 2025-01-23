// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import TransactionsTable from "./TransactionsTable"; // Adjust path as needed
// import {
//   getAllTransactions,
//   updateTransaction,
//   deleteTransaction,
//   deleteTransactions,
// } from "../services/transactionService";

// jest.mock("../services/transactionService");

// describe("TransactionsTable Component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test("renders loading spinner while fetching data", async () => {
//     getAllTransactions.mockResolvedValueOnce({
//       transactions: [],
//       totalPages: 1,
//     });

//     render(<TransactionsTable />);

//     expect(screen.getByRole("progressbar")).toBeInTheDocument();

//     await waitFor(() => {
//       expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
//     });
//   });

//   test("renders fetched transactions", async () => {
//     const mockTransactions = [
//       {
//         id: 1,
//         date: "2023-01-01",
//         description: "Test Transaction",
//         amount: 100,
//         Currency: "USD",
//       },
//     ];

//     getAllTransactions.mockResolvedValueOnce({
//       transactions: mockTransactions,
//       totalPages: 1,
//     });

//     render(<TransactionsTable />);

//     await waitFor(() => {
//       expect(screen.getByText("Test Transaction")).toBeInTheDocument();
//       expect(screen.getByText("100")).toBeInTheDocument();
//       expect(screen.getByText("USD")).toBeInTheDocument();
//     });
//   });

//   test("handles delete transaction", async () => {
//     const mockTransactions = [
//       {
//         id: 1,
//         date: "2023-01-01",
//         description: "Test Transaction",
//         amount: 100,
//         Currency: "USD",
//       },
//     ];

//     getAllTransactions.mockResolvedValueOnce({
//       transactions: mockTransactions,
//       totalPages: 1,
//     });
//     deleteTransaction.mockResolvedValueOnce({});

//     render(<TransactionsTable />);

//     await waitFor(() => {
//       expect(screen.getByText("Test Transaction")).toBeInTheDocument();
//     });

//     const deleteButton = screen.getByLabelText("delete-transaction-1");
//     fireEvent.click(deleteButton);

//     expect(deleteTransaction).toHaveBeenCalledWith(1);

//     await waitFor(() => {
//       expect(screen.queryByText("Test Transaction")).not.toBeInTheDocument();
//     });
//   });

//   test("handles editing a transaction", async () => {
//     const mockTransactions = [
//       {
//         id: 1,
//         date: "2023-01-01",
//         description: "Test Transaction",
//         amount: 100,
//         Currency: "USD",
//       },
//     ];

//     getAllTransactions.mockResolvedValueOnce({
//       transactions: mockTransactions,
//       totalPages: 1,
//     });
//     updateTransaction.mockResolvedValueOnce({
//       transaction: {
//         id: 1,
//         date: "2023-01-01",
//         description: "Updated Transaction",
//         amount: 150,
//         Currency: "USD",
//       },
//     });

//     render(<TransactionsTable />);

//     await waitFor(() => {
//       expect(screen.getByText("Test Transaction")).toBeInTheDocument();
//     });

//     const editButton = screen.getByLabelText("edit-transaction-1");
//     fireEvent.click(editButton);

//     const descriptionInput = screen.getByLabelText("Description");
//     fireEvent.change(descriptionInput, {
//       target: { value: "Updated Transaction" },
//     });

//     const amountInput = screen.getByLabelText("Amount");
//     fireEvent.change(amountInput, { target: { value: "150" } });

//     const saveButton = screen.getByText("Save");
//     fireEvent.click(saveButton);

//     expect(updateTransaction).toHaveBeenCalledWith(1, {
//       id: 1,
//       date: "2023-01-01",
//       description: "Updated Transaction",
//       amount: 150,
//       Currency: "USD",
//     });

//     await waitFor(() => {
//       expect(screen.getByText("Updated Transaction")).toBeInTheDocument();
//       expect(screen.getByText("150")).toBeInTheDocument();
//     });
//   });

//   test("handles search functionality", async () => {
//     const mockTransactions = [
//       {
//         id: 1,
//         date: "2023-01-01",
//         description: "Test Transaction",
//         amount: 100,
//         Currency: "USD",
//       },
//       {
//         id: 2,
//         date: "2023-02-01",
//         description: "Another Transaction",
//         amount: 200,
//         Currency: "EUR",
//       },
//     ];

//     getAllTransactions.mockResolvedValueOnce({
//       transactions: mockTransactions,
//       totalPages: 1,
//     });

//     render(<TransactionsTable />);

//     await waitFor(() => {
//       expect(screen.getByText("Test Transaction")).toBeInTheDocument();
//     });

//     const searchInput = screen.getByPlaceholderText("Search Transactions");
//     fireEvent.change(searchInput, { target: { value: "Another" } });

//     const searchButton = screen.getByText("Search");
//     fireEvent.click(searchButton);

//     await waitFor(() => {
//       expect(screen.getByText("Another Transaction")).toBeInTheDocument();
//       expect(screen.queryByText("Test Transaction")).not.toBeInTheDocument();
//     });
//   });

//   test("handles pagination", async () => {
//     const mockTransactionsPage1 = [
//       {
//         id: 1,
//         date: "2023-01-01",
//         description: "Page 1 Transaction",
//         amount: 100,
//         Currency: "USD",
//       },
//     ];
//     const mockTransactionsPage2 = [
//       {
//         id: 2,
//         date: "2023-02-01",
//         description: "Page 2 Transaction",
//         amount: 200,
//         Currency: "EUR",
//       },
//     ];

//     getAllTransactions.mockImplementation((page) => {
//       if (page === 1)
//         return Promise.resolve({
//           transactions: mockTransactionsPage1,
//           totalPages: 2,
//         });
//       if (page === 2)
//         return Promise.resolve({
//           transactions: mockTransactionsPage2,
//           totalPages: 2,
//         });
//     });

//     render(<TransactionsTable />);

//     await waitFor(() => {
//       expect(screen.getByText("Page 1 Transaction")).toBeInTheDocument();
//     });

//     const nextPageButton = screen.getByLabelText("Next Page");
//     fireEvent.click(nextPageButton);

//     await waitFor(() => {
//       expect(screen.getByText("Page 2 Transaction")).toBeInTheDocument();
//       expect(screen.queryByText("Page 1 Transaction")).not.toBeInTheDocument();
//     });
//   });
// });
