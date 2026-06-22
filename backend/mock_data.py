# -*- coding: utf-8 -*-
from datetime import datetime, timedelta

# Realistic wind farm and construction site recruitment posts with direct contact info
MOCK_JOBS = [
    {
        "id": "job_001",
        "title": "Wind Farm Site Manager (Turbine Installation)",
        "company": "Vestas Wind Systems",
        "platform": "LinkedIn",
        "location": "Tra Vinh, Vietnam",
        "role": "Site Manager",
        "recruiter_name": "Nguyen Minh Thu (Senior Talent Acquisition)",
        "recruiter_profile": "https://www.linkedin.com/in/thu-nguyen-vestas-hr",
        "post_url": "https://www.linkedin.com/posts/thu-nguyen-vestas-hr_hiring-sitemanager-windenergy-tra-vinh-activity-71289192",
        "post_date": (datetime.now() - timedelta(days=2)).strftime("%b %d, %Y"),
        "raw_text": (
            "We are HIRING! Vestas is looking for a Wind Farm Site Manager for our Tra Vinh nearshore project. "
            "Responsibilities: Oversee daily site operations, manage sub-contractors, ensure strict compliance with HSE "
            "standards, coordinate turbine installation and commissioning. Requirements: 5+ years of experience in wind power, "
            "GWO certifications, mechanical/electrical engineering background. Fluent in English. "
            "Please send CV to: nmt-recruitment@vestas.com with subject [Site Manager Tra Vinh]."
        ),
        "key_requirements": ["5+ years wind power experience", "GWO certifications", "Fluent English", "HSE compliance"],
        "project_type": "Nearshore",
        "salary": "Negotiable (USD 3,500 - 4,500)",
        "contact_info": "nmt-recruitment@vestas.com | 0912.345.678",
        "email": "nmt-recruitment@vestas.com",
        "phone": "0912.345.678",
        "zalo": "0912345678",
        "facebook": "https://www.facebook.com/vestas"
    },
    {
        "id": "job_002",
        "title": "Site Manager - Dự án Điện Gió Tra Vinh (Nearshore)",
        "company": "Goldwind Vietnam",
        "platform": "Facebook",
        "location": "Tra Vinh, Vietnam",
        "role": "Site Manager",
        "recruiter_name": "Tran Quoc Tuan (HR Manager)",
        "recruiter_profile": "https://www.facebook.com/tuan.tran.goldwind",
        "post_url": "https://www.facebook.com/groups/vietnamwindpower/posts/89123891283",
        "post_date": (datetime.now() - timedelta(days=1)).strftime("%b %d, %Y"),
        "raw_text": (
            "[TUYỂN DỤNG GẤP] Cần tuyển Site Manager cho Dự án Điện gió tại Trà Vinh.\n"
            "- Số lượng: 01 người\n"
            "- Yêu cầu: Kinh nghiệm quản lý công trường điện gió tối thiểu 3 năm, có chứng chỉ GWO còn hạn. "
            "Khả năng giao tiếp tiếng Anh tốt làm việc trực tiếp với chuyên gia nước ngoài.\n"
            "- Quyền lợi: Lương hấp dẫn (up to 70M VND), đóng BHXH đầy đủ, phụ cấp ăn ở, xe đưa đón.\n"
            "Anh em quan tâm gửi CV qua email: tuan.tran@goldwind.com.vn hoặc ib trực tiếp!"
        ),
        "key_requirements": ["3+ years wind site management", "GWO certified", "English communication", "Work in Tra Vinh"],
        "project_type": "Nearshore",
        "salary": "Up to 70,000,000 VND",
        "contact_info": "tuan.tran@goldwind.com.vn | 0988.765.432",
        "email": "tuan.tran@goldwind.com.vn",
        "phone": "0988.765.432",
        "zalo": "0988765432",
        "facebook": "https://www.facebook.com/tuan.tran.goldwind"
    },
    {
        "id": "job_003",
        "title": "Site Manager (Onshore Wind Farm)",
        "company": "Trung Nam Group",
        "platform": "LinkedIn",
        "location": "Dak Lak, Vietnam",
        "role": "Site Manager",
        "recruiter_name": "Le Hoang Nam (HR Lead)",
        "recruiter_profile": "https://www.linkedin.com/in/namle-trungnam-hr",
        "post_url": "https://www.linkedin.com/posts/namle-trungnam-hr_tuyendung-sitemanager-diengio-daklak-activity-71289410",
        "post_date": (datetime.now() - timedelta(days=4)).strftime("%b %d, %Y"),
        "raw_text": (
            "Trung Nam Group đang mở rộng dự án điện gió Ea Nam Đắk Lắk và cần tuyển vị trí Site Manager. "
            "Mô tả công việc: Quản lý toàn bộ hoạt động thi công xây dựng công trường, giám sát nhà thầu phụ, "
            "quản lý tiến độ dự án và phối hợp làm việc với chính quyền địa phương. Yêu cầu: Tốt nghiệp đại học chuyên ngành "
            "Xây dựng/Điện, kinh nghiệm làm Site Manager điện gió từ 4 năm trở lên. Kỹ năng giải quyết vấn đề tốt. "
            "Nộp hồ sơ trực tiếp tại: tuyển dụng@trungnamgroup.com.vn."
        ),
        "key_requirements": ["4+ years wind farm site management", "Civil/Electrical Engineering degree", "Local authority coordination"],
        "project_type": "Onshore",
        "salary": "Negotiable",
        "contact_info": "tuyendung@trungnamgroup.com.vn | 0933.111.222",
        "email": "tuyendung@trungnamgroup.com.vn",
        "phone": "0933.111.222",
        "zalo": "0933111222",
        "facebook": "https://www.facebook.com/trungnamgroup"
    },
    {
        "id": "job_004",
        "title": "Wind Farm Site Manager (BOP & Civil Works)",
        "company": "IPC Construction Joint Stock Company",
        "platform": "Facebook",
        "location": "Gia Lai, Vietnam",
        "role": "Site Manager",
        "recruiter_name": "Phan Thi Mai (HR Specialist)",
        "recruiter_profile": "https://www.facebook.com/mai.phan.ipc.recruitment",
        "post_url": "https://www.facebook.com/groups/diengiovietnam/posts/90128391290",
        "post_date": (datetime.now() - timedelta(days=3)).strftime("%b %d, %Y"),
        "raw_text": (
            "GÓC TUYỂN DỤNG: IPC GROUP cần tuyển 01 Chỉ huy trưởng công trường điện gió (Site Manager) làm việc tại Gia Lai.\n"
            "- Yêu cầu: Am hiểu thi công móng turbine điện gió, đường nội bộ công trường, BOP.\n"
            "- Có ít nhất 5 năm kinh nghiệm quản lý công trường hạ tầng kỹ thuật hoặc điện gió.\n"
            "- Có chứng chỉ hành nghề giám sát/thi công hạng I.\n"
            "- Lương thỏa thuận xứng đáng theo năng lực. Chế độ công tác phí đầy đủ.\n"
            "CV gửi về: maiphant@ipcgroup.vn hoặc liên hệ SĐT/Zalo: 0987.654.321."
        ),
        "key_requirements": ["Am hiểu BOP & Civil", "5+ years construction management", "Chứng chỉ hành nghề hạng I"],
        "project_type": "Onshore",
        "salary": "Negotiable (40 - 55M VND)",
        "contact_info": "maiphant@ipcgroup.vn | 0987.654.321",
        "email": "maiphant@ipcgroup.vn",
        "phone": "0987.654.321",
        "zalo": "0987654321",
        "facebook": "https://www.facebook.com/mai.phan.ipc.recruitment"
    },
    {
        "id": "job_005",
        "title": "Senior Wind Site Manager",
        "company": "Siemens Gamesa Renewable Energy",
        "platform": "LinkedIn",
        "location": "Binh Thuan, Vietnam",
        "role": "Site Manager",
        "recruiter_name": "Sarah Jenkins (AP Talent Partner)",
        "recruiter_profile": "https://www.linkedin.com/in/sarah-jenkins-sgre",
        "post_url": "https://www.linkedin.com/posts/sarah-jenkins-sgre_hiring-sitemanager-siemensgamesa-vietnam-activity-71289993",
        "post_date": (datetime.now() - timedelta(days=5)).strftime("%b %d, %Y"),
        "raw_text": (
            "Siemens Gamesa is recruiting a Senior Wind Site Manager for our upcoming onshore projects in Binh Thuan, Vietnam. "
            "In this role, you will lead the site installation team, manage client relationships (Developer), and ensure SGRE safety "
            "standards are executed flawlessly. Required: 8+ years in wind energy, strong leadership skills, and international project exposure. "
            "Excellent package with relocation support. Apply via LinkedIn or send CV to: jobs.vn@siemensgamesa.com."
        ),
        "key_requirements": ["8+ years wind energy experience", "Client relationship management", "International project exposure", "SGRE safety standards"],
        "project_type": "Onshore",
        "salary": "USD 5,000 - 6,500",
        "contact_info": "jobs.vn@siemensgamesa.com | 0909.123.456",
        "email": "jobs.vn@siemensgamesa.com",
        "phone": "0909.123.456",
        "zalo": "0909123456",
        "facebook": "https://www.facebook.com/siemensgamesa"
    },
    {
        "id": "job_006",
        "title": "Site Manager Điện Gió (Offshore Wind)",
        "company": "PTSC (PetroVietnam Technical Services Corp)",
        "platform": "LinkedIn",
        "location": "Ba Ria - Vung Tau, Vietnam",
        "role": "Site Manager",
        "recruiter_name": "Vu Van Hieu (Talent Acquisition Specialist)",
        "recruiter_profile": "https://www.linkedin.com/in/hieu-vu-ptsc-recruiter",
        "post_url": "https://www.linkedin.com/posts/hieu-vu-ptsc-recruiter_tuyendung-ptsc-offshore-wind-activity-71290312",
        "post_date": (datetime.now() - timedelta(days=6)).strftime("%b %d, %Y"),
        "raw_text": (
            "PTSC đang tham gia các chuỗi cung ứng dự án điện gió ngoài khơi quốc tế và cần tuyển dụng Site Manager làm việc tại Vũng Tàu/Offshore. "
            "Yêu cầu: Kinh nghiệm quản lý công trường/dự án dầu khí hoặc điện gió ngoài khơi (Offshore) tối thiểu 5 năm. "
            "Hiểu biết sâu sắc về kết cấu thép ngoài khơi, hàng hải và quy chuẩn an toàn biển. Tiếng Anh lưu loát. "
            "Quyền lợi đẳng cấp, làm việc trong môi trường quốc tế chuyên nghiệp. Nộp CV về: recruitment@ptsc.com.vn."
        ),
        "key_requirements": ["5+ years offshore wind/oil&gas", "Offshore steel structure/marine knowledge", "Fluent English"],
        "project_type": "Offshore",
        "salary": "Negotiable (Highly competitive)",
        "contact_info": "recruitment@ptsc.com.vn | 0907.333.444",
        "email": "recruitment@ptsc.com.vn",
        "phone": "0907.333.444",
        "zalo": "0907333444",
        "facebook": "https://www.facebook.com/ptsc.vietnam"
    },
    {
        "id": "job_007",
        "title": "Chỉ Huy Trưởng Điện Gió (Site Manager)",
        "company": "Fecon Corporation",
        "platform": "Facebook",
        "location": "Quang Tri, Vietnam",
        "role": "Site Manager",
        "recruiter_name": "Doan Van Tuyen (Recruitment Lead)",
        "recruiter_profile": "https://www.facebook.com/tuyen.doan.fecon",
        "post_url": "https://www.facebook.com/groups/diengiovietnam/posts/913829023",
        "post_date": (datetime.now() - timedelta(days=8)).strftime("%b %d, %Y"),
        "raw_text": (
            "FECON TUYỂN DỤNG: 01 Chỉ huy trưởng công trường Dự án Điện Gió Quảng Trị.\n"
            "- Nhiệm vụ: Tổ chức điều hành thi công phần móng, hạ tầng giao thông công trường.\n"
            "- Yêu cầu: Tốt nghiệp Đại học Xây dựng/Giao thông. Có tối thiểu 4 năm kinh nghiệm làm Chỉ huy phó/Chỉ huy trưởng "
            "các dự án điện gió onshore hoặc hạ tầng lớn. Có chứng chỉ hành nghề giám sát thi công còn hiệu lực.\n"
            "- Mức lương: 35M - 50M VND, phụ cấp công trường, phụ cấp đi lại.\n"
            "Hồ sơ gửi về: tuyendung@fecon.com.vn."
        ),
        "key_requirements": ["Civil/Infrastructure experience", "4+ years site management", "Chứng chỉ hành nghề giám sát"],
        "project_type": "Onshore",
        "salary": "35,000,000 - 50,000,000 VND",
        "contact_info": "tuyendung@fecon.com.vn | 0982.555.666",
        "email": "tuyendung@fecon.com.vn",
        "phone": "0982.555.666",
        "zalo": "0982555666",
        "facebook": "https://www.facebook.com/tuyen.doan.fecon"
    },
    {
        "id": "job_008",
        "title": "Site Manager (Dự án Điện Gió Ca Mau)",
        "company": "Super Energy Corporation",
        "platform": "LinkedIn",
        "location": "Ca Mau, Vietnam",
        "role": "Site Manager",
        "recruiter_name": "Pimchanok S. (Group HR Lead)",
        "recruiter_profile": "https://www.linkedin.com/in/pimchanok-superenergy",
        "post_url": "https://www.linkedin.com/posts/pimchanok-superenergy_hiring-sitemanager-superenergy-camau-activity-71291120",
        "post_date": (datetime.now() - timedelta(days=10)).strftime("%b %d, %Y"),
        "raw_text": (
            "Super Energy is seeking an experienced Site Manager to lead our wind farm construction in Ca Mau, Vietnam. "
            "You will monitor progress, manage EPC contractor performance, control project budget, and ensure environmental "
            "mitigation meets IFC standards. Candidate must have 6+ years in power plant or wind farm construction. "
            "Bilingual in Vietnamese and English is highly preferred. Send resume to: hr-vietnam@superenergy.co.th."
        ),
        "key_requirements": ["6+ years power plant/wind construction", "EPC management", "IFC environmental standards", "Bilingual English/Vietnamese"],
        "project_type": "Nearshore",
        "salary": "USD 3,800 - 4,800",
        "contact_info": "hr-vietnam@superenergy.co.th | 0915.999.888",
        "email": "hr-vietnam@superenergy.co.th",
        "phone": "0915.999.888",
        "zalo": "0915999888",
        "facebook": "https://www.facebook.com/superenergy"
    },
    {
        "id": "job_009",
        "title": "Chỉ Huy Trưởng Công Trường Điện Gió (VietnamWorks)",
        "company": "Fecon Corporation",
        "platform": "VietnamWorks",
        "location": "Quang Tri, Vietnam",
        "role": "Site Manager",
        "recruiter_name": "Phan Hoang Minh (HR Department)",
        "recruiter_profile": "https://www.vietnamworks.com/fecon-corporation",
        "post_url": "https://www.vietnamworks.com/site-manager-renewable-fecon",
        "post_date": (datetime.now() - timedelta(days=2)).strftime("%b %d, %Y"),
        "raw_text": (
            "FECON tuyển dụng Chỉ Huy Trưởng Điện Gió làm việc tại Quảng Trị. "
            "Quản lý toàn bộ tiến độ, chất lượng thi công móng turbine, đường công trường, trạm biến áp và đường dây truyền tải. "
            "Yêu cầu: Tốt nghiệp kỹ sư xây dựng/điện, có chứng chỉ hành nghề giám sát hạng I."
        ),
        "key_requirements": ["Civil/Electrical Engineering degree", "Chứng chỉ hành nghề giám sát hạng I", "BOP / Infrastructure management"],
        "project_type": "Onshore",
        "salary": "Up to 50,000,000 VND",
        "contact_info": "tuyendung@fecon.com.vn | 0984.123.456",
        "email": "tuyendung@fecon.com.vn",
        "phone": "0984.123.456",
        "zalo": "0984123456",
        "facebook": "https://www.facebook.com/fecon"
    },
    {
        "id": "job_010",
        "title": "Site Manager (Dự án Điện gió Onshore)",
        "company": "SMC Services and Technical Corp",
        "platform": "TopCV",
        "location": "Binh Thuan, Vietnam",
        "role": "Site Manager",
        "recruiter_name": "Le Viet Dung (Talent Acquisition)",
        "recruiter_profile": "https://www.topcv.vn/cong-ty/gec-vietnam",
        "post_url": "https://www.topcv.vn/tuyen-dung/site-manager-dien-gio-gia-lai",
        "post_date": (datetime.now() - timedelta(days=3)).strftime("%b %d, %Y"),
        "raw_text": (
            "SMC đang cần tuyển gấp Site Manager phụ trách quản lý điều hành thi công dự án và lắp đặt trụ turbine điện gió. "
            "Yêu cầu: Có kinh nghiệm thi công móng và lắp turbine onshore tối thiểu 3 năm, giao tiếp tiếng Anh tốt."
        ),
        "key_requirements": ["3+ years wind site management", "SPMT transport/installation experience", "HSE certified", "English fluency"],
        "project_type": "Onshore",
        "salary": "35,000,000 - 55,000,000 VND",
        "contact_info": "hr@smc-technical.com | 0905.888.999",
        "email": "hr@smc-technical.com",
        "phone": "0905.888.999",
        "zalo": "0905888999",
        "facebook": "https://www.facebook.com/smc-services"
    },
    # New Project Manager Jobs
    {
        "id": "job_011",
        "title": "Wind Project Manager (Renewables Portfolio)",
        "company": "Vestas Wind Systems",
        "platform": "LinkedIn",
        "location": "Hanoi, Vietnam",
        "role": "Project Manager",
        "recruiter_name": "Nguyen Minh Thu (Senior Talent Acquisition)",
        "recruiter_profile": "https://www.linkedin.com/in/thu-nguyen-vestas-hr",
        "post_url": "https://www.linkedin.com/posts/thu-nguyen-vestas-hr_projectmanager-wind-hanoi",
        "post_date": (datetime.now() - timedelta(days=1)).strftime("%b %d, %Y"),
        "raw_text": (
            "Vestas is looking for a Wind Project Manager based in Hanoi. "
            "You will drive construction execution, manage budget, schedule, and lead team. "
            "Requires PMP certification, 8+ years PM experience, and bilingual fluency."
        ),
        "key_requirements": ["8+ years project management", "Grid connection experience", "PMP certified", "Bilingual English/Vietnamese"],
        "project_type": "Onshore",
        "salary": "USD 5,000 - 7,000",
        "contact_info": "nmt-recruitment@vestas.com | 0912.345.678",
        "email": "nmt-recruitment@vestas.com",
        "phone": "0912.345.678",
        "zalo": "0912345678",
        "facebook": "https://www.facebook.com/vestas"
    },
    {
        "id": "job_012",
        "title": "Giám Đốc Dự Án Xây Dựng Hạ Tầng Điện Gió (Project Manager)",
        "company": "Trung Nam Group",
        "platform": "VietnamWorks",
        "location": "Ninh Thuan, Vietnam",
        "role": "Project Manager",
        "recruiter_name": "Le Hoang Nam (HR Lead)",
        "recruiter_profile": "https://www.linkedin.com/in/namle-trungnam-hr",
        "post_url": "https://www.vietnamworks.com/project-manager-trung-nam-ninh-thuan",
        "post_date": (datetime.now() - timedelta(days=2)).strftime("%b %d, %Y"),
        "raw_text": (
            "Trung Nam Group tuyển Giám Đốc Dự Án điện gió Ninh Thuận. "
            "Quản lý pháp lý dự án, tiến độ tổng thể, giải phóng mặt bằng và tối ưu ngân sách xây dựng. "
            "Yêu cầu: 5 năm kinh nghiệm làm PM điện gió/năng lượng, am hiểu quy trình đền bù đất đai."
        ),
        "key_requirements": ["5+ years wind power PM", "Hạ tầng kỹ thuật & pháp lý", "PMP or equivalent", "Quản lý ngân sách > 100 tỷ"],
        "project_type": "Onshore",
        "salary": "Up to 80,000,000 VND",
        "contact_info": "tuyendung@trungnamgroup.com.vn | 0933.111.222",
        "email": "tuyendung@trungnamgroup.com.vn",
        "phone": "0933.111.222",
        "zalo": "0933111222",
        "facebook": "https://www.facebook.com/trungnamgroup"
    },
    {
        "id": "job_013",
        "title": "Construction Project Manager (BOP & Infrastructure)",
        "company": "Fecon Corporation",
        "platform": "TopCV",
        "location": "Quang Tri, Vietnam",
        "role": "Project Manager",
        "recruiter_name": "Doan Van Tuyen (Recruitment Lead)",
        "recruiter_profile": "https://www.topcv.vn/cong-ty/fecon",
        "post_url": "https://www.topcv.vn/tuyen-dung/construction-pm-fecon-quang-tri",
        "post_date": (datetime.now() - timedelta(days=3)).strftime("%b %d, %Y"),
        "raw_text": (
            "FECON tuyển Giám Đốc Dự Án quản lý gói thầu hạ tầng BOP dự án điện gió Quảng Trị. "
            "Tổ chức điều hành tổng thể, đấu thầu phụ, nghiệm thu bàn giao và quản lý hợp đồng FIDIC. "
            "Yêu cầu: Tốt nghiệp đại học Xây dựng/Cầu đường, 6+ năm kinh nghiệm PM hạ tầng."
        ),
        "key_requirements": ["6+ years civil PM experience", "BOP wind farm execution", "Contract management", "Local authorities liaison"],
        "project_type": "Onshore",
        "salary": "Negotiable (High-pay)",
        "contact_info": "tuyendung@fecon.com.vn | 0982.555.666",
        "email": "tuyendung@fecon.com.vn",
        "phone": "0982.555.666",
        "zalo": "0982555666",
        "facebook": "https://www.facebook.com/fecon"
    },
    {
        "id": "job_014",
        "title": "Offshore Wind Project Manager",
        "company": "PTSC",
        "platform": "LinkedIn",
        "location": "Vung Tau, Vietnam",
        "role": "Project Manager",
        "recruiter_name": "Vu Van Hieu (Talent Acquisition)",
        "recruiter_profile": "https://www.linkedin.com/in/hieu-vu-ptsc-recruiter",
        "post_url": "https://www.linkedin.com/posts/hieu-vu-ptsc-recruiter_offshore-wind-pm",
        "post_date": (datetime.now() - timedelta(days=4)).strftime("%b %d, %Y"),
        "raw_text": (
            "PTSC is looking for an Offshore Wind Project Manager. "
            "Responsible for substation fabrication, marine operations, and foundation shipping. "
            "10+ years in marine/oil & gas/offshore wind management is required. Fluent English."
        ),
        "key_requirements": ["10+ years marine/wind PM", "Offshore logistics & installation", "Turbine foundation contract", "Fluent English"],
        "project_type": "Offshore",
        "salary": "Competitive",
        "contact_info": "recruitment@ptsc.com.vn | 0907.333.444",
        "email": "recruitment@ptsc.com.vn",
        "phone": "0907.333.444",
        "zalo": "0907333444",
        "facebook": "https://www.facebook.com/ptsc.vietnam"
    },
    # New HSE Jobs
    {
        "id": "job_015",
        "title": "HSE Manager (Dự Án Điện Gió Ngoài Khơi)",
        "company": "PTSC",
        "platform": "LinkedIn",
        "location": "Vung Tau, Vietnam",
        "role": "HSE",
        "recruiter_name": "Vu Van Hieu (Talent Acquisition)",
        "recruiter_profile": "https://www.linkedin.com/in/hieu-vu-ptsc-recruiter",
        "post_url": "https://www.linkedin.com/posts/hieu-vu-ptsc-recruiter_hse-offshore",
        "post_date": (datetime.now() - timedelta(days=1)).strftime("%b %d, %Y"),
        "raw_text": (
            "We are recruiting a Lead HSE Manager for our offshore wind farm fabrication yard. "
            "Monitor occupational safety, draft incident logs, and enforce safety regulations. "
            "Requirements: 5+ years of offshore safety management experience, NEBOSH certified."
        ),
        "key_requirements": ["5+ years offshore HSE management", "NEBOSH / OHSAS certifications", "Incident response planning", "English fluency"],
        "project_type": "Offshore",
        "salary": "Negotiable",
        "contact_info": "recruitment@ptsc.com.vn | 0907.333.444",
        "email": "recruitment@ptsc.com.vn",
        "phone": "0907.333.444",
        "zalo": "0907333444",
        "facebook": "https://www.facebook.com/ptsc.vietnam"
    },
    {
        "id": "job_016",
        "title": "Kỹ Sư An Toàn Lao Động (HSE Officer)",
        "company": "Fecon Corporation",
        "platform": "TopCV",
        "location": "Quang Tri, Vietnam",
        "role": "HSE",
        "recruiter_name": "Phan Hoang Minh (HR Department)",
        "recruiter_profile": "https://www.topcv.vn/cong-ty/fecon",
        "post_url": "https://www.topcv.vn/tuyen-dung/hse-officer-quang-tri",
        "post_date": (datetime.now() - timedelta(days=2)).strftime("%b %d, %Y"),
        "raw_text": (
            "FECON cần tuyển Kỹ sư An toàn Lao động làm việc tại công trường điện gió Quảng Trị. "
            "Thực hiện kiểm tra giám sát an toàn thi công hàng ngày, làm báo cáo đánh giá rủi ro tại hiện trường. "
            "Yêu cầu: Có chứng chỉ an toàn lao động nhà nước cấp, 3 năm kinh nghiệm công trường xây dựng."
        ),
        "key_requirements": ["3+ years construction safety", "HSE state certificate", "Risk assessment reporting", "First aid & fire drill coordination"],
        "project_type": "Onshore",
        "salary": "25,000,000 - 35,000,000 VND",
        "contact_info": "tuyendung@fecon.com.vn | 0984.123.456",
        "email": "tuyendung@fecon.com.vn",
        "phone": "0984.123.456",
        "zalo": "0984123456",
        "facebook": "https://www.facebook.com/fecon"
    },
    {
        "id": "job_017",
        "title": "HSE Specialist (Wind Farm Construction)",
        "company": "SMC Services and Technical Corp",
        "platform": "VietnamWorks",
        "location": "Binh Thuan, Vietnam",
        "role": "HSE",
        "recruiter_name": "Le Viet Dung (Talent Acquisition)",
        "recruiter_profile": "https://www.vietnamworks.com/smc-technical-safety",
        "post_url": "https://www.vietnamworks.com/hse-specialist-smc-binh-thuan",
        "post_date": (datetime.now() - timedelta(days=3)).strftime("%b %d, %Y"),
        "raw_text": (
            "SMC tuyển Chuyên viên HSE công trường điện gió Bình Thuận. "
            "Giám sát an toàn hạ turbine và vận hành xe cẩu siêu trường siêu trọng SPMT. "
            "Yêu cầu: 4+ năm kinh nghiệm, chứng chỉ ISO 45001 / OHSAS 18001. Có thể viết báo cáo bằng tiếng Anh."
        ),
        "key_requirements": ["4+ years wind site safety", "SPMT transport safety protocol", "English report writing", "OHSAS 18001 / ISO 45001"],
        "project_type": "Onshore",
        "salary": "30,000,000 - 40,000,000 VND",
        "contact_info": "hr@smc-technical.com | 0905.888.999",
        "email": "hr@smc-technical.com",
        "phone": "0905.888.999",
        "zalo": "0905888999",
        "facebook": "https://www.facebook.com/smc-services"
    },
    {
        "id": "job_018",
        "title": "Regional HSE Director (Renewables Portfolio)",
        "company": "Super Energy Corporation",
        "platform": "LinkedIn",
        "location": "Ho Chi Minh, Vietnam",
        "role": "HSE",
        "recruiter_name": "Pimchanok S. (Group HR Lead)",
        "recruiter_profile": "https://www.linkedin.com/in/pimchanok-superenergy",
        "post_url": "https://www.linkedin.com/posts/pimchanok-superenergy_hse-director",
        "post_date": (datetime.now() - timedelta(days=5)).strftime("%b %d, %Y"),
        "raw_text": (
            "Super Energy is recruiting a Regional HSE Director for Southeast Asia based in HCMC. "
            "You will set safety guidelines for all onshore wind and solar farms under our portfolio, ensuring IFC standards. "
            "Requires 8+ years experience, leadership, and bilingual skills."
        ),
        "key_requirements": ["8+ years multi-site safety", "IFC performance standards", "Leadership and policy dev", "Bilingual English/Vietnamese"],
        "project_type": "Onshore",
        "salary": "USD 4,000 - 5,500",
        "contact_info": "hr-vietnam@superenergy.co.th | 0915.999.888",
        "email": "hr-vietnam@superenergy.co.th",
        "phone": "0915.999.888",
        "zalo": "0915999888",
        "facebook": "https://www.facebook.com/superenergy"
    }
]
