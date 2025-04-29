import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  // Allow access to all pages without authentication
  return NextResponse.next();
}

// Sadece korumalı rotaları belirt
export const config = {
  matcher: [
    "/vehicle-setup",
    "/analysis",
    "/dashboard",
    "/profile",
    "/auth"
  ],
};