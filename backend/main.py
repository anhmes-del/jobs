# -*- coding: utf-8 -*-
import sys
import os
import types

# Ensure the 'backend' package is importable when running inside Vercel's serverless environment
if "backend" not in sys.modules:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    m = types.ModuleType("backend")
    m.__path__ = [current_dir]
    sys.modules["backend"] = m

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from backend.mock_data import MOCK_JOBS
import re

class VercelPrefixMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            if path.startswith("/_/backend"):
                new_path = path[len("/_/backend"):] or "/"
                scope["path"] = new_path
                if "raw_path" in scope:
                    raw = scope["raw_path"]
                    prefix = b"/_/backend"
                    if raw.startswith(prefix):
                        new_raw = raw[len(prefix):] or b"/"
                        scope["raw_path"] = new_raw
        await self.app(scope, receive, send)

app = FastAPI(title="Wind Farm Job Tracker API")
app.add_middleware(VercelPrefixMiddleware)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/jobs")
def get_jobs(
    platform: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
):
    filtered_jobs = MOCK_JOBS.copy()
    
    if platform and platform.lower() != "all":
        filtered_jobs = [j for j in filtered_jobs if j["platform"].lower() == platform.lower()]
        
    if location and location.lower() != "all":
        filtered_jobs = [j for j in filtered_jobs if location.lower() in j["location"].lower()]

    if role and role.lower() != "all":
        filtered_jobs = [j for j in filtered_jobs if j.get("role", "Site Manager").lower() == role.lower()]
        
    if q:
        q_clean = q.lower().strip()
        filtered_jobs = [
            j for j in filtered_jobs
            if q_clean in j["title"].lower()
            or q_clean in j["company"].lower()
            or q_clean in j["raw_text"].lower()
            or any(q_clean in req.lower() for req in j["key_requirements"])
        ]
        
    return filtered_jobs

@app.post("/api/jobs")
def add_job(job: dict):
    if any(j["id"] == job["id"] for j in MOCK_JOBS):
        return {"status": "already_exists"}
    MOCK_JOBS.insert(0, job)
    return {"status": "success", "job": job}

@app.get("/api/stats")
def get_stats():
    # Calculate stats over all mock jobs
    total_jobs = len(MOCK_JOBS)
    
    platform_counts = {"LinkedIn": 0, "Facebook": 0}
    location_counts = {}
    company_counts = {}
    project_type_counts = {}
    role_counts = {"Site Manager": 0, "Project Manager": 0, "HSE": 0, "Civil Engineer": 0}
    
    for job in MOCK_JOBS:
        platform_counts[job["platform"]] = platform_counts.get(job["platform"], 0) + 1
        
        # Location simple extraction (city/province)
        loc = job["location"].split(",")[0].strip()
        location_counts[loc] = location_counts.get(loc, 0) + 1
        
        comp = job["company"]
        company_counts[comp] = company_counts.get(comp, 0) + 1
        
        ptype = job["project_type"]
        project_type_counts[ptype] = project_type_counts.get(ptype, 0) + 1

        r = job.get("role", "Site Manager")
        role_counts[r] = role_counts.get(r, 0) + 1
        
    return {
        "total": total_jobs,
        "platforms": [{"name": k, "value": v} for k, v in platform_counts.items()],
        "locations": [{"name": k, "value": v} for k, v in location_counts.items()],
        "companies": [{"name": k, "value": v} for k, v in company_counts.items()],
        "project_types": [{"name": k, "value": v} for k, v in project_type_counts.items()],
        "roles": [{"name": k, "value": v} for k, v in role_counts.items()],
    }

@app.post("/api/chat")
def chat_with_data(payload: dict):
    message = payload.get("message", "").lower()
    
    # Simple semantic search / response generator based on the mock jobs database
    if "chứng chỉ" in message or "cert" in message or "gwo" in message:
        gwo_jobs = [j for j in MOCK_JOBS if any("gwo" in r.lower() for r in j["key_requirements"])]
        response_text = (
            f"Các tin tuyển dụng yêu cầu chứng chỉ **GWO (Global Wind Organisation)** bao gồm:\n\n"
            + "\n".join([f"- **{j['title']}** tại *{j['company']}* ({j['location']})" for j in gwo_jobs])
            + "\n\nHầu hết các dự án Nearshore (gần bờ) hoặc Offshore (ngoài khơi) đều bắt buộc chứng chỉ này để đảm bảo an toàn làm việc trên cao và môi trường nước."
        )
    elif "tra vinh" in message or "trà vinh" in message:
        travinh_jobs = [j for j in MOCK_JOBS if "tra vinh" in j["location"].lower()]
        response_text = (
            f"Tôi tìm thấy **{len(travinh_jobs)} tin tuyển dụng** tại **Trà Vinh**:\n\n"
            + "\n".join([f"- **{j['title']}** - *{j['company']}* (Nguồn: {j['platform']})\n  *Liên hệ:* `{j['contact_info']}`" for j in travinh_jobs])
        )
    elif "vestas" in message:
        vestas_jobs = [j for j in MOCK_JOBS if "vestas" in j["company"].lower()]
        response_text = (
            f"Hiện tại **Vestas** có tin tuyển dụng cho vị trí:\n\n"
            + "\n".join([f"- **{j['title']}** ở {j['location']}.\n  *Yêu cầu chính:* {', '.join(j['key_requirements'])}\n  *Email nhận hồ sơ:* `{j['contact_info']}`" for j in vestas_jobs])
        )
    elif "lương" in message or "salary" in message or "tiền" in message:
        jobs_with_salary = [j for j in MOCK_JOBS if "usd" in j["salary"].lower() or "vnd" in j["salary"].lower() or "m vnd" in j["salary"].lower()]
        response_text = (
            f"Dưới đây là các tin tuyển dụng có thông tin mức lương rõ ràng:\n\n"
            + "\n".join([f"- **{j['title']}** tại *{j['company']}*: Mức lương **{j['salary']}**" for j in jobs_with_salary])
            + "\n\nCác vị trí khác thường để trạng thái 'Thỏa thuận' tùy thuộc vào số năm kinh nghiệm và năng lực thực tế của bạn."
        )
    elif "kinh nghiệm" in message or "experience" in message or "năm" in message:
        response_text = (
            "Dựa trên dữ liệu tuyển dụng Site Manager điện gió:\n\n"
            "- Các nhà thầu quốc tế (Vestas, Siemens Gamesa) yêu cầu từ **5 - 8 năm kinh nghiệm** chuyên sâu về điện gió.\n"
            "- Các nhà thầu và chủ đầu tư trong nước (Trung Nam, Fecon, IPC) yêu cầu từ **3 - 5 năm kinh nghiệm** quản lý công trường xây dựng hoặc hạ tầng kỹ thuật.\n"
            "- Các chứng chỉ phụ trợ bắt buộc: Chứng chỉ hành nghề Giám sát thi công Hạng I (đối với Onshore nội địa)."
        )
    else:
        response_text = (
            "Xin chào! Tôi là trợ lý AI phân tích dữ liệu tuyển dụng điện gió. Bạn có thể hỏi tôi các câu hỏi như:\n\n"
            "- *'Có những tin tuyển dụng nào ở Trà Vinh?'*\n"
            "- *'Các tin tuyển dụng nào yêu cầu chứng chỉ GWO?'*\n"
            "- *'Mức lương trung bình của Site Manager là bao nhiêu?'*\n"
            "- *'Vestas đang tuyển dụng vị trí nào?'*"
        )
        
    return {"response": response_text}

@app.post("/api/scrape")
def scrape_jobs_endpoint(payload: dict):
    from backend.scraper import run_live_scrape
    query = payload.get("query", "site manager renewable")
    platform = payload.get("platform", "All")
    
    scraped = run_live_scrape(query, platform)
    return scraped

@app.post("/api/scrape/scrapling")
def scrape_scrapling_endpoint(payload: dict):
    from backend.scrapling_scraper import run_scrapling_scrape
    query = payload.get("query", "site manager renewable")
    platform = payload.get("platform", "All")
    
    return run_scrapling_scrape(query, platform)

