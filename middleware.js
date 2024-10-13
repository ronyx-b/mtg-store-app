// import { NextResponse } from "next/server";
// import jwtPassportUtils from "./utils/jwtPassportUtils";

/**
 * Middleware handler
 * @async
 * @param {import("next/server").NextRequest} request 
 */
export async function middleware(request) {
  console.log(`requested: ${request.pathname}`);

  // switch(request.nextUrl.pathname) {
  //   case "/api/user/login":
  //     console.log("user requested login");
  //     break;
  //   case "/api/user/orders":
  //     console.log("user requested login");
  //     break;
  //   // case "/api/user/is-admin":
  //   //   let isAdmin = jwtPassportUtils.isAdmin(request);
  //   //   console.log({isAdmin});
  //   //   break;
  //   default:
  //     console.log("path not defined");
  //     break;
  // }
}

export const config = {
  matcher: ["/api/user/:path*"],
};