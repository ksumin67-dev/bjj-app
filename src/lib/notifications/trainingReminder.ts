"use client";

import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

/**
 * 수련 리마인더 로컬 알림.
 * 네이티브 앱(Capacitor)에서만 동작 — 웹 버전에서는 항상 비활성 상태로 취급.
 * 매일 저녁 8시에 "오늘 수련 기록 남기셨나요?" 알림을 보냄.
 */
const REMINDER_ID = 1001;
const REMINDER_HOUR = 20;
const REMINDER_MINUTE = 0;

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export async function isTrainingReminderEnabled(): Promise<boolean> {
  if (!isNativePlatform()) return false;
  try {
    const pending = await LocalNotifications.getPending();
    return pending.notifications.some((n) => n.id === REMINDER_ID);
  } catch {
    return false;
  }
}

export async function enableTrainingReminder(): Promise<{
  ok: boolean;
  error?: string;
}> {
  if (!isNativePlatform()) {
    return { ok: false, error: "앱에서만 사용할 수 있는 기능이에요." };
  }

  const current = await LocalNotifications.checkPermissions();
  let display = current.display;
  if (display !== "granted") {
    const requested = await LocalNotifications.requestPermissions();
    display = requested.display;
  }
  if (display !== "granted") {
    return {
      ok: false,
      error: "알림 권한이 거부됐어요. 기기 설정에서 알림 권한을 허용해주세요.",
    };
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: REMINDER_ID,
        title: "그래플로그",
        body: "오늘 수련 기록을 남겨보세요.",
        schedule: {
          on: { hour: REMINDER_HOUR, minute: REMINDER_MINUTE },
          repeats: true,
          allowWhileIdle: true,
        },
      },
    ],
  });

  return { ok: true };
}

export async function disableTrainingReminder(): Promise<void> {
  if (!isNativePlatform()) return;
  await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
}
