import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export const useSocket = (tag: string | undefined) => {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : `${import.meta.env.VITE_ENDPOINT_URL}`;

    useEffect(() => {
        if (!tag) {
            return;
        }
        const newSocket = io(URL, {
            query: {
                tag
            },
            auth: { token: `Bearer` }
        });
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.close();
            }
        };
    }, [tag]);

    return socket;
}
