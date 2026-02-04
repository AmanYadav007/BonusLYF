"use client";

import styles from "@/styles/dashboard.module.css";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { COMPANIONS, Companion } from "@/lib/companions";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);
            }
        };
        getUser();
    }, [supabase, router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const selectCompanion = async (companionId: string) => {
        if (!user) return;

        // Use updateUser to store preference in user_metadata locally first
        // ideally we save to a table, but metadata is a good quick start
        const { error } = await supabase.auth.updateUser({
            data: { selected_companion: companionId },
        });

        if (!error) {
            router.push(`/chat`);
        } else {
            console.error("Failed to save preference", error);
        }
    };

    if (!user) return null; // Or loading spinner

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>BonusLYF</div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <span>{user.email}</span>
                    <button onClick={handleSignOut} className={styles.logoutBtn}>
                        Sign Out
                    </button>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.heading}>
                    <h2>Choose Your Companion</h2>
                    <p>Who would you like to talk to today?</p>
                </div>

                <div className={styles.grid}>
                    {COMPANIONS.map((companion) => (
                        <div
                            key={companion.id}
                            className={styles.card}
                            onClick={() => selectCompanion(companion.id)}
                        >
                            <div className={styles.cardIcon}>
                                {companion.type === "anime" ? "✨" : "☕️"}
                            </div>
                            <h3 className={styles.cardTitle}>{companion.name}</h3>
                            <p className={styles.cardDesc}>{companion.description}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
