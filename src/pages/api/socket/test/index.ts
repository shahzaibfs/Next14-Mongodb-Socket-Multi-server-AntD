import { type NextApiRequest } from "next";
import { type NextApiResponseServerIo } from "types";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  const io = res.socket.server.io;
  io.sockets.to("shahzaib").emit("test", "world");
  return res.status(200).json({ mesage: await io.sockets.adapter.serverCount() });
};

export default handler;
