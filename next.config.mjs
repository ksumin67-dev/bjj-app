/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js 15에서 experimental.typedRoutes가 안정 옵션으로 옮겨졌다.
  // 이 앱은 타입드 라우트를 쓰지 않으므로 끈 상태를 유지한다.
  typedRoutes: false,
  experimental: {
    // Next.js 15는 동적 페이지의 클라이언트 라우터 캐시(staleTime) 기본값을
    // 30초에서 0으로 바꿨다. 탭 이동마다 스켈레톤이 다시 뜨지 않도록
    // 14에서 쓰던 동적 페이지 재사용 시간(30초)을 유지한다.
    // 정적 페이지 기본값(300초)은 15.5.29에서도 그대로라 건드리지 않는다.
    // fetch 기본값(force-cache → no-store)은 되돌리지 않는다. 유저별 Supabase
    // 조회가 URL만으로 캐시되면 안 되고, 앱 코드의 fetch는 Anthropic POST뿐이다.
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default nextConfig;
