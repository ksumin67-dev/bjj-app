import json,glob,csv
names={r[1]:r[2] for r in csv.reader(open('../audit/techniques.tsv'),delimiter='\t')}
pn={r[1]:r[2] for r in csv.reader(open('../audit/techniques.tsv'),delimiter='\t') if '-' not in r[1]}
import os
ROLE={'main':'먼저','if_blocked':'막히면','then':'이어서','transition':'이동'}
out=['# 콤보 라이브러리 검수표 (2라운드 누적)\n','아래 콤보 중 **수련에서 안 쓰거나 어색하게 느껴지는 것**만 번호로 알려 주세요. 제가 등급을 내리거나 삭제합니다.',
'- 등급 `검증됨`: 본문 확인된 독립 출처 2곳 이상 / `참고`: 출처 있음, 일부만 본문 확인 (앱에 노출) / `초안`: 근거 못 찾음 (앱 미노출)\n']
n=0
for pos in sorted(os.path.basename(f)[:-5] for f in glob.glob('research/*.json')):
    out.append(f'\n## {pn[pos]}\n')
    for c in json.load(open(f'research/{pos}.json')):
        n+=1
        out.append(f'### {n}. {c["name"]}  `{c["grade"]}`')
        out.append(f'- 상황: {c["start"]}')
        for i,s in enumerate(c['steps']):
            trig=f' ({s["trigger"]})' if s.get('trigger') else ''
            out.append(f'  {i+1}. [{ROLE.get(s["role"],s["role"])}] {names[s["tech"]]} `{s["tech"]}`{trig}')
        out.append(f'- 결과: {c["end"]}')
        if c.get('issues'): out.append(f'- 확인할 점: {c["issues"].split(" [2026")[0]}')
        out.append('')
open('REVIEW.md','w').write('\n'.join(out))
print(n)
