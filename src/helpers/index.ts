import dbConnect from "@/libs/mongodb";
import { type NextRequest, NextResponse } from "next/server";

type Middleware = (req: NextRequest) => Promise<NextRequest | NextResponse>;

function corsResponse() {
  return new NextResponse("Cors Verified", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Request-Method": "*",
      "Access-Control-Allow-Methods": "OPTIONS, GET",
      "Access-Control-Allow-Headers": "*",
    },
    status: 200,
  });
}

export function ApiHandler(
  ftn: (req: NextRequest) => Promise<NextResponse>,
  ...middlewares: Middleware[]
) {
  return async (req: NextRequest) => {
    if (req.method === "OPTIONS") {
      return corsResponse();
    }
    await dbConnect();

    /**
     * Run All the Middlewares Incoming from the ApiHnadler....
     * TODO: ERROR Management.
     * TODO: Need to test. 
     */
    for (const middleware of middlewares) {
      const result = await middleware(req);
      if (result instanceof NextResponse) {
        return result;
      }
      req = result;
    }

    return await ftn(req);
  };
}
