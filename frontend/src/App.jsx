import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sun, Moon, Briefcase, BarChart3, Database, MessageSquareCode, Search, RefreshCw, Layers, Sparkles, Plus, Check, ChevronRight, ChevronDown, ChevronUp, Zap, Globe, TrendingUp } from 'lucide-react';
import DashboardCharts from './components/DashboardCharts';
import JobTable from './components/JobTable';
import DetailsPanel from './components/DetailsPanel';
import ReactECharts from 'echarts-for-react';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const getPlatformBadgeClass = (platform) => {
    switch (platform) {
      case 'LinkedIn':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Facebook':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'Zalo':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-400';
      case 'VietnamWorks':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-400';
      case 'TopCV':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400';
      case 'CareerViet':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400';
      case 'Glints':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/30 dark:text-teal-400';
      case 'JobsGO':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-950/30 dark:text-violet-400';
      case 'CareerLink':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400';
      case 'Indeed':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/30 dark:text-sky-400';
      case 'TopDev':
        return 'bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400';
      case 'Timviec365':
        return 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/30 dark:text-fuchsia-400';
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [isDark, setIsDark] = useState(true);

  // Main board Filters
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('All');
  const [location, setLocation] = useState('All');
  const [activeRoleTab, setActiveRoleTab] = useState('All');
  const [liveFetching, setLiveFetching] = useState(false);

  // Bottom panel state
  const [bottomTab, setBottomTab] = useState('scraper'); // 'charts' | 'chat' | 'scraper'
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true);

  // AI Chat State
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hi there! I am your Gemini-powered Wind Farm Recruiter Agent. Ask me anything about these job postings!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Scraper State (Exa + Scrapling combined)
  const [scraperQuery, setScraperQuery] = useState('site manager renewable');
  const [scraperPlatform, setScraperPlatform] = useState('All');
  const [scraperResults, setScraperResults] = useState([]);
  const [scraperLoading, setScraperLoading] = useState(false);
  const [addedJobsCount, setAddedJobsCount] = useState(0);

  // Scrapling specific
  const [scraplingResults, setScraplingResults] = useState([]);
  const [scraplingLoading, setScraplingLoading] = useState(false);
  const [scraplingMetrics, setScraplingMetrics] = useState(null);
  const [agentReachMetrics, setAgentReachMetrics] = useState(null);

  // Initialize theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Fetch jobs and stats
  const fetchData = async () => {
    setLoading(true);
    try {
      const jobsRes = await axios.get(`${API_BASE}/api/jobs`, {
        params: { 
          platform, 
          location: location === 'All' ? null : location, 
          role: activeRoleTab === 'All' ? null : activeRoleTab,
          q: search || null 
        }
      });
      setJobs(jobsRes.data);

      const statsRes = await axios.get(`${API_BASE}/api/stats`);
      setStats(statsRes.data);
    } catch (err) {
      console.warn('Backend not reachable. Falling back to local data simulator.');
      simulateLocalFetch();
    } finally {
      setLoading(false);
    }
  };

  const simulateLocalFetch = () => {
    setJobs([]);
    setStats({
      total: 0,
      platforms: [],
      locations: [],
      project_types: []
    });
  };

  useEffect(() => {
    fetchData();
  }, [platform, location, search, activeRoleTab]);

  // Contextually update scraper default queries based on selected tab
  useEffect(() => {
    if (activeRoleTab === 'All') {
      setScraperQuery('site manager renewable');
    } else if (activeRoleTab === 'Site Manager') {
      setScraperQuery('site manager renewable');
    } else if (activeRoleTab === 'Project Manager') {
      setScraperQuery('project manager construction');
    } else if (activeRoleTab === 'HSE') {
      setScraperQuery('HSE construction');
    } else if (activeRoleTab === 'Civil Engineer') {
      setScraperQuery('civil engineer OR "kỹ sư xây dựng"');
    }
  }, [activeRoleTab]);

  const handleFetchLiveData = () => {
    setLiveFetching(true);
    setTimeout(() => {
      fetchData();
      setLiveFetching(false);
    }, 1500);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'user', text: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/chat`, { message: chatInput });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.response }]);
    } catch (err) {
      setTimeout(() => {
        let reply = "I'm offline right now, but I can tell you that Tra Vinh has the most Nearshore manager vacancies! Vestas and Goldwind are both recruiting there.";
        const msg = chatInput.toLowerCase();
        if (msg.includes('gwo')) reply = "Vestas and Goldwind both require GWO safety certificates for their Tra Vinh projects.";
        else if (msg.includes('lương') || msg.includes('salary')) reply = "Salary ranges from 40M-70M VND for domestic EPCs, and up to $6,500 USD for international OEMs like Siemens Gamesa.";
        setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      }, 1000);
    } finally {
      setChatLoading(false);
    }
  };

  // Run live scrape calling FastAPI /api/scrape
  const handleScrape = async (e) => {
    if (e) e.preventDefault();
    setScraperLoading(true);
    const start = Date.now();
    try {
      const res = await axios.post(`${API_BASE}/api/scrape`, {
        query: scraperQuery,
        platform: scraperPlatform
      });
      setScraperResults(res.data);
      setAgentReachMetrics({
        postings_found: res.data.length,
        speed_ms: Date.now() - start,
        success_rate: 100
      });

      // Auto-push to dashboard
      if (res.data && res.data.length > 0) {
        let addedAny = false;
        for (const job of res.data) {
          if (!jobs.some(j => j.id === job.id)) {
            try {
              await axios.post(`${API_BASE}/api/jobs`, job);
              addedAny = true;
            } catch (err) {
              console.warn("Failed to auto-add job to backend:", err);
            }
          }
        }
        if (addedAny) {
          fetchData();
        }
      }
    } catch (err) {
      console.error("Error scraping data:", err);
      alert("Failed to connect to scraper API.");
      setAgentReachMetrics({
        postings_found: 0,
        speed_ms: Date.now() - start,
        success_rate: 0
      });
    } finally {
      setScraperLoading(false);
    }
  };

  const handleScraplingScrape = async (e) => {
    if (e) e.preventDefault();
    setScraplingLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/scrape/scrapling`, {
        query: scraperQuery,
        platform: scraperPlatform
      });
      setScraplingResults(res.data.jobs);
      setScraplingMetrics(res.data.metrics);

      // Auto-push to dashboard
      if (res.data.jobs && res.data.jobs.length > 0) {
        let addedAny = false;
        for (const job of res.data.jobs) {
          if (!jobs.some(j => j.id === job.id)) {
            try {
              await axios.post(`${API_BASE}/api/jobs`, job);
              addedAny = true;
            } catch (err) {
              console.warn("Failed to auto-add job to backend:", err);
            }
          }
        }
        if (addedAny) {
          fetchData();
        }
      }
    } catch (err) {
      console.error("Error running Scrapling:", err);
      setScraplingResults([]);
      setScraplingMetrics({
        postings_found: 0,
        speed_ms: 150,
        success_rate: 0,
        error: "Failed to connect to API"
      });
    } finally {
      setScraplingLoading(false);
    }
  };

  // Dynamically feed scraped job to the active job board & update ECharts
  const handleAddScrapedJob = async (scrapedJob) => {
    if (jobs.some(j => j.id === scrapedJob.id)) {
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/jobs`, scrapedJob);
      fetchData();
      setAddedJobsCount(prev => prev + 1);
    } catch (err) {
      console.warn("Failed to add job to backend, falling back to local state:", err);
      const updatedJobs = [scrapedJob, ...jobs];
      setJobs(updatedJobs);
      setAddedJobsCount(prev => prev + 1);

      const totalJobs = updatedJobs.length;
      const platformCounts = {};
      const locationCounts = {};
      const projectTypeCounts = {};

      updatedJobs.forEach(job => {
        platformCounts[job.platform] = (platformCounts[job.platform] || 0) + 1;
        const loc = job.location.split(',')[0].trim();
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
        projectTypeCounts[job.project_type] = (projectTypeCounts[job.project_type] || 0) + 1;
      });

      setStats({
        total: totalJobs,
        platforms: Object.entries(platformCounts).map(([name, value]) => ({ name, value })),
        locations: Object.entries(locationCounts).map(([name, value]) => ({ name, value })),
        project_types: Object.entries(projectTypeCounts).map(([name, value]) => ({ name, value }))
      });
    }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedJob(null), 300);
  };

  const toggleApplyState = (jobId) => {
    setAppliedJobs(prev => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  // Mini donut chart for KPI row
  const miniPlatformOption = {
    color: ["#3b82f6", "#6366f1", "#06b6d4", "#f97316", "#10b981", "#ef4444", "#8b5cf6"],
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? '#18181b' : '#ffffff',
      borderColor: isDark ? '#3f3f46' : '#e4e4e7',
      textStyle: { color: isDark ? '#f4f4f5' : '#09090b', fontSize: 11 },
      confine: true,
    },
    series: [{
      type: 'pie',
      radius: ['50%', '78%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: isDark ? '#0c0c0f' : '#ffffff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: { show: false }
      },
      data: stats?.platforms || []
    }]
  };

  // Role tabs config
  const roleTabs = [
    { id: 'All', label: 'All Construction', icon: '🏗️' },
    { id: 'Site Manager', label: 'Site Managers', icon: '👷' },
    { id: 'Project Manager', label: 'Project Mgrs', icon: '📋' },
    { id: 'HSE', label: 'HSE Officers', icon: '🦺' },
    { id: 'Civil Engineer', label: 'Civil Eng', icon: '🏛️' }
  ];

  // Bottom panel tabs config
  const bottomTabs = [
    { id: 'scraper', label: 'Scraper Comparison', icon: <Zap size={14} /> },
    { id: 'charts', label: 'Analytics Charts', icon: <BarChart3 size={14} /> },
    { id: 'chat', label: 'AI Recruiter', icon: <MessageSquareCode size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-200">
      {/* ══════════ HEADER ══════════ */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f] sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Briefcase size={18} />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
                Wind Farm Job Tracker
              </h1>
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-[0.15em]">
                Real-time Analysis • 13 Sources
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {addedJobsCount > 0 && (
              <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full animate-bounce">
                +{addedJobsCount} Added
              </span>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-glow" />
              LIVE
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {isDark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-zinc-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* ══════════ NAVIGATION BAR: Role Tabs + Filters ══════════ */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#0c0c0f]/80 backdrop-blur-sm sticky top-[57px] z-20">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-2.5 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Left: Role Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5 shrink-0 overflow-x-auto">
            {roleTabs.map(tab => {
              const isActive = activeRoleTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRoleTab(tab.id)}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right: Search + Filters + Fetch */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-grow md:w-56">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-zinc-400 pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Platform Filter */}
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-zinc-700 dark:text-zinc-300"
            >
              <option value="All">All Platforms</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Facebook">Facebook</option>
              <option value="Zalo">Zalo</option>
              <option value="VietnamWorks">VietnamWorks</option>
              <option value="TopCV">TopCV</option>
              <option value="CareerViet">CareerViet</option>
              <option value="Glints">Glints</option>
              <option value="JobsGO">JobsGO</option>
              <option value="CareerLink">CareerLink</option>
              <option value="Indeed">Indeed</option>
              <option value="TopDev">TopDev</option>
              <option value="Timviec365">Timviec365</option>
            </select>

            {/* Location Filter */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="hidden sm:block bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none text-zinc-700 dark:text-zinc-300"
            >
              <option value="All">All Locations</option>
              <option value="Tra Vinh">Tra Vinh</option>
              <option value="Dak Lak">Dak Lak</option>
              <option value="Gia Lai">Gia Lai</option>
              <option value="Binh Thuan">Binh Thuan</option>
              <option value="Ca Mau">Ca Mau</option>
              <option value="Quang Tri">Quang Tri</option>
              <option value="Vung Tau">Vung Tau</option>
            </select>

            {/* Fetch Live */}
            <button
              onClick={handleFetchLiveData}
              disabled={liveFetching}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 font-semibold transition-colors text-xs disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <RefreshCw size={12} className={liveFetching ? 'animate-spin' : ''} />
              {liveFetching ? 'Fetching...' : 'Refresh'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-5 space-y-5">
        {/* ══════════ KPI ROW: Cards + Mini Chart ══════════ */}
        <section className="flex flex-col lg:flex-row gap-4">
          {/* Left: KPI Cards */}
          <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Total */}
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 hover-lift flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Database size={16} />
              </div>
              <div>
                <div className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase">Total</div>
                <div className="text-xl font-extrabold font-mono">{stats?.total || 0}</div>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 hover-lift flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <span className="text-[10px] font-black font-mono">LI</span>
              </div>
              <div>
                <div className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase">LinkedIn</div>
                <div className="text-xl font-extrabold font-mono">{stats?.platforms.find(p => p.name === 'LinkedIn')?.value || 0}</div>
              </div>
            </div>

            {/* Facebook */}
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 hover-lift flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <span className="text-[10px] font-black font-mono">FB</span>
              </div>
              <div>
                <div className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase">Facebook</div>
                <div className="text-xl font-extrabold font-mono">{stats?.platforms.find(p => p.name === 'Facebook')?.value || 0}</div>
              </div>
            </div>

            {/* Zalo */}
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 hover-lift flex items-center gap-3">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg">
                <span className="text-[10px] font-black font-mono">ZL</span>
              </div>
              <div>
                <div className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase">Zalo</div>
                <div className="text-xl font-extrabold font-mono">{stats?.platforms.find(p => p.name === 'Zalo')?.value || 0}</div>
              </div>
            </div>

            {/* VN Boards */}
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 hover-lift flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                <Globe size={16} />
              </div>
              <div>
                <div className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase">VN Boards</div>
                <div className="text-xl font-extrabold font-mono">
                  {stats?.platforms.reduce((acc, curr) => {
                    if (curr.name !== 'LinkedIn' && curr.name !== 'Facebook' && curr.name !== 'Zalo') {
                      return acc + curr.value;
                    }
                    return acc;
                  }, 0) || 0}
                </div>
              </div>
            </div>

            {/* Key Locations */}
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 hover-lift flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Layers size={16} />
              </div>
              <div>
                <div className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase">Locations</div>
                <div className="text-xl font-extrabold font-mono">{stats?.locations.length || 0}</div>
              </div>
            </div>
          </div>

          {/* Right: Mini Platform Donut */}
          <div className="w-full lg:w-48 shrink-0 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 hover-lift flex flex-col items-center justify-center">
            <div className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">Sources</div>
            <div className="h-[100px] w-[100px]">
              <ReactECharts option={miniPlatformOption} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
        </section>

        {/* ══════════ FULL-WIDTH JOB TABLE ══════════ */}
        <section>
          <JobTable
            jobs={jobs}
            selectedJobId={selectedJob?.id}
            onSelectJob={handleSelectJob}
          />
        </section>

        {/* ══════════ BOTTOM PANEL: Tabbed (Scraper | Charts | AI Chat) ══════════ */}
        <section className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
          {/* Tab Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4">
            <div className="flex items-center gap-0">
              {bottomTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setBottomTab(tab.id); setBottomPanelOpen(true); }}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                    bottomTab === tab.id && bottomPanelOpen
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setBottomPanelOpen(!bottomPanelOpen)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {bottomPanelOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>

          {/* Tab Content */}
          {bottomPanelOpen && (
            <div className="panel-enter">
              {/* ── SCRAPER COMPARISON TAB ── */}
              {bottomTab === 'scraper' && (
                <div className="p-5">
                  {/* Scraper Controls Row */}
                  <div className="flex flex-col md:flex-row gap-4 mb-5">
                    {/* Search Query */}
                    <div className="flex-grow">
                      <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                        Search Query
                      </label>
                      <input
                        type="text"
                        value={scraperQuery}
                        onChange={(e) => setScraperQuery(e.target.value)}
                        placeholder="e.g. site manager renewable"
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>

                    {/* Platform Priority */}
                    <div className="w-full md:w-64">
                      <label className="block text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                        Platform Priority
                      </label>
                      <select
                        value={scraperPlatform}
                        onChange={(e) => setScraperPlatform(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="All">All Platforms</option>
                        <option value="LinkedIn">LinkedIn Priority</option>
                        <option value="Facebook">Facebook Priority</option>
                        <option value="Zalo">Zalo Priority</option>
                        <option value="VN_Sites">Vietnam Job Boards</option>
                      </select>
                    </div>

                    {/* Run Buttons */}
                    <div className="flex gap-2 items-end shrink-0">
                      <button
                        onClick={handleScrape}
                        disabled={scraperLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold transition-colors text-xs disabled:opacity-50 flex items-center gap-1.5 h-[34px] whitespace-nowrap"
                      >
                        {scraperLoading ? (
                          <><RefreshCw size={12} className="animate-spin" /> Exa...</>
                        ) : (
                          <><Zap size={12} /> Run Exa</>
                        )}
                      </button>
                      <button
                        onClick={handleScraplingScrape}
                        disabled={scraplingLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 font-semibold transition-colors text-xs disabled:opacity-50 flex items-center gap-1.5 h-[34px] whitespace-nowrap"
                      >
                        {scraplingLoading ? (
                          <><RefreshCw size={12} className="animate-spin" /> Scrapling...</>
                        ) : (
                          <><Sparkles size={12} /> Run Scrapling</>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Metrics Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    {/* Exa Metrics */}
                    <div className="bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/60 dark:border-blue-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap size={14} className="text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Exa (Agent Reach)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="text-[9px] text-zinc-500 mb-0.5">Postings</div>
                          <div className="text-lg font-extrabold font-mono">{agentReachMetrics ? agentReachMetrics.postings_found : '--'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-zinc-500 mb-0.5">Speed</div>
                          <div className="text-lg font-extrabold font-mono text-amber-500">{agentReachMetrics ? `${agentReachMetrics.speed_ms}ms` : '--'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-zinc-500 mb-0.5">Success</div>
                          <div className="text-lg font-extrabold font-mono text-emerald-500">{agentReachMetrics ? `${agentReachMetrics.success_rate}%` : '--'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Scrapling Metrics */}
                    <div className="bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100/60 dark:border-purple-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-purple-500" />
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Scrapling (GitHub)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <div className="text-[9px] text-zinc-500 mb-0.5">Postings</div>
                          <div className="text-lg font-extrabold font-mono">{scraplingMetrics ? scraplingMetrics.postings_found : '--'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-zinc-500 mb-0.5">Speed</div>
                          <div className="text-lg font-extrabold font-mono text-amber-500">{scraplingMetrics ? `${scraplingMetrics.speed_ms}ms` : '--'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-zinc-500 mb-0.5">Success</div>
                          <div className="text-lg font-extrabold font-mono text-emerald-500">{scraplingMetrics ? `${scraplingMetrics.success_rate}%` : '--'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Grid: 2 columns — Exa results left, Scrapling results right */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Exa Results */}
                    <div>
                      <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Zap size={10} /> Exa Results ({scraperResults.length})
                      </div>
                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {scraperResults.length === 0 ? (
                          <div className="text-center text-xs text-zinc-400 py-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                            {scraperLoading ? 'Exa searching...' : 'Click "Run Exa" to start'}
                          </div>
                        ) : (
                          scraperResults.map((job) => {
                            const isAlreadyAdded = jobs.some(j => j.id === job.id);
                            return (
                              <div key={job.id} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-lg p-2.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <h4 className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 leading-snug truncate">
                                      {job.title}
                                    </h4>
                                    <div className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5 truncate">
                                      {job.company} • {job.location}
                                    </div>
                                  </div>
                                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-bold shrink-0 ${getPlatformBadgeClass(job.platform)}`}>
                                    {job.platform}
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-[8px] font-mono text-zinc-400">{job.post_date}</span>
                                  <button
                                    onClick={() => handleAddScrapedJob(job)}
                                    disabled={isAlreadyAdded}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold transition-colors ${
                                      isAlreadyAdded
                                        ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-600 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                  >
                                    {isAlreadyAdded ? <><Check size={8} /> Added</> : <><Plus size={8} /> Add</>}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Scrapling Results */}
                    <div>
                      <div className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles size={10} /> Scrapling Results ({scraplingResults.length})
                      </div>
                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {scraplingResults.length === 0 ? (
                          <div className="text-center text-xs text-zinc-400 py-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                            {scraplingLoading ? 'Scrapling scanning...' : 'Click "Run Scrapling" to start'}
                          </div>
                        ) : (
                          scraplingResults.map((job) => {
                            const isAlreadyAdded = jobs.some(j => j.id === job.id);
                            return (
                              <div key={job.id} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-lg p-2.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <h4 className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 leading-snug truncate">
                                      {job.title}
                                    </h4>
                                    <div className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5 truncate">
                                      {job.company} • {job.location}
                                    </div>
                                  </div>
                                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[7px] font-bold shrink-0 ${getPlatformBadgeClass(job.platform)}`}>
                                    {job.platform}
                                  </span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-[8px] font-mono text-zinc-400">{job.post_date}</span>
                                  <button
                                    onClick={() => handleAddScrapedJob(job)}
                                    disabled={isAlreadyAdded}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold transition-colors ${
                                      isAlreadyAdded
                                        ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-600 cursor-not-allowed'
                                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                                    }`}
                                  >
                                    {isAlreadyAdded ? <><Check size={8} /> Đã Thêm</> : <><Plus size={8} /> Add</>}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── ANALYTICS CHARTS TAB ── */}
              {bottomTab === 'charts' && (
                <div className="p-5">
                  <DashboardCharts stats={stats} isDark={isDark} />
                </div>
              )}

              {/* ── AI RECRUITER CHAT TAB ── */}
              {bottomTab === 'chat' && (
                <div className="p-5 max-w-3xl mx-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquareCode size={16} className="text-blue-500" />
                    <span className="text-sm font-semibold">Gemini Job Analyst</span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full font-medium">AI-powered</span>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 mb-4">
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`rounded-xl px-3.5 py-2.5 text-xs max-w-[75%] leading-relaxed ${
                            m.sender === 'user'
                              ? 'bg-blue-600 text-white rounded-br-sm'
                              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/40 rounded-bl-sm'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 rounded-xl px-3.5 py-2.5 text-xs border border-zinc-200/50 dark:border-zinc-800/40 animate-pulse">
                          Analyzing postings...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about qualifications, salary, locations..."
                      className="flex-grow bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* ══════════ SLIDE-OUT DRAWER ══════════ */}
      <DetailsPanel
        job={selectedJob}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        isApplied={selectedJob ? !!appliedJobs[selectedJob.id] : false}
        onToggleApply={() => selectedJob && toggleApplyState(selectedJob.id)}
      />
    </div>
  );
}
