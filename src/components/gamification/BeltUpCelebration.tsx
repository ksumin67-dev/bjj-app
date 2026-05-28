"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import type { BeltLevel } from "@/types/domain";

const BELT_STYLE: Record<BeltLevel, { color: string; bg: string; glow: string; emoji: string }> = {
  "White Belt":  { color: "#E2E8F0", bg: "rgba(226,232,240,0.12)", glow: "rgba(226,232,240,0.3)",  emoji: "🥋" },
  "Blue Belt":   { color: "#3B82F6", bg: "rgba(59,130,246,0.15)",  glow: "rgba(59,130,246,0.45)", emoji: "💙" },
  "Purple Belt": { color: "#A855F7", bg: "rgba(168,85,247,0.15)",  glow: "rgba(168,85,247,0.45)", emoji: "💜" },
  "Brown Belt":  { color: "#92400E", bg: "rgba(180,100,30,0.15)",  glow: "rgba(180,100,30,0.45)", emoji: "🤎" },
  "Black Belt":  { color: "#F8FAFC", bg: "rgba(248,250,252,0.10)", glow: "rgba(248,250,252,0.5)",  emoji: "🖤" },
};

const BELT_MESSAGES: Record<BeltLevel, string> = {
  "White Belt":  "여정의 시작!",
  "Blue Belt":   "기초가 탄탄해졌어요!",
  "Purple Belt": "진정한 실력자가 됐습니다!",
  "Brown Belt":  "블랙벨트까지 한 걸음!",
  "Black Belt":  "최고의 경지에 올랐습니다!",
};

interface Props {
  belt: BeltLevel;
  onDismiss: () => void;
}

export function BeltUpCelebration({ belt, onDismiss }: Props) {
  const s = BELT_STYLE[belt];

  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onDismiss(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <motion.div
      className="fixed inset-0 z-toast flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(10,10,15,0.88)", backdropFilter: "blur(16px)" }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: 360, height: 360,
          background: "radial-gradient(circle, " + s.glow + " 0%, transparent 70%)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="relative z-10 text-center space-y-5"
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className="mx-auto flex items-center justify-center"
          style={{
            width: 100, height: 100,
            borderRadius: "50%",
            background: s.bg,
            border: "2px solid " + s.color,
            boxShadow: "0 0 40px " + s.glow + ", 0 0 80px " + s.glow + "40",
          }}
          animate={{ boxShadow: [
            "0 0 30px " + s.glow + ", 0 0 60px " + s.glow + "40",
            "0 0 50px " + s.glow + ", 0 0 100px " + s.glow + "60",
            "0 0 30px " + s.glow + ", 0 0 60px " + s.glow + "40",
          ]}}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Trophy size={40} style={{ color: s.color }} strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: s.color }}>
            띠 승급!
          </p>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {belt} {s.emoji}
          </h2>
          <p className="text-base text-text-secondary mt-1">
            {BELT_MESSAGES[belt]}
          </p>
        </motion.div>

        <motion.button
          type="button"
          onClick={onDismiss}
          className="pointer-events-auto mx-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-fast active:scale-[0.97]"
          style={{
            backgroundColor: s.bg,
            border: "1px solid " + s.color + "60",
            color: s.color,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          확인
        </motion.button>

        <motion.div
          className="mx-auto overflow-hidden rounded-full"
          style={{ height: 2, width: 80, backgroundColor: s.bg }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: s.color }}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
