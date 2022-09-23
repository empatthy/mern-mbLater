import axios from 'axios';

const $api = axios.create({
  withCredentials: true,
  baseURL: '',
});

$api.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return config;
});

export default $api;
