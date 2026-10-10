# src/data/comboLibrary.ts 재생성: 저장소 루트에서 `python3 docs/combo_library/build_ts.py`
import json
HEAD = '/**\n * 콤보 라이브러리 — 실전에서 쓰이는 기술 연계 모음 (자동 생성: docs/combo_library/build_ts.py)\n * 원본/근거: docs/combo_library/research/*.json , 규칙: docs/combo_library/PROTOCOL.md\n * 등급 \'검증됨\'/\'참고\'만 포함. \'초안\'은 앱에 노출하지 않는다.\n */\nexport type ComboStep = {\n  /** 기술도감 짧은 ID (예: CG-10) */\n  tech: string;\n  role: "main" | "if_blocked" | "then" | "transition";\n  trigger?: string;\n  note?: string;\n};\n\nexport type Combo = {\n  id: string;\n  /** 포지션 코드 (예: CG) */\n  position: string;\n  name: string;\n  start: string;\n  end: string;\n  grade: "검증됨" | "참고";\n  steps: ComboStep[];\n};\n\n'
out = []
for pos in ['CG', 'SC', 'MT', 'BC']:
    for c in json.load(open(f'docs/combo_library/research/{pos}.json')):
        if c['grade'] not in ('검증됨', '참고'):
            continue
        out.append({'id': c['id'], 'position': c['position'], 'name': c['name'], 'start': c['start'],
                    'end': c['end'], 'grade': c['grade'],
                    'steps': [{k: v for k, v in s.items() if k in ('tech', 'role', 'trigger', 'note')} for s in c['steps']]})
open('src/data/comboLibrary.ts', 'w').write(HEAD + 'export const COMBO_LIBRARY: Combo[] = ' + json.dumps(out, ensure_ascii=False, indent=2) + ';\n')
print(len(out))
