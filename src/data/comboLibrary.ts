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

export type Combo = {
  id: string;
  /** 포지션 코드 (예: CG) */
  position: string;
  name: string;
  start: string;
  end: string;
  grade: "검증됨" | "참고";
  steps: ComboStep[];
};

export const COMBO_LIBRARY: Combo[] = [
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
    ]
  },
  {
    "id": "cg-armbar-triangle-omoplata",
    "position": "CG",
    "name": "암바 · 삼각 · 오모플라타 연계",
    "start": "클로즈드 가드에서 상대 팔을 가두고 암바를 시도할 때",
    "end": "삼각 또는 오모플라타 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "CG-11",
        "role": "main",
        "note": "자세를 무너뜨리고 한쪽 팔을 잡아 암바 시도"
      },
      {
        "tech": "CG-16",
        "role": "if_blocked",
        "trigger": "상대가 팔을 빼며 머리를 숙이고 몸을 돌리면",
        "note": "삼두를 잡고 다리를 목에 걸어 삼각으로 전환"
      },
      {
        "tech": "CG-17",
        "role": "if_blocked",
        "trigger": "상대가 팔을 빼고 자세를 세우며 반대로 빠지면",
        "note": "빠진 팔 쪽으로 몸을 감아 오모플라타"
      }
    ]
  },
  {
    "id": "cg-overhook-triangle-omoplata",
    "position": "CG",
    "name": "오버훅 가드 · 삼각 · 오모플라타 연계",
    "start": "클로즈드 가드에서 한쪽 팔에 깊은 오버훅을 건 상태",
    "end": "삼각 또는 오모플라타 서브미션",
    "grade": "참고",
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
    ]
  },
  {
    "id": "sc-kimura-armbar",
    "position": "SC",
    "name": "기무라 · 암바 연계 (팔을 펴고 버틸 때)",
    "start": "사이드 컨트롤 탑에서 상대의 팔을 기무라 그립으로 잡았을 때",
    "end": "암바 서브미션",
    "grade": "참고",
    "steps": [
      {
        "tech": "SC-01",
        "role": "main",
        "note": "손목을 엉덩이 쪽으로 누르고 팔꿈치를 들어 올려 기무라 그립을 단단히 확보"
      },
      {
        "tech": "SC-02",
        "role": "if_blocked",
        "trigger": "상대가 팔을 펴서 버티며 굴러 도망가지 않으면",
        "note": "그립을 유지한 채 다리를 상대 머리 위로 넘겨 암바로 전환"
      }
    ]
  },
  {
    "id": "sc-kimura-backtake",
    "position": "SC",
    "name": "기무라 그립 · 백 테이크",
    "start": "사이드 컨트롤 탑에서 가까운 쪽 팔 기무라 그립을 잡은 상태",
    "end": "백 포지션 (이후 BC-01 등으로 연계 가능)",
    "grade": "참고",
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
    ]
  },
  {
    "id": "sc-frame-spinning-armbar",
    "position": "SC",
    "name": "프레임 방어를 이용한 스피닝 암바",
    "start": "사이드 컨트롤 탑에서 상대가 팔로 엉덩이/목을 밀며 프레임을 만들 때",
    "end": "암바 서브미션",
    "grade": "참고",
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
    ]
  },
  {
    "id": "sc-backtake-rnc",
    "position": "SC",
    "name": "사이드 컨트롤 백 테이크 · 리어 네이키드 초크",
    "start": "사이드 컨트롤 탑에서 상대가 등을 돌려 탈출하려 할 때",
    "end": "RNC 서브미션",
    "grade": "참고",
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
        "trigger": "상대가 팔로 밀어 막거나 팔을 가슴 앞에 세우면",
        "note": "가까운 쪽 무릎을 머리 쪽으로 올리고 반대 다리를 팔 위로 감아 S자를 만든다"
      },
      {
        "tech": "MT-01",
        "role": "then",
        "note": "팔꿈치를 몸에 붙여 고립한 뒤 다리를 머리 너머로 넘겨 암바로 마무리"
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
        "trigger": "상대가 손으로 초크를 막거나 팔을 뻗어 밀어내거나 업빠로 뒤집으려 팔을 잡으면",
        "note": "드러난 팔을 고립해 체중을 옮기며 암바"
      }
    ]
  },
  {
    "id": "mt-giftwrap-back-rnc",
    "position": "MT",
    "name": "기프트랩 · 백 테이크 · RNC 연계",
    "start": "마운트 탑에서 상대가 옆으로 몸을 돌리며 압박을 피하려 할 때",
    "end": "RNC 서브미션 (백 컨트롤)",
    "grade": "참고",
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
    ]
  },
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
    ]
  },
  {
    "id": "bc-rnc-short-choke",
    "position": "BC",
    "name": "RNC 방어 시 숏 초크 전환",
    "start": "백 컨트롤에서 RNC를 시도했는데 상대가 손과 턱으로 막을 때",
    "end": "서브미션(숏 초크)",
    "grade": "참고",
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
    ]
  },
  {
    "id": "bc-kimura-control-armbar",
    "position": "BC",
    "name": "백 기무라 컨트롤 · 암바 연계",
    "start": "백 컨트롤에서 상대가 목을 철저히 보호하며 팔을 모으고 있을 때",
    "end": "서브미션(기무라 또는 암바)",
    "grade": "참고",
    "steps": [
      {
        "tech": "BC-04",
        "role": "main",
        "note": "기무라 그립으로 팔을 잡아 머리를 들어올리고 상대의 탈출 회전을 막는다"
      },
      {
        "tech": "BC-03",
        "role": "if_blocked",
        "trigger": "기무라가 들어가지 않고 팔이 풀리거나 팔이 펴질 때",
        "note": "다리로 상대 윗팔을 엮어 암바로 이어간다"
      }
    ]
  }
];
