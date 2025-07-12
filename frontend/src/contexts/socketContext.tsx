import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './authContext';

interface ServerToClientEvents {
	'get-notification': (data: any) => void;
}

interface ClientToServerEvents {
	'register-user': (userId: string) => void;
	// 'notify':()=>void;
}

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = createContext<TypedSocket | null>(null);

interface SocketProviderProps {
	userId?: string | null;
	children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
	const { user } = useAuth();
	const socketRef = useRef<TypedSocket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		if (!user?.id) return;

		const socket: TypedSocket = io(import.meta.env.VITE_APP_SOCKET_URL, {
			transports: ['websocket'],
		});

		socket.emit('register-user', user?.id);
		socketRef.current = socket;
		setIsConnected(true);

		return () => {
			socket.disconnect();
			setIsConnected(false);
		};
	}, [user]);

	return (
		<SocketContext.Provider value={isConnected ? socketRef.current : null}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	return useContext(SocketContext);
};