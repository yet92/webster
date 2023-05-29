import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export type Command = {
    type: "update" | "delete" | "create";
    item: any;
};

const useSocket = (url = "http://localhost:4000") => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [itemsCommands, setItemsCommands] = useState<Command[]>([]);

    const addCommand = (command: Command) => {
        setItemsCommands([...itemsCommands, command]);
    };

    const pullCommand = () => {
        const command = itemsCommands[0];
        setItemsCommands(itemsCommands.splice(0));
        return command;
    };

    const onConnect = () => {
        setIsConnected(true);
    };

    useEffect(() => {
        setSocket(io(url));

        socket?.on("connect", onConnect);

        return () => {
            socket?.off("connect");
        };
    }, []);

    return { socket, isConnected, itemsCommands, pullCommand, addCommand };
};

export default useSocket;
