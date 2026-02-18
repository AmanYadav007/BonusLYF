'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import styles from '@/styles/dashboard.module.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Supabase client
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, [supabase]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setNewPassword('');
        }
        setLoading(false);
    };

    if (!user) {
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/dashboard" className={styles.logoutBtn} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ArrowLeft size={16} /> Back
                    </Link>
                    <div className={styles.title}>Settings</div>
                </div>
                <div>{user.email}</div>
            </header>

            <main className={styles.main}>
                <div className={styles.settingsContainer}>
                    <h2 className={styles.sectionTitle}>Account Security</h2>

                    {message && (
                        <div className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdatePassword}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email Address</label>
                            <input
                                className={styles.input}
                                type="email"
                                value={user.email || ''}
                                disabled
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            />
                            <small style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem', display: 'block' }}>
                                Email cannot be changed here.
                            </small>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>New Password</label>
                            <input
                                className={styles.input}
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.button}
                            disabled={loading || !newPassword}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
