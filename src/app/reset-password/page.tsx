'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import styles from '@/styles/auth.module.css';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const oobCode = searchParams.get('oobCode');
    const mode = searchParams.get('mode');
    const invalidLink = !oobCode || mode !== 'resetPassword';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!oobCode) return;
        setLoading(true);
        setError(null);

        try {
            await confirmPasswordReset(getFirebaseAuth(), oobCode, password);
            router.push('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password');
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>New Password</h1>
                    <p className={styles.subtitle}>Enter your new password below</p>
                </div>

                {error && <div className={styles.error}>{error}</div>}
                {invalidLink && !error && <div className={styles.error}>Invalid or expired reset link. Please request a new one.</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="New password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={loading || invalidLink}>
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>

                <div className={styles.footer}>
                    Remembered your password?{" "}
                    <Link href="/login" className={styles.link}>
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordForm />
        </Suspense>
    );
}