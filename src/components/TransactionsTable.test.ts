// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import TransactionsTable from "./TransactionsTable";
// import {
//   getAllTransactions,
//   deleteTransaction,
// } from "../services/transactionService";

// jest.mock("../services/transactionService", () => ({
//   getAllTransactions: jest.fn(),
//   deleteTransaction: jest.fn(),
// }));

// describe("TransactionsTable Component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   const mockTransactions = [
//     {
//       id: 1,
//       date: "2025-01-01",
//       description: "Transaction 1",
//       amount: 100,
//       Currency: "USD",
//     },
//     {
//       id: 2,
//       date: "2025-01-02",
//       description: "Transaction 2",
//       amount: 200,
//       Currency: "EUR",
//     },
//   ];

//   const mockConversionRates = {
//     USD: 75,
//     EUR: 85,
//   };

//   it("renders loading indicator initially", async () => {
//     (getAllTransactions as jest.Mock).mockResolvedValue({
//       transactions: [],
//       totalPages: 1,
//     });

//     render(<TransactionsTable />);
//     expect(screen.getByRole("progressbar")).toBeInTheDocument();

//     await waitFor(() => {
//       expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
//     });
//   });

//   it("renders transactions table correctly", async () => {
//     (getAllTransactions as jest.Mock).mockResolvedValue({
//       transactions: mockTransactions,
//       totalPages: 1,
//     });

//     render(<TransactionsTable />);

//     await waitFor(() => {
//       expect(screen.getByText("Transaction 1")).toBeInTheDocument();
//       expect(screen.getByText("Transaction 2")).toBeInTheDocument();
//     });
//   });

//   it("handles transaction deletion", async () => {
//     (getAllTransactions as jest.Mock).mockResolvedValue({
//       transactions: mockTransactions,
//       totalPages: 1,
//     });
//     (deleteTransaction as jest.Mock).mockResolvedValue({});

//     render(<TransactionsTable />);

//     await waitFor(() => {
//       expect(screen.getByText("Transaction 1")).toBeInTheDocument();
//     });

//     const deleteButton = screen.getAllByTestId("delete-button")[0];
//     fireEvent.click(deleteButton);

//     await waitFor(() => {
//       expect(deleteTransaction).toHaveBeenCalledWith(1);
//     });
//   });

//   it("handles API errors gracefully", async () => {
//     (getAllTransactions as jest.Mock).mockRejectedValue(new Error("API error"));

//     render(<TransactionsTable />);

//     await waitFor(() => {
//       expect(
//         screen.getByText(
//           "Failed to fetch transactions. Please try again later."
//         )
//       ).toBeInTheDocument();
//     });
//   });

//   it("filters transactions by search term", async () => {
//     (getAllTransactions as jest.Mock).mockResolvedValue({
//       transactions: mockTransactions,
//       totalPages: 1,
//     });

//     render(<TransactionsTable />);

//     await waitFor(() => {
//       expect(screen.getByText("Transaction 1")).toBeInTheDocument();
//     });

//     const searchInput = screen.getByPlaceholderText("Search");
//     fireEvent.change(searchInput, { target: { value: "Transaction 1" } });

//     await waitFor(() => {
//       expect(screen.getByText("Transaction 1")).toBeInTheDocument();
//       expect(screen.queryByText("Transaction 2")).not.toBeInTheDocument();
//     });
//   });

//   it("generates chart data correctly", async () => {
//     (getAllTransactions as jest.Mock).mockResolvedValue({
//       transactions: mockTransactions,
//       totalPages: 1,
//     });

//     render(<TransactionsTable />);

//     await waitFor(() => {
//       expect(screen.getByText("Transaction 1")).toBeInTheDocument();
//     });

//     const chartButton = screen.getByTestId("chart-button");
//     fireEvent.click(chartButton);

//     await waitFor(() => {
//       expect(screen.getByText("Amount (INR)")).toBeInTheDocument();
//     });
//   });

//   it("handles pagination correctly", async () => {
//     (getAllTransactions as jest.Mock).mockResolvedValue({
//       transactions: mockTransactions,
//       totalPages: 2,
//     });

//     render(<TransactionsTable />);

//     await waitFor(() => {
//       expect(screen.getByText("Transaction 1")).toBeInTheDocument();
//     });

//     const nextPageButton = screen.getByTestId("next-page-button");
//     fireEvent.click(nextPageButton);

//     await waitFor(() => {
//       expect(getAllTransactions).toHaveBeenCalledWith(2, 10);
//     });
//   });
// });
