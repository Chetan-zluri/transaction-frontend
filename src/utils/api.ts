import axios from "axios";

// Create an instance of axios with default configurations
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Change this to your backend URL if different
  headers: {
    "Content-Type": "application/json",
  },
});

// Export the instance for use in other parts of the application
export default api;
