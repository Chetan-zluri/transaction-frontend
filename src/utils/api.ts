import axios from "axios";
const api = axios.create({
  baseURL: "https://transaction-dmx4.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;
