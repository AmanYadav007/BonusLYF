import "server-only";

import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";

function getServiceAccount() {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!json) {
        return null;
    }
    try {
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function getFirebaseAdminApp(): App | null {
    const serviceAccount = getServiceAccount();
    if (!serviceAccount) {
        return null;
    }
    if (getApps().length === 0) {
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