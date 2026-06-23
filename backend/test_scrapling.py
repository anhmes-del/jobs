import json
import sys
sys.stdout.reconfigure(encoding='utf-8')
from backend.scrapling_scraper import run_scrapling_scrape
result = run_scrapling_scrape("chi huy truong dien gio", "Facebook")
print(json.dumps(result["metrics"], ensure_ascii=False, indent=2))
print(f"Jobs found: {len(result['jobs'])}")
for j in result["jobs"]:
    print(f"  - {j['title']}")
    print(f"    Company: {j['company']} | Location: {j['location']}")
    print(f"    Contact: {j['contact_info']}")
    print()
