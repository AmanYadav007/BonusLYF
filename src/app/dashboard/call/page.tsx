"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { COMPANIONS, Companion } from "@/lib/companions";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function CallPage() {
    const [user, setUser] = useState<any>(null);
    const [companion, setCompanion] = useState<Companion | null>(null);
    const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "ended">("connecting");
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);
    const [companionState, setCompanionState] = useState<"idle" | "listening" | "speaking">("idle");

    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const supabase = createClient();

    // 1. Auth & Companion Selection
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            const companionId = user.user_metadata?.selected_companion;
            const found = COMPANIONS.find(c => c.id === companionId) || COMPANIONS[0];
            setCompanion(found);

            // Simulate connection delay
            setTimeout(() => {
                setCallStatus("connected");
                setCompanionState("listening");
            }, 2500);
        };
        init();
    }, [supabase, router]);

    // 2. Speech Recognition Setup
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                if (text) {
                    console.log("User said:", text);
                    handleUserMessage(text);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                if (event.error === 'not-allowed') {
                    setMicOn(false);
                }
                // If no speech/error, go back to listening if supposed to
                if (companionState === 'listening' && event.error === 'no-speech') {
                    // Optional: nudge user?
                }
            };

            recognitionRef.current.onend = () => {
                // Determine if we need to restart
                // driven by state in the other useEffect
            };
        }
    }, []);

    // Manage Listening State
    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (companionState === 'listening' && micOn && callStatus === 'connected') {
            try {
                recognition.start();
            } catch (e) {
                // Already started
            }
        } else {
            recognition.stop();
        }
    }, [companionState, micOn, callStatus]);

    const handleUserMessage = async (text: string) => {
        if (!companion) return;

        // 1. Transition to thinking state
        setCompanionState("idle");

        try {
            console.log("Processing user input:", text);

            // 2. Get AI Text Response
            const chatRes = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    companionType: companion.type,
                    history: []
                })
            });

            if (!chatRes.ok) throw new Error("AI Service Unavailable");

            const chatData = await chatRes.json();
            const aiText = chatData.response; // e.g. "I'm doing great!"

            if (!aiText) throw new Error("Empty AI Response");

            console.log("AI says:", aiText);

            // 3. Get Audio Response (TTS)
            const ttsRes = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: aiText,
                    companionType: companion.type
                })
            });

            if (!ttsRes.ok) throw new Error("Voice Service Unavailable");

            const audioBlob = await ttsRes.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // 4. Play Audio & Animate
            const audio = new Audio(audioUrl);

            // Start speaking animation when audio starts
            audio.onplay = () => {
                setCompanionState("speaking");
            };

            // Go back to listening when audio ends
            audio.onended = () => {
                setCompanionState("listening");
                URL.revokeObjectURL(audioUrl);
            };

            // Handle playback errors
            audio.onerror = (e) => {
                console.error("Audio playback error", e);
                setCompanionState("listening");
            };

            await audio.play();

        } catch (err) {
            console.error("Interaction failed:", err);
            // If anything fails, go back to listening so the user isn't stuck
            setCompanionState("listening");
        }
    };

    // 2. User Camera Stream
    useEffect(() => {
        const startVideo = async () => {
            if (callStatus === 'connected' && videoOn) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Camera access denied:", err);
                    setVideoOn(false);
                }
            }
        };
        if (callStatus === 'connected') {
            startVideo();
        }
        return () => {
            // Cleanup tracks if needed
        };
    }, [callStatus, videoOn]);


    // 3. Audio Visualizer Simulation (Visual only)
    const AudioVisualizer = ({ active }: { active: boolean }) => (
        <div className="flex items-center gap-1 h-8">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={active ? {
                        height: [10, 24, 10],
                        opacity: [0.5, 1, 0.5]
                    } : { height: 4, opacity: 0.3 }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                    }}
                    className={`w-1.5 rounded-full ${companion?.type === 'anime' ? 'bg-violet-400' : 'bg-cyan-400'}`}
                />
            ))}
        </div>
    );

    if (!user || !companion) return null;

    return (
        <div className="relative w-full h-screen bg-midnight overflow-hidden flex flex-col items-center justify-center">

            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 ${companion.type === 'anime' ? 'bg-violet-600' : 'bg-cyan-600'}`} />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            </div>

            {/* Connection Screen */}
            <AnimatePresence>
                {callStatus === "connecting" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-midnight/90 backdrop-blur-xl"
                    >
                        <motion.div
                            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-32 h-32 rounded-full mb-8 flex items-center justify-center ${companion.type === 'anime' ? 'bg-violet-500/20' : 'bg-cyan-500/20'}`}
                        >
                            <span className="text-4xl animate-pulse">
                                {companion.type === 'anime' ? '✨' : '☕️'}
                            </span>
                        </motion.div>
                        <h2 className="text-2xl font-display font-medium text-white mb-2">Connecting to {companion.name}...</h2>
                        <p className="text-muted-foreground">Securing encryption...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="relative z-10 w-full h-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col">

                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <span className={`w-2 h-2 rounded-full ${callStatus === 'connected' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-amber-400'}`} />
                        <span className="text-sm font-medium text-white/90">
                            {callStatus === 'connected' ? 'Live Encrypted' : 'Connecting...'}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full">
                        <Settings className="w-5 h-5" />
                    </Button>
                </header>

                {/* Main Video Area */}
                <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/10 bg-black/20 shadow-2xl">

                    {/* Companion "Video" (Simulated with Image + Breath) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={companionState === "speaking" ? { scale: 1.05 } : { scale: 1 }}
                            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                            className="relative w-full h-full"
                        >
                            {/* In a real app, this would be a WebRTC Video element or Live2D Canvas */}
                            <div className={`w-full h-full bg-gradient-to-b ${companion.type === 'anime' ? 'from-violet-900/40 to-black' : 'from-cyan-900/40 to-black'} flex items-center justify-center`}>
                                <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/5 shadow-2xl">
                                    {/* Placeholder for actual companion image */}
                                    <div className={`w-full h-full ${companion.type === 'anime' ? 'bg-violet-500' : 'bg-cyan-500'} relative`}>
                                        <Image
                                            src={companion.type === 'anime' ? "/images/aiko.png" : "/images/sarah.png"}
                                            alt={companion.name}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                    {/* Speaking Glow Overlay */}
                                    {companionState === 'speaking' && (
                                        <div className={`absolute inset-0 ${companion.type === 'anime' ? 'bg-violet-500/30' : 'bg-cyan-500/30'} animate-pulse mix-blend-overlay`} />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Companion Status Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <h3 className="text-2xl font-display font-medium text-white shadow-black/50 drop-shadow-md">{companion.name}</h3>
                        <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-3">
                            {companionState === 'speaking' && (
                                <>
                                    <span className="text-xs font-medium text-white/80 uppercase tracking-widest">Speaking</span>
                                    <AudioVisualizer active={true} />
                                </>
                            )}
                            {companionState === 'listening' && (
                                <>
                                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-widest animate-pulse">Listening</span>
                                    <AudioVisualizer active={false} />
                                </>
                            )}
                            {companionState === 'idle' && (
                                <>
                                    <span className="text-xs font-medium text-white/50 uppercase tracking-widest animate-pulse">Thinking...</span>
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* User Self-View PiP */}
                    <motion.div
                        drag
                        dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
                        className="absolute bottom-4 right-4 w-32 h-48 md:w-48 md:h-72 bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl z-20 cursor-grab active:cursor-grabbing"
                    >
                        {videoOn ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                                <VideoOff className="w-8 h-8" />
                            </div>
                        )}
                        <div className="absolute bottom-2 left-2 text-[10px] font-medium text-white/50 bg-black/50 px-2 py-0.5 rounded">You</div>
                    </motion.div>
                </div>

                {/* Controls Bar */}
                <div className="h-24 flex items-center justify-center gap-6 mt-4">
                    <Button
                        size="icon"
                        variant="secondary"
                        className={`h-14 w-14 rounded-full transition-all ${!micOn ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        onClick={() => setMicOn(!micOn)}
                    >
                        {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                    </Button>

                    <Button
                        size="icon"
                        className="h-16 w-32 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all"
                        asChild
                    >
                        <Link href="/dashboard">
                            <PhoneOff className="w-8 h-8 mr-2" />
                            <span className="font-semibold">End</span>
                        </Link>
                    </Button>

                    <Button
                        size="icon"
                        variant="secondary"
                        className={`h-14 w-14 rounded-full transition-all ${!videoOn ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        onClick={() => setVideoOn(!videoOn)}
                    >
                        {videoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
