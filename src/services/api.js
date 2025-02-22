import axios from 'axios';

const api = axios.create({
  baseURL: 'https://lease-be-45ce8c8a3508.herokuapp.com/api',
});

export default api;
