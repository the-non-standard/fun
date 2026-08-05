#!/usr/bin/env python3
"""Build the formatted XLSX + CSV from businesses.jsonl (502 UK rug cleaners)."""
import csv, json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

COLS = ["Business Name","Category","Website","Email","Phone","Address","Facebook",
        "Instagram","LinkedIn","YouTube","X/Twitter","Reviews (as found)",
        "Coverage Area","Source / Notes"]

recs = [json.loads(l) for l in open("businesses.jsonl", encoding="utf-8") if l.strip()]
rank = {"SPEC": 0, "C&R": 1, "FRAN": 2}
recs.sort(key=lambda r: (rank.get(r.get("Category","C&R"), 1), r["Business Name"].lower()))
ROWS = [[r.get(c,"") for c in COLS] for r in recs]

# ---- CSV ----
with open("uk_rug_cleaning_businesses.csv","w",newline="",encoding="utf-8-sig") as f:
    w = csv.writer(f); w.writerow(COLS); w.writerows(ROWS)

# ---- XLSX ----
wb = openpyxl.Workbook(); ws = wb.active; ws.title = "UK Rug Cleaning Businesses"
HEAD_FILL = PatternFill("solid", fgColor="1F3B4D"); HEAD_FONT = Font(bold=True, color="FFFFFF", size=11)
SPEC_FILL = PatternFill("solid", fgColor="E8F3EC"); FRAN_FILL = PatternFill("solid", fgColor="FFF4E5")
thin = Side(style="thin", color="D6D6D6"); BORDER = Border(left=thin,right=thin,top=thin,bottom=thin)
WRAP = Alignment(vertical="top", wrap_text=True)

ws.append(COLS)
for c in ws[1]:
    c.fill=HEAD_FILL; c.font=HEAD_FONT; c.border=BORDER
    c.alignment=Alignment(vertical="center", horizontal="center", wrap_text=True)
for r in ROWS: ws.append(r)

link_cols = {COLS.index(h)+1 for h in ("Website","Facebook","Instagram","LinkedIn","YouTube","X/Twitter")}
for ridx in range(2, ws.max_row+1):
    cat = ws.cell(row=ridx, column=2).value
    fill = SPEC_FILL if cat=="SPEC" else (FRAN_FILL if cat=="FRAN" else None)
    for cidx in range(1, len(COLS)+1):
        cell = ws.cell(row=ridx, column=cidx); cell.alignment=WRAP; cell.border=BORDER
        if fill: cell.fill=fill
        if cidx in link_cols and isinstance(cell.value,str) and cell.value.startswith("http"):
            cell.hyperlink = cell.value; cell.font = Font(color="0563C1", underline="single", size=10)
        else:
            cell.font = Font(size=10)

for i,wdt in enumerate([30,9,34,30,22,40,42,40,16,34,26,26,40,46], start=1):
    ws.column_dimensions[get_column_letter(i)].width = wdt
ws.freeze_panes="A2"; ws.auto_filter.ref=f"A1:{get_column_letter(len(COLS))}{ws.max_row}"

# ---- Method sheet ----
ws2 = wb.create_sheet("Method & Notes")
spec = sum(1 for r in recs if r.get("Category")=="SPEC")
cr = sum(1 for r in recs if r.get("Category")=="C&R")
fran = sum(1 for r in recs if r.get("Category")=="FRAN")
notes = [
 ["UK Rug Cleaning Businesses — research notes"],[""],
 [f"Total businesses: {len(recs)}"],
 [f"  Dedicated rug specialists (SPEC, green): {spec}"],
 [f"  Carpet & upholstery cleaners that also clean rugs (C&R): {cr}"],
 [f"  National franchises / booking platforms (FRAN, amber): {fran}"],
 ["Compiled: August 2026, via multi-source web search across all UK regions,"],
 ["counties, and London boroughs (100+ targeted searches), de-duplicated by"],
 ["website domain / business name."],[""],
 ["Field completeness (be aware):"],
 [f"  Website: {sum(1 for r in recs if r.get('Website'))}   Phone: {sum(1 for r in recs if r.get('Phone'))}"
  f"   Email: {sum(1 for r in recs if r.get('Email'))}   Facebook: {sum(1 for r in recs if r.get('Facebook'))}"],
 ["  Emails are sparse: search results rarely expose them, and this environment's"],
 ["  network policy blocked opening company websites/directories to scrape them."],
 ["  Blank cell = not found via search, NOT 'does not exist'."],[""],
 ["To fill emails/socials at scale, or go beyond this list, use:"],
 ["  1. Google Places / Maps API (query 'rug cleaning' per town/postcode)."],
 ["  2. Directory exports: Yell, Checkatrade, Bark, TrustATrader, FreeIndex, Cylex, Yelp UK."],
 ["  3. Trade bodies: NCCA (ncca.co.uk) & WoolSafe (woolsafe.org) member directories."],
 ["  4. Companies House SIC 96010 for registered entities + an email-finder tool."],
]
for row in notes: ws2.append(row)
ws2["A1"].font=Font(bold=True,size=14); ws2["A3"].font=Font(bold=True)
ws2["A11"].font=Font(bold=True); ws2["A16"].font=Font(bold=True,color="B00000")
ws2.column_dimensions["A"].width = 100

wb.save("uk_rug_cleaning_businesses.xlsx")
print(f"Wrote {len(recs)} businesses -> XLSX + CSV")
