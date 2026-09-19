"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Zap, X } from "lucide-react";

export type ToastType = "success" | "error" | "xp";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  xp?: number;
}

interface ToastCtx {
  show: (type: ToastType, message: string, xp?: number) => void;
}

const ToastContext = createContext<ToastCtx>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const STYLE: Record<ToastType, {
  bg: string; border: string; iconClass: string; labelClass: string;
}> = {
  success: {
    bg:         "rgba(26,26,36,0.97)",
    border:     "rgba(52,211,153,0.35)",
    iconClass:  "text-[#34D399]",
    labelClass: "text-[#34D399]",
  },
  error: {
    bg:         "rgba(26,26,36,0.97)",
    border:     "rgba(239,68,68,0.35)",
    iconClass:  "text-[#EF4444]",
    labelClass: "text-[#EF4444]",
  },
  xp: {
    bg:         "rgba(26,26,36,0.97)",
    border:     "rgba(217,119,46,0.45)",
    iconClass:  "text-[#D9772E]",
    labelClass: "text-[#D9772E]",
  },
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const s = STYLE[toast.type];
  const Icon = toast.type === "success" ? CheckCircle : toast.type === "error" ? XCircle : Zap;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      exit={{    opacity: 0, y: 8,  scale: 0.97  }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg"
      style={{
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        backdropFilter: "blur(12px)",
        minWidth: 220,
        maxWidth: 320,
      }}
    >
      <Icon size={16} className={s.iconClass + " shrink-0"} />
      <span className="flex-1 text-sm font-medium text-white leading-snug">
        {toast.message}
        {toast.xp != null && (
          <span className={"ml-1.5 font-bold " + s.labelClass}>
            +{toast.xp} XP
          </span>
        )}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="닫기"
      >
        <X size={13} className="text-white" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timerRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timerRef.current.delete(id);
    }
  }, []);

  const show = useCallback((type: ToastType, message: string, xp?: number) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-3), { id, type, message, xp }]);
    const duration = type === "xp" ? 4000 : 3000;
    const timer = setTimeout(() => dismiss(id), duration);
    timerRef.current.set(id, timer);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        className="fixed left-0 right-0 flex flex-col items-center gap-2 px-4 pointer-events-none"
        style={{ bottom: 72, zIndex: 9999 }}
        aria-live="polite"
      >
        <AnimatePresence mode="sync">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
