import { useEffect, useRef } from "react";
import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

export const useSocket = (
    uri: string,
    opts?: Partial<ManagerOptions & SocketOptions>
): Socket | null => {
    const socketRef = useRef<Socket | null>(null);

    if (!socketRef.current) {
        socketRef.current = io(uri, opts); 
    }

    useEffect(() => {
        return () => {
            socketRef.current?.close(); 
        };
    }, []);

    return socketRef.current;
};