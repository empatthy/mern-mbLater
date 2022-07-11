import { createContext } from 'react';
import { Socket } from 'socket.io-client';

export type SocketContextValue = {
  socket: Socket | undefined;
  setSocket: (socket: Socket | undefined) => void;
};

export const SocketContext = createContext<SocketContextValue>({
  socket: undefined,
  setSocket: () => {},
});
