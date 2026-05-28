"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction } from "@/lib/actions/userProfile";
import { useToast } from "@/contexts/ToastContext";
import type { UserProfile } from "@/lib/airtable/userProfile";
import type { BeltLevel } from "@/types/domain";
import { BeltDisplay, BELT_CONFIG } from "@/components/ui/BeltDisplay";
import { CheckCircle, Loader2 } from "lucide-react";

// ── 상수 ──────────────────────────────────────────────────────────────────

const BELTS: { value: BeltLevel; label: string }[] = [
  { value: "White Belt",  label: "White"  },
  { value: "Blue Belt",   label: "Blue"   },
  { value: "Purple Belt", label: "Purple" },
  { value: "Brown Belt",  label: "Brown"  },
  { value: "Black Belt",  label: "Black"  },
];

// ── 컴포넌트 ──────────────────────────────────────────────────────────────

export function ProfileEditor({ profile }: { profile: UserProfile }) {
  const [belt,     setBelt]     = useState<BeltLevel>(profile.belt);
  const [stripe,   setStripe]   = useState(profile.stripe);
  const [nickname, setNickname] = useState(profile.nickname);
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  const maxStripe = belt === "Black Belt" ? 6 : 4;
  const cfg       = BELT_CONFIG[belt] ?? BELT_CONFIG["White Belt"];

  function handleBeltChange(b: BeltLevel) {
    setBelt(b);
    const max = b === "Black Belt" ? 6 : 4;
    if (stripe > max) setStripe(max);
  }

  function handleSave() {
    startTransition(async () => {
      const res = await updateProfileAction(belt, stripe, nickname);
      if (res.ok) {
        toast.show("success", "프로필이 저장됐습니다.");
        setTimeout(() => {
          router.refresh();
          router.push("/");
        }, 1000);
      } else {
        toast.show("error", res.error ?? "저장에 실패했습니다.");
      }
    });
  }

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <header>
        <h1 className="text-2xl font-black tracking-tight">프로필</h1>
        <p className="text-text-tertiary mt-1 text-sm">
          도장에서 승급하면 여기서 업데이트하세요
        </p>
      </header>

      {/* 프로필 미리보기 */}
      <div className="rounded-2xl p-4 bg-bg-elevated">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-xl font-black"
            style={{ background: "linear-gradient(135deg, #7B61FF, #B44FD4)", color: "#fff" }}
          >
            {nickname.charAt(0) || "A"}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black text-white truncate">{nickname || "아쿠아"}</p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: cfg.textColor }}>
              {belt}{stripe > 0 ? ` · ${stripe} Stripe` : ""}
            </p>
          </div>
        </div>

        {/* 벨트 형태 시각화 */}
        <BeltDisplay belt={belt} stripe={stripe} height={30} tipWidth={68} />
      </div>

      {/* 닉네임 */}
      <section className="rounded-2xl p-4 space-y-3 bg-bg-elevated">
        <p className="text-xs uppercase tracking-widest font-semibold text-text-tertiary">Nickname</p>
        <input
          type="text"
          value={nickname}
          maxLength={20}
          onChange={(e) => { setNickname(e.target.value); }}
          className="w-full h-11 rounded-xl px-4 text-sm font-medium text-text-primary placeholder:text-text-disabled focus:border-border-focus outline-none transition-colors duration-fast"
          style={{ backgroundColor: "var(--bg-base)", border: "1px solid var(--border-subtle)" }}
          placeholder="닉네임 입력"
        />
      </section>

      {/* 벨트 선택 */}
      <section className="rounded-2xl p-4 space-y-4 bg-bg-elevated">
        <p className="text-xs uppercase tracking-widest font-semibold text-text-tertiary">Belt</p>
        <div className="space-y-2.5">
          {BELTS.map((b) => {
            const active  = belt === b.value;
            const bCfg    = BELT_CONFIG[b.value];
            return (
              <button
                key={b.value}
                onClick={() => handleBeltChange(b.value)}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-bg-hover transition-all duration-fast active:scale-[0.98]"
                style={{
                  backgroundColor: active ? "rgba(255,255,255,0.04)" : "#0A0A0F",
                  border: active
                    ? `1.5px solid ${bCfg.bodyGrad[0]}55`
                    : "1.5px solid transparent",
                }}
              >
                {/* 미니 벨트 */}
                <div style={{ width: 120, flexShrink: 0 }}>
                  <BeltDisplay
                    belt={b.value}
                    stripe={belt === b.value ? stripe : 0}
                    fullWidth={false}
                    height={18}
                    tipWidth={38}
                    className="w-full"
                  />
                </div>
                <span
                  className="text-sm font-bold flex-1 text-left"
                  style={{ color: active ? bCfg.textColor : "#4A4A5A" }}
                >
                  {b.value}
                </span>
                {active && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: bCfg.bodyGrad[0] }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 그랄 선택 */}
      <section className="rounded-2xl p-4 space-y-3 bg-bg-elevated">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest font-semibold text-text-tertiary">
            Stripe
          </p>
          <span className="text-sm font-bold" style={{ color: cfg.textColor }}>
            {stripe} / {maxStripe}
          </span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: maxStripe + 1 }).map((_, i) => {
            const active = stripe === i;
            return (
              <button
                key={i}
                onClick={() => { setStripe(i); }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                style={{
                  backgroundColor: active ? cfg.bodyGrad[0] + "22" : "#0A0A0F",
                  color:           active ? cfg.textColor : "#4A4A5A",
                  border:          active ? `1.5px solid ${cfg.bodyGrad[0]}` : "1.5px solid transparent",
                }}
              >
                {i === 0 ? "0" : i}
              </button>
            );
          })}
        </div>
      </section>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full py-3 rounded-xl font-bold text-white text-[14px] flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.97] transition-all duration-fast"
        style={{
          background: "linear-gradient(135deg, #7B61FF 0%, #B44FD4 100%)",
          boxShadow:  "0 4px 16px rgba(123,97,255,0.35)",
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          "저장하기"
        )}
      </button>
    </div>
  );
}
