import { ApiHandler } from "@/helpers";
import Server from "@/schema/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  url: z.string().url(),
  password: z.string(),
});

const handler = ApiHandler(async (req: NextRequest) => {
  try {
    const reqBody = schema.parse(await req.json());
    let server = new Server(reqBody);
    server = await server.save();

    const s = await Server.findById(server._id).select("-__v -password");

    return NextResponse.json({ status: "ok", server: s });
  } catch (error) {
    return NextResponse.json({ status: "error", error }, { status: 400 });
  }
});

export { handler as POST };
