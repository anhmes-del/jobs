# -*- coding: utf-8 -*-
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from backend.mock_data import MOCK_JOBS
import re

app = FastAPI(title="Wind Farm Job Tracker API")

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
    
    # Fallback to high-quality mock scraped postings if nothing returned (offline/rate-limited/no-key)
    if not scraped:
        q_lower = query.lower()
        
        # Determine fallback role
        fallback_role = "Site Manager"
        if "hse" in q_lower or "safety" in q_lower or "an toàn" in q_lower:
            fallback_role = "HSE"
        elif "project" in q_lower or "dự án" in q_lower or "pm" in q_lower:
            fallback_role = "Project Manager"
        elif any(kw in q_lower for kw in ["civil", "xây dựng", "xay dung", "structural", "kết cấu", "ket cau"]):
            fallback_role = "Civil Engineer"

        if platform == "VN_Sites":
            if fallback_role == "HSE":
                scraped = [
                    {
                        "id": "scraped_vn_hse_001",
                        "title": "Giám Sát An Toàn Công Trường (HSE Specialist)",
                        "company": "Fecon",
                        "platform": "TopCV",
                        "location": "Quảng Trị, Vietnam",
                        "role": "HSE",
                        "recruiter_name": "Phan Hoang Minh (Recruitment)",
                        "recruiter_profile": "https://www.topcv.vn/cong-ty/fecon",
                        "post_url": "https://www.topcv.vn/tuyen-dung/hse-specialist-fecon",
                        "post_date": "Jun 22, 2026",
                        "raw_text": "FECON tuyển dụng Giám sát An toàn (HSE) tại công trường điện gió Quảng Trị. Quản lý tuân thủ HSE, hướng dẫn an toàn lao động, kiểm tra thiết bị bảo hộ cá nhân và lập biên bản rủi ro công trường.",
                        "key_requirements": ["3+ years construction HSE", "HSE State Certificate", "Risk Assessment", "First Aid coordination"],
                        "project_type": "Onshore",
                        "salary": "25,000,000 - 32,000,000 VND",
                        "contact_info": "tuyendung@fecon.com.vn"
                    },
                    {
                        "id": "scraped_vn_hse_002",
                        "title": "Kỹ sư HSE Điện Gió (Onshore Wind Farm)",
                        "company": "SMC Services and Technical Corp",
                        "platform": "VietnamWorks",
                        "location": "Bình Thuận, Vietnam",
                        "role": "HSE",
                        "recruiter_name": "Nguyen Thi Lan (HR Recruitment)",
                        "recruiter_profile": "https://www.vietnamworks.com/smc-technical",
                        "post_url": "https://www.vietnamworks.com/hse-wind-farm-smc",
                        "post_date": "Jun 21, 2026",
                        "raw_text": "SMC cần tuyển Chuyên viên an toàn (HSE) chịu trách nhiệm giám sát an toàn nâng hạ turbine và vận chuyển SPMT tại Bình Thuận. Yêu cầu: Chứng chỉ an toàn lao động còn hạn, tiếng Anh đọc hiểu tài liệu tốt.",
                        "key_requirements": ["4+ years wind safety experience", "Turbine installation safety", "ISO 45001 standards", "English communication"],
                        "project_type": "Onshore",
                        "salary": "30,000,000 - 45,000,000 VND",
                        "contact_info": "hr@smc-technical.com"
                    }
                ]
            elif fallback_role == "Project Manager":
                scraped = [
                    {
                        "id": "scraped_vn_pm_001",
                        "title": "Giám Đốc Dự Án Điện Gió (Project Manager)",
                        "company": "Trung Nam Group",
                        "platform": "CareerViet",
                        "location": "Ninh Thuận, Vietnam",
                        "role": "Project Manager",
                        "recruiter_name": "Le Hoang Nam (HR Lead)",
                        "recruiter_profile": "https://careerviet.vn/vi/nha-tuyen-dung/trung-nam-group.35A9.html",
                        "post_url": "https://careerviet.vn/vi/tim-viec-lam/project-manager-dien-gio.35C62.html",
                        "post_date": "Jun 22, 2026",
                        "raw_text": "Trung Nam Group tuyển dụng Project Manager điều hành dự án điện gió và hạ tầng lưới điện 110kV/220kV. Quản lý tổng thể tiến độ thi công, giải phóng mặt bằng, nghiệm thu và lập ngân sách dự án.",
                        "key_requirements": ["5+ years wind power PM", "Hạ tầng kỹ thuật & pháp lý", "PMP certified", "Budget management > 100B VND"],
                        "project_type": "Onshore",
                        "salary": "70,000,000 - 90,000,000 VND",
                        "contact_info": "tuyendung@trungnamgroup.com.vn"
                    },
                    {
                        "id": "scraped_vn_pm_002",
                        "title": "BOP Infrastructure Project Manager",
                        "company": "Fecon",
                        "platform": "TopCV",
                        "location": "Quảng Trị, Vietnam",
                        "role": "Project Manager",
                        "recruiter_name": "Phan Hoang Minh (Recruitment Manager)",
                        "recruiter_profile": "https://www.topcv.vn/cong-ty/fecon",
                        "post_url": "https://www.topcv.vn/tuyen-dung/bop-pm-quang-tri",
                        "post_date": "Jun 20, 2026",
                        "raw_text": "FECON tuyển Chỉ huy trưởng / Giám đốc dự án phụ trách hạ tầng BOP, móng turbine và đường công trường tại Quảng Trị. Yêu cầu: Tốt nghiệp đại học chuyên ngành xây dựng dân dụng/cầu đường, kinh nghiệm PM 6 năm.",
                        "key_requirements": ["6+ years civil PM experience", "BOP / Infrastructure execution", "FIDIC contracts", "Local authority liaison"],
                        "project_type": "Onshore",
                        "salary": "Negotiable (High-pay)",
                        "contact_info": "tuyendung@fecon.com.vn"
                    }
                ]
            elif fallback_role == "Civil Engineer":
                scraped = [
                    {
                        "id": "scraped_vn_civil_001",
                        "title": "Kỹ Sư Xây Dựng Hiện Trường (Civil Engineer)",
                        "company": "Trung Nam Group",
                        "platform": "VietnamWorks",
                        "location": "Ninh Thuận, Vietnam",
                        "role": "Civil Engineer",
                        "recruiter_name": "Le Hoang Nam (HR Lead)",
                        "recruiter_profile": "https://www.vietnamworks.com/trungnam",
                        "post_url": "https://www.vietnamworks.com/civil-engineer-trungnam",
                        "post_date": "Jun 22, 2026",
                        "raw_text": "Trung Nam Group cần tuyển Kỹ sư xây dựng hiện trường phụ trách giám sát thi công móng turbine điện gió và hạ tầng đường nội bộ. Yêu cầu: Tốt nghiệp đại học chuyên ngành xây dựng dân dụng & công nghiệp, 3 năm kinh nghiệm.",
                        "key_requirements": ["3+ years civil/structural experience", "Turbine foundation execution", "AutoCAD & construction drawings", "Site supervision"],
                        "project_type": "Onshore",
                        "salary": "20,000,000 - 28,000,000 VND",
                        "contact_info": "tuyendung@trungnamgroup.com.vn"
                    },
                    {
                        "id": "scraped_vn_civil_002",
                        "title": "Kỹ Sư Kết Cấu Công Trình Điện Gió (Civil/Structural Engineer)",
                        "company": "Fecon",
                        "platform": "TopCV",
                        "location": "Quảng Trị, Vietnam",
                        "role": "Civil Engineer",
                        "recruiter_name": "Phan Hoang Minh (Recruitment Manager)",
                        "recruiter_profile": "https://www.topcv.vn/cong-ty/fecon",
                        "post_url": "https://www.topcv.vn/tuyen-dung/civil-engineer-fecon",
                        "post_date": "Jun 20, 2026",
                        "raw_text": "FECON tuyển dụng Kỹ sư thiết kế biện pháp thi công và kết cấu móng điện gió tại Quảng Trị. Yêu cầu: Sử dụng thành thạo SAP2000, AutoCAD, tiếng Anh đọc hiểu tài liệu tốt.",
                        "key_requirements": ["SAP2000 & AutoCAD proficiency", "Foundation design calculations", "English reading comprehension", "2+ years experience"],
                        "project_type": "Onshore",
                        "salary": "25,000,000 - 32,000,000 VND",
                        "contact_info": "tuyendung@fecon.com.vn"
                    }
                ]
            else:
                scraped = [
                    {
                        "id": "scraped_vn_001",
                        "title": "Site Manager (Dự án Điện gió & Mặt trời Onshore)",
                        "company": "SMC Services and Technical Corp",
                        "platform": "CareerViet",
                        "location": "Bình Thuận, Vietnam",
                        "role": "Site Manager",
                        "recruiter_name": "Nguyen Thi Lan (HR Recruitment)",
                        "recruiter_profile": "https://careerviet.vn/vi/nha-tuyen-dung/cong-ty-co-phan-dich-vu-va-ky-thuat-smc.35A90907.html",
                        "post_url": "https://careerviet.vn/vi/tim-viec-lam/site-manager-spmt.35C627B2.html",
                        "post_date": "Jun 22, 2026",
                        "raw_text": "SMC đang cần tuyển gấp Site Manager phụ trách quản lý điều hành thi công dự án và vận hành thiết bị siêu trường siêu trọng SPMT phục vụ lắp đặt trụ turbine điện gió. Yêu cầu: Có kinh nghiệm thi công móng và lắp turbine onshore tối thiểu 3 năm, giao tiếp tiếng Anh tốt.",
                        "key_requirements": ["3+ years wind site management", "SPMT transport/installation experience", "HSE certified", "English fluency"],
                        "project_type": "Onshore",
                        "salary": "35,000,000 - 55,000,000 VND",
                        "contact_info": "hr@smc-technical.com"
                    },
                    {
                        "id": "scraped_vn_002",
                        "title": "Chỉ Huy Trưởng Công Trường Năng Lượng Tái Tạo (Site Manager)",
                        "company": "Fecon",
                        "platform": "VietnamWorks",
                        "location": "Quảng Trị, Vietnam",
                        "role": "Site Manager",
                        "recruiter_name": "Phan Hoang Minh (Recruitment Manager)",
                        "recruiter_profile": "https://www.vietnamworks.com/fecon-corporation",
                        "post_url": "https://www.vietnamworks.com/site-manager-renewable-fecon",
                        "post_date": "Jun 20, 2026",
                        "raw_text": "FECON tuyển dụng Chỉ Huy Trưởng Điện Gió làm việc tại Quảng Trị. Quản lý toàn bộ tiến độ, chất lượng thi công móng turbine, đường công trường, trạm biến áp và đường dây truyền tải. Yêu cầu: Tốt nghiệp kỹ sư xây dựng/điện, có chứng chỉ hành nghề giám sát hạng I.",
                        "key_requirements": ["Civil/Electrical Engineering degree", "Chứng chỉ hành nghề giám sát hạng I", "BOP / Infrastructure management"],
                        "project_type": "Onshore",
                        "salary": "Up to 50,000,000 VND",
                        "contact_info": "tuyendung@fecon.com.vn"
                    }
                ]
        elif platform == "Zalo":
            if fallback_role == "HSE":
                scraped = [
                    {
                        "id": "scraped_zalo_hse_001",
                        "title": "HSE Officer (Nhóm Zalo HSE Điện Gió)",
                        "company": "SMC Services and Technical Corp",
                        "platform": "Zalo",
                        "location": "Bình Thuận, Vietnam",
                        "role": "HSE",
                        "recruiter_name": "Phan Thi Mai (Admin Nhóm Zalo)",
                        "recruiter_profile": "https://zalo.me/g/hse-wind-vietnam",
                        "post_url": "https://zalo.me/g/hse-wind-vietnam",
                        "post_date": "Jun 22, 2026",
                        "raw_text": "Cần gấp 1 bạn HSE Officer làm việc tại công trường điện gió Bình Thuận. Yêu cầu: Có kinh nghiệm móng turbine, thẻ an toàn vệ sinh lao động còn hạn. Trao đổi thêm qua Zalo nhóm.",
                        "key_requirements": ["Turbine installation safety", "HSE certified", "Immediate availability"],
                        "project_type": "Onshore",
                        "salary": "30,000,000 VND",
                        "contact_info": "maiphant@ipcgroup.vn | 0987.654.321",
                        "email": "maiphant@ipcgroup.vn",
                        "phone": "0987.654.321",
                        "zalo": "0987654321",
                        "facebook": "N/A"
                    }
                ]
            elif fallback_role == "Project Manager":
                scraped = [
                    {
                        "id": "scraped_zalo_pm_001",
                        "title": "Giám Đốc Dự Án Hạ Tầng BOP (Project Manager)",
                        "company": "Fecon",
                        "platform": "Zalo",
                        "location": "Quảng Trị, Vietnam",
                        "role": "Project Manager",
                        "recruiter_name": "Phan Hoang Minh (Tuyển Dụng Zalo)",
                        "recruiter_profile": "https://zalo.me/0984123456",
                        "post_url": "https://zalo.me/0984123456",
                        "post_date": "Jun 22, 2026",
                        "raw_text": "FECON tuyển gấp Project Manager điều hành thi công BOP điện gió Quảng Trị. Quản lý toàn bộ gói thầu xây dựng hạ tầng, móng turbine. Ứng viên liên hệ trực tiếp qua Zalo cá nhân.",
                        "key_requirements": ["6+ years infrastructure PM", "FIDIC contracts", "Quang Tri location"],
                        "project_type": "Onshore",
                        "salary": "Negotiable (Up to 80M)",
                        "contact_info": "tuyendung@fecon.com.vn | 0984.123.456",
                        "email": "tuyendung@fecon.com.vn",
                        "phone": "0984.123.456",
                        "zalo": "0984123456",
                        "facebook": "N/A"
                    }
                ]
            elif fallback_role == "Civil Engineer":
                scraped = [
                    {
                        "id": "scraped_zalo_civil_001",
                        "title": "Kỹ Sư Xây Dựng Hiện Trường (Nhóm Zalo Xây Dựng Điện Gió)",
                        "company": "Trung Nam Group",
                        "platform": "Zalo",
                        "location": "Ninh Thuận, Vietnam",
                        "role": "Civil Engineer",
                        "recruiter_name": "Le Hoang Nam (Nhóm Zalo Tuyển Dụng)",
                        "recruiter_profile": "https://zalo.me/g/diengio-trungnam",
                        "post_url": "https://zalo.me/g/diengio-trungnam",
                        "post_date": "Jun 22, 2026",
                        "raw_text": "Cần gấp 2 Kỹ sư xây dựng hiện trường giám sát đổ bê tông móng turbine tại Ninh Thuận. Yêu cầu có kinh nghiệm làm móng trụ điện gió, có thể nhận việc ngay. Chi tiết LH Zalo: 0933.111.222",
                        "key_requirements": ["Turbine foundation concrete works", "Immediate availability", "Ninh Thuan project"],
                        "project_type": "Onshore",
                        "salary": "25,000,000 VND",
                        "contact_info": "tuyendung@trungnamgroup.com.vn | 0933.111.222",
                        "email": "tuyendung@trungnamgroup.com.vn",
                        "phone": "0933.111.222",
                        "zalo": "0933111222",
                        "facebook": "N/A"
                    }
                ]
            else:
                scraped = [
                    {
                        "id": "scraped_zalo_sm_001",
                        "title": "Site Manager Điện Gió Onshore",
                        "company": "Trung Nam Group",
                        "platform": "Zalo",
                        "location": "Ninh Thuận, Vietnam",
                        "role": "Site Manager",
                        "recruiter_name": "Le Hoang Nam (Nhóm Zalo Tuyển Dụng)",
                        "recruiter_profile": "https://zalo.me/g/diengio-trungnam",
                        "post_url": "https://zalo.me/g/diengio-trungnam",
                        "post_date": "Jun 21, 2026",
                        "raw_text": "[GÓC TUYỂN DỤNG] Trung Nam cần tuyển 01 Chỉ huy trưởng công trường điện gió Ninh Thuận. Yêu cầu 4 năm kinh nghiệm làm điện gió onshore. Chi tiết nhắn tin trực tiếp qua link nhóm Zalo bên dưới.",
                        "key_requirements": ["4+ years wind farm site manager", "Local authority coordination", "Ninh Thuan project"],
                        "project_type": "Onshore",
                        "salary": "Negotiable",
                        "contact_info": "tuyendung@trungnamgroup.com.vn | 0933.111.222",
                        "email": "tuyendung@trungnamgroup.com.vn",
                        "phone": "0933.111.222",
                        "zalo": "0933111222",
                        "facebook": "N/A"
                    }
                ]
        else:
            if fallback_role == "HSE":
                scraped = [
                    {
                        "id": "scraped_mock_hse_001",
                        "title": "Regional Health & Safety Specialist",
                        "company": "TotalEnergies",
                        "platform": "LinkedIn",
                        "location": "Houston, Texas",
                        "role": "HSE",
                        "recruiter_name": "Daveon Middleton, MBA",
                        "recruiter_profile": "https://www.linkedin.com/in/dameonmiddletonmba",
                        "post_url": "https://www.linkedin.com/posts/dameonmiddletonmba_hse-houston",
                        "post_date": "Jun 22, 2026",
                        "raw_text": "Ensure OSHA compliance across our wind and solar construction sites. Oversee incident investigations, run toolbox talks, and coordinate safety metrics reporting.",
                        "key_requirements": ["5+ years HSE experience", "OSHA 30 certified", "Renewables safety standards"],
                        "project_type": "Onshore",
                        "salary": "Negotiable",
                        "contact_info": "jobs@totalenergies.com"
                    }
                ]
            elif fallback_role == "Project Manager":
                scraped = [
                    {
                        "id": "scraped_mock_pm_001",
                        "title": "Utility-Scale Solar Project Manager",
                        "company": "TotalEnergies",
                        "platform": "LinkedIn",
                        "location": "Dallas, Texas",
                        "role": "Project Manager",
                        "recruiter_name": "Daveon Middleton, MBA",
                        "recruiter_profile": "https://www.linkedin.com/in/dameonmiddletonmba",
                        "post_url": "https://www.linkedin.com/posts/dameonmiddletonmba_pm-dallas",
                        "post_date": "Jun 21, 2026",
                        "raw_text": "TotalEnergies is hiring a Project Manager to lead engineering and construction for a 200MW solar park. Responsible for schedule, procurement, and EPC delivery.",
                        "key_requirements": ["6+ years utility solar PM", "EPC contract negotiation", "PMP certification"],
                        "project_type": "Onshore",
                        "salary": "USD 120k - 145k",
                        "contact_info": "jobs@totalenergies.com"
                    }
                ]
            elif fallback_role == "Civil Engineer":
                scraped = [
                    {
                        "id": "scraped_mock_civil_001",
                        "title": "Civil Construction Engineer (Renewables)",
                        "company": "TotalEnergies",
                        "platform": "LinkedIn",
                        "location": "Dallas, Texas",
                        "role": "Civil Engineer",
                        "recruiter_name": "Daveon Middleton, MBA",
                        "recruiter_profile": "https://www.linkedin.com/in/dameonmiddletonmba",
                        "post_url": "https://www.linkedin.com/posts/dameonmiddletonmba_civil-renewables",
                        "post_date": "Jun 22, 2026",
                        "raw_text": "Looking for a Civil Construction Engineer to supervise site preparation, access roads, and turbine foundation installations for utility-scale wind farms.",
                        "key_requirements": ["BS Civil Engineering", "3+ years site prep & foundation", "Renewables experience preferred"],
                        "project_type": "Onshore",
                        "salary": "Negotiable",
                        "contact_info": "jobs@totalenergies.com"
                    }
                ]
            else:
                scraped = [
                    {
                        "id": "scraped_mock_001",
                        "title": "Site Construction Manager (Solar Energy)",
                        "company": "TotalEnergies",
                        "platform": "LinkedIn",
                        "location": "Teague, Texas",
                        "role": "Site Manager",
                        "recruiter_name": "Daveon Middleton, MBA",
                        "recruiter_profile": "https://www.linkedin.com/in/dameonmiddletonmba",
                        "post_url": "https://www.linkedin.com/posts/dameonmiddletonmba_electrical-site-construction-manager-wind-activity-7232430293968691200-N1N8",
                        "post_date": "May 28, 2026",
                        "raw_text": "Come be an integral part of the team constructing the largest renewable energy infrastructure project. Oversee and manage the construction of wind, solar, and transmission projects, ensuring safety, quality, cost, and schedule are top priorities.",
                        "key_requirements": ["8+ years in power/renewable industry", "Utility-scale solar project management", "Team leadership"],
                        "project_type": "Onshore",
                        "salary": "Negotiable",
                        "contact_info": "jobs@totalenergies.com"
                    }
                ]
        
    return scraped

@app.post("/api/scrape/scrapling")
def scrape_scrapling_endpoint(payload: dict):
    from backend.scrapling_scraper import run_scrapling_scrape
    query = payload.get("query", "site manager renewable")
    platform = payload.get("platform", "All")
    
    return run_scrapling_scrape(query, platform)

