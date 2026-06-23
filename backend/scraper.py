# -*- coding: utf-8 -*-
import subprocess
import re
from datetime import datetime

def parse_exa_results(raw_text: str, requested_platform: str = "All") -> list:
    # Split results by the markdown separator
    blocks = raw_text.split("\n---\n")
    jobs = []
    
    for idx, block in enumerate(blocks):
        block = block.strip()
        if not block:
            continue
            
        # Parse fields using regex
        title_match = re.search(r"^Title:\s*(.+)$", block, re.MULTILINE)
        url_match = re.search(r"^URL:\s*(.+)$", block, re.MULTILINE)
        date_match = re.search(r"^Published:\s*(.+)$", block, re.MULTILINE)
        author_match = re.search(r"^Author:\s*(.+)$", block, re.MULTILINE)
        
        if not title_match or not url_match:
            continue
            
        title = title_match.group(1).strip()
        url = url_match.group(1).strip()
        
        # Determine platform based on domain and context
        platform = "Other"
        url_lower = url.lower()
        if requested_platform == "Zalo" or "zalo.me" in url_lower or "zalo.me" in highlights.lower():
            platform = "Zalo"
        elif "linkedin.com" in url_lower:
            platform = "LinkedIn"
        elif "facebook.com" in url_lower:
            platform = "Facebook"
        elif "vietnamworks.com" in url_lower:
            platform = "VietnamWorks"
        elif "topcv.vn" in url_lower:
            platform = "TopCV"
        elif "careerviet.vn" in url_lower:
            platform = "CareerViet"
        elif "jobsgo.vn" in url_lower:
            platform = "JobsGO"
        elif "indeed.com" in url_lower or "indeed.com.vn" in url_lower or "vn.indeed.com" in url_lower:
            platform = "Indeed"
        elif "glints.com" in url_lower:
            platform = "Glints"
        elif "careerlink.vn" in url_lower:
            platform = "CareerLink"
        elif "topdev.vn" in url_lower:
            platform = "TopDev"
        elif "timviec365.vn" in url_lower or "timviec365.com" in url_lower:
            platform = "Timviec365"
        elif "vieclam24h.vn" in url_lower:
            platform = "ViecLam24h"
        elif "joboko.com" in url_lower:
            platform = "Joboko"
            
        # Date formatting
        raw_date = date_match.group(1).strip() if date_match else "N/A"
        post_date = raw_date
        if raw_date != "N/A" and "t" in raw_date.lower():
            try:
                dt = datetime.strptime(raw_date.split("T")[0], "%Y-%m-%d")
                post_date = dt.strftime("%b %d, %Y")
            except Exception:
                pass
        else:
            # Set a recent date if none is found
            post_date = datetime.now().strftime("%b %d, %Y")
                
        # Highlights
        highlights = ""
        highlight_idx = block.find("Highlights:")
        if highlight_idx != -1:
            highlights = block[highlight_idx + len("Highlights:"):].strip()
            
        # Extract contact email using regex
        emails = re.findall(r"[\w\.-]+@[\w\.-]+\.\w+", highlights)
        # Extract salary if mentioned
        salary_match = re.search(r"(\$\d+[\d,]*\s*-\s*\$\d+[\d,]*|up to \d+M|lương\s*\d+\s*-\s*\d+\s*M|cạnh tranh|negotiable)", highlights, re.IGNORECASE)
        salary = salary_match.group(1) if salary_match else "Negotiable"
        
        # Extract contact email using regex
        emails = re.findall(r"[\w\.-]+@[\w\.-]+\.\w+", highlights)
        email = emails[0] if emails else "N/A"
        
        # Extract phone numbers / Zalo
        phone_matches = re.findall(r"(?:zalo|sđt|sdt|phone|lh|liên hệ|tel)?\s*:?\s*(0[35789]\d[\s.-]?\d{3}[\s.-]?\d{4})", (highlights + " " + title).lower())
        phone = phone_matches[0] if phone_matches else "N/A"
        
        # Clean phone number for Zalo link (digits only)
        zalo = re.sub(r"\D", "", phone) if phone != "N/A" else "N/A"
        
        # Determine facebook profile link
        facebook = "N/A"
        if "facebook.com" in url.lower():
            facebook = url
        else:
            fb_links = re.findall(r"(https?://(?:www\.)?facebook\.com/[\w\.]+)", highlights)
            if fb_links:
                facebook = fb_links[0]
                
        # Maintain backward compatibility with contact_info
        parts = []
        if email != "N/A":
            parts.append(email)
        if phone != "N/A":
            parts.append(phone)
        contact_info = " | ".join(parts) if parts else "Apply via website link"
        
        # Company name extraction (best effort)
        company = "Various Recruiters"
        for brand in ["Vestas", "Goldwind", "Siemens Gamesa", "GE", "TotalEnergies", "Trung Nam", "Fecon", "IPC", "PTSC", "SMC", "Super Energy", "Gec", "T&T"]:
            if brand.lower() in title.lower() or brand.lower() in highlights.lower():
                company = brand
                break
                
        # Recruiter Name
        recruiter = author_match.group(1).strip() if (author_match and author_match.group(1).strip() != "N/A") else "HR Recruiter"
        if recruiter == "HR Recruiter":
            name_post = re.search(r"(.+?)’s Post", title)
            if name_post:
                recruiter = name_post.group(1).strip()
            else:
                pipe_match = re.search(r"\|\s*([^|]+?)\s*\|", title)
                if pipe_match:
                    recruiter = pipe_match.group(1).strip()

        # Key requirements
        key_requirements = []
        bullets = re.findall(r"(?:[✅🔹🔑⚡🎯•-]\s*)([^\n]+)", highlights)
        if bullets:
            key_requirements = [b.strip() for b in bullets[:4]]
        else:
            sentences = [s.strip() for s in highlights.split("\n") if s.strip() and len(s.strip()) > 15]
            key_requirements = [s[:50] + "..." if len(s) > 50 else s for s in sentences[:3]]
            
        if not key_requirements:
            key_requirements = ["Renewable energy site management", "Technical construction oversight"]
            
        # Project Type
        project_type = "Onshore"
        if "offshore" in highlights.lower() or "offshore" in title.lower():
            project_type = "Offshore"
        elif "nearshore" in highlights.lower() or "nearshore" in title.lower():
            project_type = "Nearshore"
            
        # Location (best effort)
        location = "Vietnam"
        loc_match = re.search(r"(?:📍|location:|tại|địa điểm:)\s*([^\n|•]+)", highlights + " " + title, re.IGNORECASE)
        if loc_match:
            location = loc_match.group(1).strip()
            location = re.split(r"[,|]|\.\.\.", location)[0].strip()
            if len(location) > 30:
                location = location[:27] + "..."
        else:
            for prov in ["Tra Vinh", "Trà Vinh", "Dak Lak", "Đắk Lắk", "Gia Lai", "Binh Thuan", "Bình Thuận", "Ca Mau", "Cà Mau", "Vung Tau", "Vũng Tàu", "Quang Tri", "Quảng Trị", "Ninh Thuan", "Ninh Thuận", "Hồ Chí Minh", "HCM", "Hà Nội"]:
                if prov.lower() in highlights.lower() or prov.lower() in title.lower():
                    location = prov + ", Vietnam"
                    break
                    
        # Determine role
        role = "Site Manager"
        title_lower = title.lower()
        highlights_lower = highlights.lower()
        if "hse" in title_lower or "safety" in title_lower or "an toàn" in title_lower or "bảo hộ" in title_lower:
            role = "HSE"
        elif "project manager" in title_lower or "giám đốc dự án" in title_lower or "quản lý dự án" in title_lower or "pm" in title_lower:
            role = "Project Manager"
        elif any(kw in title_lower or kw in highlights_lower for kw in ["civil", "xây dựng", "xay dung", "structural", "kết cấu", "ket cau"]):
            role = "Civil Engineer"

        jobs.append({
            "id": f"scraped_{idx}_{int(datetime.now().timestamp())}",
            "title": title,
            "company": company,
            "platform": platform,
            "location": location,
            "role": role,
            "recruiter_name": recruiter,
            "recruiter_profile": url,
            "post_url": url,
            "post_date": post_date,
            "raw_text": highlights,
            "key_requirements": key_requirements,
            "project_type": project_type,
            "salary": salary,
            "contact_info": contact_info,
            "email": email,
            "phone": phone,
            "zalo": zalo,
            "facebook": facebook
        })
        
    return jobs

def run_live_scrape(query: str, platform: str = "All") -> list:
    search_query = ""
    if platform == "LinkedIn":
        search_query = f"site:linkedin.com/posts \"{query}\" hiring"
    elif platform == "Facebook":
        search_query = f"site:facebook.com \"{query}\" recruiting"
    elif platform == "Zalo":
        search_query = f"(site:linkedin.com/posts OR site:facebook.com) \"{query}\" (\"zalo.me/g/\" OR \"zalo.me\" OR \"zalo\") (\"recruitment\" OR \"tuyển dụng\" OR \"hiring\")"
    elif platform == "VN_Sites":
        search_query = f"(site:vietnamworks.com OR site:topcv.vn OR site:careerviet.vn OR site:jobsgo.vn OR site:careerlink.vn OR site:vn.indeed.com OR site:indeed.com OR site:glints.com OR site:topdev.vn OR site:timviec365.vn OR site:timviec365.com) \"{query}\" (\"renewable\" OR \"điện gió\" OR \"năng lượng\" OR \"solar\" OR \"windfarm\")"
    else:
        search_query = f"site:linkedin.com/posts OR site:facebook.com \"{query}\" (hiring OR recruitment)"
        
    cmd = [
        "mcporter",
        "call",
        "exa.web_search_exa",
        f"query={search_query}",
        "numResults=8"
    ]
    
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", shell=True, timeout=25)
        if r.returncode == 0:
            return parse_exa_results(r.stdout, platform)
        else:
            print("mcporter failed:", r.stderr)
            return []
    except Exception as e:
        print("Scraper exception:", e)
        return []
