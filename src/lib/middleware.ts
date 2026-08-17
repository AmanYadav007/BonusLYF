import { NextResponse, type NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";

const SESSION_COOKIE_NAME = "session";

export async function updateSession(request: NextRequest) {
    let user = null;

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (sessionCookie) {
        try {
            user = await getAuth(getFirebaseAdminApp()).verifySessionCookie(
                sessionCookie,
                true
            );
        } catch {
            // Invalid or expired session cookie
        }
    }

    // Protected routes logic
    if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/chat") && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Auth routes logic (redirect to dashboard if already logged in)
    if ((request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")) && user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next({ request });
}