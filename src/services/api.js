import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL ของ Backend ที่จะทำใน Sprint ถัดไป
  headers: { 'Content-Type': 'application/json' }
});

export default api;