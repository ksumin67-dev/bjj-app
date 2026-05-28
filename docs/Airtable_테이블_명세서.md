# BJJ 스킬트리 앱 — Airtable 테이블 명세서

> 최종 업데이트: 2026-05-20  
> 앱 재개발/수정 시 이 문서를 기준으로 사용할 것

---

## 1. 베이스 & 테이블 정보

| 항목 | 값 |
|------|-----|
| **베이스 ID** | `appkUqBmwhAK9F8AX` |
| **베이스명** | Untitled Base (앱 실제 DB) |
| **기술 테이블 ID** | `tblVrulFnmKVXHgkl` |
| **테이블명** | Techniques |

> ⚠️ `appw296M55usJRXsB` (주짓수 기술 DB)와 혼동 금지 — 별도 영상 DB임

---

## 2. 필드 스키마 (Field Schema)

| # | 필드명 (한국어) | 필드명 (영어) | 필드 ID | 타입 | 비고 |
|---|--------------|-------------|---------|------|------|
| 1 | ID | ID | `fldxf6Wu6JY9mdxE5` | singleLineText | 예: `CG-01`, `TD-12` |
| 2 | 기술명 (한국어) | Name KR | `fldV5IyWM0zWNfPqC` | singleLineText | 한국어 기술명 |
| 3 | 기술명 (영어) | Name EN | `fldPFonLmINKCO5le` | singleLineText | 영어 기술명 |
| 4 | 타입 | Type | `fldX1FGlEKWgb4T9n` | singleSelect | 아래 허용값 참조 |
| 5 | XP 값 | XP | `fldZNAha9MhULJnei` | number | 정수, 부모 레코드는 0 |
| 6 | Gi/NoGi | Gi/NoGi | `fldQdgbDOIc39f7z1` | singleSelect | 아래 허용값 참조 |
| 7 | 영상 URL | Video URL | `fld6Em3JjMN8gkecD` | url | YouTube 등 영상 링크 |
| 8 | 메모 | Memo | `fld2AoIhb37j393Pm` | multilineText | 자유 메모 |
| 9 | 부모 ID | Parent ID | `fldNxsRbjDpWQKVpY` | singleLineText | 예: `"CG"`, `"BF"` |
| 10 | 스트림 | Stream | `fld9UUVZhYi5YCe7j` | singleSelect | 아래 허용값 참조 |
| 11 | 그립 | Grip | `fldMTJ8ry8Qu8pVjT` | singleLineText | 그립 설명 |
| 12 | 체형 추천 | Body Type | `fldvyL4ODSJfk955k` | singleLineText | 체형별 추천 여부 |
| 13 | 핵심 포인트 | Key Points | `fldkifBWC5Azsg5On` | multilineText | 자유 입력 |
| 14 | 실전 팁 | Tips | `fld5iww4CI8hdFotU` | multilineText | 실전 팁 |
| 15 | 흔한 실수 | Common Mistakes | `fldEItlqDheCq2tel` | multilineText | 흔한 실수 |
| 16 | 카운터 | Counter | `fldAOoTW6PdD6dfDM` | multilineText | 카운터 기술 |
| 17 | YT 검색어 (영문) | YT Search EN | `fldgwgXc1hSStBvaV` | singleLineText | 유튜브 영문 검색어 |
| 18 | YT 검색어 (한국어) | YT Search KR | `fldf7houHb8enFKn0` | singleLineText | 유튜브 한국어 검색어 |
| 19 | 추천 강사 | Recommended Instructor | `fldcecwUym64ZAI8Q` | singleLineText | 추천 강사명 |

---

## 3. singleSelect 허용값

### 3-1. 타입 (Type) — `fldX1FGlEKWgb4T9n`

| 값 | Choice ID | 설명 |
|----|-----------|------|
| `스윕` | `seltVgJGEVi5LC4jV` | 가드에서 탑으로 역전하는 기술 |
| `서브미션` | `selJU9kqb8z0V0Yye` | 피니시 기술 |
| `전환` | `selfr7gres6j7XNUu` | 포지션 간 전환 / 셋업 |
| `컨트롤` | `selzNHaVm7bwzO1KT` | 포지션 컨트롤 유지 |
| `패스` | `selvF3CvmTLPMrwGG` | 가드 패싱 기술 |
| `테이크다운` | `selqXjAZ3MD6z4Ght` | 스탠딩 → 그라운드 기술 |
| `이스케이프` | `selABFE1SO86XRPsp` | 하위 포지션 탈출 |
| `서바이벌` | `selUKQmvRYSTRGV3F` | 하위 포지션 버티기/프레임 |

### 3-2. 스트림 (Stream) — `fld9UUVZhYi5YCe7j`

| 값 | 설명 |
|----|------|
| `스탠딩` | 테이크다운, 클린치 |
| `가드 포지션` | 바텀 가드 게임 전체 (공백 포함) |
| `탑 포지션` | 패싱·탑 컨트롤 전체 (공백 포함) |
| `이스케이프` | 마운트/사이드/백/KNB/NS 탈출 |

> ⚠️ 스페이스 정확히 포함해야 함. 틀리면 422 에러 발생

### 3-3. Gi/NoGi — `fldQdgbDOIc39f7z1`

| 값 |
|----|
| `기전용` |
| `노기전용` |
| `기·노기공통` |

---

## 4. ID 블록 체계

레코드 ID는 `포지션코드-번호` 형식. 번호는 카테고리별 블록으로 구분.

### 가드 포지션 스트림 (기본)

```
XX-01 ~ XX-09  →  스윕 (Sweep)
XX-10 ~ XX-19  →  서브미션 (Submission)
XX-20 ~ XX-29  →  전환 / 컨트롤 (Transition / Control)
```

### 탑 포지션 스트림

```
XX-01 ~ XX-09  →  서브미션 (Submission)
XX-10 ~ XX-19  →  전환 (Transition)
XX-20 ~ XX-29  →  컨트롤 (Control)
```

### 스탠딩 스트림

```
TD-01 ~ TD-09  →  테이크다운 (Takedown)
TD-10 ~ TD-19  →  스로우 / 바디락 (Throw / Bodylock)
TD-20 ~ TD-29  →  클린치 / 그립 파이팅 (Clinch / Grip)
```

### 이스케이프 스트림

```
XX-01 ~ XX-09  →  서바이벌 (Survival) — 버티기 / 프레임
XX-10 ~ XX-19  →  이스케이프 (Escape) — 탈출
XX-20 ~ XX-29  →  전환 (Transition) — 포지션 전환
```

---

## 5. 포지션(부모) 레코드 목록

### 가드 포지션 스트림

| 코드 | 포지션명 | Record ID | 기술 수 |
|------|----------|-----------|---------|
| CG | 클로즈드 가드 | `recSsdcuwrayCbTdH` | 스윕4 / 서브미션8 |
| BF | 버터플라이 가드 | `recKVlkVNMdRfGp1T` | 스윕4 / 서브미션2 / 전환4 |
| DLR | 데라리바 가드 | `rec9vwSkcrvYUnM41` | 스윕4 / 서브미션1 / 전환3 |
| HG | 하프 가드 | (별도 등록) | 스윕+ / 서브미션+ |
| SP | 스파이더 가드 | `recjCcBtr4dqzu8fL` | 스윕4 / 서브미션3 / 전환3 |
| LS | 라소 가드 | `rectv3zTmdnUSOKm2` | 스윕6 / 서브미션3 / 전환4 |
| XG | X 가드 | `recygYXAq8kHTga03` | 스윕6 / 전환4 |
| SLX | 싱글 레그 X 가드 | `recWm3LAqxjE51nqI` | 스윕4 / 서브미션5 / 전환4 |
| FF | 50/50 가드 | `rec3PkHa5jFsw5lgv` | 스윕3 / 서브미션6 / 전환5 |
| RDLR | 리버스 데라리바 가드 | `recjzoDuvucE67u2H` | 스윕3 / 서브미션3 / 전환5 |
| KG | K가드 | `recd8VrzH661dw8F2` | 스윕2 / 서브미션4 / 전환4 |
| SG | 새들 가드 | `reca8nqMYV6k7yzRe` | 스윕2 / 서브미션4 / 전환4 |

### 탑 포지션 스트림

| 코드 | 포지션명 | Record ID |
|------|----------|-----------|
| GP | 가드 패싱 | `rec0KWm1fTzQR5rIV` |
| SC | 사이드 컨트롤 | `recBipKjq7KwyknnY` |
| MT | 마운트 | `recEpreBZo0i8V5Tq` |
| KNB | 니 온 벨리 | `recNBCfhfVIrv8NNG` |
| NS | 노스-사우스 | `recJdDT6OBAwrESvu` |
| BC | 백 컨트롤 | `recKKEOR6W2rUlxGd` |
| GB | 가드 브레이크 (루트) | `recLtt3DRhI7MPdxz` |
| GBCG | 클로즈드 가드 브레이크 | `recS3ro0LiJPFfS3K` |
| GBSP | 스파이더 가드 브레이크 | `recxURX5u0GUqHXAq` |
| GBLS | 라소 가드 브레이크 | `recUHZsrSfIUtCvlG` |
| GBDLR | 데라리바 가드 브레이크 | `recmtJ2Ivid7YEfIO` |
| GBBF | 버터플라이 가드 브레이크 | `rec2Ty9v9vSA9gg0Q` |

### 스탠딩 스트림

| 코드 | 포지션명 | Record ID |
|------|----------|-----------|
| TD | 테이크다운 | `recTKt29Z2aLismuS` |

### 이스케이프 스트림

| 코드 | 포지션명 | Record ID |
|------|----------|-----------|
| ME | 마운트 이스케이프 | `recVVUQUDdk0tbRIK` |
| SCE | 사이드 컨트롤 이스케이프 | `rechgUSeZto5pxmkp` |
| BD | 백 디펜스 | `recofWKInU14LzO0G` |
| KNBE | 니온벨리 이스케이프 | `recyW5aWbuUhR9qlq` |
| NSE | 노스-사우스 이스케이프 | `reci7Ptgkpj7cbPYE` |

---

## 6. 레코드 구조 — 부모 vs 자식

### 부모 레코드 (포지션)
- `fldNxsRbjDpWQKVpY` (부모 ID) = **비어있음**
- `fldZNAha9MhULJnei` (XP) = `0`
- 기술명에 포지션명 기입 (예: "클로즈드 가드")

### 자식 레코드 (기술)
- `fldNxsRbjDpWQKVpY` (부모 ID) = 포지션 코드 문자열 (예: `"CG"`, `"BF"`)
- `fldZNAha9MhULJnei` (XP) = 실제 XP 값

---

## 7. XP 기준 가이드

| 난이도 | XP 범위 | 분류 |
|--------|---------|------|
| 🟩 기본 | 10 ~ 20 | 초급 기술 |
| 🔵 정착 | 20 ~ 35 | 중급 기술 |
| ⚡ 트렌드 | 30 ~ 45 | 고급/현대 기술 |
| 부모 레코드 | 0 | 포지션 루트 |

---

## 8. API 사용 시 주의사항

1. **singleSelect 생성 시** `typecast: true` 필수 (없으면 422 에러)
2. **스트림 값 공백 주의** — `가드 포지션`, `탑 포지션`은 스페이스 포함
3. **한국어 문자열** — Unicode escape 대신 UTF-8 직접 입력 권장
4. **한 번에 최대 10개** 레코드 생성 권장 (배치 안정성)
5. **부모 레코드 먼저 생성** 후 자식 기술 레코드 추가

---

## 9. 새 기술 추가 시 필수 입력 필드

```
fldxf6Wu6JY9mdxE5  — ID (예: CG-05)
fldV5IyWM0zWNfPqC  — 기술명 한국어
fldPFonLmINKCO5le  — 기술명 영어
fldNxsRbjDpWQKVpY  — 부모 ID (예: "CG")
fld9UUVZhYi5YCe7j  — 스트림
fldX1FGlEKWgb4T9n  — 타입
fldZNAha9MhULJnei  — XP 값
fldQdgbDOIc39f7z1  — Gi/NoGi
fldMTJ8ry8Qu8pVjT  — 그립
fldvyL4ODSJfk955k  — 체형 추천
fldkifBWC5Azsg5On  — 핵심 포인트
fld5iww4CI8hdFotU  — 실전 팁
fldEItlqDheCq2tel  — 흔한 실수
fldAOoTW6PdD6dfDM  — 카운터
fldgwgXc1hSStBvaV  — YT 검색어 (영문)
fldf7houHb8enFKn0  — YT 검색어 (한국어)
fldcecwUym64ZAI8Q  — 추천 강사
```

---

## 10. 전체 기술 현황 (2026-05-20 기준)

| 스트림 | 포지션 | 기술 수 |
|--------|--------|---------|
| 가드 포지션 | CG, BF, DLR, HG, SP, LS, XG, SLX, FF, RDLR, KG, SG | 약 120+ |
| 탑 포지션 | GP, SC, MT, KNB, NS, BC, GB계열 | 약 65+ |
| 스탠딩 | TD | 14 |
| 이스케이프 | ME, SCE, BD, KNBE, NSE | 27 |
| **합계** | | **약 230+** |
