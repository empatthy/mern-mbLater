import axios from 'axios';

const $api = axios.create({
  withCredentials: true,
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://infinite-oasis-67404.herokuapp.com'
      : 'http://localhost:3000',
});

$api.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return config;
});

export default $api;
