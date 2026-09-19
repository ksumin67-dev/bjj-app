"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { LearningLevel } from "@/types/domain";

/**
 * 학습 레벨(XP 게이미피케이션) 업 축하 연출.
 *
 * (2026-09-19 리네이밍) 예전엔 이 화면이 "띠 승급!"이라며 White/Blue/Purple
 * 같은 실제 벨트 이름을 띄웠는데, 이건 순수 XP 누적치라 사용자가 프로필에
 * 설정한 진짜 벨트와 무관/충돌했음. 이제는 "학습 레벨"이라는 이름과
 * 앰버 톤 하나로 통일해서 실제 벨트 승급과 절대 헷갈리지 않게 함.
 */
const LEVEL_STYLE = {
  color: "#D9772E",
  bg: "rgba(217,119,46,0.15)",
  glow: "rgba(217,119,46,0.45)",
};

const LEVEL_MESSAGES: Record<LearningLevel, string> = {
  "Lv.1": "여정의 시작!",
  "Lv.2": "꾸준함이 쌓이고 있어요!",
  "Lv.3": "확실히 익숙해졌습니다!",
  "Lv.4": "숙련도가 눈에 띄네요!",
  "Lv.5": "최고 레벨 달성!",
};

interface Props {
  level: LearningLevel;
  onDismiss: () => void;
}

export function LevelUpCelebration({ level, onDismiss }: Props) {
  const s = LEVEL_STYLE;

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
            레벨 업!
          </p>
          <h2 className="text-3xl font-black text-white tracking-tight">
            {level}
          </h2>
          <p className="text-base text-text-secondary mt-1">
            {LEVEL_MESSAGES[level]}
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
