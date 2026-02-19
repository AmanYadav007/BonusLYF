"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { COMPANIONS, Companion } from "@/lib/companions";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Settings,
  Sparkles,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function CallPage() {
  const [user, setUser] = useState<any>(null);
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [callStatus, setCallStatus] = useState<
    "connecting" | "connected" | "ended"
  >("connecting");
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [companionState, setCompanionState] = useState<
    "idle" | "listening" | "speaking"
  >("idle");

  const [isPaused, setIsPaused] = useState(false);

  const [inputLang, setInputLang] = useState("en-US");
  const LANGUAGES = [
    { code: "en-US", name: "English" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "pt-PT", name: "Portuguese" },
    { code: "hi-IN", name: "Hindi" },
    { code: "zh-CN", name: "Chinese" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "pl-PL", name: "Polish" },
  ];

  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // 1. Auth & Companion Selection
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
      const found =
        COMPANIONS.find((c) => c.id === companionId) || COMPANIONS[0];
      setCompanion(found);

      // Simulate connection delay
      setTimeout(() => {
        setCallStatus("connected");
        setCompanionState("listening");
      }, 2500);
    };
    init();
  }, [supabase, router]);

  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 2. Speech Recognition Setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // We handle restart manually for better control
      recognitionRef.current.interimResults = true; // Show what is being said
      recognitionRef.current.lang = inputLang;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (interimTranscript) {
          setTranscript(interimTranscript);
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          console.log("User said (Final):", finalTranscript);
          handleUserMessage(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setMicOn(false);
          setErrorMsg("Microphone access denied. Please enable it.");
        }
        if (event.error === "no-speech") {
          // Just silence, ignore
        }
      };

      recognitionRef.current.onend = () => {
        // If we are supposed to be listening, restart
        if (
          companionState === "listening" &&
          micOn &&
          callStatus === "connected"
        ) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Ignore if already started
          }
        }
      };
    } else {
      setErrorMsg(
        "Your browser does not support voice recognition. Please use Chrome.",
      );
    }

  }, [companionState, micOn, callStatus, inputLang, isPaused]); // Restart loop dependency using inputLang

  // Manage Listening State (Initial Start)
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (companionState === "listening" && micOn && callStatus === "connected" && !isPaused) {
      try {
        recognition.start();
      } catch (e) {
        // Already started or restart handled by onend
      }
    } else {
      recognition.stop();
    }
  }, [companionState, micOn, callStatus]);

  const handleUserMessage = async (text: string) => {
    if (!companion || !text.trim()) return;
    
    // Simple filter: Ignore very short text (likely noise)
    if (text.trim().length < 2) return;

    // 1. Transition to thinking state
    setCompanionState("idle");
    // Keep the text visible briefly or clear it? Let's keep it until response comes or clear immediately?
    // Clearing it usually feels better for "processing".
    // setTranscript(text); // Keep final text visible

    try {
      console.log("Processing user input:", text);

      // 2. Get AI Text Response
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          companionType: companion.type,
          history: [],
        }),
      });

      if (!chatRes.ok) {
        const err = await chatRes.json();
        throw new Error(err.error || "AI Service Unavailable");
      }

      const chatData = await chatRes.json();
      const aiText = chatData.response;

      if (!aiText) throw new Error("Empty AI Response");

      console.log("AI says:", aiText);
      setTranscript(aiText); // Show AI text as subtitle

      // 3. Get Audio Response (TTS) - With Fallback
      try {
        const ttsRes = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: aiText,
            companionType: companion.type,
          }),
        });

        if (!ttsRes.ok) throw new Error("Voice Service Unavailable, using fallback");

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
      
      } catch (ttsError) {
        console.warn("ElevenLabs TTS failed, using browser fallback:", ttsError);
        
        // Browser Speech Synthesis Fallback
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(aiText);
          
          // Try to match voice somewhat
          const voices = window.speechSynthesis.getVoices();
          // Prefer a female voice for these characters usually
          const femaleVoice = voices.find(v => v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Samantha"));
          if (femaleVoice) utterance.voice = femaleVoice;

          utterance.onstart = () => setCompanionState("speaking");
          utterance.onend = () => setCompanionState("listening");
          utterance.onerror = () => setCompanionState("listening");
          
          window.speechSynthesis.speak(utterance);
        } else {
          // If even fallback fails
          setCompanionState("listening");
        }
      }

    } catch (err: any) {
      console.error("Interaction failed:", err);
      // Only show error if main AI chat failed, otherwise we handled TTS silently
      if (!err.message.includes("Voice Service")) {
         setErrorMsg(err.message || "Something went wrong");
      }
      setCompanionState("listening");
    }
  };

  // 2. User Camera Stream
  useEffect(() => {
    const startVideo = async () => {
      if (callStatus === "connected" && videoOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access denied:", err);
          setVideoOn(false);
        }
      }
    };
    if (callStatus === "connected") {
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
          key={`bar-${i}`}
          animate={
            active
              ? {
                  height: [10, 24, 10],
                  opacity: [0.5, 1, 0.5],
                }
              : { height: 4, opacity: 0.3 }
          }
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
          className={`w-1.5 rounded-full ${companion?.type === "anime" ? "bg-violet-400" : "bg-cyan-400"}`}
        />
      ))}
    </div>
  );

  if (!user || !companion) return null;

  return (
    <div className="relative w-full h-screen bg-midnight overflow-hidden flex flex-col items-center justify-center">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 ${companion.type === "anime" ? "bg-violet-600" : "bg-cyan-600"}`}
        />
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
              className={`w-32 h-32 rounded-full mb-8 flex items-center justify-center ${companion.type === "anime" ? "bg-violet-500/20" : "bg-cyan-500/20"}`}
            >
              <span className="text-4xl animate-pulse">
                {companion.type === "anime" ? "✨" : "☕️"}
              </span>
            </motion.div>
            <h2 className="text-2xl font-display font-medium text-white mb-2">
              Connecting to {companion.name}...
            </h2>
            <p className="text-muted-foreground">Securing encryption...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${callStatus === "connected" ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "bg-amber-400"}`}
            />
            <span className="text-sm font-medium text-white/90">
              {callStatus === "connected" ? "Live Encrypted" : "Connecting..."}
            </span>
          </div>
          
          <div className="relative">
             <select
              value={inputLang}
              onChange={(e) => setInputLang(e.target.value)}
              className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-sm rounded-full px-4 py-2 pr-8 outline-none focus:border-white/30 appearance-none cursor-pointer hover:bg-white/5 transition-all"
              style={{ minWidth: "120px" }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-zinc-900 text-white p-2">
                  {l.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                <Settings className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Main Video Area */}
        <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/10 bg-black/20 shadow-2xl">
          {/* Companion "Video" (Simulated with Image + Breath) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={
                companionState === "speaking" ? { scale: 1.05 } : { scale: 1 }
              }
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="relative w-full h-full"
            >
              {/* In a real app, this would be a WebRTC Video element or Live2D Canvas */}
              <div
                className={`w-full h-full bg-gradient-to-b ${companion.type === "anime" ? "from-violet-900/40 to-black" : "from-cyan-900/40 to-black"} flex items-center justify-center`}
              >
                <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/5 shadow-2xl">
                  {/* Placeholder for actual companion image */}
                  <div
                    className={`w-full h-full ${companion.type === "anime" ? "bg-violet-500" : "bg-cyan-500"} relative`}
                  >
                    <Image
                      src={
                        companion.type === "anime"
                          ? "/images/aiko.png"
                          : "/images/sarah.png"
                      }
                      alt={companion.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Speaking Glow Overlay */}
                  {companionState === "speaking" && (
                    <div
                      className={`absolute inset-0 ${companion.type === "anime" ? "bg-violet-500/30" : "bg-cyan-500/30"} animate-pulse mix-blend-overlay`}
                    />
                  )}
                </div>
              </div>
            </motion.div>
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
            <div className="absolute bottom-2 left-2 text-[10px] font-medium text-white/50 bg-black/50 px-2 py-0.5 rounded">
              You
            </div>
          </motion.div>
        </div>

        {/* Transcript & Error Below Video */}
        <div className="h-24 w-full flex flex-col items-center justify-center relative z-30 mt-4 mb-2">
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  key="error-msg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/80 backdrop-blur-md text-white px-6 py-2 rounded-full shadow-lg border border-red-400/30 text-center font-medium text-sm absolute"
                >
                  {errorMsg}
                </motion.div>
              )}

              {transcript && (
                <motion.div
                  key="transcript-text"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/5 backdrop-blur-xl text-white/90 px-6 py-3 rounded-2xl border border-white/10 text-center text-lg font-light leading-relaxed max-w-3xl"
                >
                  "{transcript}"
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        {/* Controls Bar */}
        <div className="h-24 flex items-center justify-center gap-6 mt-4">
          <Button
            size="icon"
            variant="secondary"
            className={`h-14 w-14 rounded-full transition-all ${isPaused ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30" : "bg-white/10 text-white hover:bg-white/20"}`}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <Play className="w-6 h-6" />
            ) : (
              <Pause className="w-6 h-6" />
            )}
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className={`h-14 w-14 rounded-full transition-all ${!micOn ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-white/10 text-white hover:bg-white/20"}`}
            onClick={() => setMicOn(!micOn)}
          >
            {micOn ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
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
            className={`h-14 w-14 rounded-full transition-all ${!videoOn ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-white/10 text-white hover:bg-white/20"}`}
            onClick={() => setVideoOn(!videoOn)}
          >
            {videoOn ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
