"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AVATAR_PRESETS, avatarImageSrc, getAvatarPreset } from "@/lib/avatars";
import { UserAvatar } from "./UserAvatar";

/**
 * 캐릭터 선택기 — 큰 미리보기 + 가로 스크롤 캐릭터 목록.
 * 선택한 캐릭터의 이름·성향 문구를 미리보기 아래에 보여준다.
 */
export function AvatarPicker({
  value,
  nickname,
  ringColor,
  onChange,
}: {
  value: string | null;
  nickname: string;
  ringColor: string;
  onChange: (key: string) => void;
}) {
  const reduce = useReducedMotion();
  const current = getAvatarPreset(value);

  return (
    <div>
      <div className="flex flex-col items-center">
        <motion.div
          key={value ?? "none"}
          initial={reduce ? false : { scale: 0.85, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
        >
          <UserAvatar
            avatarType={value ? "preset" : null}
            avatarValue={value}
            nickname={nickname}
            size={96}
            ringColor={ringColor}
          />
        </motion.div>
        <p className="mt-3 text-[13px] font-bold text-white">
          {current ? `${current.name} · ${current.tag}` : "캐릭터를 골라보세요"}
        </p>
        <p className="mt-0.5 text-[11px]" style={{ color: "#8A8A94" }}>
          {current ? current.desc : "나와 닮은 수련 스타일로 골라도 좋아요"}
        </p>
      </div>

      <div className="mt-4 -mx-6 px-6 flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {AVATAR_PRESETS.map((p) => {
          const on = p.key === value;
          return (
            <motion.button
              key={p.key}
              type="button"
              whileTap={reduce ? undefined : { scale: 0.88 }}
              onClick={() => onChange(p.key)}
              aria-pressed={on}
              aria-label={`${p.name} ${p.tag}`}
              className="shrink-0 flex flex-col items-center gap-1"
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: "#1A1A24",
                  boxShadow: on ? `0 0 0 2.5px ${ringColor}` : "0 0 0 1px rgba(255,255,255,0.08)",
                  transition: "box-shadow 0.15s",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarImageSrc(p.key)} alt="" style={{ width: 46, height: 46, objectFit: "contain" }} />
              </div>
              <span className="text-[10.5px]" style={{ color: on ? "#fff" : "#8A8A94" }}>{p.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
