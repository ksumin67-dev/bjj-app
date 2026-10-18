"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import { AVATAR_BUCKET, AVATAR_PRESETS, avatarImageSrc, getAvatarPreset, type AvatarSel } from "@/lib/avatars";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "./UserAvatar";

const BRAND = "#D9772E";
const PHOTO_SIZE = 256;

/** 사진을 가운데 기준 정사각형으로 잘라 256px JPEG로 줄인다 (EXIF 회전 반영) */
async function toSquareJpeg(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = PHOTO_SIZE;
  canvas.height = PHOTO_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, PHOTO_SIZE, PHOTO_SIZE);
  bitmap.close();
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("blob"))), "image/jpeg", 0.85),
  );
}

/**
 * 프로필 이미지 선택기 — 큰 미리보기 + 캐릭터 목록 + "내 사진 올리기".
 * 사진은 선택 즉시 Storage(avatars/{내 id}/…)에 올리고 경로를 onChange로 전달한다.
 */
export function AvatarPicker({
  value,
  nickname,
  onChange,
}: {
  value: AvatarSel;
  nickname: string;
  onChange: (sel: AvatarSel) => void;
}) {
  const reduce = useReducedMotion();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presetKey = value?.type === "preset" ? value.value : null;
  const current = getAvatarPreset(presetKey);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 올릴 수 있어요.");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const blob = await toSquareJpeg(file);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("auth");
      const path = `${user.id}/${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (upErr) throw upErr;
      onChange({ type: "photo", value: path });
    } catch {
      setError("사진을 올리지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  }

  const captionTitle =
    value?.type === "photo" ? "내 사진" : current ? `${current.name} · ${current.tag}` : "프로필을 골라보세요";
  const captionDesc =
    value?.type === "photo" ? "갤러리에서 고른 사진이에요" : current ? current.desc : "캐릭터를 고르거나 내 사진을 올려요";

  return (
    <div>
      <div className="flex flex-col items-center">
        <motion.div
          key={value ? `${value.type}:${value.value}` : "none"}
          initial={reduce ? false : { scale: 0.85, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 18 }}
          className="relative"
        >
          <UserAvatar avatarType={value?.type ?? null} avatarValue={value?.value ?? null} nickname={nickname} size={96} />
          {uploading && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(10,10,15,0.6)" }}>
              <Loader2 size={22} className="animate-spin text-white" />
            </div>
          )}
        </motion.div>
        <p className="mt-3 text-[13px] font-bold text-white">{captionTitle}</p>
        <p className="mt-0.5 text-[11px]" style={{ color: "#8A8A94" }}>{captionDesc}</p>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-x-2 gap-y-3.5">
        <motion.button
          type="button"
          whileTap={reduce ? undefined : { scale: 0.88 }}
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label="내 사진 올리기"
          className="flex flex-col items-center gap-1 disabled:opacity-60"
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{
              width: 56,
              height: 56,
              backgroundColor: value?.type === "photo" ? `${BRAND}22` : "#1A1A24",
              boxShadow: value?.type === "photo" ? `0 0 0 2.5px ${BRAND}` : "0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            <Camera size={22} color={BRAND} />
          </div>
          <span className="text-[10.5px]" style={{ color: BRAND }}>내 사진</span>
        </motion.button>
        {AVATAR_PRESETS.map((p) => {
          const on = p.key === presetKey;
          return (
            <motion.button
              key={p.key}
              type="button"
              whileTap={reduce ? undefined : { scale: 0.88 }}
              onClick={() => onChange({ type: "preset", value: p.key })}
              aria-pressed={on}
              aria-label={`${p.name} ${p.tag}`}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: "#1A1A24",
                  boxShadow: on ? `0 0 0 2.5px ${BRAND}` : "0 0 0 1px rgba(255,255,255,0.08)",
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
      {error && <p className="mt-1 text-[11.5px] text-center" style={{ color: "#F87171" }}>{error}</p>}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}
