import { type Server as NetServer } from "http";
import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { type SessionSocket } from "types";
import { env } from "@/env";
import "colors";

class SocketManager {
  private static instance: SocketManager;
  public io: SocketServer | null;
  private constructor() {
    this.io = null;
  }
  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }
  public async attachServer(httpServer: NetServer): Promise<SocketServer> {
    try {
      this.io = new SocketServer(httpServer, {
        path: env.SOCKET_PATH,
        addTrailingSlash: true,
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      });
      await this.createIoAdopter();
      console.log("Socket Server Started".green);
      return this.io;
    } catch (error) {
      console.error("Error Happend while Creating Io Redis Adopter ...", error);
      throw error;
    }
  }
  private async createIoAdopter() {
    try {
      if (!this.io) return;
      // =====================================
      // Multi Server Support
      // =====================================
      const pubClient = createClient();
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);
      const adapter = createAdapter(pubClient, subClient);
      this.io.adapter(adapter);
      // *************************************
      // =====================================
      // Subscribe to Listners :)
      // =====================================
      await this.flushMiddlewares();
      await this.flushListners();
    } catch (error) {
      console.error("Error Happend :", error);
      throw error;
    }
  }
  private async flushMiddlewares() {
    // TODO: ??? JWT Decrypt session TODO: Assign userId to socket
    this.io?.use((socket: SessionSocket, next) => {
      const userId = socket.handshake.query?.userId?.toString();
      if (!userId) {
        next(new Error("BAD RREQUEST: Invalid UserId"));
        return;
      }
      socket.userId = userId;
      console.log(
        `${"Incoming Connection =>".green} | ${userId.toString()} | => (${socket.id.toString()})`,
      );
      next();
    });
  }
  private async flushListners() {
    try {
      if (!this.io) return;
      this.io.on("connection", async (socket: SessionSocket) => {
        try {
          await this.maintainSession(socket);
          await this.commonSocketEvListners(socket);
          await this.privateSocketEvListners();
        } catch (error) {
          console.error("Error Happend :", error);
          socket.disconnect(true);
        }
      });
    } catch (error) {
      console.error("Error Happend :".bgRed, error);
      throw error;
    }
  }
  private async commonSocketEvListners(socket: SessionSocket) {
    try {
      socket.on("disconnect", async () => {
        if (!socket.userId || !this.io) {
          throw Error("Either userId or Io object is missing!");
        }
        const matchingSockets = await this.io.in(socket?.userId).fetchSockets();
        const isDisconnected = matchingSockets.length === 0;
        if (isDisconnected) {
          socket.broadcast.emit("user disconnected", socket.userId);
          socket.disconnect();
        }
      });
    } catch (error) {
      throw error;
    }
  }
  private async maintainSession(socket: SessionSocket) {
    try {
      if (!socket.userId)
        throw Error(
          "Please Attach user id to Socket instance callstack-> maintainSession()",
        );
      await socket.join(socket.userId);
    } catch (error) {
      throw error;
    }
  }
  private async privateSocketEvListners() {
    // =================================================
    // extract user  Early return ||  hasPermission(role,module,action)
    // =================================================
  }
}

export const socketManager = SocketManager.getInstance();
