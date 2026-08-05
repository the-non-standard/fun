#!/usr/bin/env python3
"""Merge a batch JSON into businesses.jsonl with de-duplication.

Usage:
  python3 add.py <batch.json>   # merge a batch
  python3 add.py --clean        # normalise existing store (move social URLs out
                                #   of Website, re-key, re-dedup)

Dedup key: normalised Website domain, UNLESS that domain is a social-media host
(facebook/instagram/x/youtube/linkedin) or empty -> then key on the name.
Social URLs placed in Website are moved into the matching social column.
"""
import json, re, sys, os

COLS = ['Business Name','Category','Website','Email','Phone','Address','Facebook',
        'Instagram','LinkedIn','YouTube','X/Twitter','Reviews (as found)',
        'Coverage Area','Source / Notes']
KEYMAP = {'name':'Business Name','category':'Category','website':'Website','email':'Email',
          'phone':'Phone','address':'Address','facebook':'Facebook','instagram':'Instagram',
          'linkedin':'LinkedIn','youtube':'YouTube','twitter':'X/Twitter','reviews':'Reviews (as found)',
          'coverage':'Coverage Area','notes':'Source / Notes'}
SOCIAL = {'facebook.com','fb.com','instagram.com','twitter.com','x.com','youtube.com','youtu.be','linkedin.com'}

def norm_domain(url):
    if not url: return ''
    u = re.sub(r'^https?://','',url.strip().lower())
    u = re.sub(r'^www\.','',u)
    return u.split('/')[0]

def norm_name(n):
    return re.sub(r'[^a-z0-9]','', (n or '').lower())

def move_social(r):
    """If Website holds a social URL, relocate it to the matching column."""
    d = norm_domain(r.get('Website',''))
    if d in SOCIAL:
        w = r['Website']
        if 'facebook' in d or d=='fb.com':
            r['Facebook'] = r.get('Facebook') or w
        elif 'instag' in d:
            r['Instagram'] = r.get('Instagram') or w
        elif d in ('twitter.com','x.com'):
            r['X/Twitter'] = r.get('X/Twitter') or w
        elif 'youtu' in d:
            r['YouTube'] = r.get('YouTube') or w
        elif 'linkedin' in d:
            r['LinkedIn'] = r.get('LinkedIn') or w
        r['Website'] = ''
    return r

def to_record(d):
    r = {c:'' for c in COLS}
    for k,v in d.items():
        if k in KEYMAP and v:
            r[KEYMAP[k]] = str(v).strip()
    if not r['Category']:
        r['Category'] = 'C&R'
    return move_social(r)

def key_of(r):
    dom = norm_domain(r.get('Website',''))
    if dom and dom not in SOCIAL:
        return 'd:'+dom
    return 'n:'+norm_name(r.get('Business Name',''))

def load():
    recs=[]
    if os.path.exists('businesses.jsonl'):
        for line in open('businesses.jsonl',encoding='utf-8'):
            line=line.strip()
            if line: recs.append(json.loads(line))
    return recs

def save(recs):
    with open('businesses.jsonl','w',encoding='utf-8') as f:
        for r in recs:
            f.write(json.dumps(r,ensure_ascii=False)+'\n')

if len(sys.argv)>1 and sys.argv[1]=='--clean':
    recs = load()
    index={}; out=[]
    for r in recs:
        r = move_social(r)
        k = key_of(r)
        if k in index:
            cur=index[k]
            for c in COLS:
                if not cur.get(c) and r.get(c): cur[c]=r[c]
        else:
            index[k]=r; out.append(r)
    save(out)
    print(f'cleaned -> {len(out)} records (was {len(recs)})')
    sys.exit()

batch_file = sys.argv[1] if len(sys.argv) > 1 else 'new_batch.json'
existing = load()
index = {key_of(r):r for r in existing}
new = json.load(open(batch_file,encoding='utf-8'))
added=0; enriched=0
for d in new:
    r = to_record(d)
    if not r['Business Name']: continue
    k = key_of(r)
    if k in index:
        cur = index[k]; filled=False
        for c in COLS:
            if not cur.get(c) and r.get(c):
                cur[c]=r[c]; filled=True
        if filled: enriched+=1
    else:
        index[k]=r; existing.append(r); added+=1
save(existing)
print(f'added {added} new, enriched {enriched} existing -> total {len(existing)}')
