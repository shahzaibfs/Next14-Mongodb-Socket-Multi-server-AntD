import { ApiHandler } from "@/helpers";
import { NextResponse } from "next/server";

const handler = ApiHandler(async () => {
  try {
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json({ status: "error", error }, { status: 400 });
  }
});

export { handler as POST };
