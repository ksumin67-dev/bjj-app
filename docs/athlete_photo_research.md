# 스킬트리 선수 사진 리서치 (2026-09-15)

11명 선수 실사 후보를 리서치했다. **다운로드/코드 반영은 하지 않았고**, 소스와 라이선스 상태만 정리했다.
아래 "즉시 사용 가능" 그룹만 라이선스 문제없이 바로 넣을 수 있고, 나머지는 반드시 사용 전 별도 라이선스(구매/서면 허가/보도자료 사용 범위 확인)가 필요하다.

## ✅ 즉시 사용 가능 (Wikimedia Commons — CC/PD 라이선스 확인됨)

| 선수 | 파일 | 라이선스 | 링크 |
|---|---|---|---|
| 고든 라이언 Gordon Ryan | ADCC King Gordon Ryan... (YouTube 캡처) | CC (2025년 8월 이전 YouTube CC 라이선스 영상에서 캡처) | [Commons 카테고리](https://commons.wikimedia.org/wiki/Category:Gordon_Ryan) |
| 마이키 무수메시 Mikey Musumeci | Mikey Musumeci 2022.jpg | CC0 / Public Domain Mark 1.0 | [파일](https://commons.wikimedia.org/wiki/File:Mikey_Musumeci_2022.jpg) |
| 로저 그레이시 Roger Gracie | RogerGracie.JPG | CC BY-SA 3.0 (업로더: Iwtbf42) | [파일](https://commons.wikimedia.org/wiki/File:RogerGracie.JPG) |
| 마르셀로 가르시아 Marcelo Garcia | Marcelo garcia master mozart and fabiano souza.jpg | Commons 카테고리 내 (개별 라이선스는 파일 페이지에서 재확인 필요) | [Commons 카테고리](https://commons.wikimedia.org/wiki/Category:Marcelo_Garcia) |

주의: 위 4명도 실제 앱에 넣기 전 각 파일 페이지에서 라이선스 조건(저작자 표시 방식, SA 조건 등)을 한 번 더 직접 확인해야 한다. 특히 CC BY-SA는 앱 크레딧/저작자 표시 문구가 필요하다.

## ⚠️ Commons에서 확인 안 됨 — 라이선스 확보 필요

이 7명은 검색 결과 Wikimedia Commons에 전용 카테고리/CC 사진이 확인되지 않았다. 주로 Getty Images, 대회 주최측(ADCC/IBJJF), 개인 인스타그램, 소속 팀(Atos/AOJ) 자료로 유통되고 있어 상업 앱에 쓰려면 별도 라이선스가 필요하다.

| 선수 | 검색 결과 요약 | 추천 확보 경로 |
|---|---|---|
| 크레이그 존스 Craig Jones | Commons "Craig Jones" 카테고리는 동명의 Slipknot 멤버 사진뿐 | 본인/CJI(Craig Jones Invitational) SNS에 직접 사용 허가 요청, 또는 Getty 라이선스 구매 |
| 부셰샤 Marcus "Buchecha" Almeida | Commons에 전용 사진 없음 | Getty/Flograppling 라이선스 구매, 또는 ADCC 공식 미디어 문의 |
| 라파엘 멘데스 Rafael Mendes | Commons에 전용 사진 없음 | Art of Jiu-Jitsu(AOJ) 팀에 사용 허가 요청 |
| 라클란 자일스 Lachlan Giles | Commons에 전용 사진 없음 | 본인 SNS/BJJ Fanatics 강좌 썸네일 라이선스 문의 |
| 아담 와르진스키 Adam Wardzinski | Commons에 전용 사진 없음 | IBJJF 공식 선수 프로필 사진 사용 허가 문의 |
| 라이언 홀 Ryan Hall | Wikidata에 "Ryan Hall at UFC 232.jpg" 언급되나 Getty(Sean M. Haffey) 크레딧 확인 — 사실상 Wikipedia 저작권 보호(비상업 fair-use) 이미지로 추정, 상업 앱 사용 불가 | UFC/Getty 라이선스 구매 필요 |
| 안드레 갈바오 Andre Galvao | Commons에 전용 사진 없음 | Atos Jiu-Jitsu 팀 공식 자료 사용 허가 요청 |

## 제안

1. 우선 4명(고든 라이언, 마이키 무수메시, 로저 그레이시, 마르셀로 가르시아)은 Commons 라이선스로 바로 진행 가능 — 파일 페이지에서 저작자 표시 문구만 확정하면 이번 주 내 적용 가능.
2. 나머지 7명은 유료 앱 출시 전까지 시간이 걸릴 수 있으니, 우선순위를 정해서 (a) 본인/소속 팀에 직접 DM/이메일로 사용 허가 요청 (무료로 얻을 확률 높음 — 홍보 효과 때문에 대부분 응해줌), (b) 안 되면 Getty 등 유료 라이선스 구매 중 선택.
3. 라이선스 확보 전까지는 기존 실루엣 아바타(`AthleteAvatar.tsx`) 유지 — 즉시 사용 가능 4명만 먼저 교체하고 나머지는 아바타 유지하는 점진적 적용도 가능.

법적 책임 관련: 저작권 있는 선수 사진을 라이선스 없이 유료 상업 앱에 넣는 것은 실제 법적 리스크가 있다. "라이선스는 나중에"라고 미루더라도, 코드/앱에 실제 이미지 파일을 커밋하는 시점부터는 리스크가 발생하므로 위 표의 라이선스 상태를 반드시 확인 후 적용 권장.
