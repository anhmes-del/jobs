import subprocess
import json
import sys

def test_search():
    cmd = [
        "mcporter", 
        "call", 
        "exa.web_search_exa",
        'query=(site:vietnamworks.com OR site:topcv.vn OR site:careerviet.vn OR site:vieclam24h.vn OR site:glints.com OR site:careerlink.vn) "site manager" "renewable" OR "điện gió" OR "năng lượng"',
        "numResults=3"
    ]
    sys.stdout.reconfigure(encoding='utf-8')
    print("Running command:", " ".join(cmd))
    
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", shell=True)
    print("Return code:", r.returncode)
    print("STDOUT:")
    print(r.stdout)
    print("STDERR:")
    print(r.stderr)

if __name__ == "__main__":
    test_search()
