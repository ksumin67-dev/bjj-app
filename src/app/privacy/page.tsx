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
        <p className="mt-1 text-xs text-text-tertiary">시행일자: [시행일 검토 필요]</p>
        <p className="mt-2 text-xs leading-relaxed text-text-tertiary">
          이 문은 서비스 코드와 공개된 자료만으로 적은 개정 초안입니다. [검토 필요] 표시는
          코드나 공개 자료로 확정하지 못한 항목입니다.
        </p>
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
            <li>
              프로필 사진 — 온보딩 또는 프로필 수정에서 &quot;내 사진&quot;을 고른 경우.
              미리 들어 있는 캐릭터 이미지는 이용자 사진이 아니며, 이용자가 고른 캐릭터
              키만 프로필에 저장됩니다.
            </li>
            <li>
              직접 입력한 기술명 — 기술도감에 없는 기술을 수련 기록에 적었을 때.
              같은 기술에 메모를 적으면 그 이름과 메모가 수련 기록의 메모에도 함께 저장됩니다.
            </li>
          </ul>
          <p>
            AI 게임플랜 추천을 눌렀을 때 국외로 전송되는 항목은 제4항에서 따로 적습니다.
            그 전송에는 이메일, 이용자 ID, 닉네임, 프로필 사진, 수련 메모가 포함되지 않습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">2. 수집 목적</h2>
          <p>서비스는 다음 목적을 위해 개인정보를 수집·이용합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원 식별 및 로그인 유지</li>
            <li>수련 기록·진행도 관리, 리마인더 알림 발송</li>
            <li>선호 스타일 기반 선수 추천, 서비스 개선을 위한 이용 현황 파악</li>
            <li>프로필 화면에 이용자가 고른 사진 또는 캐릭터를 표시</li>
            <li>
              기술도감에 없는 기술명을 모아 사용 횟수와 처음·최근 사용일을 보고,
              정식 기술로 올릴지 관리자가 검토
            </li>
            <li>
              이용자가 &quot;AI로 게임플랜 추천받기&quot;를 눌렀을 때, 이미 정해 둔 후보
              콤보 안에서 연습할 조합을 고르고 이유를 한 문장으로 만들기 위해
              수련 요약 정보를 처리
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">3. 개인정보의 처리 위탁</h2>
          <p>
            서비스는 다음 외부 사업자에게 개인정보 처리 업무를 위탁합니다. 국외 이전인
            항목의 이전 항목·방법·보유 기간은 제4항에 적습니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Supabase — 회원 인증, 데이터베이스 저장, 프로필 사진 파일 저장(Storage)</li>
            <li>Google — 소셜 로그인(OAuth)</li>
            <li>Vercel — 서비스 호스팅</li>
            <li>Airtable (미국) — 기술도감 등 서비스 콘텐츠 관리, 이용자가 직접 입력한 기술명 저장</li>
            <li>
              Anthropic, PBC (미국) — 이용자가 AI 게임플랜 추천을 요청하고 제4항의 조건이
              맞을 때, 후보 콤보 선택과 추천 이유 문장 생성
            </li>
          </ul>
          <p>
            위 사업자는 각자의 개인정보처리방침에 따라 정보를 관리하며, 서비스는
            이용자의 개인정보를 광고 목적 등 제3자에게 별도로 판매·제공하지 않습니다.
          </p>
          <p>
            [검토 필요: Supabase, Google, Vercel의 법인명·연락처·소재 국가. 코드에는
            서비스명만 있고, 프로필 사진이 저장되는 Supabase 프로젝트의 리전도 없습니다.
            스키마 주석의 Storage 설정(버킷 avatars, 공개 읽기, 512KB, jpeg/png/webp)은
            주석이라 이 저장소에서 실행되지 않으며, 실제 프로젝트와 같은지는 확인되지
            않았습니다.]
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">4. 개인정보의 국외 이전</h2>
          <p>
            아래 이전은 처리 위탁이면서 국외 이전입니다. 이전받는 자의 연락처 등
            코드에 없는 사항은 검토 표시로 남겨 두었습니다.
          </p>

          <h3 className="font-semibold text-text-primary pt-2">가. Anthropic, PBC (미국) — AI 게임플랜 추천</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              이전받는 자: Anthropic, PBC (미국). [검토 필요: Anthropic, PBC의 연락처]
            </li>
            <li>위탁 업무와 이용 목적: 후보 콤보 중 지금 연습하기 좋은 것을 고르고, 한국어 한 문장의 이유를 생성</li>
            <li>
              이전 일시: 이용자가 게임플랜 화면에서 &quot;AI로 게임플랜 추천받기&quot;를 누른 뒤,
              수련·좋아요·좋아하는 선수 중 개인화에 쓸 신호가 있고, 서버에 API 키가 있으며,
              같은 날 같은 입력의 캐시가 없을 때. 신호가 없거나 키가 없으면 서버 안의 규칙
              엔진만 동작하고 이 이전은 일어나지 않습니다. 캐시가 있으면 이번 요청은
              Anthropic을 다시 호출하지 않습니다.
            </li>
            <li>
              이전 방법: 이용자 기기가 아니라 서비스 서버가 HTTPS로{" "}
              <span className="break-all">https://api.anthropic.com/v1/messages</span> 에
              POST합니다. 요청에는 모델명(환경변수 ANTHROPIC_MODEL, 없으면 claude-haiku-5-5),
              고정된 코치 지시문, 그리고 아래 입력이 들어갑니다.
            </li>
            <li>
              이전하는 항목
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>수련 세션 총 횟수(숫자)</li>
                <li>수련 횟수가 많은 기술도감 기술의 한국어 이름, 최대 8개. 횟수 자체는 이 목록에 없습니다.</li>
                <li>배우고 싶다고 표시한 기술도감 기술의 한국어 이름, 최대 12개</li>
                <li>
                  후보 콤보 최대 8개. 각 후보는 콤보 라이브러리의 식별자, 콤보 이름,
                  단계별 기술도감 한국어 이름, 규칙 엔진이 만든 이유 문장입니다.
                  이유 문장에는 그 콤보의 기술을 수련한 횟수, 배우고 싶은 기술 이름,
                  좋아하는 선수의 한국어 이름이 포함될 수 있습니다.
                </li>
              </ul>
            </li>
            <li>
              이 요청 본문에 넣지 않는 값: 이용자 ID, 이메일, 닉네임, 벨트, 프로필 사진,
              수련 메모, 직접 입력한 기술명, 수련 날짜. 이용자 ID는 서비스의 Supabase
              캐시 조회·저장에만 쓰입니다.
            </li>
            <li>
              이전받는 자의 보유·이용 기간: 코드에는 Anthropic 쪽 보관 기간이 없습니다.
              Anthropic Privacy Center의 상업용 제품 안내(2026년 7월 1일, &quot;How long do
              you store my organization&apos;s data?&quot;)는 API로 받은 입력과 생성된 출력을
              받은 날 또는 만든 날부터 30일 안에 백엔드에서 지운다고 적고, 예외로 더 길게
              보관하는 기능, 별도 합의(zero data retention 등), 이용정책 집행, 법령 준수를
              적고 있습니다. 같은 문서는 이용정책 위반으로 표시된 입력·출력을 최대 2년,
              신뢰·안전 분류 점수를 최대 7년 보유할 수 있다고 적습니다. 공개된 상업용
              약관은 서비스의 Customer Content로 모델을 학습하지 않는다고 적고 있습니다.
              이 코드의 호출은 위 메시지 API 한 번이며 파일을 따로 올리지 않습니다.
              [검토 필요: 이 서비스가 Anthropic 상업용 약관과 처리 부속서의 당사자인지,
              zero data retention이 적용되는지. 코드는 API 키 유무만 봅니다.]
              [검토 필요: 기본 모델 claude-haiku-5-5 또는 ANTHROPIC_MODEL로 바꾼 모델이
              Covered Model인지, 위 장기 보유 예외가 이 호출에 적용되는지]
            </li>
            <li>
              서비스 안에 남는 결과: 고른 콤보 식별자와 이유 문장을 Supabase의
              recommend_llm_cache에 이용자 ID와 함께 저장합니다. 캐시 키는 날짜, 후보
              식별자, 수련한 기술명, 좋아요한 기술명을 해시로 만든 값입니다.
              [검토 필요: 이 캐시의 파기 주기. 지난 날짜의 행을 지우는 코드가 없고,
              제5항의 계정 삭제 때 함께 지워지는 것으로 스키마에 선언되어 있습니다.]
            </li>
            <li>
              거부 방법: 추천 버튼을 누르지 않으면 이 이전은 일어나지 않고, AI 추천
              카드도 만들어지지 않습니다. [검토 필요: 국외 이전을 거부하는 별도 신청
              절차와, 거부 시 효과를 어떻게 고지할지. 거부 신청 화면은 코드에 없습니다.]
            </li>
          </ul>

          <h3 className="font-semibold text-text-primary pt-2">나. Airtable (미국) — 직접 입력한 기술명</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              이전받는 자: Airtable (미국). [검토 필요: Airtable의 법인 정식 명칭과 연락처.
              코드에는 없고, 소재 국가는 미국으로 적었습니다.]
            </li>
            <li>
              위탁 업무와 이용 목적: 기술도감에 없는 기술명을 모아 사용 횟수, 처음 사용일,
              최근 사용일, 정식 등록 여부를 두고, 관리자가 기술도감에 올릴지 검토
            </li>
            <li>
              이전 일시: 수련 기록을 새로 저장하거나 수정할 때, 직접 입력한 기술명이
              하나 이상 있으면 그 처리 중에 전송
            </li>
            <li>
              이전 방법: 이용자 기기가 아니라 서비스 서버가 Airtable SDK로 커스텀 기술
              테이블에 레코드를 만들거나 고칩니다. 애플리케이션 코드는 접속 주소를 지정하지
              않습니다. 사용 중인 SDK는 환경변수 AIRTABLE_ENDPOINT_URL이 없으면{" "}
              <span className="break-all">https://api.airtable.com</span> 으로 HTTPS 요청을
              보냅니다. [검토 필요: 배포 환경에 AIRTABLE_ENDPOINT_URL이 따로 있는지. 이 앱의
              환경변수 스키마에는 그 변수가 없습니다.]
            </li>
            <li>
              이전하는 항목: 새로 만드는 레코드에는 이용자가 입력한 기술명, 그 이용자의
              ID(User ID), 사용 횟수, 처음 사용일, 최근 사용일(기록한 날의 날짜), 정식
              등록 여부(새로 만들 때는 거짓)를 저장합니다. 이메일과 닉네임은 저장하지
              않습니다. 코드에 스트림 값을 넣을 자리는 있으나 필드 ID가 비어 있어 스트림은
              저장되지 않습니다.
            </li>
            <li>
              보유와 삭제: 이용자 ID가 있는 레코드는 그 이용자가 계정을 삭제하면 그
              레코드만 삭제합니다. 소유자가 없는 기존 레코드는 이용자를 구분하지 않고
              합쳐 둔 것이며, 기술명, 사용 횟수, 처음 사용일, 최근 사용일만 있는 익명
              집계로 유지합니다. 이 익명 집계는 계정 삭제 때 지우지 않습니다. 기술명에
              대해 이용자가 메모를 적은 경우, 그 이름과 메모는 수련 기록 메모로
              Supabase에도 저장되며 그 메모는 제5항의 계정 삭제 때 수련 기록과 함께
              삭제되도록 선언되어 있습니다.
            </li>
            <li>
              거부 방법: 기술도감에 없는 기술을 직접 입력하지 않으면 이 이전은 일어나지
              않습니다. [검토 필요: 국외 이전 거부 신청 절차. 별도 거부 화면은 없습니다.]
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">5. 보유 및 이용 기간, 파기</h2>
          <p>
            회원 계정에 연결된 Supabase 데이터는 계정 삭제 시 지우도록 되어 있습니다.
            삭제 처리는 Supabase Auth의 해당 사용자를 삭제합니다. 코드 주석은 이 삭제가
            ON DELETE CASCADE로 profiles, training_sessions, game_plans, technique_goals를
            함께 지운다고 적습니다. 스키마 문서는 combo_feedback과 recommend_llm_cache도
            auth.users 삭제 시 cascade 되도록 선언합니다.
            [검토 필요: 운영 데이터베이스의 외래 키가 이 주석·문서와 일치하는지.
            스키마 문서에는 sequences 테이블도 cascade로 있으나, 현재 코드는 game_plans를
            사용합니다.]
            [검토 필요: 법령상 별도 보관이 필요한 항목과 그 기간. 코드에는 법정 보존
            기간이 없습니다.]
          </p>

          <h3 className="font-semibold text-text-primary pt-2">프로필 사진</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              저장 위치: Supabase Storage 버킷 avatars. 경로 형식은
              {" "}
              <span className="break-all">{"{이용자 ID}/{업로드 시각}.jpg"}</span>
              . 기기에서 가운데를 기준으로 정사각형으로 자른 뒤 256×256 JPEG(품질 0.85)로
              만들어 올립니다. 프로필에는 종류(photo)와 이 경로만 저장합니다. 경로는
              본인 ID로 시작하는 값만 저장합니다.
            </li>
            <li>
              표시: 서비스는 해당 경로의 공개 객체 URL로 사진을 보여 줍니다.
              [검토 필요: 공개 버킷을 유지할지. URL을 알면 로그인 없이 열리는 구조입니다.]
            </li>
            <li>
              보유 기간: [검토 필요: 프로필 사진의 보유 기간. 코드에 만료일이 없습니다.
              새 사진을 올리거나 캐릭터로 바꾸거나, 프로필 편집을 취소해도 이미 올린
              파일을 지우는 코드가 없습니다. 업로드는 저장 버튼과 별개로 선택 즉시
              이루어집니다.]
            </li>
            <li>
              계정 삭제 시: 프로필 행이 지워지면 사진 경로 참조는 함께 없어지도록
              선언되어 있습니다. 파일 자체에 대한 Storage 삭제 호출은 계정 삭제 코드에
              없습니다. [검토 필요: 계정 삭제 시 Storage 사진 파일의 삭제. 대시보드에
              사용자 삭제 트리거가 있는지는 이 저장소로 확인되지 않습니다.]
            </li>
          </ul>

          <h3 className="font-semibold text-text-primary pt-2">직접 입력한 기술명과 AI 처리 결과</h3>
          <p>
            새로 저장하는 직접 입력 기술명은 이용자 ID(User ID)와 함께 Airtable에 둡니다.
            계정을 삭제하면 그 이용자 ID가 있는 레코드만 삭제합니다. 소유자 없이 이미
            합쳐 둔 레코드는 기술명, 사용 횟수, 처음 사용일, 최근 사용일의 익명 집계로
            남기며 계정 삭제 때 지우지 않습니다. Anthropic 쪽 보관은 제4항을 따릅니다.
            서비스 Supabase에 남는 AI 캐시는 위 계정 삭제 cascade 대상을 따릅니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">6. 이용자의 권리와 계정 삭제</h2>
          <p>
            이용자는 언제든지 프로필 화면에서 본인의 정보를 열람·수정할 수 있습니다.
          </p>
          <p>계정 삭제(회원 탈퇴)는 다음에서 요청할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>서비스 프로필 화면의 &quot;계정 삭제&quot;. 확인 후 계정 삭제 처리를 호출합니다.</li>
            <li>
              웹:{" "}
              <a
                href="https://bjj-app-brown.vercel.app/account/delete"
                className="underline break-all"
              >
                https://bjj-app-brown.vercel.app/account/delete
              </a>
              . [검토 필요: 이 웹 페이지의 동작. 이 저장소에는 /account/delete 라우트가
              없고, 주소만 적었습니다. 프로필의 계정 삭제와 같은 처리인지는 확인되지
              않았습니다.]
            </li>
          </ul>
          <p>
            삭제가 성공하면 로그인 세션을 끝내고 로그인 화면으로 보냅니다. 이때 이용자
            ID가 있는 Airtable 기술명 레코드는 삭제하고, 소유자가 없는 익명 집계는
            유지합니다. Storage 사진 파일은 이 처리에서 지워지지 않습니다.
            그 외 열람·정정·삭제 문의는 제8항의 연락처로 요청할 수 있습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">7. 만 14세 미만 아동의 개인정보</h2>
          <p>
            서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 만 14세 미만인 경우
            서비스 이용(회원가입)을 제한합니다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">8. 개인정보 보호책임자 및 문의처</h2>
          <p>
            개인정보 관련 문의는 아래 이메일로 연락해주세요.
            <br />
            <span className="text-text-primary">ksumin67@gmail.com</span>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-text-primary">9. 방침 변경</h2>
          <p>
            이 방침은 법령 또는 서비스 변경에 따라 개정될 수 있으며, 중요한 변경 시
            서비스 내 공지 또는 이메일로 사전 안내합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
