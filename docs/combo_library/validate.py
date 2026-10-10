import json,glob,csv,sys
ids={r[1]:r for r in csv.reader(open('../audit/techniques.tsv'),delimiter='\t')}
bad=0;tot=0;by={};seen=set()
for f in sorted(glob.glob('research/*.json')):
    for c in json.load(open(f)):
        tot+=1;by[c['grade']]=by.get(c['grade'],0)+1;p=[]
        st=c['steps'];techs=[s['tech'] for s in st]
        for t in techs:
            if t not in ids:p.append(f'없는 ID {t}')
        if len(set(techs))!=len(techs):p.append('중복 기술')
        if not 2<=len(st)<=4:p.append(f'길이 {len(st)}')
        if sum(s['role']=='if_blocked' for s in st)>2:p.append('갈래 3개 이상')
        for i,s in enumerate(st):
            if s['role']=='if_blocked' and not s.get('trigger'):p.append(f'{s["tech"]} 트리거 없음')
            if s['role']=='transition' and i!=len(st)-1 and ids.get(s['tech'],[0]*5)[4]=='전환' and ids[s['tech']][5]!=c['position']:p.append(f'{s["tech"]} 전환이 중간에')
        n=len(c.get('evidence',[]))
        pr=sum(e.get('basis')=='page-read' for e in c.get('evidence',[]))
        if c['grade']=='검증됨' and pr<2:p.append(f'검증됨인데 page-read {pr}')
        if c['id'] in seen:p.append('combo id 중복')
        seen.add(c['id'])
        if c['grade']=='검증됨' and n<2:p.append('검증됨인데 근거<2')
        if c['grade']=='초안' and n>0 and False:pass
        if p:bad+=1;print(f['research/'.__len__():],c['id'],'|',', '.join(p))
print('총',tot,'등급',by,'문제콤보',bad)
