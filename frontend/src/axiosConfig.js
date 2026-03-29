import axios from 'axios'

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://handmade-haven-6ygd.onrender.com";

axios.defaults.baseURL = BASE_URL;

export default axios;