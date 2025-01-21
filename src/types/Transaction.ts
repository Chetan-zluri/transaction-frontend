export interface Transaction {
  id: number; // Matches the PrimaryKey in your entity
  date: string; // Use string because dates are often sent as ISO strings in APIs
  description: string; // Text field for description
  amount: number; // The transaction amount
  Currency: string; // Adjusted for capitalization consistency with "Currency"
  deleted: boolean; // Tracks soft-deleted transactions
}
