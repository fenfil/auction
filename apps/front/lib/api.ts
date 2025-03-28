import axios from "axios";

export const api = axios.create({
  headers: { "Content-Type": "application/json" },
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  responseType: "json",
});

export const serverApi = axios.create({
  headers: { "Content-Type": "application/json" },
  baseURL: process.env.NEXT_PUBLIC_API_LOCAL_URL,
  withCredentials: true,
  responseType: "json",
});
