import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export const useSocket = (tag: string | undefined, token: string | null) => {
    const [socket, setSocket] = useState<Socket | undefined>(undefined);

    useEffect(() => {
        if (!tag) {
            return;
        }
        const newSocket = io('http://localhost:8080', {
            query: {
                tag
            },
            auth: { token: `Bearer ${token}` }
        });
        setSocket(newSocket);

        return () => {
            if (newSocket) {
                newSocket.close();
            }
        };
    }, [tag, token]);

    return socket;
}
