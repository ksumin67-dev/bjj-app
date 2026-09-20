import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">개인정보처리방침</h1>
        <p className="mt-1 text-xs text-text-tertiary">시행일자: 2026년 9월 20일</p>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">1. 수집하는 개인정보 항목</h2>
          <p>그래플로그(이하 &quot;서비스&quot;)는 다음의 정보를 수집합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>이메일 주소, 비밀번호(암호화 저장) — 이메일 가입 시</li>
            <li>이메일 주소, 프로필 이름 — 구글 소셜 로그인 시</li>
            <li>벨트/그랄, 주당 목표 수련 횟수, 선호 스타일 — 온보딩에서 입력</li>
            <li>수련 기록(날짜, 기술, 게임플랜, 메모), XP·레벨 정보 — 서비스 이용 중 생성</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">2. 수집 목적</h2>
          <p>
            회원 식별 및 로그인 유지, 수련 기록·진행도 관리, 리마인더 알림 발송,
            선호 스타일 기반 선수 추천, 서비스 개선을 위한 이용 현황 파악을 위해
            개인정보를 수집·이용합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">3. 개인정보의 처리 위탁</h2>
          <p>서비스는 다음 외부 사업자를 통해 개인정보를 저장·처리합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Supabase — 회원 인증 및 데이터베이스 저장</li>
            <li>Google — 소셜 로그인(OAuth)</li>
            <li>Vercel — 서비스 호스팅</li>
            <li>Airtable — 기술도감 등 서비스 콘텐츠 데이터 관리</li>
          </ul>
          <p>
            위 사업자는 각자의 개인정보처리방침에 따라 정보를 관리하며, 서비스는
            이용자의 개인정보를 광고 목적 등 제3자에게 별도로 판매·제공하지
            않습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">4. 보유 및 이용 기간</h2>
          <p>
            개인정보는 회원 탈퇴 시까지 보유하며, 탈퇴 요청 시 관련 법령에서 별도
            보관을 요구하지 않는 한 지체 없이 파기합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">5. 이용자의 권리</h2>
          <p>
            이용자는 언제든지 프로필 화면에서 본인의 정보를 열람·수정할 수 있으며,
            계정 삭제(회원 탈퇴)를 통해 개인정보 삭제를 요청할 수 있습니다. 그 외
            문의는 아래 연락처로 요청해주세요.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">6. 만 14세 미만 아동의 개인정보</h2>
          <p>
            서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 만 14세 미만인 경우
            서비스 이용(회원가입)을 제한합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">7. 개인정보 보호책임자 및 문의처</h2>
          <p>
            개인정보 관련 문의는 아래 이메일로 연락해주세요.
            <br />
            <span className="text-text-primary">ksumin67@gmail.com</span>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">8. 방침 변경</h2>
          <p>
            이 방침은 법령 또는 서비스 변경에 따라 개정될 수 있으며, 중요한 변경 시
            서비스 내 공지 또는 이메일로 사전 안내합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
