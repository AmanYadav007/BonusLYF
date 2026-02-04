"use client";

import styles from "@/styles/chat.module.css";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { COMPANIONS, Companion } from "@/lib/companions";
import Link from "next/link";

export default function ChatPage() {
    const [user, setUser] = useState<any>(null);
    const [companion, setCompanion] = useState<Companion | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [playingAudio, setPlayingAudio] = useState<number | null>(null); // Index of message playing
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const supabase = createClient();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const init = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            const companionId = user.user_metadata?.selected_companion;

            if (!companionId) {
                router.push("/dashboard");
                return;
            }

            const found = COMPANIONS.find((c) => c.id === companionId);
            if (found) {
                setCompanion(found);
                setMessages([
                    {
                        role: "assistant",
                        content: `Hello! I'm ${found.name}. I'm here to listen. How are you feeling right now?`,
                    },
                ]);
            } else {
                // Fallback or invalid ID
                router.push("/dashboard");
                return;
            }
            setLoading(false);
        };
        init();
    }, [supabase, router]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        const userMsg = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setSending(true);

        // Call the API
        try {
            const history = messages.map(m => ({
                role: m.role,
                content: m.content
            }));

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    companionType: companion?.type || 'human',
                    history: history // passing limited history could be an optimization later
                })
            });

            const data = await res.json();

            if (data.error) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: "I'm having trouble connecting right now. (" + data.error + ")" },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.response },
                ]);
            }

        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, I couldn't reach the server." },
            ]);
        } finally {
            setSending(false);
        }
    };

    const playAudio = async (text: string, index: number) => {
        if (playingAudio === index) {
            audioRef.current?.pause();
            setPlayingAudio(null);
            return;
        }

        try {
            setPlayingAudio(index);
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    companionType: companion?.type || 'human',
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'TTS Failed');
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            if (audioRef.current) {
                audioRef.current.pause();
            }

            const audio = new Audio(url);
            audioRef.current = audio;
            audio.play();

            audio.onended = () => {
                setPlayingAudio(null);
                URL.revokeObjectURL(url);
            };

        } catch (err: any) {
            console.error("Audio playback error:", err);
            alert(err.message); // Temporary: show error to user
            setPlayingAudio(null);
        }
    }



    if (loading)
        return (
            <div
                className={styles.container}
                style={{ alignItems: "center", justifyContent: "center" }}
            >
                Loading experience...
            </div>
        );

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>BonusLYF</div>
                <Link href="/dashboard" className={styles.backLink}>
                    ← Change Companion
                </Link>
                <div style={{ marginTop: "auto", fontSize: "0.8rem", opacity: 0.5 }}>
                    {user?.email}
                </div>
            </aside>

            <section className={styles.chatArea}>
                <div className={styles.header}>
                    <div className={styles.companionName}>
                        <span>{companion?.type === "anime" ? "✨" : "☕️"}</span>
                        {companion?.name}
                    </div>
                </div>

                <div className={styles.messages}>
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`${styles.message} ${msg.role === "user" ? styles.userMessage : styles.assistantMessage
                                }`}
                        >
                            {msg.content}
                            {msg.role === "assistant" && (
                                <button
                                    onClick={() => playAudio(msg.content, i)}
                                    className={styles.audioBtn}
                                    title="Play Voice"
                                >
                                    {playingAudio === i ? "⏹" : "🔊"}
                                </button>
                            )}
                        </div>
                    ))}
                    {sending && (
                        <div className={`${styles.message} ${styles.assistantMessage}`}>
                            <span style={{ opacity: 0.7 }}>typing...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className={styles.inputArea}>
                    <form onSubmit={handleSend} className={styles.form}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder={`Message ${companion?.name}...`}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={sending}
                        />
                        <button type="submit" className={styles.sendBtn} disabled={sending}>
                            Send
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
