import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Next.js는 Server Actions를 전면적으로 사용해 정적 export가 불가능하므로,
 * 네이티브 셸은 라이브 Vercel URL을 원격으로 로드하는 방식을 씀 (Next.js 코드 변경 불필요).
 * 서버는 계속 Vercel에서 돌리고, 이 앱은 그 화면을 감싸는 껍데기 역할만 함.
 *
 * webDir은 Capacitor가 요구하는 필수값이라 형식상 지정하지만,
 * server.url이 설정되어 있으면 실제로는 사용되지 않고 원격 URL을 로드함.
 */
const config: CapacitorConfig = {
  appId: "com.aqua.bjjapp",
  appName: "BJJ 스킬트리",
  webDir: "public",
  server: {
    url: "https://bjj-app-brown.vercel.app",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 500,
      backgroundColor: "#0F1115",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0F1115",
    },
  },
};

export default config;
