import { io } from 'socket.io-client';

export const socket = io(
  process.env.NODE_ENV === 'production'
    ? 'https://infinite-oasis-67404.herokuapp.com'
    : 'http://localhost:5000',
);
