import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";

const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION = 60 * 60 * 24 * 14 * 1000; // 14 days

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();
        if (!idToken) {
            return NextResponse.json({ error: "Missing idToken" }, { status: 401 });
        }

        const sessionCookie = await getAuth(getFirebaseAdminApp()).createSessionCookie(
            idToken,
            { expiresIn: SESSION_DURATION }
        );

        const response = NextResponse.json({ success: true });
        response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: SESSION_DURATION / 1000,
            path: "/",
        });
        return response;
    } catch (error) {
        console.error("Failed to create session cookie:", error);
        return NextResponse.json({ error: "Invalid ID token" }, { status: 401 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
    });
    return response;
}