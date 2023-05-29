import { Server, Socket } from "socket.io";
import http from 'http';

const socketRoom = new Map<string, string>();

export const onConnect = (socket: Socket) => {
    console.log("user connected");

    socket.on("join_project", (data: { projectId: number }) => {
        // delete from room
        if (socketRoom.has(socket.id)) {
            socket.leave(socketRoom.get(socket.id));
            socketRoom.delete(socket.id);
        }

        // add to another room
        const roomId = String(data.projectId);
        socket.join(roomId);
        socketRoom.set(socket.id, roomId);

        console.log("roomId", roomId);

        socket.emit("joined", { projectId: data.projectId });
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
};

export class ServerIO {

  private static io: Server | null = null;

  static get(server?: http.Server) {
    if (!ServerIO.io) {
      if (!server) {
        console.log('SERVER cannot be null when io creates');
        process.exit(1);
      }
      ServerIO.io = new Server(server, {
        cors: {
          origin: "*"
        }
      });
    }
    return ServerIO.io;
  }

}
