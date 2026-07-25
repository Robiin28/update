"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User } from "lucide-react";
import { useTheme } from "next-themes";
import { siteConfig } from "../../lib/siteConfig";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const FAQ = [
  {
    question: "Who is Robel?",
    answer: "Robel is a Backend & Platform Engineer based in Addis Ababa, currently building and operating Kifiya's production loan platform solo — from architecture to day-to-day operations."
  },
  {
    question: "What are your core technologies?",
    answer: "Go, Node.js, Kafka, Redis, and PostgreSQL for backend and distributed systems, with Next.js and React on the frontend. Also deep in platform operations, monitoring, and fintech data integrity."
  },
  {
    question: "Are you available for projects?",
    answer: "I'm open to select opportunities alongside my current role. Feel free to reach out and we can talk specifics."
  },
  {
    question: "How can I contact you?",
    answer: "You can use the contact form on this site, or reach out directly via email or LinkedIn. Check the links in the footer!"
  }
];

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hi! I'm Rob, your digital assistant. How can I help you today?", sender: "bot" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleQuestionClick = async (question: string, answer: string) => {
    const newUserMsg: Message = { id: Date.now().toString(), text: question, sender: "user" };
    setMessages((prev) => [...prev, newUserMsg]);

    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsTyping(false);

    const newBotMsg: Message = { id: (Date.now() + 1).toString(), text: answer, sender: "bot" };
    setMessages((prev) => [...prev, newBotMsg]);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="mb-4 w-[calc(100vw-32px)] sm:w-[400px] max-w-[400px] h-[500px] max-h-[calc(100vh-120px)] glass overflow-hidden rounded-2xl flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-border"
          >
            {/* Header */}
            <div className="p-4 bg-primary flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Rob</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                    <p className="text-[10px] text-white/80 uppercase font-bold tracking-wider">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Chat Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-hide"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-muted border border-border text-foreground rounded-tl-none backdrop-blur-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted border border-border p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-foreground/40 animate-bounce" />
                      <div className="w-1 h-1 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Question Suggestions */}
            <div className="p-4 border-t border-border bg-muted/50 space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-1">Common Questions</p>
              <div className="flex flex-wrap gap-2">
                {FAQ.map((item) => (
                  <button
                    key={item.question}
                    onClick={() => handleQuestionClick(item.question, item.answer)}
                    disabled={isTyping}
                    className="text-left py-1.5 px-3 rounded-lg text-xs bg-background border border-border hover:bg-muted hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground"
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary shadow-[0_8px_32px_rgb(var(--primary)/0.3)] flex items-center justify-center text-white border border-border group cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
