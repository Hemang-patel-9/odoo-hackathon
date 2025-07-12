
import { useContext } from 'react';
import { SocketContext } from '../contexts/socketContext';

export const useSocket = () => useContext(SocketContext);