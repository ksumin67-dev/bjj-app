/**
 * 콤보 라이브러리 — 실전에서 쓰이는 기술 연계 모음 (자동 생성: docs/combo_library/build_ts.py)
 * 원본/근거: docs/combo_library/research/*.json , 규칙: docs/combo_library/PROTOCOL.md
 * 등급 '검증됨'/'참고'만 포함. '초안'은 앱에 노출하지 않는다.
 */
export type ComboStep = {
  /** 기술도감 짧은 ID (예: CG-10) */
  tech: string;
  role: "main" | "if_blocked" | "then" | "transition";
  trigger?: string;
  note?: string;
};

export type ComboSource = { name: string; url: string };

export type Combo = {
  id: string;
  /** 포지션 코드 (예: CG) */
  position: string;
  name: string;
  start: string;
  end: string;
  grade: "검증됨" | "참고";
  steps: ComboStep[];
  /** 근거 출처 (본문 확인된 것 우선, 최대 3개) */
  sources: ComboSource[];
};

export const COMBO_LIBRARY: Combo[] = [
  {
    "id": "bc-seatbelt-rnc-armbar",
    "position": "BC",
    "name": "백 컨트롤 · RNC · 손 방어 시 암바 연계",
    "start": "훅과 시트벨트 그립으로 백 컨트롤을 잡았을 때",
    "end": "서브미션(RNC 또는 암바)",
    "grade": "참고",
    "steps": [
      {
        "tech": "BC-20",
        "role": "main",
        "note": "훅을 깊게 걸고 가슴을 상대 등에 붙여 컨트롤을 먼저 안정시킨다"
      },
      {
        "tech": "BC-01",
        "role": "then",
        "note": "컨트롤이 안정되면 RNC를 시도한다"
      },
      {
        "tech": "BC-03",
        "role": "if_blocked",
        "trigger": "상대가 양손을 목으로 올려 초크를 막아 팔꿈치가 벌어지면",
        "note": "벌어진 팔을 잡아 몸을 돌려 암바로 전환한다"
      }
    ],
    "sources": [
      {
        "name": "Gracie Barra - Transitioning From Back Control to Armlock (Jackson Alves 클래스)",
        "url": "https://graciebarra.com/gb-learning/armlock"
      }
    ]
  },
  {
    "id": "bc-rnc-short-choke",
    "position": "BC",
    "name": "RNC 방어 시 숏 초크 전환",
    "start": "백 컨트롤에서 RNC를 시도했는데 상대가 손과 턱으로 막을 때",
    "end": "서브미션(숏 초크)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "BC-20",
        "role": "main",
        "note": "백 포지션을 잃지 않고 유지한 채로 그립을 조정한다"
      },
      {
        "tech": "BC-01",
        "role": "then",
        "note": "RNC를 먼저 시도한다"
      },
      {
        "tech": "BC-06",
        "role": "if_blocked",
        "trigger": "상대가 양손으로 초크 팔을 막아 RNC가 들어가지 않으면",
        "note": "깍지 대신 손바닥 맞잡는 그립으로 바꿔 아래팔로 목 앞쪽을 압박하고, 팔꿈치를 상대 어깨 뒤로 눌러 마무리한다"
      }
    ],
    "sources": [
      {
        "name": "Evolve MMA - What Is The Short Choke In BJJ?",
        "url": "https://evolve-mma.com/blog/what-is-the-short-choke-in-bjj/"
      },
      {
        "name": "Digitsu - Short Choke",
        "url": "https://app.digitsu.com/t/short-choke"
      }
    ]
  },
  {
    "id": "bc-bodytriangle-rnc-armbar",
    "position": "BC",
    "name": "바디 트라이앵글 · RNC · 암바 연계",
    "start": "바디 트라이앵글로 백을 단단히 묶고 상대 팔 하나를 잡았을 때",
    "end": "서브미션(RNC 또는 암바)",
    "grade": "참고",
    "steps": [
      {
        "tech": "BC-21",
        "role": "main",
        "note": "다리를 엮어 상대 몸통을 고정하고 상체 컨트롤을 유지한다"
      },
      {
        "tech": "BC-01",
        "role": "then",
        "note": "고정된 상태에서 RNC를 시도한다"
      },
      {
        "tech": "BC-03",
        "role": "if_blocked",
        "trigger": "상대가 손으로 초크 팔을 잡고 턱을 숙여 막으면",
        "note": "방어하는 팔을 끌어내 암바로 전환한다"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Body Triangle",
        "url": "https://digitsu.com/t/body-triangle"
      },
      {
        "name": "Bullshido 포럼 스레드",
        "url": "https://forums.bullshido.net/t/problems-making-effective-use-of-rear-mount-w-hooks-or-body-triangle/47518"
      }
    ]
  },
  {
    "id": "bc-straitjacket-bowarrow-armbar",
    "position": "BC",
    "name": "스트레이트 자켓 컨트롤 · 보우 앤 애로우 연계",
    "start": "도복 상태에서 백 컨트롤을 잡고 상대 양팔을 묶어 목 방어를 막았을 때",
    "end": "서브미션(보우 앤 애로우 또는 암바)",
    "grade": "참고",
    "steps": [
      {
        "tech": "BC-22",
        "role": "main",
        "note": "양팔을 각각 잡아 상대가 목을 방어하지 못하게 한다"
      },
      {
        "tech": "BC-02",
        "role": "then",
        "note": "깃을 잡고 반대 손으로 같은 쪽 바지를 잡은 뒤 옆으로 몸을 돌려 보우 앤 애로우로 마무리한다"
      },
      {
        "tech": "BC-03",
        "role": "if_blocked",
        "trigger": "상대가 초크에서 머리를 빼내면",
        "note": "다리를 상대 어깨 위로 넘기며 암바(또는 손목기)로 전환한다"
      }
    ],
    "sources": [
      {
        "name": "JitsuIQ - Straight Jacket",
        "url": "https://jitsuiq.com/grips/material-grips/straight-jacket.html"
      },
      {
        "name": "Digitsu - Seat-Belt Control | Bow And Arrow | Wrist Lock (Kristina Barlaan)",
        "url": "https://digitsu.com/v/seat-belt-control-bow-and-arrow-wrist-lock-kristina-barlaan"
      }
    ]
  },
  {
    "id": "bc-kimura-control-armbar",
    "position": "BC",
    "name": "백 기무라 컨트롤 · 암바 연계",
    "start": "백 컨트롤에서 상대가 목을 철저히 보호하며 팔을 모으고 있을 때",
    "end": "서브미션(기무라 또는 암바)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "BC-04",
        "role": "main",
        "note": "기무라 그립으로 팔을 잡아 머리를 들어올리고 상대의 탈출 회전을 막는다"
      },
      {
        "tech": "BC-03",
        "role": "then",
        "note": "기무라 컨트롤로 팔을 묶은 상태에서 다리로 상대 윗팔을 엮어 암바로 이어간다"
      }
    ],
    "sources": [
      {
        "name": "Evolve University - 4 Attack Options From The Back Mount",
        "url": "https://evolve-university.com/blog/4-attack-options-from-the-back-mount/"
      },
      {
        "name": "Grapplearts - Triangle chokes from the back: a users guide",
        "url": "https://www.grapplearts.com/triangle-chokes-from-the-back-a-users-guide/"
      }
    ]
  },
  {
    "id": "bc-rnc-bowarrow-gi",
    "position": "BC",
    "name": "RNC 방어 시 깃 보우 앤 애로우 전환 (도복)",
    "start": "도복 상태 백 컨트롤에서 RNC를 상대가 손으로 막을 때",
    "end": "서브미션(보우 앤 애로우)",
    "grade": "참고",
    "steps": [
      {
        "tech": "BC-20",
        "role": "main",
        "note": "시트벨트 그립으로 백을 유지한다"
      },
      {
        "tech": "BC-01",
        "role": "then",
        "note": "RNC를 시도한다"
      },
      {
        "tech": "BC-02",
        "role": "if_blocked",
        "trigger": "상대가 손으로 목을 단단히 보호해 RNC를 잠글 수 없으면",
        "note": "깃을 잡고 바지 그립을 더해 옆으로 몸을 돌려 보우 앤 애로우로 전환한다"
      }
    ],
    "sources": [
      {
        "name": "Digitsu (Kristina Barlaan)",
        "url": "https://digitsu.com/v/seat-belt-control-bow-and-arrow-kristina-barlaan"
      },
      {
        "name": "BJJ Ee - Secrets to a more effective bow and arrow choke",
        "url": "https://www.bjjee.com/articles/secrets-to-a-more-effective-bow-and-arrow-choke-in-bjj/"
      }
    ]
  },
  {
    "id": "bc-kimura-triangle",
    "position": "BC",
    "name": "백 기무라 컨트롤 · 백 트라이앵글 연계",
    "start": "백 컨트롤에서 상대가 목을 철저히 보호하며 팔을 모으고 있을 때",
    "end": "백 트라이앵글(초크 또는 암락)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "BC-04",
        "role": "main",
        "note": "기무라 그립으로 팔을 잡아 머리를 들어올리고 상대의 탈출 회전을 막는다"
      },
      {
        "tech": "BC-11",
        "role": "then",
        "note": "한쪽 팔을 가둔 채 다리를 어깨 위로 넘기고 반대 다리를 걸어 백 트라이앵글을 만든다"
      }
    ],
    "sources": [
      {
        "name": "Evolve University",
        "url": "https://evolve-university.com/blog/4-attack-options-from-the-back-mount/"
      },
      {
        "name": "Grapplearts (Kesting 삼각 가이드)",
        "url": "https://www.grapplearts.com/triangle-chokes-from-the-back-a-users-guide/"
      },
      {
        "name": "Digitsu (백 트라이앵글)",
        "url": "https://digitsu.com/t/rear-triangle"
      }
    ]
  },
  {
    "id": "bc-rnc-backtriangle",
    "position": "BC",
    "name": "RNC 방어 시 백 트라이앵글 전환",
    "start": "백 컨트롤에서 RNC를 시도했는데 상대 방어가 강하고 한쪽 손이 다리 사이에 있을 때",
    "end": "백 트라이앵글(초크 또는 암락)",
    "grade": "참고",
    "steps": [
      {
        "tech": "BC-20",
        "role": "main",
        "note": "백을 안정시키고 상대 한 팔을 중심선 너머로 보낸다"
      },
      {
        "tech": "BC-01",
        "role": "then",
        "note": "RNC를 시도한다"
      },
      {
        "tech": "BC-11",
        "role": "if_blocked",
        "trigger": "상대 방어가 너무 강해 RNC를 잠글 수 없으면",
        "note": "가둔 팔 쪽 어깨 위로 다리를 넘기고 반대 다리를 걸어 백 트라이앵글로 전환"
      }
    ],
    "sources": [
      {
        "name": "Evolve MMA",
        "url": "https://evolve-mma.com/blog/3-types-of-triangle-chokes-in-bjj/"
      },
      {
        "name": "Digitsu (백 트라이앵글)",
        "url": "https://digitsu.com/t/rear-triangle"
      }
    ]
  },
  {
    "id": "bc-backtriangle-armbar",
    "position": "BC",
    "name": "백 트라이앵글 · 암락 마무리",
    "start": "백 컨트롤에서 한 팔을 가둔 채 백 트라이앵글을 잠갔을 때",
    "end": "암바 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "BC-11",
        "role": "main",
        "note": "가둔 팔과 목을 삼각으로 묶고 무릎을 모아 손목을 컨트롤한다"
      },
      {
        "tech": "BC-03",
        "role": "then",
        "note": "초크가 들어가지 않거나 다른 마무리를 원하면 삼각을 유지한 채 가둔 팔을 공략해 암바로 이어간다"
      }
    ],
    "sources": [
      {
        "name": "Digitsu (백 트라이앵글)",
        "url": "https://digitsu.com/t/rear-triangle"
      },
      {
        "name": "Evolve MMA",
        "url": "https://evolve-mma.com/blog/3-types-of-triangle-chokes-in-bjj/"
      },
      {
        "name": "Grapplearts (Kesting 삼각 가이드)",
        "url": "https://www.grapplearts.com/triangle-chokes-from-the-back-a-users-guide/"
      }
    ]
  },
  {
    "id": "bf-sweep-triangle",
    "position": "BF",
    "name": "버터플라이 스윕 · 삼각 셋업 연계 (손을 짚을 때)",
    "start": "버터플라이 가드에서 상대를 앞으로 끌어당겨 스윕을 걸었을 때",
    "end": "삼각 초크 셋업(서브미션 시도) 또는 스윕 성공 시 탑 포지션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "BF-01",
        "role": "main",
        "note": "언더훅과 상체 그립으로 상대를 앞으로 당기고 후크로 들어 올려 기본 스윕 시도"
      },
      {
        "tech": "BF-11",
        "role": "if_blocked",
        "trigger": "상대가 손을 바닥에 짚어 스윕을 막으면",
        "note": "짚은 팔을 잡아 팔을 고립하고 삼각 셋업으로 전환 (암바·오모플라타도 같은 반응에서 가능)"
      }
    ],
    "sources": [
      {
        "name": "Jitsu IQ - Butterfly Sweep",
        "url": "https://jitsuiq.com/sweeps/butterfly-sweep.html"
      },
      {
        "name": "Grapplearts (Stephan Kesting) - butterfly to X guard",
        "url": "https://www.grapplearts.com/how-to-take-the-back-from-x-guard/"
      },
      {
        "name": "Gracie Barra 블로그 (GB Technique: Butterfly Guard Setups)",
        "url": "https://graciebarra.com/gb-news/gb-technique-butterfly-guard-setups"
      }
    ]
  },
  {
    "id": "bf-sweep-guillotine",
    "position": "BF",
    "name": "버터플라이 스윕 · 길로틴 트랩 연계 (상대가 팔로 버티고 엉덩이를 낮출 때)",
    "start": "버터플라이 가드에서 컬러 타이와 삼두 컨트롤로 기본 스윕을 시도할 때",
    "end": "길로틴 초크 서브미션 또는 스윕 성공 시 하프 가드 탑",
    "grade": "참고",
    "steps": [
      {
        "tech": "BF-01",
        "role": "main",
        "note": "한 손은 목 뒤(칼라 타이), 다른 손은 삼두를 잡고 옆으로 쓰러지며 후크로 스윕"
      },
      {
        "tech": "BF-10",
        "role": "if_blocked",
        "trigger": "상대가 팔로 바닥을 짚고 엉덩이를 내려 스윕을 막으면",
        "note": "목을 아래로 눌러 올라타듯 길로틴 그립을 만들고 후크를 하프 가드 쪽으로 바꿔 마무리"
      }
    ],
    "sources": [
      {
        "name": "Evolve MMA (BJJEE 게재) - Marcelo Garcia 버터플라이 스윕과 길로틴 소개",
        "url": "https://www.bjjee.com/?p=81912"
      }
    ]
  },
  {
    "id": "bf-shoulder-crunch",
    "position": "BF",
    "name": "버터플라이 스윕 · 숄더 크런치 수미가에시 (손을 짚을 때)",
    "start": "버터플라이 가드에서 상대를 앞으로 끌어 스윕 위협을 줄 때",
    "end": "마운트 또는 탑 패싱 포지션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "BF-25",
        "role": "main",
        "note": "가짜 암드래그나 같은 쪽으로 끌기로 상대 팔을 머리 위로 뻗게 만든다"
      },
      {
        "tech": "BF-02",
        "role": "if_blocked",
        "trigger": "상대가 넘어지지 않으려 손을 바닥에 짚어 팔이 머리 위로 뻗어지면",
        "note": "뻗은 팔 안으로 팔을 걸어 팔꿈치를 높게 유지하며 머리를 상대 머리 옆에 두고 후크를 차올려 반대편으로 스윕"
      }
    ],
    "sources": [
      {
        "name": "Evolve MMA (BJJEE 게재) - Gordon Ryan 숄더 크런치",
        "url": "https://www.bjjee.com/?p=81912"
      },
      {
        "name": "80/20 BJJ Coach 뉴스레터 (Enrique Iturriaga)",
        "url": "https://bjjcoach.substack.com/p/week-3-shoulder-crunch-a-la-gordon"
      },
      {
        "name": "JiuJitsu.com - Butterfly Guard Sweeps That Work in Live Rolls",
        "url": "https://jiujitsu.com/blogs/jiujitsu/butterfly-guard-sweeps-live-rolls"
      }
    ]
  },
  {
    "id": "bf-sweep-xguard-standup",
    "position": "BF",
    "name": "버터플라이 스윕 · X가드 전환 · 스탠드업 스윕",
    "start": "버터플라이 가드에서 한 손은 칼라, 다른 손은 무릎 바지를 잡고 스윕을 시도할 때",
    "end": "탑 포지션 (스윕 성공) — X가드 이후 단계는 XG 포지션 콤보 참고",
    "grade": "참고",
    "steps": [
      {
        "tech": "BF-01",
        "role": "main",
        "note": "상대를 앞으로 당기며 기본 스윕 시도"
      },
      {
        "tech": "BF-20",
        "role": "if_blocked",
        "trigger": "상대가 발을 뒤로 딛거나 밀어내며 스윕을 막을 때",
        "note": "앉듯이 후크를 상대 다리 안쪽에 넣고 상대 무게중심 밑으로 파고들어 한쪽 다리를 상대 다리 사이로 뻗어 X가드를 만듦"
      },
      {
        "tech": "XG-01",
        "role": "then",
        "note": "X가드에서 스탠드업 스윕으로 일어나며 상대를 쓰러뜨려 탑 포지션 획득"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (Stephan Kesting) - Butterfly Guard to X Guard Standup Sweep",
        "url": "https://www.grapplearts.com/butterfly-guard-to-x-guard-standup-sweep/"
      },
      {
        "name": "Grapplearts (Stephan Kesting) - It's almost impossible to use the Butterfly Guard without X Guard",
        "url": "https://www.grapplearts.com/how-to-take-the-back-from-x-guard/"
      }
    ]
  },
  {
    "id": "bf-sweep-slx-entry",
    "position": "BF",
    "name": "버터플라이 스윕 · 싱글 레그 X 전환 (상대가 뒤로 기댈 때)",
    "start": "버터플라이 가드에서 스윕을 시도할 때",
    "end": "싱글 레그 X가드 (이후 SLX 포지션 콤보 참고)",
    "grade": "참고",
    "steps": [
      {
        "tech": "BF-01",
        "role": "main",
        "note": "상대를 당겨 기본 스윕 시도"
      },
      {
        "tech": "BF-21",
        "role": "if_blocked",
        "trigger": "상대가 뒤로 기대어(상체를 빼) 스윕을 피하면",
        "note": "다리를 잡은 채 한쪽 다리를 상대 다리 사이로 넣어 엉덩이를 아래로 파고들며 싱글 레그 X를 만듦"
      }
    ],
    "sources": [
      {
        "name": "Jitsu IQ - Butterfly Sweep",
        "url": "https://jitsuiq.com/sweeps/butterfly-sweep.html"
      },
      {
        "name": "Evolve MMA (BJJEE 게재) - Attacks and Transitions from Butterfly Guard",
        "url": "https://www.bjjee.com/?p=81912"
      },
      {
        "name": "Grapplearts (Stephan Kesting) - How to Leglock Someone in Butterfly Guard",
        "url": "https://www.grapplearts.com/how-to-leglock-someone-in-butterfly-guard/"
      }
    ]
  },
  {
    "id": "bf-armdrag-elevator-wrestleup",
    "position": "BF",
    "name": "암드래그 · 엘리베이터 스윕 · 웨슬업",
    "start": "버터플라이 가드에서 상대의 팔을 잡을 수 있을 때 (노기 수업 등)",
    "end": "탑 포지션 또는 스탠딩 레슬링 우위",
    "grade": "참고",
    "steps": [
      {
        "tech": "BF-25",
        "role": "main",
        "note": "손목을 잡아 반대편으로 끌어 상대 어깨와 체중을 틀어 놓는다"
      },
      {
        "tech": "BF-04",
        "role": "if_blocked",
        "trigger": "상대가 다시 정면으로 돌아오며 체중을 앞으로 실을 때",
        "note": "엉덩이를 당겨 들어가며 끌어당긴 팔 쪽으로 엘리베이터 스윕"
      },
      {
        "tech": "BF-26",
        "role": "if_blocked",
        "trigger": "상대가 팔을 빼고 손을 짚어 버틸 때",
        "note": "잡은 팔을 놓지 않고 후크를 풀며 일어나 웨슬업으로 이어간다"
      }
    ],
    "sources": [
      {
        "name": "David Avellan - Robert Drysdale 버터플라이 암드래그 시리즈",
        "url": "https://davidavellan.com/spy-cam-butterfly-arm-drag/"
      },
      {
        "name": "JiuJitsu.com - Butterfly Guard Sweeps That Work in Live Rolls",
        "url": "https://jiujitsu.com/blogs/jiujitsu/butterfly-guard-sweeps-live-rolls"
      },
      {
        "name": "Jitsu IQ - Butterfly Sweep",
        "url": "https://jitsuiq.com/sweeps/butterfly-sweep.html"
      }
    ]
  },
  {
    "id": "bf-armdrag-backtake",
    "position": "BF",
    "name": "암드래그 · 백 테이크 (어깨가 노출될 때)",
    "start": "버터플라이 가드에서 상대의 손목을 잡고 끌어 어깨가 틀어질 때",
    "end": "백 또는 탑 터틀",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "BF-25",
        "role": "main",
        "note": "손목 그립으로 팔을 끌어 상대 어깨를 노출시킨다"
      },
      {
        "tech": "BF-22",
        "role": "then",
        "note": "노출된 어깨 쪽으로 돌아 나와 백을 잡는다"
      }
    ],
    "sources": [
      {
        "name": "David Avellan - Robert Drysdale 버터플라이 암드래그 시리즈",
        "url": "https://davidavellan.com/spy-cam-butterfly-arm-drag/"
      },
      {
        "name": "JiuJitsu.com - Butterfly Guard Sweeps That Work in Live Rolls",
        "url": "https://jiujitsu.com/blogs/jiujitsu/butterfly-guard-sweeps-live-rolls"
      },
      {
        "name": "Jitsu IQ - Butterfly Sweep",
        "url": "https://jitsuiq.com/sweeps/butterfly-sweep.html"
      }
    ]
  },
  {
    "id": "cg-crosschoke-armbar",
    "position": "CG",
    "name": "크로스 초크 · 암바 연계",
    "start": "클로즈드 가드에서 상대 자세를 무너뜨리고 깃 깊이 그립을 잡았을 때",
    "end": "암바 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "CG-10",
        "role": "main",
        "note": "깊은 크로스 깃 그립으로 초크를 위협해 반응을 유도"
      },
      {
        "tech": "CG-11",
        "role": "if_blocked",
        "trigger": "상대가 초크를 피해 몸을 옆으로 틀거나 팔로 내 이두를 밀어 막으면",
        "note": "드러난 가까운 쪽 팔을 잡아 암바로 전환"
      }
    ],
    "sources": [
      {
        "name": "BJJEE (Renzo Gracie 클로즈드 가드 크로스 초크-암바 트랩 소개)",
        "url": "https://www.bjjee.com/articles/renzo-gracies-cross-choke-armbar-trap-closed-guard/"
      },
      {
        "name": "BJJEE (크로스 깃 초크에서 암바로)",
        "url": "https://www.bjjee.com/?p=82920"
      }
    ]
  },
  {
    "id": "cg-hipbump-kimura-guillotine",
    "position": "CG",
    "name": "힙범프 · 기무라 · 길로틴 연계",
    "start": "클로즈드 가드에서 상대가 상체를 세우고 있을 때",
    "end": "서브미션 또는 스윕 후 탑 포지션",
    "grade": "참고",
    "steps": [
      {
        "tech": "CG-01",
        "role": "main",
        "note": "손목을 잡고 힙범프 스윕 시도"
      },
      {
        "tech": "CG-13",
        "role": "if_blocked",
        "trigger": "상대가 팔을 빼거나 손을 짚어 버티면",
        "note": "고립된 팔로 기무라"
      },
      {
        "tech": "CG-12",
        "role": "if_blocked",
        "trigger": "상대가 껴안으며 앞으로 밀고 들어오면",
        "note": "드러난 목으로 길로틴"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (힙범프 스윕 설명)",
        "url": "https://www.grapplearts.com/hip-bump-sweep-from-closed-guard"
      },
      {
        "name": "JitsuIQ (Hip Bump Sweep)",
        "url": "https://jitsuiq.com/sweeps/hip-bump-sweep.html"
      }
    ]
  },
  {
    "id": "cg-armbar-triangle-omoplata",
    "position": "CG",
    "name": "암바 · 삼각 · 오모플라타 연계",
    "start": "클로즈드 가드에서 상대 팔을 가두고 암바를 시도할 때",
    "end": "삼각 또는 오모플라타 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "CG-11",
        "role": "main",
        "note": "자세를 무너뜨리고 한쪽 팔을 잡아 암바 시도"
      },
      {
        "tech": "CG-19",
        "role": "if_blocked",
        "trigger": "상대가 팔을 빼며 반대쪽 팔이 굽어 팔꿈치가 상대 배 근처에 있으면",
        "note": "삼두를 잡고 다리를 목에 걸어 클로즈드 가드 삼각으로 전환"
      },
      {
        "tech": "CG-22",
        "role": "if_blocked",
        "trigger": "상대가 팔을 빼며 반대쪽 팔이 펴진 채 내 가슴을 밀면",
        "note": "빠진 팔 쪽으로 몸을 감아 클로즈드 가드 오모플라타"
      }
    ],
    "sources": [
      {
        "name": "jiujitsu.com (Closed Guard Armbar to Triangle)",
        "url": "https://jiujitsu.com/blogs/techniques/closed-guard-armbar-to-triangle"
      },
      {
        "name": "jiujitsu.com (Josh Griffiths, Armbar to Omoplata)",
        "url": "https://jiujitsu.com/blogs/techniques/closed-guard-armbar-to-omoplata"
      },
      {
        "name": "Evolve University",
        "url": "https://evolve-university.com/blog/basic-bjj-combinations-triangle-choke-omoplata-and-armbar/"
      }
    ]
  },
  {
    "id": "cg-overhook-triangle-omoplata",
    "position": "CG",
    "name": "오버훅 가드 · 삼각 · 오모플라타 연계",
    "start": "클로즈드 가드에서 한쪽 팔에 깊은 오버훅을 건 상태",
    "end": "삼각 또는 오모플라타 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "CG-14",
        "role": "main",
        "note": "오버훅으로 어깨 라인을 컨트롤하고 엉덩이를 오버훅 쪽으로 각도 만들기"
      },
      {
        "tech": "CG-16",
        "role": "then",
        "note": "팔을 몸에서 분리해 다리를 겨드랑이 아래로 넣어 삼각"
      },
      {
        "tech": "CG-17",
        "role": "if_blocked",
        "trigger": "상대가 삼각을 막으려 팔을 빼거나 자세를 세우면",
        "note": "같은 진입에서 오모플라타로 전환"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (모든 삼각 진입은 오모플라타 진입이기도 함)",
        "url": "https://www.grapplearts.com/every-triangle-choke-setup-is-also-an-omoplata-setup/"
      },
      {
        "name": "Digitsu (Overhook Guard)",
        "url": "https://digitsu.com/t/overhook-guard"
      },
      {
        "name": "Elite Sports (오버훅 공격 5가지)",
        "url": "https://www.elitesports.com/blogs/news/top-5-bjj-overhook-attacks-from-the-bjj-closed-guard"
      }
    ]
  },
  {
    "id": "cg-crosschoke-scissor",
    "position": "CG",
    "name": "크로스 초크 · 시저 스윕 연계",
    "start": "클로즈드 가드에서 크로스 깃 그립과 소매 그립을 잡았을 때",
    "end": "탑 포지션(마운트)",
    "grade": "참고",
    "steps": [
      {
        "tech": "CG-10",
        "role": "main",
        "note": "깃 그립으로 초크를 위협해 상대가 자세를 세우게 유도"
      },
      {
        "tech": "CG-02",
        "role": "if_blocked",
        "trigger": "상대가 초크를 막으려 몸을 세우거나 손으로 짚어 버티면",
        "note": "같은 그립으로 시저 스윕"
      }
    ],
    "sources": [
      {
        "name": "Evolve University (Cross Choke And Scissor Sweep)",
        "url": "https://evolve-university.com/blog/basic-bjj-combinations-cross-choke-and-scissor-sweep/"
      },
      {
        "name": "BJJ Canvas (시저 스윕 공격 시퀀스)",
        "url": "https://bjjcanvas.com/?p=6831"
      }
    ]
  },
  {
    "id": "cg-pendulum-armbar",
    "position": "CG",
    "name": "펜듈럼 스윕 · 암바 연계",
    "start": "클로즈드 가드에서 상대가 두 손으로 내 몸통을 짚고 앞으로 기울었을 때",
    "end": "서브미션 또는 마운트",
    "grade": "참고",
    "steps": [
      {
        "tech": "CG-03",
        "role": "main",
        "note": "소매와 반대 바지를 잡고 다리를 크게 휘둘러 스윕"
      },
      {
        "tech": "CG-11",
        "role": "if_blocked",
        "trigger": "상대가 자유로운 손을 짚어 버티면",
        "note": "고립된 짚은 팔로 암바"
      }
    ],
    "sources": [
      {
        "name": "Evolve MMA (Pendulum Sweep 활용)",
        "url": "https://evolve-mma.com/blog/heres-how-to-utilize-the-pendulum-sweep-in-bjj/"
      }
    ]
  },
  {
    "id": "cg-triangle-omoplata",
    "position": "CG",
    "name": "삼각 · 오모플라타 연계 (삼각이 막힐 때)",
    "start": "클로즈드 가드에서 한 팔을 몸에서 떼어 삼각을 시도할 때",
    "end": "오모플라타 서브미션(또는 스윕)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "CG-19",
        "role": "main",
        "note": "한 팔을 몸에서 분리하고 다리를 겨드랑이 아래로 넣어 삼각 시도"
      },
      {
        "tech": "CG-22",
        "role": "if_blocked",
        "trigger": "상대가 팔로 내 허벅지를 감싸 삼각이 조여지지 않으면",
        "note": "상대 팔꿈치를 잡고 다리를 풀어 180도 돌며 겨드랑이로 다리를 넘겨 오모플라타로 마무리"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (Stephan Kesting)",
        "url": "https://www.grapplearts.com/technique-1-triangle-choke-to-omoplata/"
      },
      {
        "name": "Evolve University",
        "url": "https://evolve-university.com/blog/basic-bjj-combinations-triangle-choke-omoplata-and-armbar/"
      },
      {
        "name": "Borderline BJJ (수련 일지)",
        "url": "https://borderlinebjj.bearblog.dev/practice-log-arm-bartriangleomoplata-sequence"
      }
    ]
  },
  {
    "id": "cg-hipbump-triangle",
    "position": "CG",
    "name": "힙범프 · 삼각 연계",
    "start": "클로즈드 가드에서 상대가 상체를 세우고 손을 짚고 있을 때",
    "end": "삼각 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "CG-01",
        "role": "main",
        "note": "손목을 잡고 힙범프로 상대 자세를 무너뜨린다"
      },
      {
        "tech": "CG-19",
        "role": "if_blocked",
        "trigger": "스윕이 끝까지 넘어가지 않고 상대 팔이 몸에서 떨어져 있으면",
        "note": "한쪽 팔과 목을 다리로 가두어 삼각으로 이어간다"
      }
    ],
    "sources": [
      {
        "name": "BJJEE (Craig Jones 시연)",
        "url": "https://www.bjjee.com/articles/craig-jones-demonstrates-a-more-effective-hip-bump-sweep-variation/"
      },
      {
        "name": "Atos BJJ OnDemand (Andre Galvao)",
        "url": "https://live.atosbjjondemand.com/closed-guard/videos/hip-bump-sweep-to-triangle-back-take-submission-options"
      },
      {
        "name": "Grapplearts (Jon Thomas 영상 소개)",
        "url": "https://www.grapplearts.com/hip-bump-sweep-from-closed-guard"
      }
    ]
  },
  {
    "id": "cg-kimura-triangle",
    "position": "CG",
    "name": "기무라 · 삼각 연계 (기무라가 막힐 때)",
    "start": "클로즈드 가드에서 상대 손목을 잡고 기무라 그립을 만들었을 때",
    "end": "삼각 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "CG-13",
        "role": "main",
        "note": "손목을 잡고 일어나 앉아 기무라 그립을 만든다"
      },
      {
        "tech": "CG-19",
        "role": "if_blocked",
        "trigger": "상대가 팔을 안쪽으로 가져와 기무라를 막으면",
        "note": "힙 이스케이프로 공간을 만들고 다리를 어깨 바깥으로 넘겨 삼각으로 전환"
      }
    ],
    "sources": [
      {
        "name": "Digitsu (Dan Covel 영상 설명)",
        "url": "https://digitsu.com/v/double-attack-kimura-triangle-dan-covel"
      },
      {
        "name": "Digitsu (기술 페이지)",
        "url": "https://digitsu.com/t/kimura-from-guard"
      }
    ]
  },
  {
    "id": "dlr-omoplata",
    "position": "DLR",
    "name": "데라리바 훅 · 오모플라타",
    "start": "데라리바 가드에서 소매/칼라 그립과 훅이 세팅되고 상대가 앞으로 체중을 실을 때",
    "end": "오모플라타 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "DLR-23",
        "role": "main",
        "note": "소매 그립을 엉덩이 가까이 당겨 상체를 무너뜨리고, 발목을 굽힌 DLR 훅과 반대 발의 골반 프레임으로 거리를 유지"
      },
      {
        "tech": "DLR-10",
        "role": "then",
        "note": "반대 발로 밀며 훅을 조인 채 무릎을 안쪽으로 돌려 상대 팔을 열고, 정강이를 몸 위로 넘겨 오모플라타. 벨트/바지 그립으로 바꿔 앞구르기 탈출을 막는다"
      },
      {
        "tech": "DLR-11",
        "role": "if_blocked",
        "trigger": "상대가 오모플라타를 피해 앞구르기로 빠져나가려 하면",
        "note": "소매 그립을 놓지 않고 그대로 암바로 전환해 팔을 잡는다"
      }
    ],
    "sources": [
      {
        "name": "Vicente Junior (Digitsu 'De La Riva Guard' 코스)",
        "url": "https://digitsu.com/v/omoplata-vicente-junior"
      },
      {
        "name": "Gianni Grippo (Digitsu 'NeXT GeN De La Riva' 코스)",
        "url": "https://digitsu.com/v/dlr-to-omaplata-gianni-grippo"
      },
      {
        "name": "Jitsu IQ - De La Riva",
        "url": "https://jitsuiq.com/positions/guard/de-la-riva.html"
      }
    ]
  },
  {
    "id": "dlr-backstep-waiter",
    "position": "DLR",
    "name": "백스텝 패스를 웨이터 스윕으로 받아치기",
    "start": "데라리바 가드에서 상대가 훅을 빼며 백스텝(스텝백) 패스를 시도할 때",
    "end": "탑 포지션 또는 크랩 라이드 백 테이크",
    "grade": "참고",
    "steps": [
      {
        "tech": "DLR-23",
        "role": "main",
        "note": "타이트한 DLR 훅과 그립을 유지하며 상대의 백스텝 타이밍을 예측, 엉덩이는 매트에서 띄움"
      },
      {
        "tech": "DLR-03",
        "role": "if_blocked",
        "trigger": "상대가 백스텝으로 훅을 넘으려 하면",
        "note": "패스가 완성되기 전에 상대 다리를 언더훅하고 바지 그립으로 바꿔 다리를 안쪽으로 엮어 들어올려 웨이터 스윕. 유연성이 부족하면 한쪽 다리는 두고 무릎 뒤 발로 보조"
      },
      {
        "tech": "DLR-24",
        "role": "then",
        "note": "웨이터로 들어올렸을 때 상대가 베이스를 버티면 스윕을 고집하지 말고 크랩 라이드로 등 뒤를 공략"
      }
    ],
    "sources": [
      {
        "name": "Vicente Junior (Digitsu 'Advanced De La Riva' 코스)",
        "url": "https://digitsu.com/v/waiter-sweep-vicente-junior"
      },
      {
        "name": "Andre Galvao (Atos BJJ OnDemand)",
        "url": "https://live.atosbjjondemand.com/back-takes/videos/warm-ups-the-waiter-sweep-with-option-to-crab-ride-back-take-from-dlr-guard"
      },
      {
        "name": "Atos BJJ OnDemand",
        "url": "https://live.atosbjjondemand.com/de-la-riva-guard/videos/crab-ride-from-dlr-guard-to-back-take"
      }
    ]
  },
  {
    "id": "dlr-foot-push-xguard",
    "position": "DLR",
    "name": "발 눌러 내릴 때 · 언더훅 X가드 스윕",
    "start": "데라리바 가드에서 상대가 손으로 내 훅 발을 눌러 내리려 할 때",
    "end": "X가드 스윕 후 탑(사이드 컨트롤 연결). X가드는 타 포지션이므로 마지막 단계",
    "grade": "참고",
    "steps": [
      {
        "tech": "DLR-23",
        "role": "main",
        "note": "DLR 훅과 각도를 유지하며 상대의 푸시를 유도"
      },
      {
        "tech": "DLR-22",
        "role": "if_blocked",
        "trigger": "상대가 훅 발을 밀어 내리려 하면",
        "note": "그립을 상대 다리 둘레로 바꿔 발목을 가슴에 붙이고, 다리 뒤에 훅을 넣은 채 양발을 올려 X가드로 이동해 스윕"
      }
    ],
    "sources": [
      {
        "name": "Lucas Lepri (Digitsu 'No-Gi Master Series')",
        "url": "https://digitsu.com/v/underhook-de-la-riva-to-x-guard-sweep-lucas-lepri"
      },
      {
        "name": "Jitsu IQ - De La Riva",
        "url": "https://jitsuiq.com/positions/guard/de-la-riva.html"
      }
    ]
  },
  {
    "id": "dlr-low-single",
    "position": "DLR",
    "name": "훅이 뽑힐 때 · 낮은 싱글 레그 스윕",
    "start": "데라리바 가드에서 상대가 DLR 훅을 팝아웃하며 다리를 밀어 내려 패스하려 할 때",
    "end": "탑 포지션 (이후 언더훅 패스로 사이드 컨트롤)",
    "grade": "참고",
    "steps": [
      {
        "tech": "DLR-23",
        "role": "main",
        "note": "보조 훅(상대 무릎 뒤)을 유지하며 상대의 패스 동작을 기다림"
      },
      {
        "tech": "DLR-02",
        "role": "if_blocked",
        "trigger": "상대가 DLR 훅을 빼고 다리를 눌러 내리면",
        "note": "DLR 훅을 빠르게 풀고 상대를 밀어 공간을 만든 뒤 매트에 발과 손을 짚고, 상대 다리 뒤로 팔을 넣어 다리를 종아리와 허벅지 사이로 조여 들어올려 스윕"
      }
    ],
    "sources": [
      {
        "name": "Vicente Junior (Digitsu 'De La Riva Guard' 코스)",
        "url": "https://digitsu.com/v/low-single-vicente-junior"
      }
    ]
  },
  {
    "id": "dlr-sweep-berimbolo",
    "position": "DLR",
    "name": "스윕이 막히면 베림볼로로 백 테이크",
    "start": "데라리바 가드에서 상대가 서서 베이스를 유지하며 기본 스윕이 통하지 않을 때",
    "end": "백 포지션",
    "grade": "참고",
    "steps": [
      {
        "tech": "DLR-01",
        "role": "main",
        "note": "훅과 그립으로 상대 다리/중심을 흔드는 기본 DLR 스윕 시도"
      },
      {
        "tech": "DLR-20",
        "role": "if_blocked",
        "trigger": "스윕이 막히고 상대가 몸을 돌려 등이 노출되려 하면",
        "note": "상대 움직임을 이용해 그립을 바지로 바꾸고 인버트해 베림볼로로 등 뒤를 잡는다"
      }
    ],
    "sources": [
      {
        "name": "Vicente Junior (Digitsu 'Advanced De La Riva' 코스) - 발룬 스윕 베림볼로",
        "url": "https://digitsu.com/v/de-la-riva-x-balloon-sweep-berimbolo-vicente-junior"
      },
      {
        "name": "DLR 스윕 가이드 (검색 요약; 사이트 미특정)",
        "url": "https://digitsu.com/t/de-la-riva-sweep"
      },
      {
        "name": "Jason Scully 영상 소개 (Bullshido 포럼)",
        "url": "https://forums.bullshido.net/t/5-defenses-to-the-step-back-pass-against-dlr-jason-scully-video-for-you/50006"
      }
    ]
  },
  {
    "id": "dlr-overhead-armbar",
    "position": "DLR",
    "name": "오버헤드 스윕이 막히면 · 암바",
    "start": "데라리바 가드에서 소매 그립으로 상대를 당겨 오버헤드 스윕을 시도할 때",
    "end": "암바 서브미션 (또는 스윕 성공 시 탑 포지션)",
    "grade": "참고",
    "steps": [
      {
        "tech": "DLR-05",
        "role": "main",
        "note": "소매 그립과 DLR 훅으로 상대 머리가 내 골반선 위로 오도록 당겨 올린다. 푸시-풀로 균형을 깨고 다리를 뻗어 뒤로 넘기는 오버헤드 스윕을 시도"
      },
      {
        "tech": "DLR-11",
        "role": "if_blocked",
        "trigger": "상대가 양손으로 바닥을 짚어 스윕을 버티면",
        "note": "DLR 훅을 상대 다리 바깥쪽으로 바꾸고 엉덩이를 돌려 반대 다리를 머리 위로 넘겨 암바. 팔은 기무라 그립이나 일반 암바 그립으로 고정"
      }
    ],
    "sources": [
      {
        "name": "Digitsu(Vicente Junior)",
        "url": "https://digitsu.com/v/overhead-sweep-armbar-vicente-junior"
      },
      {
        "name": "Digitsu(Vicente Junior)",
        "url": "https://digitsu.com/v/overhead-sweep-vicente-junior"
      },
      {
        "name": "Digitsu(Danny Stolfi)",
        "url": "https://digitsu.com/v/overhead-sweep-de-la-riva-danny-stolfi"
      }
    ]
  },
  {
    "id": "dlr-to-slx",
    "position": "DLR",
    "name": "데라리바에서 싱글 레그 X로 전환",
    "start": "데라리바 훅과 소매/발목 그립으로 상대와 거리를 관리하고 있을 때",
    "end": "싱글 레그 X 포지션 (이후 SLX 콤보 참고)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "DLR-23",
        "role": "main",
        "note": "플렉스한 DLR 훅과 반대 발 골반 프레임으로 거리를 유지하며 소매 또는 발목을 컨트롤. 상대 체중을 뒤쪽 다리로 실리게 유도"
      },
      {
        "tech": "DLR-25",
        "role": "transition",
        "note": "상대가 DLR 훅을 넘어 밟거나 다리가 고립되면 정강이를 상대 정강이에 붙이고 뒤로 기대며 들어올려 싱글 레그 X로 이동. 엉덩이는 높게, 무릎은 모아 유지"
      }
    ],
    "sources": [
      {
        "name": "Digitsu(Gianni Grippo)",
        "url": "https://digitsu.com/v/dlr-to-single-leg-x-guard-sweep-gianni-grippo"
      },
      {
        "name": "Digitsu(Adam Benayoun)",
        "url": "https://digitsu.com/v/entries-de-la-riva-adam-benayoun"
      }
    ]
  },
  {
    "id": "ff-heelhook-stall-sweep",
    "position": "FF",
    "name": "50/50 힐훅 정체 시 엘리베이트 스윕",
    "start": "50/50에서 힐 컨트롤을 잡았으나 상대가 힐을 숨기거나 버텨 공격이 정체될 때",
    "end": "탑 포지션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "FF-20",
        "role": "main",
        "note": "무릎을 모아 상대 다리를 가두고 발 컨트롤과 힙 높이를 확보"
      },
      {
        "tech": "FF-12",
        "role": "then",
        "note": "힐훅 그립과 무릎 라인을 유지하며 마무리 시도"
      },
      {
        "tech": "FF-01",
        "role": "if_blocked",
        "trigger": "힐훅이 막혀 정체되면",
        "note": "엔탱글먼트를 이용해 힙으로 상대 다리를 들어 올리며 앉아서 스윕"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - 50-50 Guard (기술 설명)",
        "url": "https://digitsu.com/t/50-50-guard"
      },
      {
        "name": "Jitsu IQ - Fifty-Fifty Guard",
        "url": "https://jitsuiq.com/positions/guard/fifty-fifty-guard.html"
      },
      {
        "name": "Digitsu - Backside 50/50 Heel Hook (Jon Calestine)",
        "url": "https://digitsu.com/v/backside-50-50-heel-hook-jon-calestine"
      }
    ]
  },
  {
    "id": "ff-kneebar-heelhook-dilemma",
    "position": "FF",
    "name": "50/50 니바 · 힐훅 딜레마",
    "start": "50/50에서 상대 다리가 펴져 있고 무릎 라인이 잡힌 상태",
    "end": "힐훅 서브미션 (상대가 다시 다리를 펴면 니바로 복귀)",
    "grade": "참고",
    "steps": [
      {
        "tech": "FF-20",
        "role": "main",
        "note": "무릎을 모아 상대 무릎 라인을 확보하고 발 컨트롤"
      },
      {
        "tech": "FF-15",
        "role": "then",
        "note": "다리를 힙에 걸치고 힙을 펴 니바 압박"
      },
      {
        "tech": "FF-12",
        "role": "if_blocked",
        "trigger": "상대가 니바 방어로 무릎을 굽히거나 발을 빼려 하면",
        "note": "드러난 힐을 잡아 힐훅으로 전환"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Heel Hook Dilemma (기술 설명)",
        "url": "https://digitsu.com/t/heel-hook-dilemma"
      },
      {
        "name": "Digitsu - 50-50 Guard (기술 설명)",
        "url": "https://digitsu.com/t/50-50-guard"
      },
      {
        "name": "Digitsu - Jon Calestine K Guard Kodex 코스 목록",
        "url": "https://digitsu.com/v/50-50-attacks-finish-backside-5050-off-back-step-jon-calestine"
      }
    ]
  },
  {
    "id": "ff-anklelock-backtake",
    "position": "FF",
    "name": "50/50 발목 공격 정체 시 백 테이크",
    "start": "50/50에서 스트레이트 앵클락을 시도했으나 상대가 발을 빼거나 버틸 때",
    "end": "백 포지션",
    "grade": "참고",
    "steps": [
      {
        "tech": "FF-10",
        "role": "main",
        "note": "발목을 갈비뼈에 고정하고 힙을 펴 앵클락 시도"
      },
      {
        "tech": "FF-23",
        "role": "if_blocked",
        "trigger": "앵클락이 정체되고 상대 힙이 돌아가면",
        "note": "다리 그립을 유지한 채 상대 밑으로 회전해 백 노출 후 훅 삽입"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - 50-50 Guard (기술 설명)",
        "url": "https://digitsu.com/t/50-50-guard"
      },
      {
        "name": "Jitsu IQ - Fifty-Fifty Guard",
        "url": "https://jitsuiq.com/positions/guard/fifty-fifty-guard.html"
      },
      {
        "name": "BJJ More - Modern 50/50 Fundamentals Guard (Nick Salles / Danny Maira) 리뷰",
        "url": "https://bjjmore.com/nick-salles-danny-maira-5050-guard/"
      }
    ]
  },
  {
    "id": "ff-sweep-backtake-weight",
    "position": "FF",
    "name": "50/50 스윕 · 상대 체중에 따른 백 테이크 선택",
    "start": "50/50 바텀에서 상대 체중이 뒤나 앞으로 치우쳐 반응이 갈릴 때(도복 위주)",
    "end": "백 포지션 또는 탑 포지션",
    "grade": "참고",
    "steps": [
      {
        "tech": "FF-01",
        "role": "main",
        "note": "다리를 걸친 채 앉으며 힙을 돌려 상대 균형을 무너뜨림"
      },
      {
        "tech": "FF-23",
        "role": "if_blocked",
        "trigger": "상대가 체중을 실어 스윕을 막고 몸이 돌아가면",
        "note": "상대 다리 컨트롤을 유지한 채 롤링하여 백 테이크"
      }
    ],
    "sources": [
      {
        "name": "BJJ More - Modern 50/50 Fundamentals Guard 리뷰",
        "url": "https://bjjmore.com/nick-salles-danny-maira-5050-guard/"
      },
      {
        "name": "BJJ More - The Modern 50/50 Guard (Patrick Gaudio) 리뷰",
        "url": "https://bjjmore.com/patrick-gaudio-modern-50-50-guard/"
      },
      {
        "name": "Jitsu IQ - Fifty-Fifty Guard",
        "url": "https://jitsuiq.com/positions/guard/fifty-fifty-guard.html"
      }
    ]
  },
  {
    "id": "ff-calfcrusher-kneebar",
    "position": "FF",
    "name": "50/50 카프 크러셔 · 다리를 펴면 니바",
    "start": "50/50에서 상대 다리를 접어 정강이를 오금에 넣을 수 있을 때",
    "end": "카프 크러셔 또는 니바 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "FF-20",
        "role": "main",
        "note": "무릎을 모아 상대 다리를 가두고 발 컨트롤과 힙 높이를 확보"
      },
      {
        "tech": "FF-14",
        "role": "then",
        "note": "정강이를 오금 깊이 넣고 발을 엉덩이 쪽으로 당겨 압박"
      },
      {
        "tech": "FF-15",
        "role": "if_blocked",
        "trigger": "상대가 압박을 풀려고 다리를 펴면",
        "note": "펴진 다리를 힙에 걸치고 니바로 전환"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Calf Slicer (기술 설명)",
        "url": "https://digitsu.com/t/calf-slicer"
      },
      {
        "name": "Digitsu - Heel Hook Dilemma (기술 설명)",
        "url": "https://digitsu.com/t/heel-hook-dilemma"
      }
    ]
  },
  {
    "id": "gp-kneeslice-legdrag",
    "position": "GP",
    "name": "니 슬라이스 · 레그 드래그 전환 패스",
    "start": "탑에서 상대 다리 사이에 한 다리를 넣고 니 슬라이스를 시작할 때",
    "end": "사이드 컨트롤",
    "grade": "참고",
    "steps": [
      {
        "tech": "GP-14",
        "role": "main",
        "note": "안쪽 무릎을 눌러 낮은 자세로 대각선으로 무릎을 슬라이스, 힐을 엉덩이에 붙여 RDLR 훅을 방지"
      },
      {
        "tech": "GP-15",
        "role": "if_blocked",
        "trigger": "상대가 다리를 밀어내거나 프레임으로 저항해 무릎이 안 빠지면",
        "note": "무릎 슬라이스를 접고 상대 다리를 반대편으로 넘겨 레그 드래그 포지션으로 전환"
      },
      {
        "tech": "GP-20",
        "role": "then",
        "note": "무릎을 상대 힙에 붙이고 백스텝하며 사이드 컨트롤로 정리"
      }
    ],
    "sources": [
      {
        "name": "Erin Herle (Digitsu) - Knee Slice Concepts",
        "url": "https://digitsu.com/v/knee-slice-concepts-erin-herle"
      },
      {
        "name": "Gianni Grippo (Digitsu) - Falling Leg Drag",
        "url": "https://digitsu.com/v/falling-leg-drag-gianni-grippo"
      }
    ]
  },
  {
    "id": "gp-legdrag-backtake",
    "position": "GP",
    "name": "레그 드래그 · 상대가 돌면 백 테이크",
    "start": "탑에서 상대 다리를 한쪽으로 끌어 레그 드래그 포지션을 만들었을 때",
    "end": "백 포지션 (상대가 돌지 않으면 사이드 컨트롤로 마무리 - GP-20)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "GP-15",
        "role": "main",
        "note": "무릎을 매트에 고정하고 가슴을 붙여 먼 쪽 힙/벨트를 컨트롤"
      },
      {
        "tech": "GP-22",
        "role": "if_blocked",
        "trigger": "상대가 힙을 빼 돌아서 터틀로 도망가려 하면",
        "note": "상대 등 방향으로 각도를 잡고 힙을 컨트롤해 백으로 이동"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Leg Drag Pass (기술 설명)",
        "url": "https://digitsu.com/t/leg-drag-pass"
      },
      {
        "name": "Jitsu IQ - Leg Drag Pass",
        "url": "https://jitsuiq.com/guard-passes/leg-drag-pass.html"
      },
      {
        "name": "Edwin Najmi (Digitsu) - Double Knee Slide",
        "url": "https://digitsu.com/v/pass-double-knee-slide-edwin-najmi"
      }
    ]
  },
  {
    "id": "gp-kneeslice-backtake",
    "position": "GP",
    "name": "니 슬라이스 · 상대가 파고들면 백 테이크",
    "start": "탑에서 니 슬라이스를 시도할 때 상대가 안쪽으로 돌아 들어오는 경우",
    "end": "백 포지션",
    "grade": "참고",
    "steps": [
      {
        "tech": "GP-14",
        "role": "main",
        "note": "크로스페이스나 어깨 압박으로 상체를 눌러 니 슬라이스 시작"
      },
      {
        "tech": "GP-22",
        "role": "if_blocked",
        "trigger": "상대가 밀거나 몸을 돌려 이쪽으로 파고들면(터틀 시작)",
        "note": "상대 머리 너머로 넘어가 손목 시트벨트로 백을 잡음"
      }
    ],
    "sources": [
      {
        "name": "Edwin Najmi (Digitsu) - Double Knee Slide",
        "url": "https://digitsu.com/v/pass-double-knee-slide-edwin-najmi"
      },
      {
        "name": "Digitsu - Knee Cut Pass (기술 설명)",
        "url": "https://digitsu.com/t/knee-cut-pass"
      }
    ]
  },
  {
    "id": "gp-toreando-legdrag",
    "position": "GP",
    "name": "토레안도 · 레그 드래그 전환 패스",
    "start": "서서 상대 발/다리를 그립하고 토레안도를 시도할 때",
    "end": "사이드 컨트롤",
    "grade": "참고",
    "steps": [
      {
        "tech": "GP-13",
        "role": "main",
        "note": "다리를 높게 컨트롤하고 정지하지 않고 빠르게 옆으로 통과"
      },
      {
        "tech": "GP-15",
        "role": "if_blocked",
        "trigger": "상대가 다리를 밀어내거나 가드 리커버리를 위해 다리를 빼려 하면",
        "note": "붙잡은 다리를 몸 반대쪽으로 끌어 레그 드래그로 전환"
      },
      {
        "tech": "GP-20",
        "role": "then",
        "note": "가슴을 붙여 사이드 컨트롤로 안정화"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Leg Drag Pass (기술 설명)",
        "url": "https://digitsu.com/t/leg-drag-pass"
      },
      {
        "name": "Jitsu IQ - Leg Drag Pass",
        "url": "https://jitsuiq.com/guard-passes/leg-drag-pass.html"
      },
      {
        "name": "Bruno Frazatto (Digitsu) - 패스 코스 목차",
        "url": "https://digitsu.com/v/closed-guard-stack-pass-long-step-bruno-frazatto"
      }
    ]
  },
  {
    "id": "gp-toreando-folding",
    "position": "GP",
    "name": "토레안도 · 상대가 프레임하면 폴딩 패스",
    "start": "무릎 바깥을 그립하고 토레안도처럼 옆으로 원을 그리며 돌 때",
    "end": "사이드 컨트롤",
    "grade": "참고",
    "steps": [
      {
        "tech": "GP-13",
        "role": "main",
        "note": "두 손으로 무릎 바깥을 잡고 바깥으로 스텝하며 원을 그림"
      },
      {
        "tech": "GP-24",
        "role": "if_blocked",
        "trigger": "상대가 어깨에 프레임을 만들고 힙을 이쪽으로 돌려 리가드하려 하면",
        "note": "상대 다리를 같은 방향으로 내려 접은 뒤 정강이 슬라이스로 접어 넘김"
      },
      {
        "tech": "GP-20",
        "role": "then",
        "note": "다리를 접은 스테이플 자세에서 백스텝하거나 무릎 허그로 정리해 패스 완료"
      }
    ],
    "sources": [
      {
        "name": "Marcus Johnson (Digitsu) - Set Ups: From Torreando and X Pass",
        "url": "https://digitsu.com/v/set-ups-from-torreando-and-x-pass-marcus-johnson"
      },
      {
        "name": "Evolve MMA - Toreando Pass 해설",
        "url": "https://evolve-mma.com/blog/what-is-the-toreando-pass-in-bjj/"
      }
    ]
  },
  {
    "id": "gp-stack-longstep",
    "position": "GP",
    "name": "스택 패스 · 막히면 반대쪽 전환 후 롱스텝",
    "start": "클로즈드 가드를 열고 스택 패스로 무릎을 눌러 올릴 때",
    "end": "사이드 컨트롤",
    "grade": "참고",
    "steps": [
      {
        "tech": "GP-23",
        "role": "main",
        "note": "한 무릎을 세우고 상대 무릎을 눌러 옆으로 스택"
      },
      {
        "tech": "GP-19",
        "role": "if_blocked",
        "trigger": "상대가 힙과 얼굴에 프레임해 무릎이 팔 위로 넘어가지 않으면",
        "note": "반대쪽으로 스위치한 뒤 칼라를 놓고 롱스텝으로 아래 다리를 컨트롤하며 넘어감"
      },
      {
        "tech": "GP-20",
        "role": "then",
        "note": "다리를 눌러 평평하게 만들고 팔꿈치 컨트롤로 사이드 컨트롤 안정화"
      }
    ],
    "sources": [
      {
        "name": "Bruno Frazatto (Digitsu) - Closed Guard | Stack Pass | Long Step",
        "url": "https://digitsu.com/v/closed-guard-stack-pass-long-step-bruno-frazatto"
      },
      {
        "name": "Paul Schreiner (Digitsu) - Double Stack / 더블언더 방어 대응 영상",
        "url": "https://digitsu.com/v/trouble-shooting-double-under-defenses-paul-schreiner"
      }
    ]
  },
  {
    "id": "gp-legweave-backstep",
    "position": "GP",
    "name": "레그 위브 패스 · 상대가 프레임하면 백스텝 패스",
    "start": "오픈가드 상대의 다리 사이로 팔을 넣어 무릎 라인을 눌러 고정할 때",
    "end": "사이드 컨트롤",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "GP-03",
        "role": "main",
        "note": "팔을 깊이 넣어 먼 쪽 힙/벨트를 잡고 어깨로 무릎을 눌러 힙을 평평하게 만듦"
      },
      {
        "tech": "GP-02",
        "role": "if_blocked",
        "trigger": "상대가 머리나 이두에 프레임을 만들고 힙을 빼 리가드하려 하면",
        "note": "한쪽 다리를 잡아 고정한 채 몸을 180도 돌려 백스텝으로 각도를 바꿔 프레임을 우회"
      },
      {
        "tech": "GP-20",
        "role": "then",
        "note": "낮은 자세로 가슴 압박과 상체 컨트롤을 얹어 사이드 컨트롤로 정리"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Leg Weave (포지션 설명)",
        "url": "https://digitsu.com/t/leg-weave"
      },
      {
        "name": "Digitsu - Leg Weave Pass (기술 설명)",
        "url": "https://digitsu.com/t/leg-weave-pass"
      },
      {
        "name": "Bruno Frazatto (Digitsu) - Leg Weave Pass 세미나",
        "url": "https://digitsu.com/v/leg-weave-pass-bruno-frazatto"
      }
    ]
  },
  {
    "id": "gp-backstep-backtake",
    "position": "GP",
    "name": "백스텝 패스 · 상대가 등을 돌리면 백 테이크",
    "start": "한쪽 다리를 잡고 상체를 컨트롤한 채 백스텝 패스를 시작할 때",
    "end": "백 포지션 (상대가 돌지 않으면 사이드 컨트롤 GP-20으로 마무리)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "GP-02",
        "role": "main",
        "note": "상대 다리를 고정하고 크로스페이스/언더훅으로 상체를 막은 뒤 몸을 돌려 백스텝"
      },
      {
        "tech": "GP-22",
        "role": "if_blocked",
        "trigger": "백스텝 중 상대가 패스를 피하려 등을 돌리면(터틀)",
        "note": "만들어진 각도를 이용해 따라붙어 백 컨트롤을 잡음"
      }
    ],
    "sources": [
      {
        "name": "Jitsu IQ - Backstep Pass",
        "url": "https://jitsuiq.com/guard-passes/backstep-pass.html"
      },
      {
        "name": "Digitsu - Back Step (기술 설명)",
        "url": "https://digitsu.com/t/back-step"
      },
      {
        "name": "Digitsu - Bodylock Pass (기술 설명)",
        "url": "https://digitsu.com/t/bodylock-pass"
      }
    ]
  },
  {
    "id": "hg-underhook-oldschool-backtake",
    "position": "HG",
    "name": "언더훅 · 올드스쿨 스윕 · 백 테이크",
    "start": "하프 가드 바텀에서 먼 쪽 언더훅을 얻고 상대가 체중을 앞으로 싣고 있을 때",
    "end": "탑 포지션(하프 가드 탑/사이드) 또는 백 컨트롤",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "HG-20",
        "role": "main",
        "note": "머리를 상대 가슴에 붙이고 깊은 언더훅을 확보해 크로스페이스를 막음"
      },
      {
        "tech": "HG-01",
        "role": "then",
        "note": "갇힌 다리의 발목을 잡아 당기며 언더훅으로 밀고 들어가 기울여 스윕"
      },
      {
        "tech": "HG-03",
        "role": "if_blocked",
        "trigger": "상대가 한 손이나 다리를 넓게 짚어 스윕을 버티면",
        "note": "스윕을 막는 데 쏠린 틈에 언더훅과 힙 이스케이프로 돌아 백을 잡음"
      }
    ],
    "sources": [
      {
        "name": "Evolve MMA - 5 best sweeps from half guard",
        "url": "https://evolve-mma.com/blog/the-5-best-sweeps-from-the-half-guard-in-bjj/"
      },
      {
        "name": "Digitsu - Dogfight Position (포지션 가이드)",
        "url": "https://digitsu.com/t/dogfight-position"
      },
      {
        "name": "Jitsu IQ - Old School Sweep",
        "url": "https://jitsuiq.com/sweeps/old-school-sweep.html"
      }
    ]
  },
  {
    "id": "hg-kneeshield-dogfight-back",
    "position": "HG",
    "name": "니 쉴드 · 언더훅 · 도그파이트 백 테이크",
    "start": "니 쉴드 하프 가드 바텀에서 상대의 크로스페이스를 풀고 먼 쪽 언더훅을 얻었을 때",
    "end": "백 컨트롤 (또는 도그파이트에서 스윕/기무라/일렉트릭 체어로 분기)",
    "grade": "참고",
    "steps": [
      {
        "tech": "HG-21",
        "role": "main",
        "note": "니 쉴드 프레임으로 상체 압박을 막고 크로스페이스를 처리"
      },
      {
        "tech": "HG-20",
        "role": "then",
        "note": "먼 쪽 깊은 언더훅을 잡고 무릎으로 올라 도그파이트 자세를 만듦(갇힌 다리는 유지)"
      },
      {
        "tech": "HG-03",
        "role": "then",
        "note": "언더훅과 머리 위치를 유지한 채 상대 옆으로 돌아 백을 잡음"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Dogfight Position",
        "url": "https://digitsu.com/t/dogfight-position"
      },
      {
        "name": "Evolve MMA - BJJ 101: Knee Shield Half Guard",
        "url": "https://evolve-mma.com/blog/bjj-101-knee-shield-half-guard/"
      }
    ]
  },
  {
    "id": "hg-kimura-trap-backtake",
    "position": "HG",
    "name": "하프 가드 기무라 그립 · 스윙 백 테이크",
    "start": "하프 가드 바텀에서 상대 손목을 잡고 기무라 그립이 만들어졌을 때",
    "end": "백 컨트롤 (시트벨트로 RNC 또는 기무라 계속)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "HG-10",
        "role": "main",
        "note": "먼 손목을 잡고 반대 팔을 넘겨 기무라 그립을 만든다. 서브미션 위협으로 상대 반응을 본다"
      },
      {
        "tech": "HG-25",
        "role": "then",
        "note": "그립을 상대 배에 밀어 공간을 만든 뒤 하프 가드를 풀며 다리를 크게 스윙해 백으로 돈다. 상대가 힙을 눌러 막으면 반대 다리로 버터플라이 훅을 넣어 틈을 만들고 다시 시도(HG-24 자세)"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (Stephan Kesting, 4단 블랙벨트)",
        "url": "https://www.grapplearts.com/taking-the-back-from-half-guard-using-the-kimura-grip/"
      },
      {
        "name": "Digitsu - Kimura Trap",
        "url": "https://digitsu.com/t/kimura-trap"
      }
    ]
  },
  {
    "id": "hg-lockdown-electricchair",
    "position": "HG",
    "name": "록다운 · 휩다운 일렉트릭 체어 스윕",
    "start": "하프 가드 바텀에서 록다운을 걸고 상대가 앞으로 체중을 싣고 있을 때",
    "end": "탑 포지션 또는 일렉트릭 체어 서브미션 위협",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "HG-23",
        "role": "main",
        "note": "록다운을 걸어 상대 다리를 늘리고 휩업으로 균형을 흔든다"
      },
      {
        "tech": "HG-06",
        "role": "then",
        "note": "휩다운으로 록다운을 늘리고 상대 다리를 어깨에 올려 일렉트릭 체어 스윕으로 상위를 잡는다. 상대가 자유로운 손으로 짚으면 올드스쿨(HG-01)도 대안이라는 설명이 있음"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Lockdown Sweep",
        "url": "https://digitsu.com/t/lockdown-sweep"
      },
      {
        "name": "BJJEE (10th Planet 블랙벨트 Zach Maslany/J-M Holland 기고) - 록다운 안전성 글",
        "url": "https://www.bjjee.com/?p=58217"
      }
    ]
  },
  {
    "id": "hg-deephalf-entry-waiter",
    "position": "HG",
    "name": "딥 하프 진입 · 웨이터 스윕",
    "start": "하프 가드 바텀에서 상대에게 눌려 있을 때 몸 아래로 파고들 수 있는 상황",
    "end": "탑 포지션 (스윕) 또는 딥 하프에서 백 테이크",
    "grade": "참고",
    "steps": [
      {
        "tech": "HG-05",
        "role": "main",
        "note": "몸을 옆으로 틀어 상대 힙 아래로 들어가 먼 쪽 허벅지를 깊게 언더훅"
      },
      {
        "tech": "HG-02",
        "role": "then",
        "note": "상대 다리를 어깨에 얹고 균형을 뒤로 무너뜨려 위로 올라오는 웨이터 스윕"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Deep Half Entry",
        "url": "https://digitsu.com/t/deep-half-entry"
      },
      {
        "name": "Digitsu - Deep Half Guard Back Take",
        "url": "https://digitsu.com/t/deep-half-guard-back-take"
      },
      {
        "name": "검색 요약 (Upstream BJJ 코스 목차 / Atos 딥 하프 시리즈)",
        "url": "https://live.atosbjjondemand.com/deep-half-guard"
      }
    ]
  },
  {
    "id": "hg-dogfight-electricchair",
    "position": "HG",
    "name": "도그파이트 · 일렉트릭 체어",
    "start": "하프 가드 바텀에서 언더훅을 잡고 도그파이트 자세에서 상대 다리가 갇혀 있을 때",
    "end": "스윕 후 탑 포지션 또는 일렉트릭 체어 서브미션 위협",
    "grade": "참고",
    "steps": [
      {
        "tech": "HG-20",
        "role": "main",
        "note": "언더훅과 갇힌 다리를 유지하며 무릎으로 올라 몸을 붙임"
      },
      {
        "tech": "HG-04",
        "role": "then",
        "note": "갇힌 다리를 퍼올려 일렉트릭 체어 자세로 전환해 스윕/압박"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Dogfight Position",
        "url": "https://digitsu.com/t/dogfight-position"
      }
    ]
  },
  {
    "id": "hg-deephalf-entry-backtake",
    "position": "HG",
    "name": "딥 하프 진입 · 딥 하프 백 테이크",
    "start": "하프 가드 바텀에서 상대에게 눌려 있을 때 몸 아래로 파고들 수 있는 상황",
    "end": "백 컨트롤",
    "grade": "참고",
    "steps": [
      {
        "tech": "HG-05",
        "role": "main",
        "note": "몸을 낮춰 상대 먼 쪽 허벅지 아래로 파고들어 딥 하프 언더훅을 얻는다"
      },
      {
        "tech": "HG-26",
        "role": "then",
        "note": "상대가 체중을 앞으로 실으면 허벅지 언더훅을 핸들로 힙 뒤로 돌아 시트벨트와 훅으로 백을 잡는다. 머리를 힙 가까이 유지"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Deep Half Entry",
        "url": "https://digitsu.com/t/deep-half-entry"
      },
      {
        "name": "Digitsu - Deep Half Guard Back Take",
        "url": "https://digitsu.com/t/deep-half-guard-back-take"
      }
    ]
  },
  {
    "id": "kg-matrix-backtake",
    "position": "KG",
    "name": "K가드 · 매트릭스 백 테이크",
    "start": "K가드에서 상대가 상체를 세우고 서 있어 먼 다리를 스쿠프할 수 있을 때",
    "end": "백 포지션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "KG-20",
        "role": "main",
        "note": "무릎을 상대 무릎 안쪽에 둔 K훅을 세팅하고, 상대 먼 다리를 스쿠프할 준비. 삼각 같은 상체 위협으로 상대가 자세를 높게 유지하게 유도"
      },
      {
        "tech": "KG-21",
        "role": "then",
        "note": "먼 다리를 스쿠프하며 인버트해 다리를 뒤로 넘기고 골반을 밑으로 돌려 등 뒤로 이동, 시트벨트와 훅 확보. 다리 장력을 먼저 풀지 말 것"
      }
    ],
    "sources": [
      {
        "name": "FloGrappling (Corey Stockton) - K-guard Technique Showcase",
        "url": "https://www.flograppling.com/articles/6812215-crucial-details-from-the-best-k-guard-players-technique-showcase"
      },
      {
        "name": "Jon Calestine (Digitsu 'The K Guard Kodex' 코스)",
        "url": "https://digitsu.com/v/attacks-matrix-hook-calf-cutter-back-take-jon-calestine"
      },
      {
        "name": "BJJ More - K Guard & Matrix System (Mikey Musumeci) 리뷰",
        "url": "https://bjjmore.com/k-guard-matrix-system-mikey-musumeci/"
      }
    ]
  },
  {
    "id": "kg-matrix-xguard-sweep",
    "position": "KG",
    "name": "백사이드가 안 될 때 · X가드 전환 스윕",
    "start": "K가드에서 다리를 넘겨 백사이드 포지션으로 가려 하지만 넘기기 어려울 때",
    "end": "X가드 스윕 후 탑 포지션. X가드는 타 포지션 단계",
    "grade": "참고",
    "steps": [
      {
        "tech": "KG-21",
        "role": "main",
        "note": "다리를 초핑하듯 넘겨 백사이드/매트릭스 진입 시도"
      },
      {
        "tech": "KG-02",
        "role": "if_blocked",
        "trigger": "다리를 쉽게 넘기지 못하면",
        "note": "그 다리 쪽 엉덩이를 들고 상대 허벅지 아래로 넣어 X가드로 전환. 허벅지 안쪽 발로 밀어 균형을 깨고 손이 바닥에 닿으면 올라오며 스윕"
      }
    ],
    "sources": [
      {
        "name": "Jon Calestine (Digitsu 'The K Guard Kodex' 코스) - X-Guard Attacks",
        "url": "https://digitsu.com/v/x-guard-attacks-sweep-with-second-leg-jon-calestine"
      },
      {
        "name": "FloGrappling (Corey Stockton) - K-guard Technique Showcase",
        "url": "https://www.flograppling.com/articles/6812215-crucial-details-from-the-best-k-guard-players-technique-showcase"
      }
    ]
  },
  {
    "id": "kg-backside-heelhook",
    "position": "KG",
    "name": "K가드에서 백사이드 50-50 · 힐훅",
    "start": "K가드에서 상대가 내 발을 눌러 내리거나 다리 얽힘이 가능한 상황",
    "end": "아웃사이드 힐훅 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "KG-20",
        "role": "main",
        "note": "팔꿈치를 상대 무릎 안쪽에 두어 K훅 연결을 유지하며 상대 반응을 본다"
      },
      {
        "tech": "KG-25",
        "role": "if_blocked",
        "trigger": "상대가 내 발을 눌러 내리거나 다리를 빼려 하면",
        "note": "한 발을 넘기고 다른 발은 골반 위로 보내 각도를 자르며 인버트해 백사이드 50/50으로 들어간다"
      },
      {
        "tech": "KG-10",
        "role": "then",
        "note": "백사이드 50/50에서 발목을 잡고 피겨4로 잠근 뒤 발가락을 당겨 장력을 유지, 팔꿈치를 안으로 넣고 배를 아래로 향하며 아웃사이드 힐훅 마무리"
      }
    ],
    "sources": [
      {
        "name": "Jon Calestine (Digitsu 'The K Guard Kodex' 코스) - 50/50 Attacks",
        "url": "https://digitsu.com/v/50-50-attacks-backside-to-break-down-finishes-jon-calestine"
      },
      {
        "name": "FloGrappling (Corey Stockton) - K-guard Technique Showcase",
        "url": "https://www.flograppling.com/articles/6812215-crucial-details-from-the-best-k-guard-players-technique-showcase"
      },
      {
        "name": "Jon Calestine (Digitsu) - K Guard Rolling Commentary Roll 5",
        "url": "https://digitsu.com/v/k-guard-rolling-commentary-roll-5-jon-calestine"
      }
    ]
  },
  {
    "id": "kg-to-slx",
    "position": "KG",
    "name": "상대가 앞으로 눌러올 때 · SLX 진입",
    "start": "K가드에서 상대를 움직여 균형을 파악하고 상대가 앞으로 압박해 올 때",
    "end": "싱글 레그 X(SLX) 포지션. 타 포지션 단계",
    "grade": "참고",
    "steps": [
      {
        "tech": "KG-20",
        "role": "main",
        "note": "손을 위로 올려 거리를 관리하며 근접/먼 쪽 다리 중 공략할 쪽 선택, 상대를 코너로 몰아 균형이 약한 쪽을 찾는다"
      },
      {
        "tech": "KG-22",
        "role": "then",
        "note": "상대가 앞으로 누르면 아래로 끌어 균형을 깨고, 앞다리를 올려 발을 넘기며 옆으로 피벗해 싱글 레그 X로 이동. 그립은 손목이 아닌 팔꿈치 깊이까지"
      }
    ],
    "sources": [
      {
        "name": "Adam Benayoun (Digitsu 'SLX Evolution' 코스) - Entries: K Guard",
        "url": "https://digitsu.com/v/entries-k-guard-adam-benayoun"
      },
      {
        "name": "Jon Calestine (Digitsu) - X-Guard Attacks / K Guard Kodex 설명",
        "url": "https://digitsu.com/v/x-guard-attacks-sweep-with-second-leg-jon-calestine"
      }
    ]
  },
  {
    "id": "kg-tilt-sweep",
    "position": "KG",
    "name": "K훅 · 기본 K가드 스윕 (다리 스쿠프 후 밀어 올리기)",
    "start": "K가드에서 상대의 먼 다리를 스쿠프할 수 있을 때",
    "end": "탑 포지션",
    "grade": "참고",
    "steps": [
      {
        "tech": "KG-20",
        "role": "main",
        "note": "K훅이 패스를 막는 벽 역할을 하도록 무릎을 안쪽에 두고, 상대 먼 다리 아래로 파고들어 스쿠프 그립 확보"
      },
      {
        "tech": "KG-01",
        "role": "then",
        "note": "스쿠프한 다리를 들어올리며 K훅을 밀어 상대를 기울여 넘기는 틸트 스윕"
      },
      {
        "tech": "KG-03",
        "role": "if_blocked",
        "trigger": "상대가 먼 다리를 빼고 거리를 유지해 스쿠프가 안 되면",
        "note": "크로스 칼라 그립에서 소매 그립으로 바꾸고 K훅 다리로 가위 스윕을 건다"
      }
    ],
    "sources": [
      {
        "name": "FloGrappling (Corey Stockton) - K-guard Technique Showcase",
        "url": "https://www.flograppling.com/articles/6812215-crucial-details-from-the-best-k-guard-players-technique-showcase"
      },
      {
        "name": "Digitsu K-Guard Sweep 기술 페이지",
        "url": "https://digitsu.com/t/k-guard-sweep"
      }
    ]
  },
  {
    "id": "kg-calfslicer-backtake",
    "position": "KG",
    "name": "K가드 카프 슬라이서 · 매트릭스 백 테이크",
    "start": "K가드(매트릭스 훅)에서 상대가 마주보거나 다리를 빼려 할 때",
    "end": "카프 슬라이서 서브미션 또는 백 포지션",
    "grade": "참고",
    "steps": [
      {
        "tech": "KG-20",
        "role": "main",
        "note": "얕은 매트릭스 훅을 세우고 상대가 마주보거나 다리를 빼려 하면 발을 뻗어 연결을 유지"
      },
      {
        "tech": "KG-14",
        "role": "then",
        "note": "정강이를 상대 종아리 가장 약한 지점 아래에 넣고 발가락 쪽을 당겨 카프 슬라이서를 시도"
      },
      {
        "tech": "KG-21",
        "role": "if_blocked",
        "trigger": "카프 슬라이서가 안 걸리고 상대 다리를 정리할 수 있으면",
        "note": "다리를 치우고 인버트해 상대 등 뒤로 이동, 시트벨트와 훅 확보"
      }
    ],
    "sources": [
      {
        "name": "Digitsu(Jon Calestine)",
        "url": "https://digitsu.com/v/attacks-matrix-hook-calf-cutter-back-take-jon-calestine"
      },
      {
        "name": "Atos BJJ OnDemand",
        "url": "https://live.atosbjjondemand.com/calf-slicer/videos/calf-slice-position-from-closed-guard-to-back-take-and-slicer"
      }
    ]
  },
  {
    "id": "knb-push-knee-armbar-mount",
    "position": "KNB",
    "name": "무릎 밀기 반응 · 암바 · 마운트 전환",
    "start": "니 온 벨리 탑에서 상대가 내 무릎을 손으로 밀어 압박을 풀려고 할 때",
    "end": "암바 서브미션 또는 마운트",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "KNB-20",
        "role": "main",
        "note": "넓은 베이스와 칼라/하리 그립으로 압박 유지, 상대 반응을 유도"
      },
      {
        "tech": "KNB-01",
        "role": "then",
        "note": "밀어낸 팔의 틈으로 손을 넣어 팔꿈치를 붙이고 다리를 넘겨 암바"
      },
      {
        "tech": "KNB-10",
        "role": "if_blocked",
        "trigger": "암바가 걸리지 않거나 상대가 팔을 빼 버티면",
        "note": "무릎을 상대 몸 반대편으로 넘겨 마운트를 잡음"
      }
    ],
    "sources": [
      {
        "name": "Gracie Barra - KOB sequence (Marcio Feitosa, 6단 블랙벨트)",
        "url": "https://graciebarra.com/gb-news/gb-technique-knee-on-belly-sequence-with-prof-marcio-feitosa"
      },
      {
        "name": "Evolve University - 5 Attacks From KOB",
        "url": "https://evolve-university.com/blog/5-attacks-from-the-knee-on-belly-position/"
      },
      {
        "name": "Digitsu - Knee on Belly",
        "url": "https://digitsu.com/t/knee-on-belly"
      }
    ]
  },
  {
    "id": "knb-armbar-kimura-gripdefense",
    "position": "KNB",
    "name": "암바 시도 · 기무라 전환 (팔을 자기 몸에 붙여 방어할 때)",
    "start": "니 온 벨리 탑에서 상대의 팔을 공격하는 상황",
    "end": "기무라 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "KNB-01",
        "role": "main",
        "note": "밀어낸 팔을 노려 암바 시도"
      },
      {
        "tech": "KNB-02",
        "role": "if_blocked",
        "trigger": "상대가 자기 도복이나 벨트를 잡아 팔을 숨기면",
        "note": "기무라 그립으로 바꿔 어깨를 공격"
      }
    ],
    "sources": [
      {
        "name": "Gracie Barra - KOB sequence (Marcio Feitosa)",
        "url": "https://graciebarra.com/gb-news/gb-technique-knee-on-belly-sequence-with-prof-marcio-feitosa"
      },
      {
        "name": "Grapplearts - A Powerful Choke from Knee on Belly",
        "url": "https://www.grapplearts.com/powerful-choke-knee-on-belly/"
      }
    ]
  },
  {
    "id": "knb-turn-backtake",
    "position": "KNB",
    "name": "니 온 벨리 · 돌아 도망가는 상대 백 테이크",
    "start": "니 온 벨리 탑에서 상대가 옆으로 돌아 도망가려 할 때",
    "end": "백 컨트롤",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "KNB-20",
        "role": "main",
        "note": "압박을 유지하며 상대의 돌아가는 방향을 읽음"
      },
      {
        "tech": "KNB-11",
        "role": "transition",
        "note": "상대 등을 넘어 스텝오버하며 백 컨트롤을 잡음"
      }
    ],
    "sources": [
      {
        "name": "Jitsu IQ - Knee on Belly",
        "url": "https://jitsuiq.com/positions/mount/knee-on-belly.html"
      },
      {
        "name": "Digitsu - Knee on Belly",
        "url": "https://digitsu.com/t/knee-on-belly"
      }
    ]
  },
  {
    "id": "knb-collar-grip-crosschoke",
    "position": "KNB",
    "name": "먼 쪽 칼라 그립 선행 · 크로스 칼라 초크",
    "start": "니 온 벨리를 잡기 전 또는 직후, 상대가 암바와 기무라를 모두 막아내는 단단한 타입일 때",
    "end": "초크 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "KNB-20",
        "role": "main",
        "note": "먼 쪽 칼라를 먼저 깊게 잡은 상태로 무릎을 올리고 반대편으로 옮겨 앉음"
      },
      {
        "tech": "KNB-03",
        "role": "then",
        "note": "상대가 예상 못 한 사이 두 번째 그립을 잡아 크로스 초크 마무리"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (Stephan Kesting, Denis Kang 기술)",
        "url": "https://www.grapplearts.com/powerful-choke-knee-on-belly/"
      },
      {
        "name": "Jitsu IQ - Knee on Belly",
        "url": "https://jitsuiq.com/positions/mount/knee-on-belly.html"
      }
    ]
  },
  {
    "id": "knb-baseball-choke",
    "position": "KNB",
    "name": "니 온 벨리 베이스볼 배트 초크 (상대가 팔을 잡을 때)",
    "start": "니 온 벨리 탑에서 양손 칼라 그립을 잡을 수 있을 때",
    "end": "초크 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "KNB-20",
        "role": "main",
        "note": "무릎 압박을 유지하며 칼라 그립 준비"
      },
      {
        "tech": "KNB-04",
        "role": "then",
        "note": "손바닥 위/아래 그립으로 팔꿈치를 모으고 상대가 새우처럼 빠지면 무릎을 떨어뜨려 조임을 강화"
      }
    ],
    "sources": [
      {
        "name": "Evolve MMA - BJJ 101: Baseball Choke",
        "url": "https://evolve-mma.com/blog/bjj-101-baseball-choke/"
      },
      {
        "name": "Jitsu IQ - Knee on Belly",
        "url": "https://jitsuiq.com/positions/mount/knee-on-belly.html"
      }
    ]
  },
  {
    "id": "knb-americana-mount",
    "position": "KNB",
    "name": "니 온 벨리 아메리카나 · 마운트 전환",
    "start": "니 온 벨리 탑에서 크로스 라펠 그립으로 상대 반응을 유도할 때",
    "end": "마운트 또는 아메리카나 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "KNB-13",
        "role": "main",
        "note": "크로스 라펠을 잡아 상대가 내 공격하는 팔을 잡으면 다른 팔을 삼두 아래로 넣어 피겨포로 아메리카나"
      },
      {
        "tech": "KNB-10",
        "role": "transition",
        "note": "아메리카나가 안 되면 상대의 반응을 이용해 무릎을 넘겨 마운트를 잡는다"
      }
    ],
    "sources": [
      {
        "name": "Evolve University",
        "url": "https://evolve-university.com/blog/5-attacks-from-the-knee-on-belly-position/"
      },
      {
        "name": "JitsuIQ (아메리카나)",
        "url": "https://jitsuiq.com/submissions/locks/joint-locks/americana.html"
      }
    ]
  },
  {
    "id": "knb-armbar-darce",
    "position": "KNB",
    "name": "니 온 벨리 암바 · 다르스 초크 (밀기 반응에 따라)",
    "start": "니 온 벨리 탑에서 상대가 압박을 풀려고 밀어낼 때",
    "end": "암바 또는 다르스 초크",
    "grade": "참고",
    "steps": [
      {
        "tech": "KNB-01",
        "role": "main",
        "note": "상대가 내 무릎을 밀면 생긴 틈으로 손을 넣어 먼 쪽 암바"
      },
      {
        "tech": "KNB-14",
        "role": "if_blocked",
        "trigger": "상대가 무릎이 아니라 내 배/몸통을 밀면",
        "note": "팔 배치 때문에 암바는 어렵지만 팔을 상대 팔 아래로 넣어 머리를 잡고 다르스 초크"
      }
    ],
    "sources": [
      {
        "name": "Evolve University",
        "url": "https://evolve-university.com/blog/5-attacks-from-the-knee-on-belly-position/"
      },
      {
        "name": "Bernardo Faria Academy (Chris Lyon 다르스)",
        "url": "https://bernardofariaacademy.com/?p=1110"
      }
    ]
  },
  {
    "id": "ls-sweep-omoplata",
    "position": "LS",
    "name": "라소 스윕 · 오모플라타 연계 (상대가 버티면)",
    "start": "라소 가드에서 상대 소매를 잡고 라소 다리가 어깨 뒤까지 깊게 감긴 상태",
    "end": "탑 포지션(사이드 컨트롤/마운트) 또는 오모플라타 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "LS-01",
        "role": "main",
        "note": "라소 쪽 소매를 당기면서 라소 다리를 위로 뻗어 상대를 라소 반대편으로 기울여 스윕. 반대 손은 상대 먼 쪽 칼라/소매를 잡아 짚기를 막는다"
      },
      {
        "tech": "LS-11",
        "role": "if_blocked",
        "trigger": "상대가 상체를 세워 버티거나 먼 쪽 다리를 넓게 벌려 스윕이 막히면",
        "note": "라소를 풀고 다리를 어깨 위로 넘겨 가둔 팔 쪽 오모플라타로 전환(스윕이 안 돼도 회전 동작 자체가 상대를 넘기는 경우가 있음)"
      }
    ],
    "sources": [
      {
        "name": "Digitsu 기술 사전 - Lasso Sweep",
        "url": "https://digitsu.com/t/lasso-sweep"
      },
      {
        "name": "Evolve MMA - Sweeps From The Lasso Guard",
        "url": "https://evolve-mma.com/blog/sweeps-from-the-lasso-guard-a-complete-beginners-guide/"
      },
      {
        "name": "Digitsu - All About the Lasso Guard",
        "url": "https://app.digitsu.com/a/all-about-the-lasso-guard"
      }
    ]
  },
  {
    "id": "ls-triangle-omoplata",
    "position": "LS",
    "name": "라소 트라이앵글 · 오모플라타 연계",
    "start": "라소 가드에서 상대를 앞으로 당겨 라소 다리를 목 쪽으로 넘길 수 있을 때",
    "end": "오모플라타 서브미션 또는 스윕",
    "grade": "참고",
    "steps": [
      {
        "tech": "LS-10",
        "role": "main",
        "note": "라소 다리를 상대 등 위로 뻗어 눌러 넘기고 트라이앵글 자세를 만든다"
      },
      {
        "tech": "LS-11",
        "role": "if_blocked",
        "trigger": "상대가 트라이앵글을 막으려고 손을 등 뒤로 숨기면",
        "note": "한 손으로 상대 목을 밀어내며 다리를 어깨 위로 넘겨 오모플라타로 전환"
      }
    ],
    "sources": [
      {
        "name": "Danny Stolfi (Digitsu, Open Guard Fundamentals) - Gu Triangle Omoplata Lasso",
        "url": "https://digitsu.com/v/gu-triangle-omoplata-lasso-danny-stolfi"
      },
      {
        "name": "Grapplearts (Stephan Kesting) - Lasso Spider Guard to Omoplata",
        "url": "https://www.grapplearts.com/lasso-spider-guard-to-omoplata/"
      },
      {
        "name": "Digitsu - All About the Lasso Guard",
        "url": "https://app.digitsu.com/a/all-about-the-lasso-guard"
      }
    ]
  },
  {
    "id": "ls-sweep-standing-slx",
    "position": "LS",
    "name": "라소 스윕 · 일어서는 상대에게 싱글 레그 X 전환",
    "start": "라소 가드에서 상대가 일어서서 라소를 풀거나 뒤로 물러나려 할 때",
    "end": "싱글 레그 X 가드 (다른 포지션, 이후 SLX 계열 스윕/레그락으로 연결)",
    "grade": "참고",
    "steps": [
      {
        "tech": "LS-01",
        "role": "main",
        "note": "상대가 일어서며 체중이 앞으로 실릴 때 소매를 당기며 라소 스윕 시도"
      },
      {
        "tech": "LS-22",
        "role": "if_blocked",
        "trigger": "상대가 일어서서 균형을 잡고 스윕이 안 걸리면",
        "note": "남은 발로 상대 먼 쪽 다리를 컨트롤하고 아래로 들어가 싱글 레그 X(또는 X가드) 컨트롤로 전환 후 다음 스윕/레그락 연결"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - All About the Lasso Guard",
        "url": "https://app.digitsu.com/a/all-about-the-lasso-guard"
      },
      {
        "name": "Jitsu IQ - Lasso Guard",
        "url": "https://jitsuiq.com/positions/guard/lasso-guard.html"
      },
      {
        "name": "Digitsu 기술 사전 - Lasso Guard",
        "url": "https://digitsu.com/t/lasso-guard"
      }
    ]
  },
  {
    "id": "ls-sweep-dlr",
    "position": "LS",
    "name": "라소 스윕 · 데라히바 전환 (그립을 떼며 물러나는 상대)",
    "start": "라소 가드에서 상대가 한 걸음 물러나며 소매 그립을 떼려 할 때",
    "end": "데라히바 가드 (다른 포지션)",
    "grade": "참고",
    "steps": [
      {
        "tech": "LS-01",
        "role": "main",
        "note": "후퇴하는 상대의 움직임에 맞춰 힙 각도를 다시 잡고 라소 스윕 위협"
      },
      {
        "tech": "LS-23",
        "role": "if_blocked",
        "trigger": "상대가 물러나 라소가 풀리거나 스윕이 안 걸리면",
        "note": "라소를 풀고 발을 상대 먼 쪽 다리 뒤로 넣어 데라히바 후크로 컨트롤 유지"
      }
    ],
    "sources": [
      {
        "name": "Jitsu IQ - Lasso Guard",
        "url": "https://jitsuiq.com/positions/guard/lasso-guard.html"
      },
      {
        "name": "Digitsu 기술 사전 - Lasso Guard",
        "url": "https://digitsu.com/t/lasso-guard"
      },
      {
        "name": "Digitsu - All About the Lasso Guard",
        "url": "https://app.digitsu.com/a/all-about-the-lasso-guard"
      }
    ]
  },
  {
    "id": "ls-sweep-backtake",
    "position": "LS",
    "name": "라소 스윕 위협 · 라소 백 테이크 (상대가 일어서거나 라소를 풀 때)",
    "start": "라소 가드에서 소매를 잡고 상대가 자세를 세우거나 라소를 풀려 할 때",
    "end": "백 컨트롤",
    "grade": "참고",
    "steps": [
      {
        "tech": "LS-01",
        "role": "main",
        "note": "라소와 소매 그립으로 스윕을 위협해 상대 반응을 본다"
      },
      {
        "tech": "LS-24",
        "role": "if_blocked",
        "trigger": "상대가 자세를 세우거나 라소를 풀고 물러나려 할 때",
        "note": "소매를 몸 쪽으로 당기며 힙을 빼 아래로 파고든 뒤 상대 반대편으로 나와 라소를 풀고 시트벨트를 잡는다"
      }
    ],
    "sources": [
      {
        "name": "BJJEE - Andre Galvao의 DLR 라소 가드 백 테이크",
        "url": "https://www.bjjee.com/?p=69748"
      },
      {
        "name": "Digitsu - Lasso Guard",
        "url": "https://digitsu.com/t/lasso-guard"
      },
      {
        "name": "Digitsu - Lasso Back Take",
        "url": "https://digitsu.com/t/lasso-back-take"
      }
    ]
  },
  {
    "id": "ls-spin-omoplata-triangle",
    "position": "LS",
    "name": "라소 스피닝 오모플라타 · 트라이앵글 전환",
    "start": "라소 가드에서 소매와 상대 자세를 제어하며 회전할 수 있는 거리일 때",
    "end": "서브미션 (오모플라타 또는 트라이앵글)",
    "grade": "참고",
    "steps": [
      {
        "tech": "LS-14",
        "role": "main",
        "note": "라소 훅으로 한쪽 팔을 묶은 채 상대 체중이 한쪽으로 쏠린 틈에 회전해 오모플라타를 건다"
      },
      {
        "tech": "LS-10",
        "role": "if_blocked",
        "trigger": "회전 중 상대가 자세를 세워 오모플라타가 어긋날 때",
        "note": "회전을 이어가며 엉덩이를 들어 라소 다리를 목 쪽으로 넘겨 트라이앵글로 바꾼다"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (Stephan Kesting) - Lasso Spider Guard to Omoplata",
        "url": "https://www.grapplearts.com/lasso-spider-guard-to-omoplata/"
      },
      {
        "name": "Danny Stolfi (Digitsu) - Invert To Gonzalez Triangle Omoplata - Lasso",
        "url": "https://digitsu.com/v/invert-to-gonzalez-triangle-omoplata-lasso-danny-stolfi"
      }
    ]
  },
  {
    "id": "mt-highmount-smount-armbar",
    "position": "MT",
    "name": "하이 마운트 · S-마운트 · 암바 연계",
    "start": "마운트 탑에서 상대가 팔꿈치와 손으로 밀어내며 빠지려 할 때",
    "end": "암바 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "MT-21",
        "role": "main",
        "note": "무릎을 겨드랑이 쪽으로 올려 하이 마운트로 체중을 가슴에 실어 상대 팔을 노출시킨다"
      },
      {
        "tech": "MT-05",
        "role": "then",
        "trigger": "상대가 방어하려 팔을 내밀어 팔이 고립되거나 공간이 생기면",
        "note": "가까운 쪽 무릎을 머리 쪽으로 올리고 반대 다리를 팔 위로 감아 S자를 만든다"
      },
      {
        "tech": "MT-01",
        "role": "then",
        "note": "팔꿈치를 몸에 붙여 고립한 뒤 다리를 머리 너머로 넘겨 암바로 마무리"
      }
    ],
    "sources": [
      {
        "name": "jiujitsu.com 기술 페이지",
        "url": "https://jiujitsu.com/blogs/techniques/s-mount-armbar-setup-and-finish"
      },
      {
        "name": "Evolve MMA 블로그",
        "url": "https://evolve-mma.com/blog/how-to-perform-the-s-mount-in-bjj/"
      },
      {
        "name": "Gracie Barra 기술 글",
        "url": "https://graciebarra.com/gb-news/gb-technique-4-different-types-of-top-mount"
      }
    ]
  },
  {
    "id": "mt-crosschoke-armbar",
    "position": "MT",
    "name": "크로스 초크 미끼 · 암바 연계",
    "start": "기(도복) 마운트 탑에서 상대가 아직 팔을 몸에 붙이고 방어할 때",
    "end": "암바 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "MT-02",
        "role": "main",
        "note": "깊은 칼라 그립으로 크로스 초크를 위협해 상대 반응을 유도"
      },
      {
        "tech": "MT-01",
        "role": "if_blocked",
        "trigger": "상대가 초크 미끼에 반응해 팔을 잡고 업빠로 뒤집으려 하면",
        "note": "드러난 팔을 고립해 체중을 옮기며 암바"
      }
    ],
    "sources": [
      {
        "name": "Atos BJJ On Demand 입문 강좌",
        "url": "https://live.atosbjjondemand.com/packages/intro-jiu-jitsu/videos/intro-day-4-techniques-1-3"
      }
    ]
  },
  {
    "id": "mt-giftwrap-back-rnc",
    "position": "MT",
    "name": "기프트랩 · 백 테이크 · RNC 연계",
    "start": "마운트 탑에서 상대가 옆으로 몸을 돌리며 압박을 피하려 할 때",
    "end": "RNC 서브미션 (백 컨트롤)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "MT-11",
        "role": "main",
        "note": "상대 위쪽 팔을 목 뒤로 감아 손목을 잡고 기프트랩으로 고정한 뒤 돌아가는 방향을 따라 훅을 넣고 백을 잡는다"
      },
      {
        "tech": "BC-01",
        "role": "then",
        "note": "백 컨트롤에서 RNC로 마무리"
      }
    ],
    "sources": [
      {
        "name": "Evolve University 블로그",
        "url": "https://evolve-university.com/blog/how-to-use-the-gift-wrap-to-improve-your-bjj/"
      },
      {
        "name": "JitsuIQ 기프트랩 페이지",
        "url": "https://jitsuiq.com/positions/side-control/gift-wrap.html"
      },
      {
        "name": "BJJ Fanatics/Digitsu 태그 페이지",
        "url": "https://digitsu.com/t/gift-wrap"
      }
    ]
  },
  {
    "id": "mt-kimura-armbar",
    "position": "MT",
    "name": "마운트 기무라 · 암바 전환 연계",
    "start": "마운트 탑에서 상대가 두 팔을 가슴 앞이나 매트에 붙이고 버틸 때",
    "end": "암바 또는 기무라 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "MT-03",
        "role": "main",
        "note": "팔을 매트 쪽으로 눌러 피겨포 그립을 만들고 기무라를 시도"
      },
      {
        "tech": "MT-01",
        "role": "if_blocked",
        "trigger": "상대가 그립을 끊고 팔을 펴거나 밀어내면",
        "note": "팔이 펴진 쪽을 잡아 암바로 전환"
      }
    ],
    "sources": [
      {
        "name": "JitsuIQ 기무라 페이지",
        "url": "https://jitsuiq.com/submissions/locks/joint-locks/kimura.html"
      }
    ]
  },
  {
    "id": "mt-armbar-defended-backtake",
    "position": "MT",
    "name": "암바 방어 시 백 테이크 연계",
    "start": "마운트 암바를 시도했는데 상대가 팔꿈치를 굽혀 팔을 빼려 할 때",
    "end": "백 컨트롤 (포지션 전환)",
    "grade": "참고",
    "steps": [
      {
        "tech": "MT-01",
        "role": "main",
        "note": "S-마운트나 마운트에서 암바 시도"
      },
      {
        "tech": "MT-10",
        "role": "if_blocked",
        "trigger": "상대가 팔을 빼며 옆으로 돌아 등을 보이면",
        "note": "무릎을 등 밑으로 넣어 훅을 걸며 백을 잡는다"
      }
    ],
    "sources": [
      {
        "name": "Graciemag (Marcos Giusti)",
        "url": "https://www.graciemag.com/overcome-the-armbar-defense-with-a-transition-to-the-back-with-marcos-giusti/"
      }
    ]
  },
  {
    "id": "mt-basic-control-technical-mount",
    "position": "MT",
    "name": "마운트 압박 · 기술적 마운트 · 백 테이크 연계",
    "start": "마운트 기본 컨트롤에서 상대가 브릿지로 몸을 옆으로 돌리려 할 때",
    "end": "백 컨트롤",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "MT-20",
        "role": "main",
        "note": "머리와 팔을 앞으로 보내 힙을 낮추고 체중을 가슴에 실어 브릿지를 막는다"
      },
      {
        "tech": "MT-22",
        "role": "if_blocked",
        "trigger": "상대가 브릿지나 새우로 몸을 옆으로 돌리면",
        "note": "머리 쪽 무릎을 어깨에 붙이고 반대 발을 골반 옆에 짚어 기술적 마운트로 전환"
      },
      {
        "tech": "MT-10",
        "role": "transition",
        "note": "가슴을 등에 붙인 채 따라가 훅을 넣어 백 컨트롤을 만든다"
      }
    ],
    "sources": [
      {
        "name": "Digitsu (기술적 마운트)",
        "url": "https://digitsu.com/t/technical-mount"
      },
      {
        "name": "JitsuIQ (기술적 마운트)",
        "url": "https://jitsuiq.com/positions/mount/technical-mount.html"
      },
      {
        "name": "Evolve MMA",
        "url": "https://evolve-mma.com/blog/the-technical-mount-in-bjj-explained/"
      }
    ]
  },
  {
    "id": "mt-armbar-mountedtriangle",
    "position": "MT",
    "name": "S-마운트 암바 · 마운트 삼각초크 연계",
    "start": "마운트에서 S-마운트로 팔을 고립해 암바를 시도할 때",
    "end": "마운트 삼각초크",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "MT-05",
        "role": "main",
        "note": "S-마운트에서 먼 쪽 팔을 고립하고 암바를 시도"
      },
      {
        "tech": "MT-13",
        "role": "if_blocked",
        "trigger": "상대가 암바를 막으려 팔을 빼 방어하면",
        "note": "다리를 목 아래로 넣고 반대 다리를 걸어 팔과 목을 함께 가두는 삼각초크로 전환"
      }
    ],
    "sources": [
      {
        "name": "BJJEE (Andre Galvao 영상 소개)",
        "url": "https://www.bjjee.com/articles/andre-galvaos-sneaky-s-mount-triangle-trap/"
      },
      {
        "name": "JitsuIQ (마운트 삼각)",
        "url": "https://jitsuiq.com/submissions/chokes/mounted-triangle.html"
      }
    ]
  },
  {
    "id": "mt-americana-armbar",
    "position": "MT",
    "name": "아메리카나 · 암바 · 기무라 연계 (마운트)",
    "start": "마운트 탑에서 상대가 가슴을 밀거나 팔로 프레임을 만들 때",
    "end": "아메리카나/암바/기무라 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "MT-12",
        "role": "main",
        "note": "먼 쪽 손목을 매트에 누르고 팔 아래로 팔을 넣어 피겨포를 만든 뒤 아메리카나"
      },
      {
        "tech": "MT-01",
        "role": "if_blocked",
        "trigger": "상대가 아메리카나를 막으려 팔을 곧게 펴면",
        "note": "손목과 팔꿈치 컨트롤을 유지한 채 팔을 따라가 마운트 암바로 전환"
      },
      {
        "tech": "MT-03",
        "role": "if_blocked",
        "trigger": "상대가 팔을 바깥으로 돌리거나 도복/벨트를 잡아 팔을 숨기면",
        "note": "기무라 그립으로 바꿔 어깨를 공격"
      }
    ],
    "sources": [
      {
        "name": "JitsuIQ (아메리카나)",
        "url": "https://jitsuiq.com/submissions/locks/joint-locks/americana.html"
      },
      {
        "name": "NAGA Fighter",
        "url": "https://www.nagafighter.com/what-is-the-americana-in-bjj"
      },
      {
        "name": "Digitsu (아메리카나 컨트롤)",
        "url": "https://digitsu.com/t/americana-control"
      }
    ]
  },
  {
    "id": "ns-kimura-armbar",
    "position": "NS",
    "name": "노스-사우스 기무라 · 암바 전환",
    "start": "노스-사우스 탑에서 상대 팔을 기무라 그립으로 잡았는데 피니시가 안 될 때",
    "end": "암바 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "NS-02",
        "role": "main",
        "note": "상대가 팔을 두르면 가두고 노스-사우스로 이동해 어깨뼈 쪽으로 낮게 끌어 기무라"
      },
      {
        "tech": "NS-03",
        "role": "if_blocked",
        "trigger": "상대가 팔을 몸에 붙여 기무라가 안 되면",
        "note": "기무라 그립을 유지한 채 상대 반대편까지 이동해 암바 마무리"
      }
    ],
    "sources": [
      {
        "name": "Atos BJJ OnDemand - Intro Day 17 (Galvao 커리큘럼)",
        "url": "https://live.atosbjjondemand.com/videos/intro-day-17-techniques-1-3"
      },
      {
        "name": "Grapplearts (Stephan Kesting) - North South Kimura",
        "url": "https://www.grapplearts.com/the-north-south-kimura-armlock/"
      },
      {
        "name": "Jitsu IQ - North South",
        "url": "https://jitsuiq.com/positions/mount/north-south.html"
      }
    ]
  },
  {
    "id": "ns-kimura-backtake",
    "position": "NS",
    "name": "노스-사우스 기무라 · 백 테이크 (기무라 방어가 강할 때)",
    "start": "노스-사우스 탑에서 기무라를 걸었는데 상대가 그립을 끊고 강하게 버틸 때",
    "end": "백 컨트롤 (이후 초크)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "NS-02",
        "role": "main",
        "note": "기무라 그립을 고정해 상대를 노스-사우스에서 묶음"
      },
      {
        "tech": "NS-12",
        "role": "if_blocked",
        "trigger": "상대가 기무라 방어 그립을 풀지 않고 버티면",
        "note": "그립을 놓지 않은 채 상대 등 쪽으로 이동해 백을 잡음(이후 크로스 칼라 초크로 연결 가능)"
      }
    ],
    "sources": [
      {
        "name": "Graciemag - Roger Gracie, kimura에서 초크로 (Dojjo 레슨)",
        "url": "https://www.graciemag.com/video-roger-gracie-teaches-a-choke-starting-from-the-kimura/"
      },
      {
        "name": "Grapplearts (Stephan Kesting) - North South Kimura",
        "url": "https://www.grapplearts.com/the-north-south-kimura-armlock/"
      },
      {
        "name": "Digitsu - Kimura Trap",
        "url": "https://digitsu.com/t/kimura-trap"
      }
    ]
  },
  {
    "id": "ns-choke-turn-backtake",
    "position": "NS",
    "name": "노스-사우스 초크 · 돌아 도망가는 상대 백 테이크",
    "start": "노스-사우스 탑에서 초크를 시도하는데 상대가 몸을 돌려 피할 때",
    "end": "백 컨트롤",
    "grade": "참고",
    "steps": [
      {
        "tech": "NS-01",
        "role": "main",
        "note": "어깨와 팔로 목을 감싸고 상체에 체중을 실어 초크 시도"
      },
      {
        "tech": "NS-12",
        "role": "if_blocked",
        "trigger": "상대가 초크를 피하려고 옆으로 돌아 등을 보이면",
        "note": "움직임을 따라가 훅을 넣고 백 컨트롤로 이동"
      }
    ],
    "sources": [
      {
        "name": "Jitsu IQ - North South",
        "url": "https://jitsuiq.com/positions/mount/north-south.html"
      },
      {
        "name": "Digitsu - North-South",
        "url": "https://digitsu.com/t/north-south"
      }
    ]
  },
  {
    "id": "ns-tkimura-crucifix-back",
    "position": "NS",
    "name": "T-기무라 · 크루시픽스로 백 테이크",
    "start": "노스-사우스 탑에서 기무라 그립으로 상대 팔을 제어한 상태",
    "end": "크루시픽스 컨트롤 또는 백 컨트롤",
    "grade": "참고",
    "steps": [
      {
        "tech": "NS-02",
        "role": "main",
        "note": "기무라 그립 유지로 팔을 고립"
      },
      {
        "tech": "NS-21",
        "role": "then",
        "note": "다리로 상대 팔을 가두는 크루시픽스 컨트롤을 만들어 백을 노림"
      }
    ],
    "sources": [
      {
        "name": "Damien BJJ Online 코스 목차 (검색 요약)",
        "url": "https://bjjdamienonline.teachable.com/courses/1864515/lectures/43108905"
      }
    ]
  },
  {
    "id": "ns-control-mount",
    "position": "NS",
    "name": "노스-사우스 컨트롤 · 마운트 전환",
    "start": "노스-사우스 컨트롤에서 상대를 눌러 움직임을 제한했을 때",
    "end": "마운트",
    "grade": "참고",
    "steps": [
      {
        "tech": "NS-20",
        "role": "main",
        "note": "다리를 뒤로 뻗고 체중을 가슴에 실어 상대 팔과 엉덩이를 제한"
      },
      {
        "tech": "NS-11",
        "role": "transition",
        "note": "무릎 하나를 상대 몸통 위로 넘겨 마운트를 잡음"
      }
    ],
    "sources": [
      {
        "name": "Jitsu IQ - North South",
        "url": "https://jitsuiq.com/positions/mount/north-south.html"
      },
      {
        "name": "Digitsu - North-South",
        "url": "https://digitsu.com/t/north-south"
      }
    ]
  },
  {
    "id": "rdlr-kiss-of-the-dragon",
    "position": "RDLR",
    "name": "리버스 데라리바 · 키스 오브 더 드래곤 백 테이크",
    "start": "리버스 데라리바에서 상대 발을 잡고 거리를 유지하며 상대가 앞으로 나올 때",
    "end": "백 포지션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "RDLR-20",
        "role": "main",
        "note": "RDLR 훅과 발 그립으로 거리를 만들고, 엉덩이를 띄워 다리 아래로 깊은 그립 확보. 상대를 당겨 앞으로 한 발 나오게 유도"
      },
      {
        "tech": "RDLR-21",
        "role": "then",
        "note": "상대 무릎 뒤를 프레임하고 아래로 스핀해 반대편으로 빠져나온 뒤 두 번째 훅을 넣어 엉덩이를 당겨 등을 공략"
      }
    ],
    "sources": [
      {
        "name": "Mason Fowler (Digitsu 'Cold Blooded Half Guard' 코스)",
        "url": "https://digitsu.com/v/reverse-de-la-riva-kiss-of-the-dragon-mason-fowler"
      },
      {
        "name": "Grapplearts (Stephan Kesting 계열) - Arm Drag from Reverse de la Riva",
        "url": "https://www.grapplearts.com/arm-drag-from-reverse-de-la-riva-guard-simple-and-effective/"
      },
      {
        "name": "Jitsu IQ - Reverse De La Riva",
        "url": "https://jitsuiq.com/positions/guard/reverse-de-la-riva.html"
      }
    ]
  },
  {
    "id": "rdlr-armbar-omoplata",
    "position": "RDLR",
    "name": "언더훅 방어를 노린 플랫폼 암바 · 오모플라타",
    "start": "리버스 데라리바에서 상대가 언더훅을 파고들려 손을 뻗을 때",
    "end": "오모플라타 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "RDLR-13",
        "role": "main",
        "note": "상대가 언더훅을 파고들려 손을 뻗으면 몸이 끌려가지 않게 유지하고 팔꿈치를 C그립으로 잡아, 한 발은 골반 한 발은 등에 걸어 플랫폼 암바 시도"
      },
      {
        "tech": "RDLR-11",
        "role": "if_blocked",
        "trigger": "상대가 어깨를 아래로 돌려 암바를 피하면",
        "note": "즉시 오모플라타로 전환: 발을 포개 얼굴 쪽을 밀어 무너뜨리고 팔꿈치를 닫은 채 등을 통제"
      }
    ],
    "sources": [
      {
        "name": "Seph Smith (Digitsu 'Reverse De La Riva Almanac' 코스)",
        "url": "https://digitsu.com/v/platform-arm-bar-omoplata-seph-smith"
      },
      {
        "name": "Jitsu IQ - Reverse De La Riva",
        "url": "https://jitsuiq.com/positions/guard/reverse-de-la-riva.html"
      }
    ]
  },
  {
    "id": "rdlr-legdrag",
    "position": "RDLR",
    "name": "리버스 X를 거쳐 레그 드래그 탑 올라가기",
    "start": "리버스 데라리바에서 상대 무릎 뒤와 다리를 잡고 훅을 넣을 수 있을 때",
    "end": "레그 드래그 탑 포지션",
    "grade": "참고",
    "steps": [
      {
        "tech": "RDLR-20",
        "role": "main",
        "note": "무릎 뒤와 근접 다리를 잡아 훅을 넣고, 자기 정강이를 잡아 상대가 인버전을 막기 어려운 각도를 만든다"
      },
      {
        "tech": "RDLR-02",
        "role": "then",
        "note": "발을 골반에 걸고 엉덩이를 띄워 반대쪽 햄스트링을 당겨 리버스 X로 이동, 상대를 앉힌 뒤 아래 훅을 빼고 머리를 가슴에 박으며 올라와 레그 드래그 포지션 확보"
      }
    ],
    "sources": [
      {
        "name": "Jason Rau (Digitsu 'Reverse De La Riva' 코스) - Leg Drag",
        "url": "https://digitsu.com/v/leg-drag-jason-rau"
      },
      {
        "name": "Bruno Frazatto (Digitsu) - Reverse De la Riva Leg Circle Leg Drag",
        "url": "https://digitsu.com/v/reverse-de-la-riva-leg-circle-leg-drag-bruno-frazatto"
      }
    ]
  },
  {
    "id": "rdlr-sweep-chain",
    "position": "RDLR",
    "name": "RDLR 백롤/백워드 스윕 (들어올려 반응 이용)",
    "start": "리버스 데라리바에서 칼라/소매 또는 팔 그립이 확보되고 상대가 체중을 되돌리려 할 때",
    "end": "탑 포지션",
    "grade": "참고",
    "steps": [
      {
        "tech": "RDLR-20",
        "role": "main",
        "note": "팔 그립과 훅으로 연결을 유지하며 상대를 한쪽으로 들어올려 반응을 유도"
      },
      {
        "tech": "RDLR-01",
        "role": "then",
        "note": "상대가 체중을 되돌리면 다시 들어올리고, 반응에 맞춰 팔/다리를 컨트롤한 채 스윕. 올라온 뒤 팔 컨트롤(기무라 그립)이나 패스로 연결"
      }
    ],
    "sources": [
      {
        "name": "Lucas Lepri (Digitsu 'No-Gi Master Series')",
        "url": "https://digitsu.com/v/reverse-de-la-riva-backwards-sweep-lucas-lepri"
      },
      {
        "name": "Seph Smith (Digitsu 'Reverse De La Riva Almanac' 코스) - Back Roll Sweep",
        "url": "https://digitsu.com/v/reverse-de-la-riva-back-roll-sweep-kimura-seph-smith"
      },
      {
        "name": "Jitsu IQ - Reverse De La Riva",
        "url": "https://jitsuiq.com/positions/guard/reverse-de-la-riva.html"
      }
    ]
  },
  {
    "id": "rdlr-berimbolo-roll",
    "position": "RDLR",
    "name": "RDLR 언더훅 · 베림볼로 백 테이크",
    "start": "리버스 데라리바에서 상대와 거리를 유지하며 언더훅을 만들 수 있을 때",
    "end": "백 포지션",
    "grade": "참고",
    "steps": [
      {
        "tech": "RDLR-20",
        "role": "main",
        "note": "한 발을 상대 어깨나 골반에 플렉스해 걸어 거리를 유지하고, 칼라를 잡아 끌어당기지 말고 한 팔 언더훅과 반대 손 가슴 포스트로 컨트롤"
      },
      {
        "tech": "RDLR-22",
        "role": "then",
        "note": "상대 밑으로 스핀해 상대 다리를 반대 손으로 넘기고 벨트를 잡은 채 등 쪽으로 롤. 가슴을 등에 붙이고 시트벨트 후 양발 훅"
      }
    ],
    "sources": [
      {
        "name": "Digitsu(Gianni Grippo)",
        "url": "https://digitsu.com/v/rdlr-to-berimbolo-gianni-grippo"
      },
      {
        "name": "Jitsu IQ - Reverse De La Riva",
        "url": "https://jitsuiq.com/positions/guard/reverse-de-la-riva.html"
      }
    ]
  },
  {
    "id": "rdlr-to-slx",
    "position": "RDLR",
    "name": "리버스 데라리바에서 싱글 레그 X로 전환",
    "start": "리버스 데라리바에서 상대가 앞다리를 세우거나 다가와 압박할 때",
    "end": "싱글 레그 X 포지션 (이후 SLX 콤보 참고)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "RDLR-20",
        "role": "main",
        "note": "칼라를 잡아 당기지 말고 손으로 가슴을 밀고 발을 골반/어깨에 올려 거리를 유지. 상대가 깊게 들어오지 못하게 하면서 체중을 뒤쪽 다리로 몰아준다"
      },
      {
        "tech": "RDLR-25",
        "role": "transition",
        "note": "RDLR 훅으로 가까운 다리를 들어 올려 상대 체중을 뒷다리로 보내고 반대 발을 다리 사이로 넣어 싱글 레그 X. 상대가 손을 짚으면 발목이 아니라 뒤꿈치를 잡아 겨드랑이로 끌어당긴다"
      }
    ],
    "sources": [
      {
        "name": "Digitsu(Gianni Grippo)",
        "url": "https://digitsu.com/v/slx-entry-from-rdlr-gianni-grippo"
      },
      {
        "name": "Digitsu(Adam Benayoun)",
        "url": "https://digitsu.com/v/entries-reverse-de-la-riva-adam-benayoun"
      }
    ]
  },
  {
    "id": "rdlr-scissor-sweep",
    "position": "RDLR",
    "name": "RDLR 2-on-1 그립 · 시저 스윕",
    "start": "칼라 소매 리버스 데라리바에서 상대가 내 칼라를 잡으러 손을 뻗을 때",
    "end": "탑 포지션(마운트)",
    "grade": "참고",
    "steps": [
      {
        "tech": "RDLR-20",
        "role": "main",
        "note": "RDLR 훅으로 거리를 유지하며 상대가 칼라를 잡으러 손을 뻗도록 둔다"
      },
      {
        "tech": "RDLR-04",
        "role": "then",
        "note": "상대 먼 팔을 솔기를 잡아 2-on-1 그립으로 바꾸고, 팔 안쪽 발을 스파이더 훅처럼 무릎에 걸어 발가락을 말아 쥔다. 다리 힘만 쓰지 말고 가슴을 바닥 쪽으로 돌리며 팔을 당겨 스윕하고, 올라올 때 상대 발뒤꿈치를 걸어 마운트로 올라간다"
      }
    ],
    "sources": [
      {
        "name": "Digitsu(Seph Smith)",
        "url": "https://digitsu.com/v/reverse-de-la-riva-2-on-1-grip-scissor-sweep-seph-smith"
      }
    ]
  },
  {
    "id": "sc-kimura-armbar",
    "position": "SC",
    "name": "기무라 · 암바 연계 (팔을 펴고 버틸 때)",
    "start": "사이드 컨트롤 탑에서 상대의 팔을 기무라 그립으로 잡았을 때",
    "end": "암바 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "SC-01",
        "role": "main",
        "note": "손목을 엉덩이 쪽으로 누르고 팔꿈치를 들어 올려 기무라 그립을 단단히 확보"
      },
      {
        "tech": "SC-02",
        "role": "if_blocked",
        "trigger": "상대가 기무라를 버텨 그립이 쉽게 끊기지 않고 굴러 도망가지도 않으면",
        "note": "그립을 유지한 채 다리를 상대 머리 위로 넘겨 암바로 전환"
      }
    ],
    "sources": [
      {
        "name": "Kristina Barlaan (Digitsu, 블랙벨트 강사)",
        "url": "https://digitsu.com/v/kimura-arm-lock-kristina-barlaan"
      },
      {
        "name": "Lachlan Giles (Awesome Jiu Jitsu 정리 글)",
        "url": "https://awesomejiujitsu.com/2019/05/07/side-control-kimura-options-from-lachlan-giles/"
      },
      {
        "name": "Grapplearts (Stephan Kesting)",
        "url": "https://www.grapplearts.com/two-powerful-armbars-from-side-control/"
      }
    ]
  },
  {
    "id": "sc-kimura-backtake",
    "position": "SC",
    "name": "기무라 그립 · 백 테이크",
    "start": "사이드 컨트롤 탑에서 가까운 쪽 팔 기무라 그립을 잡은 상태",
    "end": "백 포지션 (이후 BC-01 등으로 연계 가능)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "SC-01",
        "role": "main",
        "note": "팔꿈치를 들어 올려 기무라 그립으로 상대 움직임을 제한"
      },
      {
        "tech": "SC-11",
        "role": "transition",
        "note": "그립이 풀리지 않도록 유지하며 상대의 등 쪽으로 이동해 백을 잡음"
      }
    ],
    "sources": [
      {
        "name": "Lachlan Giles (Awesome Jiu Jitsu 정리 글)",
        "url": "https://awesomejiujitsu.com/2019/05/07/side-control-kimura-options-from-lachlan-giles/"
      },
      {
        "name": "Grapplearts 기무라 포지션 체크리스트",
        "url": "https://www.grapplearts.com/wp-content/uploads/2025/10/The-Kimura-Position-Cheatsheet.pdf"
      }
    ]
  },
  {
    "id": "sc-frame-spinning-armbar",
    "position": "SC",
    "name": "프레임 방어를 이용한 스피닝 암바",
    "start": "사이드 컨트롤 탑에서 상대가 팔로 엉덩이/목을 밀며 프레임을 만들 때",
    "end": "암바 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "SC-20",
        "role": "main",
        "note": "가슴 밀착, 무릎을 상대 엉덩이 가까이 두고 압박 유지"
      },
      {
        "tech": "SC-05",
        "role": "then",
        "note": "뻗은 팔을 고립한 뒤 무릎을 모아 돌며 팔 쪽으로 스텝오버해 암바 마무리"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (Stephan Kesting) - armbar attacks from side control",
        "url": "https://www.grapplearts.com/ambar-attacks-from-side-control/"
      },
      {
        "name": "Bernardo Faria Academy (Demian Maia 사이드 암바 교정)",
        "url": "https://bernardofariaacademy.com/all-articles/fix-side-control-armbar-demian-maia/"
      }
    ]
  },
  {
    "id": "sc-underhook-marcelo-armbar",
    "position": "SC",
    "name": "먼 쪽 언더훅 마르셀로 암바",
    "start": "사이드 컨트롤 탑에서 상대의 먼 쪽 팔에 언더훅을 얻었을 때",
    "end": "암바 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "SC-20",
        "role": "main",
        "note": "먼 쪽 팔 언더훅을 확보하고 상대를 옆으로 당겨 팔꿈치로 배 앞을 막아 고정"
      },
      {
        "tech": "SC-02",
        "role": "then",
        "note": "윗다리를 상대 팔과 갈비뼈 사이로 넣고 옆으로 누워 다리 방향을 보며 암바 마무리"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (Stephan Kesting, Marcelo Garcia에게 배운 기술)",
        "url": "https://www.grapplearts.com/two-powerful-armbars-from-side-control/"
      }
    ]
  },
  {
    "id": "sc-arm-triangle",
    "position": "SC",
    "name": "사이드 컨트롤 암 트라이앵글",
    "start": "사이드 컨트롤 탑에서 상대 팔이 얼굴/목 쪽으로 올라와 있을 때",
    "end": "초크 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "SC-20",
        "role": "main",
        "note": "상대 팔을 얼굴 쪽으로 밀어 넘기고 체중을 실어 고정"
      },
      {
        "tech": "SC-04",
        "role": "then",
        "note": "가둔 팔의 반대쪽으로 몸을 옮겨 각도를 만들고 천천히 체중을 실어 조름"
      }
    ],
    "sources": [
      {
        "name": "Jitsu IQ",
        "url": "https://jitsuiq.com/submissions/chokes/arm-triangle.html"
      },
      {
        "name": "BJJ Ee",
        "url": "https://www.bjjee.com/?p=11098"
      }
    ]
  },
  {
    "id": "sc-backtake-rnc",
    "position": "SC",
    "name": "사이드 컨트롤 백 테이크 · 리어 네이키드 초크",
    "start": "사이드 컨트롤 탑에서 상대가 등을 돌려 탈출하려 할 때",
    "end": "RNC 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "SC-11",
        "role": "transition",
        "note": "엉덩이 움직임을 팔꿈치로 제한하고 뒤쪽에서 압박해 상대를 앉히며 백으로 이동"
      },
      {
        "tech": "BC-01",
        "role": "then",
        "note": "시트벨트로 백을 확보한 뒤 리어 네이키드 초크로 마무리"
      }
    ],
    "sources": [
      {
        "name": "Rafael Gordinho (Graciemag, 블랙벨트)",
        "url": "https://www.graciemag.com/rafael-gordinho-a-transition-from-side-control-to-the-rear-naked-choke/"
      },
      {
        "name": "Kristina Barlaan (Digitsu) - Side Control Back Take",
        "url": "https://digitsu.com/v/side-control-back-take-kristina-barlaan"
      }
    ]
  },
  {
    "id": "sc-mount-smount-armbar",
    "position": "SC",
    "name": "사이드 컨트롤 · 마운트 · S-마운트 암바",
    "start": "사이드 컨트롤 탑에서 상대 엉덩이를 돌려 마운트 진입이 가능할 때",
    "end": "암바 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "SC-10",
        "role": "transition",
        "note": "엉덩이로 상대 엉덩이를 누르다 상대가 밀어내는 순간 마운트로 진입, 높은 마운트로 마무리"
      },
      {
        "tech": "MT-05",
        "role": "then",
        "note": "초크 위협으로 반응을 유도하고 먼 쪽 팔을 고립해 S-마운트로 돌며 암바"
      }
    ],
    "sources": [
      {
        "name": "Josh Griffiths (Jiujitsu.com)",
        "url": "https://jiujitsu.com/blogs/techniques/s-mount-armbar-setup-and-finish"
      }
    ]
  },
  {
    "id": "sc-americana-armbar",
    "position": "SC",
    "name": "아메리카나 · 암바 · 기무라 연계 (팔 트랩 시리즈)",
    "start": "사이드 컨트롤 탑에서 먼 쪽 팔의 손목을 매트에 눌러 고정했을 때",
    "end": "아메리카나/암바/기무라 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "SC-12",
        "role": "main",
        "note": "손목을 매트에 누르고 팔꿈치 아래로 팔을 넣어 피겨포를 만든 뒤 아메리카나"
      },
      {
        "tech": "SC-02",
        "role": "if_blocked",
        "trigger": "상대가 아메리카나를 막으며 팔을 곧게 펴면",
        "note": "피겨포를 풀고 이두를 잡아 팔을 따라가 암바로 전환"
      },
      {
        "tech": "SC-01",
        "role": "if_blocked",
        "trigger": "암바 중 상대가 팔을 아래로 돌려 팔꿈치를 몸에 붙이면",
        "note": "그립을 바꿔 손 아래로 넣어 기무라로 전환"
      }
    ],
    "sources": [
      {
        "name": "Evolve University",
        "url": "https://evolve-university.com/blog/basic-bjj-combinations-arm-trap-series-from-side-control/"
      },
      {
        "name": "JitsuIQ (아메리카나)",
        "url": "https://jitsuiq.com/submissions/locks/joint-locks/americana.html"
      },
      {
        "name": "NAGA Fighter",
        "url": "https://www.nagafighter.com/what-is-the-americana-in-bjj"
      }
    ]
  },
  {
    "id": "sc-kimura-americana",
    "position": "SC",
    "name": "기무라 · 아메리카나 전환 (상대가 팔을 당길 때)",
    "start": "사이드 컨트롤 탑에서 상대 팔을 기무라로 컨트롤할 때",
    "end": "아메리카나 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "SC-01",
        "role": "main",
        "note": "손목을 컨트롤하고 체중을 실어 팔꿈치를 들어 기무라 시도"
      },
      {
        "tech": "SC-12",
        "role": "if_blocked",
        "trigger": "상대가 팔을 몸 쪽으로 당겨 빼려 하면",
        "note": "손등을 매트에 두고 재빨리 그립을 바꿔 팔꿈치를 들어 아메리카나로 마무리"
      }
    ],
    "sources": [
      {
        "name": "Digitsu (Kristina Barlaan)",
        "url": "https://digitsu.com/v/kimura-arm-lock-americana-kristina-barlaan"
      },
      {
        "name": "NAGA Fighter",
        "url": "https://www.nagafighter.com/what-is-the-americana-in-bjj"
      },
      {
        "name": "Digitsu (아메리카나 컨트롤)",
        "url": "https://digitsu.com/t/americana-control"
      }
    ]
  },
  {
    "id": "sg-heelhook-backside5050",
    "position": "SG",
    "name": "새들 인사이드 힐훅 · 힙턴 탈출 대응 백사이드 50/50 전환",
    "start": "새들(411)에서 상대의 보조 다리까지 제어해 인사이드 힐훅을 노릴 때",
    "end": "백사이드 50/50(힐훅 지속) - 50/50 계열 포지션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "SG-20",
        "role": "main",
        "note": "무릎을 모아 상대 다리를 가두고 보조 다리 제어(더블 트러블)로 먼저 안정화"
      },
      {
        "tech": "SG-10",
        "role": "then",
        "note": "숏건 그립으로 발끝을 젖혀 힐을 노출한 뒤 힐훅 마무리 시도"
      },
      {
        "tech": "SG-24",
        "role": "if_blocked",
        "trigger": "상대가 힙을 돌려 무릎을 빼내며(니라인 클리어) 새들을 풀려 하면",
        "note": "새들을 고집하지 말고 몸을 돌려 백사이드 50/50으로 진입해 힐훅 공격을 이어감(새들→백사이드 50/50 진입 기술)"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (Stephan Kesting) - 411 포지션 힐훅 마스터클래스",
        "url": "https://www.grapplearts.com/a-masterclass-on-finishing-the-heel-hook-from-the-411-position"
      },
      {
        "name": "Dan Jonaher - 무수메시 레그락 분석 글",
        "url": "https://danjonaher.substack.com/p/mikey-musumeci-and-the-art-of-leg-locks"
      },
      {
        "name": "Digitsu - Saddle Defense (기술 설명)",
        "url": "https://digitsu.com/t/saddle-defense"
      }
    ]
  },
  {
    "id": "sg-heelhook-sweep-top",
    "position": "SG",
    "name": "새들 힐 노출 실패 시 스윕/탑 포지션 전환",
    "start": "새들에서 상대가 일어서거나 발을 숨겨 힐을 잡기 어려울 때",
    "end": "탑 포지션 (스윕/히스트로 가드 패스 자세)",
    "grade": "참고",
    "steps": [
      {
        "tech": "SG-20",
        "role": "main",
        "note": "보조 다리를 잡아 더블 트러블을 만들고 서두르지 않고 힐 노출을 시도"
      },
      {
        "tech": "SG-10",
        "role": "then",
        "note": "숏건 그립 후 팔꿈치로 눌러 힐을 잡는 시도"
      },
      {
        "tech": "SG-02",
        "role": "if_blocked",
        "trigger": "상대가 서 있거나 발을 숨겨 힐이 노출되지 않으면",
        "note": "엔탱글먼트를 유지한 채 스윕으로 탑을 확보"
      }
    ],
    "sources": [
      {
        "name": "Dan Jonaher - 무수메시 레그락 분석 글",
        "url": "https://danjonaher.substack.com/p/mikey-musumeci-and-the-art-of-leg-locks"
      },
      {
        "name": "Living As A Grappler (Robert Diggle 세미나 정리)",
        "url": "https://livingasagrappler.substack.com/p/leg-lock-everyone-with-this-system"
      }
    ]
  },
  {
    "id": "sg-kneebar-heelhook-dilemma",
    "position": "SG",
    "name": "새들 니바 · 힐훅 딜레마",
    "start": "새들에서 상대 다리가 펴져 있고 무릎 라인이 잡힌 상태",
    "end": "힐훅 서브미션 (상대가 다시 다리를 펴면 니바로 복귀)",
    "grade": "참고",
    "steps": [
      {
        "tech": "SG-12",
        "role": "main",
        "note": "힙을 상대 무릎에 붙이고 다리를 펴서 니바 압박"
      },
      {
        "tech": "SG-10",
        "role": "if_blocked",
        "trigger": "상대가 니바를 피하려 무릎을 굽히거나 발을 빼려 하면",
        "note": "드러난 힐을 양손으로 컵 그립해 인사이드 힐훅으로 전환"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Heel Hook Dilemma (기술 설명)",
        "url": "https://digitsu.com/t/heel-hook-dilemma"
      },
      {
        "name": "Digitsu - Cross Ashi Garami (기술 설명)",
        "url": "https://digitsu.com/t/cross-ashi-garami"
      }
    ]
  },
  {
    "id": "sg-backtake-no-secondary",
    "position": "SG",
    "name": "새들 보조 다리 없이 상대가 돌 때 백 테이크",
    "start": "새들이지만 보조 다리를 잡지 못했고 상대가 힐을 숨기며 몸을 안쪽으로 돌릴 때",
    "end": "백 포지션",
    "grade": "참고",
    "steps": [
      {
        "tech": "SG-20",
        "role": "main",
        "note": "새들 컨트롤 유지, 상대 반응을 읽음"
      },
      {
        "tech": "SG-23",
        "role": "if_blocked",
        "trigger": "상대가 힐을 숨기려 몸 전체를 안쪽으로 돌려 등이 노출되면",
        "note": "위쪽 다리를 빼고 일어나 상대를 따라가 백을 잡음"
      }
    ],
    "sources": [
      {
        "name": "Living As A Grappler (Robert Diggle 세미나 정리)",
        "url": "https://livingasagrappler.substack.com/p/leg-lock-everyone-with-this-system"
      },
      {
        "name": "Digitsu - Saddle Defense (기술 설명)",
        "url": "https://digitsu.com/t/saddle-defense"
      }
    ]
  },
  {
    "id": "sg-inside-outside-heelhook",
    "position": "SG",
    "name": "새들 인사이드 힐훅 · 아웃사이드 힐훅 전환",
    "start": "새들에서 인사이드 힐 그립은 잡았으나 상대가 발끝을 바깥으로 돌려 막을 때",
    "end": "힐훅 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "SG-10",
        "role": "main",
        "note": "인사이드 힐 그립으로 마무리 시도"
      },
      {
        "tech": "SG-11",
        "role": "if_blocked",
        "trigger": "상대가 발의 방향을 바꾸거나 보조 다리 제어를 못 얻어 인사이드 마무리가 막히면",
        "note": "다리를 중심선 반대로 넘겨 아웃사이드 힐훅으로 전환"
      }
    ],
    "sources": [
      {
        "name": "Living As A Grappler (Robert Diggle 세미나 정리)",
        "url": "https://livingasagrappler.substack.com/p/leg-lock-everyone-with-this-system"
      },
      {
        "name": "Digitsu - Cross Ashi Garami (기술 설명)",
        "url": "https://digitsu.com/t/cross-ashi-garami"
      },
      {
        "name": "BJJ More - The Saddle by Lachlan Giles 리뷰",
        "url": "https://bjjmore.com/the-saddle-lachlan-giles/"
      }
    ]
  },
  {
    "id": "sg-heel-calfslicer-kneebar",
    "position": "SG",
    "name": "새들 힐 공격 정체 시 카프 슬라이서 · 다리를 펴면 니바",
    "start": "새들에서 인사이드 힐훅을 시도했으나 상대가 무릎 라인을 풀며 몸을 돌리거나 발을 숨길 때",
    "end": "카프 슬라이서 또는 니바 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "SG-10",
        "role": "main",
        "note": "보조 다리를 제어한 채 인사이드 힐 그립으로 마무리 시도"
      },
      {
        "tech": "SG-14",
        "role": "if_blocked",
        "trigger": "상대가 발을 숨기고 무릎을 굽힌 채 돌아 힐이 노출되지 않으면",
        "note": "정강이를 오금 깊이 넣고 발을 엉덩이 쪽으로 당겨 카프 슬라이서로 압박"
      },
      {
        "tech": "SG-12",
        "role": "if_blocked",
        "trigger": "상대가 압박을 풀려고 다리를 펴면",
        "note": "펴진 다리를 그대로 니바로 전환"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - Calf Slicer (기술 설명)",
        "url": "https://digitsu.com/t/calf-slicer"
      },
      {
        "name": "Digitsu - Cross Ashi Garami (기술 설명)",
        "url": "https://digitsu.com/t/cross-ashi-garami"
      },
      {
        "name": "Dan Jonaher - 무수메시 레그락 분석 글",
        "url": "https://danjonaher.substack.com/p/mikey-musumeci-and-the-art-of-leg-locks"
      }
    ]
  },
  {
    "id": "slx-situp-sweep-anklelock",
    "position": "SLX",
    "name": "싱글 레그 X 힙범프(싯업) 스윕 · 앵클락",
    "start": "싱글 레그 X가드를 만들고 상대 발목을 겨드랑이/가슴에 끼운 상태",
    "end": "스트레이트 앵클락 서브미션 (또는 스윕 성공 시 탑 포지션)",
    "grade": "참고",
    "steps": [
      {
        "tech": "SLX-01",
        "role": "main",
        "note": "발목을 몸에 고정하고 다리를 모아 엉덩이를 최대한 띄운 뒤 상대 무릎 쪽으로 돌려 넘기고 일어남"
      },
      {
        "tech": "SLX-10",
        "role": "then",
        "note": "스윕으로 상대가 쓰러지면 오버훅 팔뚝을 아킬레스건에 걸고 허리를 아치로 당겨 앵클락. 스윕이 막혀 서 있으면 상대의 밀어붙이는 힘을 따라 몸을 돌려 배로 엎드린 앵클락 변형(IBJJF 금지인 니 리핑 포함)"
      }
    ],
    "sources": [
      {
        "name": "Evolve MMA - 3 Attacks From Single Leg X-Guard",
        "url": "https://evolve-mma.com/blog/3-attacks-from-single-leg-x-guard-you-need-to-know/"
      },
      {
        "name": "Digitsu - SLX Sweep",
        "url": "https://digitsu.com/t/slx-sweep"
      },
      {
        "name": "Jitsu IQ - Single-Leg X Guard",
        "url": "https://jitsuiq.com/positions/guard/single-leg-x-guard.html"
      }
    ]
  },
  {
    "id": "slx-toehold-kneebar",
    "position": "SLX",
    "name": "싱글 레그 X 토홀드 · 니바 (상대가 굴러 빠질 때)",
    "start": "싱글 레그 X가드에서 상대 칼라를 당겨 자세를 무너뜨린 상태",
    "end": "니바 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "SLX-13",
        "role": "main",
        "note": "상대 발을 잡고 토홀드를 시도"
      },
      {
        "tech": "SLX-14",
        "role": "if_blocked",
        "trigger": "상대가 토홀드를 피해 굴러 빠져나가려 할 때",
        "note": "아래쪽 다리를 재빨리 빼서 풀고 상대 다리를 눌러 뒤꿈치를 잡아 니바로 전환"
      }
    ],
    "sources": [
      {
        "name": "BJJEE - This Single Leg X to Kneebar Setup (Victor Hugo)",
        "url": "https://www.bjjee.com/articles/this-single-leg-x-to-kneebar-setup-works-every-time/"
      },
      {
        "name": "Jitsu IQ - Single-Leg X Guard",
        "url": "https://jitsuiq.com/positions/guard/single-leg-x-guard.html"
      }
    ]
  },
  {
    "id": "slx-ashi-heelhook",
    "position": "SLX",
    "name": "싱글 레그 X · 아웃사이드 아시 · 힐훅 (노기 레그락)",
    "start": "싱글 레그 X가드에서 상대 다리를 고립해 레그락 포지션을 잡으려 할 때",
    "end": "힐훅 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "SLX-21",
        "role": "main",
        "note": "엉덩이 각도를 바깥쪽으로 돌려 아웃사이드 아시 가라미로 전환해 다리를 고립"
      },
      {
        "tech": "SLX-11",
        "role": "then",
        "note": "무릎 라인을 제어하고 뒤꿈치를 잡아 아웃사이드 힐훅 (SLX 계열 기술이라 같은 포지션 연계로 취급)"
      }
    ],
    "sources": [
      {
        "name": "Jitsu IQ - Single-Leg X Guard",
        "url": "https://jitsuiq.com/positions/guard/single-leg-x-guard.html"
      },
      {
        "name": "Digitsu - Single Leg X",
        "url": "https://digitsu.com/t/single-leg-x"
      }
    ]
  },
  {
    "id": "slx-sweep-crabride-backtake",
    "position": "SLX",
    "name": "웨이터 스윕이 안 될 때 · 백 테이크",
    "start": "싱글 레그 X에서 상대 다리를 어깨에 올려 웨이터(펜들럼) 스윕을 시도할 때",
    "end": "탑 포지션 또는 백 컨트롤",
    "grade": "참고",
    "steps": [
      {
        "tech": "SLX-05",
        "role": "main",
        "note": "상대 무릎을 당겨 발을 매트에서 띄우고 다리를 어깨 위로 스쿠프, 머리와 어깨로 조이며 무릎을 모아 웨이터 스윕 시도"
      },
      {
        "tech": "SLX-24",
        "role": "if_blocked",
        "trigger": "상대가 베이스가 강해 스윕이 안 넘어가면",
        "note": "한 다리로 공간을 만들고 반대 발을 상대 종아리에 걸어 뒷문으로 빠져나가며 손으로 상대 옆구리를 앵커 삼아 엉덩이를 매트에 앉히고, 시트벨트를 먼저 잡은 뒤 훅을 넣는다"
      }
    ],
    "sources": [
      {
        "name": "Digitsu(Gianni Grippo)",
        "url": "https://digitsu.com/v/waiter-sweep-to-back-gianni-grippo"
      },
      {
        "name": "Digitsu(Adam Benayoun)",
        "url": "https://digitsu.com/v/short-hook-waiter-sweep-to-back-attack-adam-benayoun"
      },
      {
        "name": "Jitsu IQ",
        "url": "https://jitsuiq.com/positions/guard/single-leg-x-guard.html"
      }
    ]
  },
  {
    "id": "slx-to-xguard",
    "position": "SLX",
    "name": "싱글 레그 X ↔ X가드 전환",
    "start": "싱글 레그 X에서 상대 체중이 한쪽 다리에 실려 있을 때",
    "end": "X가드 포지션 (스탠드업 스윕 등은 XG 콤보 참고)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "SLX-20",
        "role": "main",
        "note": "엉덩이를 높게, 무릎은 모으고 발로 상대 햄스트링과 골반을 붙여 컨트롤. 상대를 앞으로 흔들어 체중을 먼 다리로 옮긴다"
      },
      {
        "tech": "SLX-25",
        "role": "transition",
        "note": "발을 먼저 보내 X 모양을 만들고, 살짝 차내며 상대 무릎 뒤를 잡아당겨 언더훅으로 X가드 확보. 그 뒤 스탠드업 스윕 등으로 이어간다"
      }
    ],
    "sources": [
      {
        "name": "Digitsu(Gianni Grippo)",
        "url": "https://digitsu.com/v/slx-x-guard-drill-gianni-grippo"
      },
      {
        "name": "Digitsu(Danny Stolfi)",
        "url": "https://digitsu.com/v/connection-to-x-guard-technical-standup-standard-ashi-danny-stolfi"
      }
    ]
  },
  {
    "id": "sp-sweep-triangle-armbar",
    "position": "SP",
    "name": "스파이더 스윕 · 트라이앵글 · 암바 연계",
    "start": "스파이더 가드에서 양 소매 그립과 이중 이두 발 컨트롤로 상대 팔을 늘려 놓은 상태",
    "end": "트라이앵글 또는 암바 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "SP-04",
        "role": "main",
        "note": "발로 이두를 밀어 소매를 당기며 기본 스파이더 스윕 시도"
      },
      {
        "tech": "SP-10",
        "role": "if_blocked",
        "trigger": "상대가 한쪽 발을 짚어 스윕을 막으면",
        "note": "한쪽 소매를 깊게 당기고 반대 발로 이두를 밀어 팔 하나만 안으로 넣은 뒤 다리를 목 위로 넘겨 트라이앵글"
      },
      {
        "tech": "SP-12",
        "role": "if_blocked",
        "trigger": "상대가 상체를 세워 트라이앵글을 버티면",
        "note": "소매 그립을 유지한 채 고립된 팔을 암바로 전환"
      }
    ],
    "sources": [
      {
        "name": "Evolve (Evolve Vacation 블로그) - 4 BJJ Submissions From Spider Guard",
        "url": "https://evolve-vacation.com/blog/4-bjj-submissions-from-spider-guard/"
      },
      {
        "name": "Digitsu 기술 사전 - Triangle From Spider Guard",
        "url": "https://digitsu.com/t/triangle-from-spider-guard"
      },
      {
        "name": "Graciemag - Gabriel Arges (Gracie Barra 블랙벨트) spider guard sweep to armbar",
        "url": "https://www.graciemag.com/irvine-open-standout-gabriel-arges-teaches-a-spider-guard-sweep-that-leads-to-an-armbar/"
      }
    ]
  },
  {
    "id": "sp-sweep-armbar",
    "position": "SP",
    "name": "스파이더 스윕 페이크 · 암바",
    "start": "스파이더 가드에서 소매와 이두 발 컨트롤로 상대를 앞으로 당긴 상태",
    "end": "암바 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "SP-04",
        "role": "main",
        "note": "소매 그립과 이두 발 컨트롤을 유지하고 바지 그립을 더해 상대를 아래로 끌어내리며 스윕 위협"
      },
      {
        "tech": "SP-12",
        "role": "if_blocked",
        "trigger": "상대가 스윕을 막으려 일어나 앉거나 몸을 세우면",
        "note": "그 순간 소매를 당겨 팔을 고립하고 다리를 머리 위로 넘겨 암바"
      }
    ],
    "sources": [
      {
        "name": "Graciemag - Gabriel Arges (Gracie Barra 블랙벨트)",
        "url": "https://www.graciemag.com/irvine-open-standout-gabriel-arges-teaches-a-spider-guard-sweep-that-leads-to-an-armbar/"
      },
      {
        "name": "Evolve (Evolve Vacation 블로그) - 4 BJJ Submissions From Spider Guard",
        "url": "https://evolve-vacation.com/blog/4-bjj-submissions-from-spider-guard/"
      }
    ]
  },
  {
    "id": "sp-sleeve-lasso-omoplata",
    "position": "SP",
    "name": "스파이더 컨트롤 · 라소 오모플라타",
    "start": "스파이더 가드에서 한쪽은 스파이더, 다른 한쪽은 라소 훅으로 상대 한쪽 팔을 깊게 제어한 상태",
    "end": "오모플라타 서브미션",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "SP-20",
        "role": "main",
        "note": "양 소매를 당기며 이두 발 압박으로 상대 팔꿈치를 몸에서 떼어 놓고, 목표 팔 쪽은 라소 또는 높은 이두 컨트롤로 깊게 만든다"
      },
      {
        "tech": "SP-11",
        "role": "then",
        "note": "힙을 빼 각도를 만들고 라소 다리를 어깨 위로 넘긴 뒤 반대 발은 이두에서 떼어 몸을 회전, 곧바로 일어나 앉아 상대 허리/벨트를 잡아 앞구르기를 막고 마무리"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (Stephan Kesting, 4단 블랙벨트) - Lasso Spider Guard to Omoplata",
        "url": "https://www.grapplearts.com/lasso-spider-guard-to-omoplata/"
      },
      {
        "name": "Gracie Barra - Prof. Draculino omoplata from spider guard",
        "url": "https://graciebarra.com/gb-learning/offensive-game-friday-omaplata-from-the-spider-guard"
      },
      {
        "name": "Digitsu 기술 사전 - Spider Guard Omoplata",
        "url": "https://digitsu.com/t/spider-guard-omoplata"
      }
    ]
  },
  {
    "id": "sp-sweep-x-guard",
    "position": "SP",
    "name": "스파이더 스윕 · 일어서는 패서에게 X가드 계열 전환",
    "start": "스파이더 가드에서 상대가 무릎 꿇은 자세로 패스를 노릴 때",
    "end": "X가드 계열 스윕 (다른 포지션)",
    "grade": "참고",
    "steps": [
      {
        "tech": "SP-04",
        "role": "main",
        "note": "소매 그립과 이두 발로 균형을 무너뜨려 가장 기본적인 스파이더 스윕 시도"
      },
      {
        "tech": "SP-22",
        "role": "if_blocked",
        "trigger": "상대가 스윕을 피하려고 일어서면",
        "note": "기존 소매 그립을 유지한 채 남은 다리를 상대 다리 사이로 넣어 X계열 가드로 전환하고 스파이더/X 하이브리드로 스윕"
      }
    ],
    "sources": [
      {
        "name": "Gracie Barra - Spider Guard Sweeps with Prof. Marcio Feitosa",
        "url": "https://graciebarra.com/gb-news/gb-technique-spider-guard-sweeps-with-prof-marcio-feitosa"
      },
      {
        "name": "Erin Herle (Digitsu 코스) - X-Guard Back Roll",
        "url": "https://digitsu.com/v/x-guard-back-roll-erin-herle"
      },
      {
        "name": "Jitsu IQ - Tripod Sweep",
        "url": "https://jitsuiq.com/sweeps/tripod-sweep.html"
      }
    ]
  },
  {
    "id": "sp-tripod-x",
    "position": "SP",
    "name": "트라이포드 · 시클 스윕 · X가드 전환 (스윕이 막힐 때)",
    "start": "스파이더 가드에서 한 발은 이두, 다른 발은 상대 발목 뒤에 걸어 서 있는 상대를 흔들 때",
    "end": "싱글 레그 X 또는 X가드 계열 (다른 포지션)",
    "grade": "참고",
    "steps": [
      {
        "tech": "SP-03",
        "role": "main",
        "note": "한 발은 이두 위, 다른 발은 발목 뒤에 걸고 당겨 트라이포드 스윕을 시도"
      },
      {
        "tech": "SP-06",
        "role": "if_blocked",
        "trigger": "트라이포드가 막혀 상대가 베이스를 조정하거나 체중을 뒤로 뺄 때",
        "note": "후크를 풀어 시클 모양으로 발목을 쳐내며 스윕"
      },
      {
        "tech": "SP-22",
        "role": "if_blocked",
        "trigger": "시클도 막혀 상대가 손으로 바닥을 짚을 때",
        "note": "소매를 유지한 채 아래로 파고들어 X가드를 만든다"
      }
    ],
    "sources": [
      {
        "name": "Jitsu IQ - Tripod Sweep",
        "url": "https://jitsuiq.com/sweeps/tripod-sweep.html"
      },
      {
        "name": "Jitsu IQ - Sickle Sweep",
        "url": "https://jitsuiq.com/sweeps/sickle-sweep.html"
      },
      {
        "name": "Gracie Barra - Spider Guard Sweeps with Prof. Marcio Feitosa",
        "url": "https://graciebarra.com/gb-news/gb-technique-spider-guard-sweeps-with-prof-marcio-feitosa"
      }
    ]
  },
  {
    "id": "sp-sweep-kneebar",
    "position": "SP",
    "name": "스파이더 스윕 · 니바 (상대가 다리를 짚어 막을 때)",
    "start": "스파이더 가드에서 소매 그립과 이두 발 컨트롤로 서 있는 상대를 스윕하려 할 때",
    "end": "서브미션 (니바)",
    "grade": "참고",
    "steps": [
      {
        "tech": "SP-04",
        "role": "main",
        "note": "소매를 당기고 이두 발로 밀어 기본 스파이더 스윕을 시도한다"
      },
      {
        "tech": "SP-13",
        "role": "if_blocked",
        "trigger": "상대가 다리를 짚어 스윕을 막을 때",
        "note": "상대 다리 아래로 돌아 들어가며 그 다리를 안아 니바를 건다"
      }
    ],
    "sources": [
      {
        "name": "Evolve (Evolve Vacation 블로그) - 4 BJJ Submissions From Spider Guard",
        "url": "https://evolve-vacation.com/blog/4-bjj-submissions-from-spider-guard/"
      },
      {
        "name": "Erin Herle (Digitsu 코스) - Kneebar",
        "url": "https://digitsu.com/v/kneebar-erin-herle"
      }
    ]
  },
  {
    "id": "xg-standup-farleg-buckle",
    "position": "XG",
    "name": "스탠드업 스윕 · 원거리 발목(다리 꺾기) 스윕",
    "start": "X가드를 만든 직후, 상대 다리를 어깨에 올린 상태",
    "end": "탑 포지션 (상대 오픈 가드 위에서 패스 준비)",
    "grade": "검증됨",
    "steps": [
      {
        "tech": "XG-01",
        "role": "main",
        "note": "다리를 뻗어 상대를 늘려 놓고 테크니컬 스탠드업으로 일어나며 상대 다리를 어깨에 얹은 채 스윕"
      },
      {
        "tech": "XG-03",
        "role": "if_blocked",
        "trigger": "상대가 균형을 유지하며 두 다리를 다시 모으거나 나를 향해 몸을 실을 때",
        "note": "다리를 늘린 뒤 상대가 먼 다리를 다시 가져오는 순간 그 발목을 잡고 다시 다리를 뻗어 무릎을 꺾어 넘김"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (Stephan Kesting) - My Favorite One-Two Sweeping Combo from X Guard",
        "url": "https://www.grapplearts.com/my-favorite-one-two-sweeping-combo-from-x-guard/"
      },
      {
        "name": "NAGA Fighter - What is the X Guard Sweep in BJJ?",
        "url": "https://www.nagafighter.com/?p=2486"
      },
      {
        "name": "Evolve MMA (BJJEE 게재) - 3 Attacks From X-Guard",
        "url": "https://www.bjjee.com/articles/3-attacks-from-x-guard-you-need-to-know/"
      }
    ]
  },
  {
    "id": "xg-standup-knockback",
    "position": "XG",
    "name": "스탠드업 스윕 · 노크백 스윕 (상대가 다리를 모을 때)",
    "start": "X가드에서 상대를 늘려 스탠드업 스윕을 시도한 직후",
    "end": "탑 포지션 (상대 오픈 가드 위)",
    "grade": "참고",
    "steps": [
      {
        "tech": "XG-01",
        "role": "main",
        "note": "다리를 뻗어 무릎을 밖으로 밀어 균형을 무너뜨리고 일어나며 스윕 시도 (탐색용 잽 역할)"
      },
      {
        "tech": "XG-05",
        "role": "if_blocked",
        "trigger": "상대가 두 다리를 최대한 모아 앞으로 못 넘어지게 막으면",
        "note": "무릎 뒤의 발을 발목 뒤로 내리고 위쪽 발로 상대 골반을 차 뒤로 쓰러뜨림"
      }
    ],
    "sources": [
      {
        "name": "Evolve MMA (BJJEE 게재) - 3 Attacks From X-Guard",
        "url": "https://www.bjjee.com/articles/3-attacks-from-x-guard-you-need-to-know/"
      },
      {
        "name": "Grapplearts (Stephan Kesting) - Favorite One-Two Sweeping Combo",
        "url": "https://www.grapplearts.com/my-favorite-one-two-sweeping-combo-from-x-guard/"
      }
    ]
  },
  {
    "id": "xg-strongbase-backtake",
    "position": "XG",
    "name": "X가드 스윕 · 백 테이크 (기반이 강한 상대)",
    "start": "X가드에서 상대가 키가 크거나 기반이 단단해 스윕이 잘 안 될 때",
    "end": "백 포지션 (리어 마운트)",
    "grade": "참고",
    "steps": [
      {
        "tech": "XG-01",
        "role": "main",
        "note": "스탠드업 스윕을 먼저 시도해 상대 반응을 확인"
      },
      {
        "tech": "XG-22",
        "role": "if_blocked",
        "trigger": "상대 기반이 너무 강해 스윕이 안 되고 한쪽 다리에 체중을 실을 때",
        "note": "스윕을 포기하고 상대 아래로 돌아 들어가 다리를 넘겨 백을 잡는다(도감 XG-22와 이름·세부가 같다고 확정되지 않은 X가드 백 테이크)"
      }
    ],
    "sources": [
      {
        "name": "Grapplearts (Stephan Kesting) - How to Take the Back from X Guard",
        "url": "https://www.grapplearts.com/how-to-take-the-back-from-x-guard/"
      },
      {
        "name": "NAGA Fighter - What is the X Guard Sweep in BJJ?",
        "url": "https://www.nagafighter.com/?p=2486"
      },
      {
        "name": "Digitsu(Gianni Grippo)",
        "url": "https://digitsu.com/v/x-guard-back-take-gianni-grippo"
      }
    ]
  },
  {
    "id": "xg-sweep-blocked-to-slx",
    "position": "XG",
    "name": "X가드 사이드 스윕 · 싱글 레그 X 전환 (상대가 넓게 짚을 때)",
    "start": "X가드에서 상대를 옆으로 넘기는 스윕을 시도할 때",
    "end": "싱글 레그 X가드 (이후 SLX 콤보 참고)",
    "grade": "참고",
    "steps": [
      {
        "tech": "XG-06",
        "role": "main",
        "note": "발목 그립을 유지한 채 후크로 다리를 들어 올리고 옆 방향으로 넘김"
      },
      {
        "tech": "XG-21",
        "role": "if_blocked",
        "trigger": "상대가 발이나 손을 넓게 짚어 첫 스윕이 막히면",
        "note": "엉덩이를 당겨 각도를 다시 잡고 후크를 바꿔 싱글 레그 X로 전환하여 공격 지속"
      }
    ],
    "sources": [
      {
        "name": "Digitsu - X-guard Sweep (기술 해설)",
        "url": "https://digitsu.com/t/x-guard-sweep"
      },
      {
        "name": "Jitsu IQ - X Guard",
        "url": "https://jitsuiq.com/positions/guard/x-guard.html"
      }
    ]
  },
  {
    "id": "xg-failed-sweep-ankle-lock",
    "position": "XG",
    "name": "X가드 스윕 후 · 싱글 레그 X · 발목 꺾기 (레그락 연계)",
    "start": "X가드 스윕이 방어되었지만 상대가 균형을 유지한 채 서 있을 때",
    "end": "스트레이트 앵클락 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "XG-01",
        "role": "main",
        "note": "먼저 스윕 시도로 상대 균형과 반응을 흔듦"
      },
      {
        "tech": "XG-21",
        "role": "if_blocked",
        "trigger": "스윕은 막혔으나 상대가 한쪽 다리를 내게 맡긴 채 서 있을 때",
        "note": "싱글 레그 X로 전환해 발목 그립을 유지하며 다리를 고립"
      },
      {
        "tech": "SLX-10",
        "role": "then",
        "note": "발목을 양손으로 잡고 엉덩이를 앞으로 밀어 스트레이트 앵클락"
      }
    ],
    "sources": [
      {
        "name": "Evolve MMA (BJJEE 게재) - 3 Attacks From X-Guard",
        "url": "https://www.bjjee.com/articles/3-attacks-from-x-guard-you-need-to-know/"
      },
      {
        "name": "NAGA Fighter - What is the X Guard Sweep in BJJ?",
        "url": "https://www.nagafighter.com/?p=2486"
      }
    ]
  },
  {
    "id": "xg-knockback-kneebar",
    "position": "XG",
    "name": "스탠드업·노크백 스윕이 막히면 · X가드 니바",
    "start": "X가드에서 스탠드업 스윕을 시도해 상대 반응을 본 직후",
    "end": "탑 포지션(스윕) 또는 니바 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "XG-01",
        "role": "main",
        "note": "다리를 뻗어 상대를 늘려 놓고 테크니컬 스탠드업으로 일어나며 스윕 시도"
      },
      {
        "tech": "XG-05",
        "role": "if_blocked",
        "trigger": "상대가 두 다리를 모아 앞으로 넘어가지 않게 버티면",
        "note": "무릎 뒤 훅을 발목 뒤로 내리고 위쪽 발로 상대 골반을 차 뒤로 넘기는 노크백 스윕"
      },
      {
        "tech": "XG-10",
        "role": "if_blocked",
        "trigger": "노크백도 막혀 상대가 균형을 되찾고 서 있으면",
        "note": "위쪽 발을 먼 골반에서 가까운 골반으로 옮기고 아래 다리를 언더훅한 다리 둘레로 돌려 뒤꿈치를 엉덩이 쪽에 붙인 뒤, 엉덩이를 무릎 위로 밀며 뒤꿈치를 당겨 니바"
      }
    ],
    "sources": [
      {
        "name": "Evolve MMA(bjjee 재게재 동일 글)",
        "url": "https://evolve-mma.com/blog/3-attacks-from-x-guard-worth-adding-to-your-bjj-game/"
      },
      {
        "name": "Digitsu(Johnny Tama)",
        "url": "https://digitsu.com/v/waiter-position-x-guard-knee-bar-johnny-tama"
      }
    ]
  }
];
