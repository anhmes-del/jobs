# -*- coding: utf-8 -*-
"""
Scrapling-based Facebook scraper for Vietnamese construction/renewable energy job posts.
Uses Scrapling's StealthyFetcher (Playwright-backed) to bypass anti-bot detection
on Facebook public group/page posts.
"""
import os
import time
import re
import hashlib
from datetime import datetime


def _generate_id(text: str) -> str:
    """Generate a deterministic ID from text content."""
    return "scrapling_fb_" + hashlib.md5(text.encode("utf-8")).hexdigest()[:10]


def _extract_phone(text: str) -> str:
    """Extract Vietnamese phone number from text."""
    patterns = [
        r"(0[35789]\d[\s.-]?\d{3}[\s.-]?\d{4})",
        r"(0[235]\d[\s.-]?\d{3}[\s.-]?\d{4})",
        r"(\+84\s?\d[\s.-]?\d{3}[\s.-]?\d{4})",
    ]
    for pat in patterns:
        m = re.search(pat, text)
        if m:
            return m.group(1).strip()
    return "N/A"


def _extract_email(text: str) -> str:
    """Extract email address from text."""
    m = re.findall(r"[\w\.\-\+]+@[\w\.\-]+\.\w+", text)
    return m[0] if m else "N/A"


def _extract_salary(text: str) -> str:
    """Extract salary info from Vietnamese text."""
    patterns = [
        r"(lương\s*[:.]?\s*[\d\.,]+\s*[-–]\s*[\d\.,]+\s*(?:triệu|tr|M|VND|vnđ))",
        r"([\d\.,]+\s*[-–]\s*[\d\.,]+\s*(?:triệu|tr|M)\s*/?\s*(?:tháng|month)?)",
        r"(lương\s*[:.]?\s*(?:thỏa thuận|thoả thuận|cạnh tranh|hấp dẫn))",
        r"(thu nhập\s*[:.]?\s*[\d\.,]+\s*[-–]\s*[\d\.,]+\s*(?:triệu|tr|M))",
        r"((?:up\s*to|tới|đến)\s*[\d\.,]+\s*(?:triệu|tr|M|VND))",
    ]
    for pat in patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            return m.group(1).strip()
    if re.search(r"thỏa thuận|thoả thuận|negotiable", text, re.IGNORECASE):
        return "Thỏa thuận"
    return "Negotiable"


def _detect_role(text: str) -> str:
    """Detect role from Vietnamese/English text."""
    t = text.lower()
    if any(kw in t for kw in ["hse", "an toàn", "safety", "bảo hộ", "giám sát an toàn"]):
        return "HSE"
    if any(kw in t for kw in ["project manager", "giám đốc dự án", "quản lý dự án", "pm dự án", "trưởng phòng dự án"]):
        return "Project Manager"
    if any(kw in t for kw in ["civil", "xây dựng", "xay dung", "structural", "kết cấu", "ket cau"]):
        return "Civil Engineer"
    return "Site Manager"


def _detect_location(text: str) -> str:
    """Extract location from Vietnamese text."""
    provinces = [
        "Trà Vinh", "Tra Vinh", "Bình Thuận", "Binh Thuan",
        "Quảng Trị", "Quang Tri", "Ninh Thuận", "Ninh Thuan",
        "Đắk Lắk", "Dak Lak", "Gia Lai", "Cà Mau", "Ca Mau",
        "Vũng Tàu", "Vung Tau", "Bạc Liêu", "Bac Lieu",
        "Sóc Trăng", "Soc Trang", "Hà Nội", "Ha Noi",
        "Hồ Chí Minh", "HCM", "TPHCM", "Đà Nẵng", "Da Nang",
        "Quảng Bình", "Quang Binh", "Hà Tĩnh", "Ha Tinh",
        "Phú Yên", "Phu Yen", "Bến Tre", "Ben Tre",
        "Đồng Nai", "Dong Nai", "Bình Dương", "Binh Duong",
        "Long An", "Tiền Giang", "Tien Giang",
    ]
    for prov in provinces:
        if prov.lower() in text.lower():
            return prov + ", Vietnam"
    return "Vietnam"


def _detect_project_type(text: str) -> str:
    """Detect project type from text."""
    t = text.lower()
    if any(kw in t for kw in ["offshore", "ngoài khơi"]):
        return "Offshore"
    if any(kw in t for kw in ["nearshore", "gần bờ"]):
        return "Nearshore"
    return "Onshore"


def _extract_recruiter_name(text: str) -> str:
    """Try to extract recruiter/poster name from text."""
    patterns = [
        r"(?:liên hệ|lh|contact)\s*[:.]?\s*(?:anh|chị|mr\.?|ms\.?|mrs\.?)\s+([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+)*)",
        r"(?:anh|chị|mr\.?|ms\.?|mrs\.?)\s+([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+)*)\s*[-–:.]?\s*(?:0[35789]\d)",
    ]
    for pat in patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            return m.group(1).strip()
    return "HR Recruiter"


def _extract_requirements(text: str) -> list:
    """Extract key requirements from Vietnamese job post text."""
    reqs = []
    bullets = re.findall(r"(?:[✅🔹🔑⚡🎯•\-➡️👉✔️]\s*)([^\n]{10,80})", text)
    if bullets:
        reqs = [b.strip() for b in bullets[:5]]
    if not reqs:
        kw_patterns = [
            r"(kinh nghiệm\s*\d+\s*năm[^,.\n]*)",
            r"(\d+\s*(?:năm|years?)\s*(?:kinh nghiệm|experience)[^,.\n]*)",
            r"(tốt nghiệp\s*[^,.\n]{5,50})",
            r"(chứng chỉ\s*[^,.\n]{5,50})",
            r"(tiếng (?:anh|Anh)\s*[^,.\n]{3,40})",
            r"(giao tiếp\s*[^,.\n]{3,40})",
        ]
        for pat in kw_patterns:
            ms = re.findall(pat, text, re.IGNORECASE)
            for m in ms:
                if len(m.strip()) > 8:
                    reqs.append(m.strip()[:60])
    if not reqs:
        reqs = ["Quản lý thi công công trường", "Kinh nghiệm xây dựng/năng lượng"]
    return reqs[:5]


def _fb_login_action(page):
    """Page action to log into Facebook if we hit a login wall.
    Credentials are read from environment variables (not hardcoded).
    """
    fb_email = os.environ.get("FB_EMAIL")
    fb_pass = os.environ.get("FB_PASS")
    if not fb_email or not fb_pass:
        print("  [Scrapling] FB_EMAIL/FB_PASS not set — skipping login")
        return
    try:
        email_input = page.locator("input[name='email']")
        if email_input.is_visible(timeout=5000):
            print("  [Scrapling] Detected Facebook login wall, attempting login...")
            email_input.fill(fb_email)
            page.locator("input[name='pass']").fill(fb_pass)
            login_btn = page.locator("button[name='login']")
            if login_btn.is_visible():
                login_btn.click()
            else:
                page.keyboard.press("Enter")
            page.wait_for_timeout(10000)
            print("  [Scrapling] Login attempt completed.")
        else:
            print("  [Scrapling] Already logged in or no login form found.")
    except Exception as e:
        print(f"  [Scrapling] Error during login action: {e}")


def run_scrapling_scrape(query: str, platform: str = "All") -> dict:
    """
    Run a real Scrapling scrape on Facebook public search/groups for
    Vietnamese construction & renewable energy job posts.
    
    Falls back to Fetcher (requests-based) if StealthyFetcher is unavailable.
    """
    start_time = time.time()
    jobs = []
    success = True
    error_message = None
    fetcher_used = "Fetcher"

    # Build search URLs for Facebook public posts
    search_terms = query.replace(" ", "%20")
    urls_to_scrape = []

    if platform in ("All", "Facebook"):
        urls_to_scrape.extend([
            f"https://m.facebook.com/search/posts/?q={search_terms}%20tuy%E1%BB%83n%20d%E1%BB%A5ng%20vi%E1%BB%87t%20nam",
            f"https://m.facebook.com/search/posts/?q=ch%E1%BB%89%20huy%20tr%C6%B0%E1%BB%9Fng%20%C4%91i%E1%BB%87n%20gi%C3%B3%20tuy%E1%BB%83n%20d%E1%BB%A5ng",
        ])

    try:
        # Try Fetcher first (requests-based, stable)
        # StealthyFetcher uses .fetch() and requires Patchright browsers
        # Fetcher uses .get() and works with requests/curl_cffi
        use_stealthy = False
        try:
            from scrapling import StealthyFetcher
            fetcher = StealthyFetcher
            fetcher_used = "StealthyFetcher"
            use_stealthy = True
        except Exception:
            pass
        
        if not use_stealthy:
            try:
                from scrapling import Fetcher
                fetcher = Fetcher
                fetcher_used = "Fetcher"
            except ImportError:
                # scrapling not installed at all (e.g., Vercel serverless)
                raise ImportError("scrapling package not available in this environment")
        else:
            # Ensure we are logged in before hitting search URLs
            print("[Scrapling] Ensuring Facebook session is active...")
            fetcher.fetch(
                "https://m.facebook.com/login",
                headless=True,
                timeout=30000,
                user_data_dir="./scrapling_fb_profile",
                page_action=_fb_login_action
            )

        for url in urls_to_scrape:
            try:
                if use_stealthy:
                    response = fetcher.fetch(
                        url, 
                        headless=True, 
                        timeout=30000, 
                        user_data_dir="./scrapling_fb_profile"
                    )
                else:
                    response = fetcher.get(url, timeout=15)
                
                if response.status is None or response.status >= 400:
                    continue

                # Try to find post containers on Facebook
                # Facebook mobile uses various div structures for posts
                post_selectors = [
                    "div[data-ft]",           # Classic Facebook post container
                    "article",                # Article elements
                    "div.story_body_container", # Story body
                    "div[role='article']",     # Modern FB article role
                ]

                posts = []
                for selector in post_selectors:
                    found = response.css(selector)
                    if found:
                        posts = found
                        break

                # If structured selectors fail, try to get text blocks
                if not posts:
                    # Get all text content and try to parse it
                    page_text = response.get_all_text() if hasattr(response, 'get_all_text') else str(response.text)
                    if page_text and len(page_text) > 100:
                        # Split by common separators and look for job-related content
                        segments = re.split(r'\n{2,}|<br\s*/?>\s*<br\s*/?>|<hr', page_text)
                        for seg in segments:
                            seg = seg.strip()
                            if len(seg) < 50:
                                continue
                            # Check if this segment looks like a job post
                            job_keywords = [
                                "tuyển dụng", "tuyển gấp", "cần tuyển",
                                "chỉ huy trưởng", "site manager", "giám sát",
                                "công trường", "điện gió", "năng lượng",
                                "xây dựng", "liên hệ", "lương",
                            ]
                            matches = sum(1 for kw in job_keywords if kw in seg.lower())
                            if matches >= 2:
                                # Parse this segment as a job post
                                title_match = re.search(
                                    r"(?:tuyển\s*(?:dụng|gấp)?)\s*[:.\-]?\s*(.{10,80})",
                                    seg, re.IGNORECASE
                                )
                                title = title_match.group(1).strip() if title_match else seg[:80].strip()
                                # Clean up title
                                title = re.sub(r'\s+', ' ', title).strip()
                                if len(title) > 80:
                                    title = title[:77] + "..."

                                phone = _extract_phone(seg)
                                email = _extract_email(seg)
                                zalo = re.sub(r"\D", "", phone) if phone != "N/A" else "N/A"

                                job = {
                                    "id": _generate_id(seg[:100]),
                                    "title": title,
                                    "company": "Facebook Post",
                                    "platform": "Facebook",
                                    "location": _detect_location(seg),
                                    "role": _detect_role(seg),
                                    "recruiter_name": _extract_recruiter_name(seg),
                                    "recruiter_profile": url,
                                    "post_url": url,
                                    "post_date": datetime.now().strftime("%b %d, %Y"),
                                    "raw_text": seg[:300],
                                    "key_requirements": _extract_requirements(seg),
                                    "project_type": _detect_project_type(seg),
                                    "salary": _extract_salary(seg),
                                    "contact_info": f"{email} | {phone}" if email != "N/A" or phone != "N/A" else "Xem bài đăng gốc",
                                    "email": email,
                                    "phone": phone,
                                    "zalo": zalo,
                                    "facebook": url,
                                }
                                jobs.append(job)

                else:
                    # Process structured post elements
                    for post_el in posts[:10]:
                        try:
                            post_text = post_el.text if hasattr(post_el, 'text') else str(post_el)
                            if len(post_text) < 30:
                                continue
                            
                            job_keywords = [
                                "tuyển", "cần tuyển", "chỉ huy",
                                "site manager", "công trường", "điện gió",
                                "xây dựng", "liên hệ",
                            ]
                            if not any(kw in post_text.lower() for kw in job_keywords):
                                continue

                            title_match = re.search(
                                r"(?:tuyển\s*(?:dụng|gấp)?)\s*[:.\-]?\s*(.{10,80})",
                                post_text, re.IGNORECASE
                            )
                            title = title_match.group(1).strip() if title_match else post_text[:80].strip()
                            title = re.sub(r'\s+', ' ', title).strip()

                            # Try to find post link
                            post_link = url
                            link_el = post_el.css("a[href*='/posts/']") or post_el.css("a[href*='story_fbid']")
                            if link_el:
                                href = link_el[0].attrib.get("href", "")
                                if href:
                                    post_link = "https://www.facebook.com" + href if href.startswith("/") else href

                            phone = _extract_phone(post_text)
                            email = _extract_email(post_text)
                            zalo = re.sub(r"\D", "", phone) if phone != "N/A" else "N/A"

                            job = {
                                "id": _generate_id(post_text[:100]),
                                "title": title,
                                "company": "Facebook Post",
                                "platform": "Facebook",
                                "location": _detect_location(post_text),
                                "role": _detect_role(post_text),
                                "recruiter_name": _extract_recruiter_name(post_text),
                                "recruiter_profile": post_link,
                                "post_url": post_link,
                                "post_date": datetime.now().strftime("%b %d, %Y"),
                                "raw_text": post_text[:300],
                                "key_requirements": _extract_requirements(post_text),
                                "project_type": _detect_project_type(post_text),
                                "salary": _extract_salary(post_text),
                                "contact_info": f"{email} | {phone}" if email != "N/A" or phone != "N/A" else "Xem bài đăng gốc",
                                "email": email,
                                "phone": phone,
                                "zalo": zalo,
                                "facebook": post_link,
                            }
                            jobs.append(job)
                        except Exception as e:
                            print(f"  [Scrapling] Error parsing post element: {e}")
                            continue

            except Exception as e:
                print(f"[Scrapling] Error fetching {url}: {e}")
                continue

    except Exception as e:
        success = False
        error_message = str(e)
        print(f"[Scrapling] Fatal error: {e}")

    if not jobs and not error_message:
        error_message = "Không tìm thấy dữ liệu thực từ Facebook."

    elapsed_ms = int((time.time() - start_time) * 1000)

    return {
        "jobs": jobs,
        "metrics": {
            "postings_found": len(jobs),
            "speed_ms": elapsed_ms,
            "success_rate": 100 if success and jobs else (60 if jobs else 0),
            "fetcher_used": fetcher_used,
            "error": error_message,
        }
    }
