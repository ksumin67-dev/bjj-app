import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "이용약관" };

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 pb-16 space-y-6">
      <Link
        href="/login"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ChevronLeft size={16} />
        돌아가기
      </Link>

      <header>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">이용약관</h1>
        <p className="mt-1 text-xs text-text-tertiary">시행일자: 2026년 9월 20일</p>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">제1조 (목적)</h2>
          <p>
            이 약관은 그래플로그(이하 &quot;서비스&quot;)를 운영하는 개발자(이하 &quot;운영자&quot;)가
            제공하는 주짓수 기술 기록 및 수련 관리 서비스의 이용과 관련하여 운영자와
            이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">제2조 (서비스의 내용)</h2>
          <p>
            서비스는 기술도감(기술/포지션 정보), 수련 기록 캘린더, 게임플랜(기술 조합)
            관리, XP·벨트 등 학습 진행도 표시 기능을 제공합니다. 일부 기능은 유료
            구독(프리미엄) 전환 시에만 제공될 수 있으며, 구체적인 유료 기능 범위와
            가격은 서비스 내 안내 화면에 따릅니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">제3조 (계정 및 이용자의 의무)</h2>
          <p>
            이용자는 정확한 이메일 정보로 가입해야 하며, 계정 정보(비밀번호 등)의
            관리 책임은 이용자 본인에게 있습니다. 타인의 계정을 도용하거나 서비스의
            정상적인 운영을 방해하는 행위(예: 관리자 전용 기능에 대한 무단 접근 시도,
            비정상적인 대량 요청 등)를 해서는 안 됩니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">제4조 (콘텐츠에 대한 면책)</h2>
          <p>
            서비스에서 제공하는 기술 정보, 선수 정보, 수련 가이드 등은 참고 목적으로
            제공되는 정보이며, 실제 주짓수 수련은 반드시 자격을 갖춘 지도자의 감독
            하에 이루어져야 합니다. 서비스에 기재된 정보의 활용으로 발생하는 부상이나
            손해에 대해 운영자는 책임을 지지 않습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">제5조 (서비스의 변경 및 중단)</h2>
          <p>
            운영자는 서비스의 전부 또는 일부를 사전 고지 후 변경하거나 중단할 수
            있습니다. 다만 이용자에게 중대한 영향을 미치는 변경의 경우, 사전에 서비스
            내 공지 또는 이메일로 안내합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">제6조 (계정 해지)</h2>
          <p>
            이용자는 언제든지 프로필 화면에서 계정 삭제(회원 탈퇴)를 요청할 수 있으며,
            탈퇴 시 개인정보처리방침에 따라 이용자의 데이터가 처리됩니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">제7조 (문의)</h2>
          <p>
            서비스 이용과 관련한 문의는 아래 이메일로 연락해주세요.
            <br />
            <span className="text-text-primary">ksumin67@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
}
