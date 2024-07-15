import { io } from 'socket.io-client';

export const socket = io(
  process.env.NODE_ENV === 'production'
    ? 'https://mern-mblater-be.onrender.com'
    : 'http://localhost:5000',
);
