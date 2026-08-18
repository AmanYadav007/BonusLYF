"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_FREE_MESSAGES = 3;

const COMPANIONS = {
  anime: {
    name: "Aiko",
    avatar: "/images/aiko.png",
    type: "anime" as const,
    intro: "Heyyy Senpai~! (★^O^★) I've been waiting for you! What's on your mind today?",
    borderColor: "border-violet-500/40",
    glowColor: "shadow-violet-500/10",
    badgeColor: "text-violet-300",
  },
  human: {
    name: "Sarah",
    avatar: "/images/sarah.png",
    type: "human" as const,
    intro: "Hi there. I'm Sarah — I'm here to listen, no judgment at all. What would you like to talk about?",
    borderColor: "border-cyan-500/40",
    glowColor: "shadow-cyan-500/10",
    badgeColor: "text-cyan-300",
  },
};

type CompanionKey = keyof typeof COMPANIONS;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function CompanionPreviewChat() {
  const [active, setActive] = useState<CompanionKey>("anime");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: COMPANIONS.anime.intro },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const companion = COMPANIONS[active];
  const remaining = MAX_FREE_MESSAGES - msgCount;
  const limitReached = msgCount >= MAX_FREE_MESSAGES;

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const switchCompanion = (key: CompanionKey) => {
    if (key === active) return;
    setActive(key);
    setMessages([{ role: "assistant", content: COMPANIONS[key].intro }]);
    setMsgCount(0);
    setInput("");
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping || limitReached) return;
    setInput("");
    setIsTyping(true);
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setMsgCount((c) => c + 1);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          companionType: companion.type,
          history: messages.slice(-6),
        }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.response || "..." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Sorry, having trouble connecting right now..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section className="w-full py-24 md:py-32 relative" id="preview">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/5 to-transparent pointer-events-none" />

      <div className="container px-6 mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest text-violet-300 uppercase mb-4">
            Try Before You Sign Up
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium mb-4 tracking-tight">
            Say hello.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              Feel the difference.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light">
            Have a short conversation with Aiko or Sarah — no account needed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          {/* Companion Tabs */}
          <div className="flex items-center gap-3 mb-4">
            {(Object.keys(COMPANIONS) as CompanionKey[]).map((key) => {
              const c = COMPANIONS[key];
              return (
                <button
                  key={key}
                  onClick={() => switchCompanion(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                    active === key
                      ? "bg-white/10 border-white/20 text-foreground"
                      : "bg-transparent border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                    <Image src={c.avatar} alt={c.name} width={24} height={24} className="object-cover w-full h-full" />
                  </div>
                  {c.name}
                </button>
              );
            })}
            <span className="ml-auto text-xs text-muted-foreground/50">
              {remaining > 0 ? `${remaining} message${remaining !== 1 ? "s" : ""} left` : "Preview ended"}
            </span>
          </div>

          {/* Chat Window */}
          <div
            className={`rounded-2xl bg-black/40 border ${companion.borderColor} backdrop-blur-xl overflow-hidden shadow-2xl ${companion.glowColor}`}
          >
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${companion.borderColor} shrink-0`}>
                <Image src={companion.avatar} alt={companion.name} width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{companion.name}</p>
                <p className={`text-xs ${companion.badgeColor}/60`}>Preview Mode · {MAX_FREE_MESSAGES} free messages</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground/50">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto px-5 py-4 space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mb-0.5">
                        <Image src={companion.avatar} alt={companion.name} width={28} height={28} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-violet-500/20 border border-violet-500/30 text-foreground rounded-br-sm"
                          : "bg-white/5 border border-white/10 text-foreground/90 rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                      <Image src={companion.avatar} alt={companion.name} width={28} height={28} className="object-cover w-full h-full" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 rounded-bl-sm">
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((j) => (
                          <motion.div
                            key={j}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: j * 0.15 }}
                            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="px-5 py-4 border-t border-white/5">
              <AnimatePresence mode="wait">
                {limitReached ? (
                  <motion.div
                    key="cta"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col sm:flex-row items-center gap-3 py-1"
                  >
                    <p className="text-sm text-muted-foreground text-center sm:text-left flex-1">
                      Loved talking to {companion.name}? Continue for free.
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white px-6 shadow-lg border-0 shrink-0"
                    >
                      <Link href="/register">
                        Create Account <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                    className="flex gap-3"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Say something to ${companion.name}...`}
                      disabled={isTyping}
                      className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-white/20 disabled:opacity-50 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity hover:opacity-90"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Subtle note */}
          <p className="text-center text-xs text-muted-foreground/40 mt-4">
            Preview uses live AI · No account required · Conversations not saved
          </p>
        </motion.div>
      </div>
    </section>
  );
}
