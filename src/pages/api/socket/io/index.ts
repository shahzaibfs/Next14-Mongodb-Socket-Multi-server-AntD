import { type Server as NetServer } from "http";
import { type NextApiRequest } from "next";
import { type NextApiResponseServerIo } from "types";
import { socketManager } from "@/libs/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any as NetServer;
    const io = await socketManager.attachServer(httpServer);
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
