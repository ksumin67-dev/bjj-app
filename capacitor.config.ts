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
  appName: "그래플로그",
  webDir: "public",
  server: {
    url: "https://bjj-app-brown.vercel.app",
    cleartext: false,
    // 구글 로그인 등 앱 도메인 밖으로 나가는 이동이 여기 없으면
    // Capacitor가 외부 시스템 브라우저(Custom Tab)로 열어버려서
    // 로그인 이후 화면이 네이티브 브릿지가 없는 "그냥 브라우저 탭"이 되어버림.
    // (window.Capacitor는 존재하지만 isNativePlatform()이 false로 나오는 원인)
    allowNavigation: [
      "smgunmjpddcfgohmuawb.supabase.co",
      "accounts.google.com",
      "*.google.com",
      "*.googleusercontent.com",
    ],
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
