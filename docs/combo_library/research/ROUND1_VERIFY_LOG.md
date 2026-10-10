# 1라운드 본문 확인 로그 (2026-10-10)

방법: 참고 등급 22개 콤보의 snippet 근거 URL을 web_fetch로 열어 본문(긴 페이지는 저장 파일을 grep)에서 해당 연계와 트리거 방향을 확인. 초안 8개는 대상 제외.
결과: 검증됨 0 -> 9, 참고 22 -> 13, 초안 8 -> 8. 새로 연 페이지 43개(page-read 38, unverified 5). 기존 page-read 2개(Renzo 크로스 초크 페이지, jiujitsu.com 암바->삼각 페이지)는 재열람하지 않음.
판정 기준: 검증됨 = 독립 사이트 2곳 이상 page-read가 같은 연계를 같은 방향으로 서술. 같은 사이트 여러 페이지는 1곳, Evolve MMA/Evolve University는 같은 조직이라 1곳. JitsuIQ는 위키성이라 단독 근거로 쳐주지 않음(다른 곳이 받쳐줄 때만 보조). Digitsu/Bullshido 등은 근거 약함을 issues에 표기.

## 등급 변화 요약

| 콤보 | 이전 -> 이후 |
|---|---|
| cg-crosschoke-armbar | 참고 -> 참고 |
| cg-hipbump-kimura-guillotine | 참고 -> 참고 |
| cg-armbar-triangle-omoplata | 참고 -> 검증됨 |
| cg-overhook-triangle-omoplata | 참고 -> 검증됨 |
| cg-crosschoke-scissor | 참고 -> 참고 |
| cg-pendulum-armbar | 참고 -> 참고 |
| sc-kimura-armbar | 참고 -> 검증됨 |
| sc-kimura-backtake | 참고 -> 검증됨 |
| sc-frame-spinning-armbar | 참고 -> 검증됨 |
| sc-underhook-marcelo-armbar | 참고 -> 참고 |
| sc-arm-triangle | 참고 -> 참고 |
| sc-backtake-rnc | 참고 -> 검증됨 |
| sc-mount-smount-armbar | 참고 -> 참고 |
| mt-highmount-smount-armbar | 참고 -> 참고 |
| mt-crosschoke-armbar | 참고 -> 참고 |
| mt-giftwrap-back-rnc | 참고 -> 검증됨 |
| mt-kimura-armbar | 참고 -> 참고 |
| bc-seatbelt-rnc-armbar | 참고 -> 참고 |
| bc-rnc-short-choke | 참고 -> 검증됨 |
| bc-bodytriangle-rnc-armbar | 참고 -> 참고 |
| bc-straitjacket-bowarrow-armbar | 참고 -> 참고 |
| bc-kimura-control-armbar | 참고 -> 검증됨 |
| 초안 8개 (cg-overhook-armdrag-backtake, sc-darce-anaconda, mt-kimura-armtriangle, mt-armbar-defended-backtake, mt-basic-control-technical-mount, bc-rnc-bowarrow-gi, bc-system-choke-short, bc-armbar-mount-exit) | 변경 없음 |

## 콤보별 상세

### CG

**cg-crosschoke-armbar** 참고 -> 참고
- 읽음: bjjee ?p=82920 (Stambowsky, page-read), bjjcanvas ?p=5871 (Kenneth Brown).
- Stambowsky 글은 "크로스 칼라 초크에서 상대가 이두를 밀면 암바"를 명확히 서술. 단 Renzo 글과 같은 BJJEE라 1곳.
- BJJ Canvas 본문은 "초크를 피해 몸을 옮기면 가까운 쪽 팔 공격이 열린다"까지만 있고 암바를 명시하지 않음(영상에만 있음) -> unverified.
- 독립 사이트 page-read 1곳이라 참고 유지.

**cg-hipbump-kimura-guillotine** 참고 -> 참고
- 읽음: Grapplearts hip-bump-sweep, JitsuIQ hip-bump-sweep (둘 다 page-read).
- JitsuIQ(위키성)는 "팔을 빼면 기무라 / 앞으로 숙이면 길로틴"을 서술해 콤보와 일치. Grapplearts는 챕터 목록에 "힙범프->삼각", "전방 압박에 대한 기무라", "전방 압박에 대한 오버훅 캡처"만 있어 기무라 트리거가 다르고 길로틴은 없음.
- 트리거 불일치 + 한 곳이 위키성이라 참고 유지. 단계/트리거는 수정하지 않음.

**cg-armbar-triangle-omoplata** 참고 -> 검증됨
- 읽음: jiujitsu.com armbar-to-omoplata (page-read), Atos OnDemand (유료 영상 페이지, 제목/태그만 -> unverified), Evolve University (page-read). 기존 page-read: jiujitsu.com armbar-to-triangle.
- Evolve가 "암바에서 팔을 빼면 남은 팔이 펴짐=오모플라타, 굽음=삼각"을 서술. jiujitsu.com + Evolve = 독립 2곳.
- 수정: CG-16 트리거를 "반대쪽 팔이 굽어 팔꿈치가 상대 배 근처에 있으면", CG-17 트리거를 "반대쪽 팔이 펴진 채 내 가슴을 밀면"으로 변경(기존 "머리 숙임/자세 세움"은 본문 근거 없음).

**cg-overhook-triangle-omoplata** 참고 -> 검증됨
- 읽음: Grapplearts every-triangle-is-omoplata, Digitsu overhook-guard, Elite Sports overhook attacks (모두 page-read).
- Grapplearts: 삼각/오모플라타 진입이 같고 서로 후속으로 쓸 수 있다고 서술(실패한 삼각->오모플라타는 링크만). Digitsu: 오버훅 가드 허브 설명. Elite Sports: 오버훅에서 각 공격을 나열만 하고 삼각->오모플라타 순서는 없음.
- 추가한 증거: Evolve University 삼각/오모플라타/암바 콤비네이션 글(page-read, 이미 읽은 페이지). 이로써 삼각<->오모플라타 연계를 Grapplearts + Evolve 독립 2곳이 서술.
- 남은 점: Evolve는 "오모플라타를 막으면 삼각" 방향도 서술. 삼각 방어 후 오모플라타 방향은 Grapplearts에서 링크로만 언급.

**cg-crosschoke-scissor** 참고 -> 참고
- 읽음: Evolve University cross-choke-and-scissor (page-read, 초크->시저 방향 정확), BJJ Canvas ?p=6831 (page-read).
- BJJ Canvas는 반대 방향(시저 시도 중 상대가 짚으면 칼라 그립으로 루프 초크). 같은 방향 독립 확인이 아니라 참고 유지.

**cg-pendulum-armbar** 참고 -> 참고
- 읽음: Evolve MMA pendulum sweep (page-read, grep). 펜듈럼 중 상대가 팔을 짚으면 암바로 전환하는 Fabio Da Mata 설명이 본문에 있음(기존 issues의 "암바 세부 동작 없음"은 오류, 정정). 삼각 연계는 확인하지 않아 supports에서 삭제.
- 출처 1곳이라 참고 유지.

### SC

**sc-kimura-armbar** 참고 -> 검증됨
- 읽음: Digitsu (Barlaan), Awesome Jiu Jitsu (Giles), Grapplearts two-powerful-armbars (모두 page-read, 독립 3곳).
- 수정: SC-02 트리거를 "상대가 기무라를 버텨 그립이 쉽게 끊기지 않고 굴러 도망가지도 않으면"으로 변경(기존 "팔을 펴서 버티며"는 근거 없음). Digitsu supports의 "팔을 펴면 암바 / 팔을 당겨 빼면 아메리카나"는 본문에 없어 삭제하고 issues의 아메리카나 분기 언급도 근거로 쓰지 않는다고 정정.

**sc-kimura-backtake** 참고 -> 검증됨
- 읽음: Awesome Jiu Jitsu (page-read), Grapplearts Kimura Cheatsheet PDF (page-read: 원문 PDF를 이번에 열람). 독립 2곳.
- 남은 점: 두 출처 모두 백 테이크 세부 동작을 서술하지 않음. PDF의 T-기무라는 등 뒤에서 공격하는 포지션이라 시트벨트 백과 다를 수 있음. SC-11 동일 동작 여부는 사람 검수.

**sc-frame-spinning-armbar** 참고 -> 검증됨
- 읽음: Grapplearts ambar-attacks-from-side-control (Ritchie Yip), Bernardo Faria Academy (Demian Maia) (둘 다 page-read, 독립 2곳).
- 남은 점: Grapplearts의 "스피닝 암바"는 먼 쪽 팔 기술, 가까운 쪽은 fast armbar로 별도 서술. 도감 SC-05가 어느 쪽인지 사람 검수.

**sc-underhook-marcelo-armbar** 참고 -> 참고
- 읽음: Grapplearts two-powerful-armbars (page-read, 4단계가 콤보와 일치). 출처 1곳.

**sc-arm-triangle** 참고 -> 참고
- 읽음: JitsuIQ arm-triangle (위키성), BJJEE ?p=11098 (영상 소개 글, 팔을 귀 쪽으로 쳐내고 반대로 넘어가는 순서). 둘 다 page-read.
- 위키성 + 강사 직접 아님, 반응별 트리거 없음 -> 참고 유지.

**sc-backtake-rnc** 참고 -> 검증됨
- 읽음: Graciemag Gordinho (page-read, RNC까지 서술), Digitsu Barlaan side-control-back-take (page-read, RNC는 서술 없음). 독립 2곳.
- 남은 점: 상대가 도는 방향이 다름(Gordinho: 반대쪽으로 도망, Barlaan: 나를 향해 돎).

**sc-mount-smount-armbar** 참고 -> 참고
- 읽음: Mauricio Gomes (본문에 영상 소개 한 줄뿐, 엉덩이 압박/상대가 밀어내는 트리거 없음 -> unverified), jiujitsu.com s-mount-armbar (page-read).
- 사이드->마운트 전환 고리가 근거 없음.

### MT

**mt-highmount-smount-armbar** 참고 -> 참고
- 읽음: jiujitsu.com S-mount armbar, Evolve MMA S-mount (grep), Gracie Barra top mount types (모두 page-read, 독립 3곳이 S-마운트->암바 확인).
- 남은 점: 하이 마운트(MT-21)->S-마운트(MT-05) 순서를 서술한 출처 없음(GB는 "높은 S-마운트"만 언급). 기존 트리거 "상대가 팔로 밀어 막거나 팔을 가슴 앞에 세우면"는 근거 없어 "상대가 방어하려 팔을 내밀어 팔이 고립되거나 공간이 생기면"으로 수정. 첫 단계 미확인이라 참고 유지.

**mt-crosschoke-armbar** 참고 -> 참고
- 읽음: Atos Intro Day 4 (설명문 page-read: 크로스 초크 미끼 -> 업빠 -> 암바), BJJ More (연계 서술 없음 -> unverified).
- 수정: MT-01 트리거에서 근거 없는 "손으로 초크를 막거나 팔을 뻗어 밀어내면"을 삭제하고 "팔을 잡고 업빠로 뒤집으려 하면"만 남김. 독립 1곳.

**mt-giftwrap-back-rnc** 참고 -> 검증됨
- 읽음: Evolve University gift wrap, JitsuIQ gift-wrap(위키성), Digitsu gift-wrap (모두 page-read). Evolve와 Digitsu가 백 테이크를, Evolve와 JitsuIQ가 RNC를 서술. 위키성 JitsuIQ 없이도 Evolve + Digitsu 독립 2곳.

**mt-kimura-armbar** 참고 -> 참고
- 읽음: JitsuIQ kimura (위키성, page-read). "기무라가 막히면 암바/삼각 준비"라는 일반 팁과 마운트 기무라 진입만 있고 마운트에서 기무라->암바 순서는 없음. 1곳.

### BC

**bc-seatbelt-rnc-armbar** 참고 -> 참고
- 읽음: Gracie Barra armlock (page-read: 목 방어가 단단해 초크가 막히면 암바), BJJEE back attacks (Evolve 게스트글, 삼각이 어려울 때의 대안이라 트리거 다름 -> unverified).
- 독립 1곳.

**bc-rnc-short-choke** 참고 -> 검증됨
- 읽음: Evolve MMA short choke (grep), Digitsu short choke, (참고로 Evolve University 4옵션 글도 읽음) 모두 RNC가 막히면 숏 초크라고 서술. Evolve 계열은 1곳으로 계산해 Evolve + Digitsu 독립 2곳.

**bc-bodytriangle-rnc-armbar** 참고 -> 참고
- 읽음: Digitsu body-triangle (RNC/숏초크/백 암바를 나열만, 트리거 없음), Bullshido 포럼 (팔 하나를 잡고 있으면 암바, 비전문 출처). 둘 다 page-read이나 근거가 약해 참고 유지.

**bc-straitjacket-bowarrow-armbar** 참고 -> 참고
- 읽음: JitsuIQ straight-jacket (위키성, SJ -> RNC/보우 앤 애로우), Digitsu Barlaan bow-and-arrow-wrist-lock (머리를 빼면 손목락, 기회가 되면 암바). 각 고리를 출처 1곳씩만 뒷받침. Digitsu는 손목락을 주 선택지로 서술하고 암바는 부차적.

**bc-kimura-control-armbar** 참고 -> 검증됨
- 읽음: Evolve University 4 attack options, Grapplearts triangle-chokes-from-the-back (모두 page-read). 독립 2곳이 기무라 컨트롤에서 암바(삼각 경유 포함)로 가는 흐름을 서술.
- 수정: BC-03을 role if_blocked에서 then으로 바꾸고 근거 없는 트리거("기무라가 들어가지 않고 팔이 풀리거나 펴질 때")를 삭제, note를 "기무라 컨트롤로 팔을 묶은 상태에서 다리로 윗팔을 엮어 암바로 이어간다"로 수정. Grapplearts는 삼각 중심, 암바는 삼각 경유 서술.

## 사실 수정 목록 (전체)
1. cg-armbar-triangle-omoplata: CG-16/CG-17 트리거 교체 (Evolve 기준).
2. sc-kimura-armbar: SC-02 트리거 교체, 아메리카나 갈래 근거 철회.
3. mt-highmount-smount-armbar: MT-05 트리거 교체.
4. mt-crosschoke-armbar: MT-01 트리거에서 근거 없는 반응 삭제.
5. bc-kimura-control-armbar: BC-03 role if_blocked -> then, 트리거 삭제, note 수정.
6. cg-pendulum-armbar: 기존 issues의 "암바 세부 동작 없음" 정정, supports에서 미확인 삼각 언급 삭제.
7. cg-overhook-triangle-omoplata: Evolve University 증거 1건 추가(콤보 추가/삭제 없음).

## unverified 처리한 근거 5건
- cg-crosschoke-armbar: bjjcanvas ?p=5871 (본문에 암바 명시 없음)
- cg-armbar-triangle-omoplata: Atos OnDemand omoplata 영상 (유료 페이지, 본문 없음)
- sc-mount-smount-armbar: mauriciogomesbjj.com (트리거 서술 없음)
- mt-crosschoke-armbar: bjjmore.com Roger Gracie review (연계 서술 없음)
- bc-seatbelt-rnc-armbar: bjjee back-attacks (트리거 다름)
- 접속 불가/차단된 URL은 없었음. 우회 수단은 사용하지 않음.

## 후속 권장
- 참고 13개 중 출처 1곳짜리(cg-crosschoke-scissor, cg-pendulum-armbar, sc-underhook-marcelo-armbar, mt-crosschoke-armbar, mt-kimura-armbar, bc-seatbelt-rnc-armbar)는 다음 라운드에서 강사 직접 출처 보강.
- 검증됨 9개도 한국 코치 검수는 별도 필요(PROTOCOL 7절).
- 지금 JitsuIQ와 Digitsu 기술 페이지는 데이터베이스/위키 성격이라 PROTOCOL 3절에 따라 "단독 근거 불가"로 두는 편이 안전함.
