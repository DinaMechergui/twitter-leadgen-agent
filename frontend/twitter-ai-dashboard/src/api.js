import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // l'adresse de ton backend FastAPI
  timeout: 5000,
});
