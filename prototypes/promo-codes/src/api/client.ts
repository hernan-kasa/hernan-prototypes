import axios from "axios";

// In production (Netlify), Vite sets import.meta.env.BASE_URL to "/promo-codes/"
// Netlify proxy redirects /promo-codes/api/* to the Railway backend
// In dev, Vite proxy handles /api → localhost:8000
const base = import.meta.env.DEV ? "/api" : `${import.meta.env.BASE_URL}api`;

const api = axios.create({
  baseURL: base,
  headers: { "Content-Type": "application/json" },
});

export default api;
