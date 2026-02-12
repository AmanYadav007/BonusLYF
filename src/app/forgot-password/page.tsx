'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import styles from '@/styles/auth.module.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/reset-password`,
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({
                type: 'success',
                text: 'Check your email for the password reset link.'
            });
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Reset Password</h1>
                    <p className={styles.subtitle}>Enter your email to receive a reset link</p>
                </div>

                {message && (
                    <div
                        className={styles.error}
                        style={message.type === 'success' ? {
                            backgroundColor: 'rgba(0, 255, 100, 0.1)',
                            borderColor: 'rgba(0, 255, 100, 0.3)',
                            color: '#cfc'
                        } : undefined}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Sending link..." : "Send Reset Link"}
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
