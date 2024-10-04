import { NextResponse } from "next/server";
import { verifyJWT, getAuthHeader } from "./utils/helpers/authHelpers";

const unsafeMethods = ["POST", "PUT", "DELETE"];

export async function middleware(req) {
  console.log("Middleware is running", req.url.pathname);
  const url = new URL(req.url);
  if (
    unsafeMethods.includes(req.method) ||
    url.pathname.includes("api/users")
  ) {
    console.log("VERIFY");
    try {
      const bearer = req.headers.get("Authorization") || "";
      const token = bearer.split(" ")?.[1]; // get the token from the Authorization header through optional chaining

      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const jwtPayload = await verifyJWT(token);

      // Om JWT verifieras, lägg till användarens ID i headers
      const headers = new Headers(req.headers);
      headers.set("userId", JSON.stringify(jwtPayload.userId));

      return NextResponse.next({ headers: headers });
    } catch (error) {
      return NextResponse.json(
        {
          error: "Unauthorized request",
        },
        { status: 401 }
      );
    }
  }
}

export const config = {
  matcher: ["/api/items/", "/api/items/:path*"],
};
