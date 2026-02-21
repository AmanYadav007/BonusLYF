"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { COMPANIONS, Companion } from "@/lib/companions";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
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
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [lowVoiceMode, setLowVoiceMode] = useState(false);

  // Audio boost refs for low-voice mode
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const boostStreamRef = useRef<MediaStream | null>(null);
  const rawMicStreamRef = useRef<MediaStream | null>(null);

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
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const handleUserMessageRef = useRef<((text: string) => void) | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // 1. Auth & Companion Selection + early permission requests
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

      // Request mic + camera permissions FIRST so the browser shows the permission
      // dialog before we start the call, then set status to connected.
      let micOk = false;
      let camOk = false;

      try {
        // Request both at once — single permission prompt in most browsers
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        stream.getTracks().forEach(t => t.stop()); // just needed the grant
        micOk = true;
        camOk = true;
        console.log("Mic + Camera permissions granted ✅");
      } catch (e: any) {
        console.error("Media permission error:", e?.name, e?.message);
        if (e?.name === "NotAllowedError") {
          // Try mic-only as a fallback
          try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            micStream.getTracks().forEach(t => t.stop());
            micOk = true;
            console.log("Mic-only permission granted ✅ (camera denied)");
            setVideoOn(false);
            setErrorMsg("Camera access denied. Mic-only mode active.");
          } catch (micErr) {
            console.error("Mic also denied:", micErr);
            setMicOn(false);
            setVideoOn(false);
            setErrorMsg("Microphone and camera access denied. Please allow in browser settings.");
          }
        } else if (e?.name === "NotFoundError") {
          // No camera — try mic only
          try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            micStream.getTracks().forEach(t => t.stop());
            micOk = true;
            setVideoOn(false);
            console.log("Mic granted, no camera device found");
          } catch (_) {}
        } else {
          console.warn("Unexpected media error:", e);
        }
      }

      // Small delay so the call animates in before camera starts
      await new Promise<void>(resolve => setTimeout(resolve, 2000));
      setCallStatus("connected");
      setCompanionState("listening");
    };
    init();
  }, [supabase, router]);

  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-dismiss error messages after 6 seconds
  useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(null), 6000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  // 2. Speech Recognition — initialised ONCE, uses a ref-callback to avoid stale closures
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
      setErrorMsg("Voice recognition not supported. Please use Chrome.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognition.lang = inputLang;

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      if (interim) setTranscript(interim);
      if (final) {
        setTranscript(final);
        console.log("User said:", final);
        // Always call via ref so we get the latest version of the function
        handleUserMessageRef.current?.(final);
      }
    };

    recognition.onerror = (event: any) => {
      // "aborted" and "no-speech" are not real errors — ignore them silently
      if (event.error === "aborted" || event.error === "no-speech") return;
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setMicOn(false);
        setErrorMsg("Microphone access denied. Please allow it in your browser.");
      }
    };

    recognition.onend = () => {
      // Only restart if we're supposed to be actively listening
      if (!isListeningActiveRef.current) return;
      if (!recognitionRef.current) return;

      // Small delay to break rapid abort loops
      setTimeout(() => {
        if (
          isListeningActiveRef.current &&
          recognitionRef.current &&
          !isPausedRef.current &&
          micOnRef.current &&
          callStatusRef.current === "connected" &&
          companionStateRef.current === "listening"
        ) {
          try { recognitionRef.current.start(); } catch (_) {}
        }
      }, 250);
    };

    return () => {
      try { recognition.stop(); } catch (_) {}
    };
  // Only re-init if the language changes  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputLang]);

  // Stable refs so event handlers can always read latest values without re-registering
  const companionStateRef = useRef(companionState);
  const micOnRef          = useRef(micOn);
  const callStatusRef     = useRef(callStatus);
  const isPausedRef       = useRef(isPaused);
  useEffect(() => { companionStateRef.current = companionState; }, [companionState]);
  useEffect(() => { micOnRef.current = micOn; }, [micOn]);
  useEffect(() => { callStatusRef.current = callStatus; }, [callStatus]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // Manage listening start/stop — always re-read ref live so language changes don't break it
  const isListeningActiveRef = useRef(false);

  useEffect(() => {
    const shouldListen = companionState === "listening" && micOn && callStatus === "connected" && !isPaused;

    if (shouldListen) {
      isListeningActiveRef.current = true;
      try { recognitionRef.current?.start(); } catch (_) {} // ignore "already started"
    } else {
      isListeningActiveRef.current = false;
      try { recognitionRef.current?.stop(); } catch (_) {}
    }
  }, [companionState, micOn, callStatus, isPaused]);


  // Browser Speech Synthesis fallback helper
  const useBrowserTTS = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setCompanionState("listening");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const speak = (voiceList: SpeechSynthesisVoice[]) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;

      // Find best voice: prefer English female, then any English, then any
      const preferred = voiceList.find(v =>
        v.lang.startsWith("en") && (
          v.name.toLowerCase().includes("female") ||
          v.name.includes("Zira") ||
          v.name.includes("Samantha") ||
          v.name.includes("Google UK English Female") ||
          v.name.includes("Google US English")
        )
      ) || voiceList.find(v => v.lang.startsWith("en")) || voiceList[0];

      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => {
        console.log("Browser TTS speaking with voice:", preferred?.name || "default");
        setCompanionState("speaking");
      };
      utterance.onend = () => setCompanionState("listening");
      utterance.onerror = (e) => {
        console.error("Browser TTS error:", e);
        setCompanionState("listening");
      };

      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speak(voices);
    } else {
      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = () => {
        speak(window.speechSynthesis.getVoices());
      };
      // Trigger voice load
      window.speechSynthesis.getVoices();
    }
  };

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
      let audioPlayed = false;
      try {
        console.log("Requesting TTS for:", aiText.slice(0, 50));
        const ttsRes = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: aiText,
            companionType: companion.type,
          }),
        });

        console.log("TTS response status:", ttsRes.status, ttsRes.headers.get("Content-Type"));

        if (!ttsRes.ok) {
          // Try to get the error message from the response
          const errText = await ttsRes.text();
          console.error("TTS API error:", ttsRes.status, errText);
          throw new Error(`TTS failed: ${ttsRes.status}`);
        }

        // Make sure we got actual audio back, not a JSON error
        const contentType = ttsRes.headers.get("Content-Type") || "";
        if (!contentType.includes("audio")) {
          const errBody = await ttsRes.text();
          console.error("TTS returned non-audio:", errBody);
          throw new Error("TTS returned non-audio content");
        }

        const audioBlob = await ttsRes.blob();
        console.log("Got audio blob, size:", audioBlob.size, "bytes");

        if (audioBlob.size < 100) {
          throw new Error("Audio blob too small — likely empty response");
        }

        const audioUrl = URL.createObjectURL(audioBlob);

        // 4. Play Audio & Animate
        const audio = new Audio();
        audio.preload = "auto";
        audio.src = audioUrl;

        // Start speaking animation when audio starts
        audio.onplay = () => {
          setCompanionState("speaking");
          audioPlayed = true;
        };

        // Go back to listening when audio ends
        audio.onended = () => {
          setCompanionState("listening");
          URL.revokeObjectURL(audioUrl);
        };

        // Handle playback errors — fall to browser TTS
        audio.onerror = (e) => {
          console.error("Audio element playback error:", e);
          URL.revokeObjectURL(audioUrl);
          useBrowserTTS(aiText);
        };

        // Load first, then play (fixes some browser issues)
        audio.load();
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio playing via ElevenLabs ✅");
            })
            .catch((playErr) => {
              console.error("audio.play() was blocked:", playErr);
              // If autoplay blocked, still set state and use browser TTS
              URL.revokeObjectURL(audioUrl);
              useBrowserTTS(aiText);
            });
        }

      } catch (ttsError) {
        console.warn("ElevenLabs TTS failed, using browser fallback:", ttsError);
        useBrowserTTS(aiText);
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
  // Keep ref in sync so recognition.onresult always calls the latest version
  handleUserMessageRef.current = handleUserMessage;

  // Hard-stop everything and navigate away
  const handleEndCall = () => {
    // 0. Mark listening as inactive FIRST so onend doesn't restart recognition
    isListeningActiveRef.current = false;

    // 1. Stop speech recognition immediately
    try { recognitionRef.current?.abort(); } catch (_) {}
    try { recognitionRef.current?.stop(); } catch (_) {}
    recognitionRef.current = null;

    // 2. Stop camera
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;

    // 3. Stop browser speech synthesis
    try { window.speechSynthesis?.cancel(); } catch (_) {}

    // 4. Close audio boost context
    try { audioContextRef.current?.close(); } catch (_) {}
    if (boostStreamRef.current) {
      boostStreamRef.current.getTracks().forEach(t => t.stop());
      boostStreamRef.current = null;
    }
    if (rawMicStreamRef.current) {
      rawMicStreamRef.current.getTracks().forEach(t => t.stop());
      rawMicStreamRef.current = null;
    }

    // 5. Navigate
    router.push("/dashboard");
  };

  // Low Voice Mode: Boost microphone gain via Web Audio API
  const applyLowVoiceBoost = useCallback(async (enabled: boolean) => {
    // Cleanup previous boost context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      gainNodeRef.current = null;
    }
    if (boostStreamRef.current) {
      boostStreamRef.current.getTracks().forEach(t => t.stop());
      boostStreamRef.current = null;
    }

    if (!enabled) {
      // Re-init speech recognition with original stream
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
        setTimeout(() => {
          if (recognitionRef.current && companionState === "listening" && micOn && callStatus === "connected") {
            try { recognitionRef.current.start(); } catch (e) {}
          }
        }, 300);
      }
      return;
    }

    try {
      // Get raw mic stream with low-noise settings for maximum sensitivity
      const rawStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,     // Disable to catch more quiet sounds
          noiseSuppression: false,     // Disable so quiet voice isn't filtered out
          autoGainControl: false,      // We do manual gain control instead
          channelCount: 1,
        }
      });
      rawMicStreamRef.current = rawStream;

      // Create AudioContext and boost gain significantly
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(rawStream);
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 2.5; // Boost by 2.5x for low voice sensitivity
      gainNodeRef.current = gainNode;

      // Create a destination stream to feed into speech recognition
      const destination = audioCtx.createMediaStreamDestination();
      source.connect(gainNode);
      gainNode.connect(destination);
      boostStreamRef.current = destination.stream;

      // Restart speech recognition — browser will pick up boosted stream passively
      // (Web Speech API uses the default mic, so boost is additive via AudioContext)
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
        setTimeout(() => {
          if (recognitionRef.current && companionState === "listening" && micOn && callStatus === "connected") {
            try { recognitionRef.current.start(); } catch (e) {}
          }
        }, 300);
      }

      console.log("Low Voice Mode: Mic gain boosted to 2.5x");
    } catch (err) {
      console.error("Low Voice Mode failed to initialize:", err);
    }
  }, [companionState, micOn, callStatus]);

  // Toggle low voice mode
  useEffect(() => {
    if (callStatus === "connected") {
      applyLowVoiceBoost(lowVoiceMode);
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [lowVoiceMode, callStatus]);

  // 3. Camera Stream — single getUserMedia for video only, mic handled separately
  useEffect(() => {
    if (callStatus !== "connected") return;

    let currentStream: MediaStream | null = null;
    let cancelled = false;

    const startCamera = async () => {
      // Stop existing stream first
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
        cameraStreamRef.current = null;
      }

      if (!videoOn) {
        if (videoRef.current) videoRef.current.srcObject = null;
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        currentStream = stream;
        cameraStreamRef.current = stream;

        // Retry attaching to videoRef — it may not be in the DOM yet on first render
        const attachStream = (attemptsLeft: number) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
            console.log("Camera started ✅");
          } else if (attemptsLeft > 0) {
            setTimeout(() => attachStream(attemptsLeft - 1), 100);
          } else {
            console.warn("Camera: videoRef never became available");
          }
        };
        attachStream(10); // retry up to 10 times (1 second total)

      } catch (err: any) {
        if (cancelled) return;
        console.error("Camera access failed:", err);
        setVideoOn(false);
        // Provide a friendlier message based on error type
        const msg = err?.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera in browser settings."
          : err?.name === "NotFoundError"
          ? "No camera found. Please connect a webcam."
          : "Camera error. Please check your device settings.";
        setErrorMsg(msg);
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (currentStream) {
        currentStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [callStatus, videoOn]);

  // Note: mic start/stop is fully managed by the combined useEffect above (companionState, micOn, callStatus, isPaused)
  // No separate micOn effect needed — having two was causing the aborted loop

  // ── Jaw animation — drives the lower-face clip translateY for lip-sync effect ──
  const jawY = useMotionValue(0);
  useEffect(() => {
    let rafId: number;
    let t = Math.random() * 100;
    let current = 0;

    const tick = () => {
      t += 0.09;
      const speaking = companionStateRef.current === 'speaking';
      // Multi-frequency target: gives natural, non-repeating speech cadence
      const target = speaking
        ? Math.max(0,
            3.5
            + Math.sin(t * 5.1) * 3.8
            + Math.sin(t * 8.3) * 1.8
            + Math.sin(t * 3.2) * 2.6
          )
        : 0;
      // Smooth lerp so jaw doesn't snap
      current += (target - current) * 0.22;
      jawY.set(current);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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

  const isAnime = companion.type === "anime";
  const accentColor = isAnime ? "violet" : "cyan";
  const accentHex = isAnime ? "#7c3aed" : "#06b6d4";
  const accentRgb = isAnime ? "124,58,237" : "6,182,212";

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col" style={{ background: "#050508" }}>

      {/* ── Cinematic Background ──────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Main ambient orb */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] rounded-full"
          style={{ background: `radial-gradient(circle, ${accentHex}55 0%, transparent 70%)`, filter: "blur(60px)" }}
        />
        {/* Secondary corner orbs */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${accentHex} 0%, transparent 70%)`, filter: "blur(80px)" }} />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: `radial-gradient(circle, ${accentHex} 0%, transparent 70%)`, filter: "blur(60px)" }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* ── Connecting Splash ─────────────────────────────────── */}
      <AnimatePresence>
        {callStatus === "connecting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: "rgba(5,5,8,0.95)", backdropFilter: "blur(24px)" }}
          >
            {/* Orbiting rings */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-8 sm:mb-10 flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border"
                  style={{
                    width: `${72 + i * 28}px`,
                    height: `${72 + i * 28}px`,
                    borderColor: `rgba(${accentRgb}, ${0.5 - i * 0.13})`,
                    boxShadow: i === 0 ? `0 0 20px rgba(${accentRgb},0.3)` : "none",
                  }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }}
                  transition={{ duration: 3 + i * 1.2, repeat: Infinity, ease: "linear" }}
                />
              ))}
              <motion.div
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl"
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ background: `rgba(${accentRgb},0.15)`, border: `1px solid rgba(${accentRgb},0.3)` }}
              >
                {isAnime ? "✨" : "☕️"}
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-3xl font-bold text-white mb-2 tracking-tight text-center px-4"
            >
              Connecting to <span style={{ color: accentHex }}>{companion.name}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/40 text-xs sm:text-sm flex items-center gap-2 text-center px-4"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              End-to-end encrypted · Securing channel...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Layout ──────────────────────────────────────── */}
      <div className="relative z-10 w-full h-full flex flex-col p-3 sm:p-4 md:p-6">

        {/* ── Top Bar ──────────────────────────────────────── */}
        <header className="flex justify-between items-center mb-3 sm:mb-4 flex-shrink-0">
          {/* Left: Status + companion name */}
          <div className="flex items-center gap-2">
            {/* Live status pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" }}>
              <motion.span
                animate={{ opacity: callStatus === "connected" ? [1, 0.4, 1] : 1 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0"
                style={{ background: callStatus === "connected" ? "#34d399" : "#fbbf24", boxShadow: callStatus === "connected" ? "0 0 8px #34d399" : "0 0 8px #fbbf24" }}
              />
              <span className="text-[10px] sm:text-xs font-semibold text-white/70 tracking-wide uppercase">
                {callStatus === "connected" ? "Live" : "Connecting"}
              </span>
            </div>

            {/* Companion name + state — hidden on xs, visible md+ */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" }}>
              <span className="text-base">{isAnime ? "🌸" : "☕"}</span>
              <span className="text-xs sm:text-sm font-medium text-white/80">{companion.name}</span>
              <span className="text-xs text-white/30">·</span>
              <span className="text-[10px] sm:text-xs font-medium capitalize px-2 py-0.5 rounded-full"
                style={{ background: `rgba(${accentRgb},0.15)`, color: accentHex }}>
                {companionState === "speaking" ? "Speaking" : companionState === "listening" ? "Listening" : "Thinking..."}
              </span>
            </div>

            {/* Mobile: just emoji + state badge */}
            <div className="flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)" }}>
              <span className="text-sm">{isAnime ? "🌸" : "☕"}</span>
              <span className="text-[10px] font-medium capitalize"
                style={{ color: accentHex }}>
                {companionState === "speaking" ? "Speaking" : companionState === "listening" ? "Listening" : "Thinking"}
              </span>
            </div>
          </div>

          {/* Right: Language Picker — icon only on mobile */}
          <div className="relative">
            {/* Mobile: icon-only lang select */}
            <div className="flex sm:hidden">
              <select
                value={inputLang}
                onChange={(e) => setInputLang(e.target.value)}
                className="appearance-none outline-none cursor-pointer text-[10px] text-white/80 rounded-full pl-3 pr-7 py-1.5 border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", maxWidth: "90px" }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-zinc-900 text-white">{l.name}</option>
                ))}
              </select>
              <Settings className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
            </div>
            {/* Desktop: full lang select */}
            <div className="hidden sm:flex">
              <select
                value={inputLang}
                onChange={(e) => setInputLang(e.target.value)}
                className="appearance-none outline-none cursor-pointer text-sm text-white/80 rounded-full px-4 py-2 pr-9 border border-white/10 transition-all hover:border-white/25"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", minWidth: "130px" }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-zinc-900 text-white">{l.name}</option>
                ))}
              </select>
              <Settings className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
            </div>
          </div>
        </header>

        {/* ── Video Area ───────────────────────────────────── */}
        <div className="flex-1 relative rounded-[28px] overflow-hidden min-h-0"
          style={{
            border: `1px solid rgba(${accentRgb},0.18)`,
            background: `linear-gradient(160deg, rgba(${accentRgb},0.08) 0%, rgba(5,5,8,0.95) 60%)`,
            boxShadow: `0 0 80px rgba(${accentRgb},0.12), inset 0 0 60px rgba(${accentRgb},0.04)`,
          }}>

          {/* Companion center display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">

              {/* State-reactive pulsing rings — vw-based so they scale on mobile */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `min(${180 + i * 44}px, ${52 + i * 12}vw)`,
                    height: `min(${180 + i * 44}px, ${52 + i * 12}vw)`,
                    border: `1px solid rgba(${accentRgb}, ${companionState === "speaking" ? 0.35 - i * 0.08 : companionState === "listening" ? 0.2 - i * 0.05 : 0.08})`,
                    boxShadow: companionState === "speaking" && i === 0 ? `0 0 40px rgba(${accentRgb},0.25)` : "none",
                  }}
                  animate={
                    companionState === "speaking"
                      ? { scale: [1, 1.07 + i * 0.03, 1], opacity: [0.8, 0.4, 0.8] }
                      : companionState === "listening"
                      ? { scale: [1, 1.03, 1], opacity: [0.5, 0.2, 0.5] }
                      : { scale: 1, opacity: 0.1 }
                  }
                  transition={{ duration: 1.8 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}

              {/* Companion avatar — responsive size */}
              <motion.div
                animate={
                  companionState === "speaking"
                    ? { scale: [1, 1.04, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden"
                style={{
                  border: `2px solid rgba(${accentRgb},0.4)`,
                  boxShadow: `0 0 40px rgba(${accentRgb}, ${companionState === "speaking" ? 0.5 : 0.2}), 0 0 80px rgba(${accentRgb},0.1)`,
                }}
              >
                <div className="w-full h-full relative" style={{ background: `linear-gradient(135deg, rgba(${accentRgb},0.3), rgba(${accentRgb},0.05))` }}>
                  {/* Upper face — static (eyes, nose, forehead) */}
                  <Image
                    src={isAnime ? "/images/aiko.png" : "/images/sarah.png"}
                    alt={companion.name}
                    fill
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
                    className="object-cover"
                    priority
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 65%, 0 65%)' }}
                  />
                  {/* Lower face (jaw) — drops when speaking */}
                  <motion.div
                    style={{
                      position: 'absolute', inset: 0,
                      y: jawY,
                    }}
                  >
                    <Image
                      src={isAnime ? "/images/aiko.png" : "/images/sarah.png"}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 160px, (max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
                      className="object-cover"
                      aria-hidden
                      style={{ clipPath: 'polygon(0 61%, 100% 61%, 100% 200%, 0 200%)' }}
                    />
                  </motion.div>
                </div>
                {/* Speaking shimmer overlay */}
                <AnimatePresence>
                  {companionState === "speaking" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="absolute inset-0 mix-blend-overlay"
                      style={{ background: `radial-gradient(circle, rgba(${accentRgb},0.6) 0%, transparent 70%)` }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Companion name tag below avatar */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  whiteSpace: "nowrap",
                }}
              >
                <span className="text-xs sm:text-sm font-semibold text-white">{companion.name}</span>
                {/* Live audio waveform */}
                <div className="flex items-center gap-0.5 ml-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 rounded-full"
                      style={{ background: accentHex }}
                      animate={
                        companionState === "speaking" || companionState === "listening"
                          ? { height: [2, 8 + i * 2, 2], opacity: [0.5, 1, 0.5] }
                          : { height: 2, opacity: 0.2 }
                      }
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── User PiP Camera ─────────────────────────────── */}
          {/* Mobile: top-right corner, smaller. Desktop: bottom-right, larger */}
          <motion.div
            drag
            dragConstraints={{ left: 0, right: 200, top: 0, bottom: 200 }}
            className="absolute top-3 right-3 sm:top-auto sm:bottom-5 sm:right-5 z-20 cursor-grab active:cursor-grabbing"
            whileHover={{ scale: 1.03 }}
            whileDrag={{ scale: 1.05 }}
            style={{ width: "clamp(80px, 20vw, 140px)" }}
          >
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden"
              style={{
                aspectRatio: "3/4",
                border: `2px solid rgba(${accentRgb},0.4)`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(${accentRgb},0.2)`,
              }}>
              {videoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "#0d0d11" }}>
                  <VideoOff className="w-5 h-5 sm:w-7 sm:h-7 text-white/20" />
                </div>
              )}
              {/* PiP label */}
              <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-semibold text-white/60 bg-black/50 px-1.5 py-0.5 rounded-full backdrop-blur-sm">You</span>
                {!videoOn && <span className="text-[8px] text-red-400 bg-black/50 px-1.5 py-0.5 rounded-full backdrop-blur-sm">Off</span>}
              </div>
            </div>
            {/* Drag hint — hide on mobile to save space */}
            <div className="hidden sm:block text-center mt-1">
              <span className="text-[9px] text-white/20">drag to move</span>
            </div>
          </motion.div>

          {/* ── Transcript pill ─────────────────────────────── */}
          {/* Mobile: full-width at bottom center. Desktop: left-anchored with right padding for PiP */}
          <div className="absolute bottom-3 sm:bottom-5 left-3 right-3 sm:left-5 sm:right-52 z-30 flex items-end">
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-white w-full"
                  style={{ background: "rgba(239,68,68,0.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(239,68,68,0.4)" }}
                >
                  ⚠️ {errorMsg}
                </motion.div>
              )}
              {!errorMsg && transcript && (
                <motion.div
                  key="transcript"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-white/90 text-xs sm:text-sm font-light leading-relaxed w-full"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  <span className="text-white/40 mr-1">{companionState === "speaking" ? `${companion.name}:` : "You:"}</span>
                  {transcript}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Control Dock ─────────────────────────────────── */}
        <div className="flex-shrink-0 mt-2 sm:mt-4 flex items-center justify-center px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-full sm:w-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-2.5 sm:py-3 rounded-[20px] sm:rounded-[28px]"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Low Voice */}
            <ControlBtn
              active={lowVoiceMode}
              activeColor={`rgba(52,211,153,0.25)`}
              activeTextColor="#34d399"
              activeShadow="0 0 20px rgba(52,211,153,0.35)"
              label={lowVoiceMode ? "Boost" : "Boost"}
              onClick={() => setLowVoiceMode(!lowVoiceMode)}
              title="Low Voice Boost"
              small
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </ControlBtn>

            <div className="hidden sm:block w-px h-10 bg-white/10" />

            {/* Pause */}
            <ControlBtn
              active={isPaused}
              activeColor="rgba(251,191,36,0.2)"
              activeTextColor="#fbbf24"
              activeShadow="0 0 20px rgba(251,191,36,0.3)"
              label={isPaused ? "Resume" : "Pause"}
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Resume" : "Pause"}
              small
            >
              {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" />}
            </ControlBtn>

            {/* Mic */}
            <ControlBtn
              active={!micOn}
              activeColor="rgba(239,68,68,0.2)"
              activeTextColor="#f87171"
              activeShadow="0 0 20px rgba(239,68,68,0.3)"
              label={micOn ? "Mic" : "Muted"}
              onClick={() => setMicOn(!micOn)}
              title={micOn ? "Mute Mic" : "Unmute Mic"}
              small
            >
              {micOn ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
            </ControlBtn>

            {/* End Call — special */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <button
                onClick={handleEndCall}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-white text-xs sm:text-sm transition-all"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  boxShadow: "0 0 24px rgba(239,68,68,0.45), 0 4px 12px rgba(0,0,0,0.4)",
                }}
              >
                <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline sm:inline">End Call</span>
                <span className="inline xs:hidden sm:hidden">End</span>
              </button>
            </motion.div>

            {/* Camera */}
            <ControlBtn
              active={!videoOn}
              activeColor="rgba(239,68,68,0.2)"
              activeTextColor="#f87171"
              activeShadow="0 0 20px rgba(239,68,68,0.3)"
              label={videoOn ? "Camera" : "Cam Off"}
              onClick={() => setVideoOn(!videoOn)}
              title={videoOn ? "Turn off camera" : "Turn on camera"}
              small
            >
              {videoOn ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
            </ControlBtn>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

/* ── Reusable Control Button ───────────────────────────────── */
function ControlBtn({
  children,
  active,
  activeColor,
  activeTextColor,
  activeShadow,
  label,
  onClick,
  title,
  small,
}: {
  children: React.ReactNode;
  active: boolean;
  activeColor: string;
  activeTextColor: string;
  activeShadow: string;
  label: string;
  onClick: () => void;
  title: string;
  small?: boolean;
}) {
  return (
    <motion.div className="flex flex-col items-center gap-0.5 sm:gap-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <button
        title={title}
        onClick={onClick}
        className={`${
          small ? "w-9 h-9 sm:w-11 sm:h-11" : "w-12 h-12"
        } rounded-full flex items-center justify-center transition-all duration-200`}
        style={{
          background: active ? activeColor : "rgba(255,255,255,0.08)",
          color: active ? activeTextColor : "rgba(255,255,255,0.7)",
          boxShadow: active ? activeShadow : "none",
          border: active ? `1px solid ${activeTextColor}40` : "1px solid transparent",
        }}
      >
        {children}
      </button>
      <span
        className="text-[9px] sm:text-[10px] font-medium"
        style={{ color: active ? activeTextColor : "rgba(255,255,255,0.25)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}
