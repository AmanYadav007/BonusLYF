import "server-only";

import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";

function getServiceAccount() {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!json) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set");
    }
    return JSON.parse(json);
}

export function getFirebaseAdminApp(): App {
    if (getApps().length === 0) {
        const serviceAccount = getServiceAccount();
        return initializeApp({
            credential: cert(
                serviceAccount as {
                    projectId: string;
                    clientEmail: string;
                    privateKey: string;
                }
            ),
        });
    }
    return getApp();
}