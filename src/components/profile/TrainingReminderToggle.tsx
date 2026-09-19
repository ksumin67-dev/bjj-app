"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import {
  disableTrainingReminder,
  enableTrainingReminder,
  isNativePlatform,
  isTrainingReminderEnabled,
} from "@/lib/notifications/trainingReminder";

/**
 * 수련 리마인더 알림 on/off 토글.
 * 네이티브 앱(Capacitor)에서만 노출 — 웹 버전에서는 렌더링하지 않음.
 */
export function TrainingReminderToggle() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const native = isNativePlatform();
      setSupported(native);
      if (native) {
        const on = await isTrainingReminderEnabled();
        if (!cancelled) setEnabled(on);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!supported || loading) {
    return null;
  }

  async function handleToggle() {
    setPending(true);
    if (enabled) {
      await disableTrainingReminder();
      setEnabled(false);
      toast.show("success", "수련 리마인더를 껐어요.");
    } else {
      const res = await enableTrainingReminder();
      if (res.ok) {
        setEnabled(true);
        toast.show("success", "매일 저녁 8시에 알려드릴게요.");
      } else {
        toast.show("error", res.error ?? "알림을 켜지 못했어요.");
      }
    }
    setPending(false);
  }

  return (
    <section
      className="flex items-center justify-between gap-3"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginBottom: "20px" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ border: "1px solid rgba(217,119,46,0.4)" }}
        >
          <Bell size={15} color="#D9772E" />
        </div>
        <div className="text-left min-w-0">
          <p className="text-sm font-bold text-white">수련 리마인더</p>
          <p className="text-[11px] font-normal" style={{ color: "#6B7280" }}>
            매일 저녁 8시에 수련 기록을 알려드려요
          </p>
        </div>
      </div>
      <button
        onClick={handleToggle}
        disabled={pending}
        aria-pressed={enabled}
        aria-label="수련 리마인더 알림 켜기/끄기"
        className="relative shrink-0 rounded-full transition-colors duration-fast"
        style={{
          width: 44,
          height: 26,
          backgroundColor: enabled ? "#D9772E" : "rgba(255,255,255,0.12)",
          opacity: pending ? 0.6 : 1,
        }}
      >
        {pending ? (
          <Loader2
            size={14}
            className="animate-spin absolute top-1/2 left-1/2"
            style={{ transform: "translate(-50%, -50%)", color: "#fff" }}
          />
        ) : (
          <span
            className="absolute rounded-full bg-white transition-transform duration-fast"
            style={{
              width: 20,
              height: 20,
              top: 3,
              left: 3,
              transform: enabled ? "translateX(18px)" : "translateX(0)",
            }}
          />
        )}
      </button>
    </section>
  );
}
