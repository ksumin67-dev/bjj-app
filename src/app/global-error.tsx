"use client";

/**
 * 루트 레이아웃 자체가 실패했을 때의 최후 화면. 자체 html/body를 가져야 하며
 * 앱 스타일에 의존하지 않도록 인라인 스타일만 사용한다.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          background: "#0F1115",
          color: "#F3F4F6",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div>
          <h1 style={{ fontSize: 17, margin: 0 }}>잠시 문제가 생겼어요</h1>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 8 }}>
            잠시 후 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              borderRadius: 8,
              border: 0,
              background: "#F59E0B",
              color: "#000",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
