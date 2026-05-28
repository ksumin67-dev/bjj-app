# BJJ 스킬트리 앱 — 세션 핸드오프 v4

> **목적:** 새 대화 또는 미래 본인이 이 프로젝트를 맥락 없이 이어받을 때 사용.
>
> 마지막 업데이트: 2026-05-15 (v3 DB 마이그레이션 완료 / 단계 3: 스킬트리 그래프 준비 중)
>
> 이전 버전: `BJJ_App_Session_Handoff_v3.md` (2026-05-10 시점, v3 마이그레이션 시작 전)
>
> 이 문서를 새 대화 첫 메시지에 첨부 → "이 핸드오프 보고 컨텍스트 잡아줘. [원하는 작업]" 식으로 시작.

---

## 0. 한 줄 요약

> Next.js 14 + Tailwind + Airtable로 만든 BJJ 수련자 본인용 스킬트리 앱. v3 완료: **96개 기술 DB 마이그레이션 완료**, 4 스트림 게이밍 트리(가드스윕/탑패스/서브미션/포지션컨트롤) 전부 Airtable에 적재됨. 코드도 7 심화필드 + YT 검색 버튼 반영 완료. 다음: **단계 3 스킬트리 그래프** (@xyflow/react).

---

## 1. v3 → v4 사이 진행 사항

### 1.1 v3 DB 마이그레이션 — 전체 완료 ✅

Task #1~#10 전부 완료 (2026-05-15):

| Task | 내용 | 상태 |
|---|---|---|
| #1 | 9 신규 필드 추가 (stream, grip, body_type, ...) | ✅ |
| #2 | type 필드 11 신규 옵션 추가 | ✅ |
| #3 | CSV 96개 데이터 가공 (인물명 제거, YT 분리) | ✅ |
| #4 | 기존 55개 기술 DELETE | ✅ |
| #5 | 96개 일괄 임포트 (50개씩 2배치) | ✅ |
| #6 | prereq 텍스트 → recordId 배열 PATCH (63/67 성공) | ✅ |
| #7 | 시퀀스 "버터플라이가드 스윕" 처리 | ✅ |
| #8 | 코드 반영 (5개 파일 수정) | ✅ |
| #9 | stream 96개 일괄 적용 + 포지션컨트롤 오타 수정 | ✅ |
| #10 | 라이브 검증 (96개 확인, 심화필드 확인, prereq 확인) | ✅ |

### 1.2 알려진 미완성 항목 (영향 최소)

- **prereq 4개 누락**: CG-06, CG-07, FF-01, DLR-04가 다른 기술의 prerequisite로 참조되지만, 해당 ID 기술이 v3 DB에 존재하지 않음. 해당 연결만 공백. 나머지 63/67 정상.
- **시퀀스 "버터플라이가드 스윕" 기술 링크 해제**: v3에서 BF-02는 "암 드래그"로 의미 다름. 시퀀스는 success_count=1 보존 상태, techniques_used 비어있음. 수동 재연결 필요 (BF-01 기본 버터플라이 스윕 또는 BF-03 아이디오트 스윕으로 연결 권장).
- **stream 좀비 옵션 "가드스윗"**: Airtable 필드에 오타 옵션 잔류 (삭제 API 없음). 코드의 `normalizeStream()`이 "가드스윗" → "가드스윕" 자동 교정하므로 실용적 영향 없음.

### 1.3 코드 반영 완료 파일 (v3 추가분)

```
bjj-app/src/
├── lib/airtable/tables.ts         [UPDATED] STREAM + 9 심화필드 ID 추가
├── types/domain.ts                [UPDATED] Stream 타입, TechniqueType 11개 추가, Technique 인터페이스 확장
├── lib/airtable/techniques.ts     [UPDATED] normalizeStream() + toTechnique() v3 필드 매핑
├── components/tree/TypeChip.tsx   [UPDATED] Partial<Record> + 17종 컬러 스타일
└── app/tree/[positionId]/[techId]/page.tsx  [UPDATED] 7 심화필드 섹션 + YT 2버튼 + stream 배지
```

---

## 2. 현재 상태 (v4 시점)

### 2.1 Airtable 베이스 `appkUqBmwhAK9F8AX`

| 테이블 | 레코드 수 | 상태 |
|---|---|---|
| Positions | 18 | 변경 없음 |
| Techniques | **96** | v3 완료. 25 필드 전부 populated. |
| Sequences | 1 ("버터플라이가드 스윕") | success_count=1, techniques_used=[] (수동 재연결 필요) |
| UserProgress | 0 | 영향 없음 |
| TrainingSessions | 0 | 영향 없음 |

### 2.2 Techniques 필드 (25 필드) — 전체 목록

```
v1 기본 (11):
  ID             fldxf6Wu6JY9mdxE5  singleLineText  (PK)
  name_ko        fldV5IyWM0zWNfPqC  singleLineText
  name_en        fldPFonLmINKCO5le  singleLineText
  position       fldv9wpskHSxktUsG  multipleRecordLinks → Positions
  type           fldX1FGlEKWgb4T9n  singleSelect (17종)
  belt_level     fldLgROPfEJ7thx9j  singleSelect
  xp_value       fldZNAha9MhULJnei  number
  gi_nogi        fldQdgbDOIc39f7z1  singleSelect
  video_url      fld6Em3JjMN8gkecD  url
  notes          fld2AoIhb37j393Pm  multilineText
  prerequisites  fldVgPzw8ECOx9cSr  multipleRecordLinks → Techniques (자기참조)

v2 자동 링크 (4):
  From field: prerequisites  fldAWgGQpcTrLmpiM
  Sequences                  fldrWqWcCSDdGMsMG
  UserProgress               fldhS4yaYw9y3xPeS
  TrainingSessions           fldhFfK3anPwX24PR

v3 신규 (10):
  stream            fld9UUVZhYi5YCe7j  singleSelect (가드스윕/탑패스/서브미션/포지션컨트롤)
  grip              fldMTJ8ry8Qu8pVjT  multilineText
  body_type         fldvyL4ODSJfk955k  multilineText
  key_point         fldkifBWC5Azsg5On  multilineText
  practical_tip     fld5iww4CI8hdFotU  multilineText
  common_mistake    fldEItlqDheCq2tel  multilineText
  counter           fldAOoTW6PdD6dfDM  multilineText
  yt_search_general fldgwgXc1hSStBvaV  singleLineText
  yt_search_ko      fldf7houHb8enFKn0  singleLineText
  curated_instructor fldcecwUym64ZAI8Q singleLineText
```

### 2.3 기존 TypeScript 에러 (pre-existing, 내 변경 무관)

- `sequences.ts:96` — airtable.create() 타입 overload 불일치
- `trainingSessions.ts:151` — 동일 패턴
→ 내가 수정한 5개 파일은 에러 없음. 단계 3 코드 작업 시 함께 수정 권장.

---

## 3. 다음 작업 — 단계 3: 스킬트리 그래프

### 3.1 핵심 설치

```bash
cd ~/Desktop/Agent/불로소득/04_BJJ_project/bjj-app
pnpm add @xyflow/react @dagrejs/dagre
```

### 3.2 /tree 페이지 재설계 계획

```
현재: /tree → 띠별 리스트 (v1 잔류)
목표: /tree → 4 스트림 탭 + 노드 그래프

구조:
├── 탭 바 (가드스윕 | 탑패스 | 서브미션 | 포지션컨트롤)
└── 각 탭 = ReactFlow 캔버스
     - Dagre 자동 레이아웃 (계층형, top→bottom)
     - 노드 4상태: locked(어두운 회색) / aware(보라) / drill(파랑) / master(초록 글로우)
     - 엣지: prerequisites 기반 방향 화살표
     - 노드 클릭 → 기술 상세 시트 (슬라이드업, 기존 page.tsx 재사용)
     - 스트림별 컬러 (아래 참조)
     - 모바일 핀치 줌 지원
```

### 3.3 4 스트림 컬러 (globals.css에 추가 필요)

```css
--stream-sweep:    #2E80F0;  /* 가드스윕 — 파랑 */
--stream-pass:     #FF8C42;  /* 탑패스 — 주황 */
--stream-submit:   #FF4D6D;  /* 서브미션 — 빨강 */
--stream-control:  #34D399;  /* 포지션컨트롤 — 초록 */
```

### 3.4 클래스 아이덴티티 카드 (홈 상단 추가 — 별도 작업)

```
UserProgress의 stream별 누적 XP 비율 계산
→ 가장 높은 stream → 클래스 라벨
  가드스윕     → 스위퍼 (Sweeper)
  탑패스       → 패서 (Passer)
  서브미션     → 헌터 (Hunter)
  포지션컨트롤 → 컨트롤러 (Pressure Player)
→ 진행 바 4개 + 캘린더 홈 상단 위젯
```

---

## 4. Tech Stack

```json
{
  "framework": "Next.js 14.2.18 (App Router)",
  "language": "TypeScript 5.6",
  "node": "20 LTS",
  "package-manager": "pnpm 10.x",
  "styling": "Tailwind CSS 3.4 (커스텀 토큰)",
  "data": "airtable@0.12.2 npm SDK (서버 전용)",
  "form-state": "useFormState/useFormStatus (react-dom)",
  "icons": "lucide-react 0.460",
  "validation": "zod 3.23 (env.ts에서만 사용)",
  "fonts": "pretendard (한글 + 영문)",
  "graph-tree": "@xyflow/react (미설치 — 단계 3에서 도입)"
}
```

---

## 5. 학습된 함정 (v2 + v3 누적)

### v2 함정 (요약)
- 6.1: `returnFieldsByFieldId: true` 모든 select 필수
- 6.2: `find()`는 옵션 미지원 → `select` + `filterByFormula RECORD_ID()` 사용
- 6.3: multipleRecordLinks의 record ID는 formula로 비교 불가 → 메모리 필터링
- 6.4: `lib/airtable/*.ts`에 `import "server-only"` 필수
- 6.5: 한글 unicode escape 회피 (typecast: true로 안전) — 단, 6.11 참조
- 6.6: Phase 끝마다 라이브 시나리오 테스트 의무

### v3 신규 함정

#### 6.7 LLM 생성 콘텐츠의 진위 검증 필요 ⚠️
v3 7 심화필드는 LLM이 생성한 미검증 콘텐츠. 1단계(본인 사용)엔 OK, 결제 진입 전 재검증 필요.

#### 6.8 Mount 권한 한계
`/sessions/.../mnt/bjj-app/` 마운트는 `rm -rf` 불가. 폐기 파일은 stub/redirect 처리.

#### 6.9 Edit 도구 한글 경로 막힘 ⚠️
한글 경로(`불로소득`)에서 Edit/Write 가끔 "blocked" 에러.
**회피**: `mcp__workspace__bash`로 `cat > file << 'EOF'` 직접 쓰기 사용.

#### 6.10 stream 옵션 한글 typo
"가드스윗" 좀비 옵션 잔류 (삭제 API 없음). `normalizeStream()`이 코드 레벨에서 교정함.

#### 6.11 typecast:true 한글 singleSelect 오염 ⚠️ (중요)
typecast:true로 한글 singleSelect 값 입력 시 Airtable이 유니코드가 다른 새 옵션을 생성할 수 있음.
예: "포지션컨트롤"(컨=U+CE90)이 "포지션콘트롤"(콘=U+CF58)로 생성됨.
**대응**: 기존 옵션 exact match 필요 시 반드시 `typecast:false` + 정확한 한글 문자열 사용.

#### 6.12 sandbox 네트워크 차단
`mcp__workspace__bash`에서 `api.airtable.com` 직접 호출은 403. Airtable MCP(`mcp__d7d0778f__*`) 사용 필수.

---

## 6. 디자인 시스템

v2 §7 그대로. v3에서 stream 컬러 추가 예정:

```css
--stream-sweep:    #2E80F0;
--stream-pass:     #FF8C42;
--stream-submit:   #FF4D6D;
--stream-control:  #34D399;
```

---

## 7. 환경 변수 — 변경 없음

```bash
# .env.local
AIRTABLE_API_KEY=patXXXXXXXXX.XXXXX...
AIRTABLE_BASE_ID=appkUqBmwhAK9F8AX
NEXT_PUBLIC_APP_NAME=bjj-app
```

---

## 8. 중요 결정 사항

| # | 결정 | 근거 |
|---|---|---|
| 1 | 캘린더가 홈, /log 폐기 | 입력 + 보기 일관성 |
| 2 | 세션에 드릴/스파링 구분 없음 | UX 단순화 |
| 3 | 4 메인 스트림 | 사용자 통찰 — 클래스 아이덴티티 |
| 4 | 스킬트리: @xyflow/react | 작업량 70% 절감 |
| 5 | 트리 단위: 4 스트림 탭 분리 | 모바일 가독성 |
| 6 | 해금 시스템: 시각·논리적만 | 띠 인증 시스템 보류 |
| 7 | v3 DB 풀 교체 (55→96) | UserProgress 0, ID 충돌 회피 |
| 8 | 7 심화필드 그대로 (검증 추후) | 1단계 시간 절약 |
| 9 | YT 검색어 인물명 폐기, 2 필드 분리 | LLM 검증 안 됨 |
| 10 | bjj-technique-map은 참고용 | 두 시스템 독립 |

---

## 9. 새 대화 시작 시 권장 첫 메시지

```
이 핸드오프 문서(BJJ_App_Session_Handoff_v4.md) 보고
프로젝트 컨텍스트 잡아줘.

작업 환경:
- Cowork
- 코드: ~/Desktop/Agent/불로소득/04_BJJ_project/bjj-app/
- Airtable: appkUqBmwhAK9F8AX

다음 작업: 단계 3 스킬트리 그래프 작업 시작
```

---

## 10. 빠른 시작 체크리스트

```bash
cd ~/Desktop/Agent/불로소득/04_BJJ_project/bjj-app
pnpm install
pnpm dev   # http://localhost:3000

# 화면 순회
# /              → 캘린더 메인뷰
# /tree          → 스킬트리 (단계 3에서 그래프로 교체 예정)
# /tree/CG/CG-01 → 기술 상세 (7 심화필드 + YT 버튼 ✅)
# /sequences     → 시퀀스 목록
# Airtable: https://airtable.com/appkUqBmwhAK9F8AX
```

---

## 11. 중요 파일 빠른 색인

| 무엇 | 경로 |
|---|---|
| **이 핸드오프 (v4)** | `bjj-app/BJJ_App_Session_Handoff_v4.md` |
| 이전 핸드오프 (v3) | `BJJ_App_Session_Handoff_v3.md` |
| Airtable 필드 ID | `bjj-app/src/lib/airtable/tables.ts` |
| 도메인 타입 | `bjj-app/src/types/domain.ts` |
| 기술 Airtable 함수 | `bjj-app/src/lib/airtable/techniques.ts` |
| 기술 상세 페이지 | `bjj-app/src/app/tree/[positionId]/[techId]/page.tsx` |
| TypeChip | `bjj-app/src/components/tree/TypeChip.tsx` |
| 캘린더 컴포넌트 | `bjj-app/src/components/calendar/*.tsx` |
| 디자인 토큰 | `bjj-app/src/app/globals.css` + `tailwind.config.ts` |

---

## 12. v3 마스터 DB — 카테고리 prefix (96 기술)

```
가드 포지션 (27개):  CG HG BF DLR SP RG XG SLX LP GR
탑 포지션 (29개):    GP SC KB NS MT BC
서브미션 (24개):     CH AL SL LL
전환·이탈·디펜스 (16개): TD TR ES SD
```

---

## 13. 진행 현황 (2026-05-15 기준)

```
[단계 1: 캘린더]      ✅ 완료
[단계 2: v3 마이그레이션] ✅ 완료 (Task #1~#10)
[단계 3: 스킬트리 그래프] ⏳ 지금 시작 가능 — pnpm add @xyflow/react
[단계 4: Vercel 배포]  □ 단계 3 후
[단계 5: 결제]        □ 2단계 진입 시
```

**즉시 가능한 작업**:
1. 단계 3 — pnpm add @xyflow/react @dagrejs/dagre → /tree 그래프 재설계
2. 시퀀스 재연결 — "버터플라이가드 스윕" → BF-01/BF-03으로 techniques_used 재연결 (5분)
3. pre-existing TS 에러 수정 — sequences.ts + trainingSessions.ts (30분)

---

**End of handoff v4.**

> 다음 핸드오프 갱신 시점: 단계 3 스킬트리 그래프 완성 후.
