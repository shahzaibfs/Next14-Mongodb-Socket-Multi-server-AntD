import { ApiHandler } from "@/helpers";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["SERVER_RESTART"]),
});

const handler = ApiHandler(async (req: NextRequest) => {
  try {
    const reqBody = schema.parse(await req.json());
    const { type } = reqBody;

    switch (type) {
      case "SERVER_RESTART":
        return NextResponse.json({ status: "ok" });
    }
  } catch (error) {
    return NextResponse.json({ status: "error", error }, { status: 400 });
  }
});

export { handler as POST };
