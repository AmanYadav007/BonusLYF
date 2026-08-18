import { NextResponse, type NextRequest } from "next/server";
import { updateSession, isFirebaseConfigured } from "@/lib/middleware";

export async function middleware(request: NextRequest) {
    if (!isFirebaseConfigured()) {
        return NextResponse.next();
    }
    return await updateSession(request);
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/chat/:path*",
        "/login",
        "/register",
    ],
    runtime: "nodejs",
};
