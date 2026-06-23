import requests
import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

r = requests.post("http://localhost:8000/api/scrape/scrapling", json={"query": "chi huy truong dien gio", "platform": "Facebook"})
data = r.json()
print("Status:", r.status_code)
print("Metrics:", json.dumps(data.get("metrics", {}), ensure_ascii=False, indent=2))
print(f"Jobs: {len(data.get('jobs', []))}")
for j in data.get("jobs", []):
    print(f"  - {j['title']}")
    print(f"    {j['company']} | {j['location']} | {j['salary']}")
    print(f"    Contact: {j['contact_info']}")
    print()
