import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sun, Moon, Briefcase, BarChart3, Database, MessageSquareCode, Search, RefreshCw, Layers, Sparkles, Plus, Check, ChevronRight } from 'lucide-react';
import DashboardCharts from './components/DashboardCharts';
import JobTable from './components/JobTable';
import DetailsPanel from './components/DetailsPanel';

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
  const [appliedJobs, setAppliedJobs] = useState({});
  const [isDark, setIsDark] = useState(true); // Dark mode by default

  // Main board Filters
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('All');
  const [location, setLocation] = useState('All');
  const [activeRoleTab, setActiveRoleTab] = useState('All');
  const [liveFetching, setLiveFetching] = useState(false);

  // Side Panel Tabs: 'details', 'chat', or 'scraper'
  const [activeTab, setActiveTab] = useState('scraper'); // Scraper open by default for this update

  // AI Chat State
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hi there! I am your Gemini-powered Wind Farm Recruiter Agent. Ask me anything about these job postings!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Agent Reach Scraper State
  const [scraperQuery, setScraperQuery] = useState('site manager renewable');
  const [scraperPlatform, setScraperPlatform] = useState('All');
  const [scraperResults, setScraperResults] = useState([]);
  const [scraperLoading, setScraperLoading] = useState(false);
  const [addedJobsCount, setAddedJobsCount] = useState(0);

  // Scrapling Scraper State
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

  // Simulates data filtering on frontend if backend is offline
  const simulateLocalFetch = () => {
    const baseMockJobs = [];

    let filtered = baseMockJobs;
    setJobs(filtered);

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
      return; // Already added
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

      // Update charts statistics dynamically
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
    setActiveTab('details'); // Auto open details tab
  };

  const toggleApplyState = (jobId) => {
    setAppliedJobs(prev => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f] sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <Briefcase size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Wind Farm Site Manager Tracker</h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">REAL-TIME JOB ANALYSIS: FACEBOOK & LINKEDIN</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {addedJobsCount > 0 && (
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-full animate-bounce">
                +{addedJobsCount} Scraped Jobs Added
              </span>
            )}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-zinc-600" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        {/* KPI Dashboard Statistics Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Database size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Postings</div>
              <div className="text-2xl font-bold font-mono">{stats?.total || 0}</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <span className="text-sm font-bold font-mono">LI</span>
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">LinkedIn Sourced</div>
              <div className="text-2xl font-bold font-mono">
                {stats?.platforms.find(p => p.name === 'LinkedIn')?.value || 0}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <span className="text-sm font-bold font-mono">FB</span>
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Facebook Sourced</div>
              <div className="text-2xl font-bold font-mono">
                {stats?.platforms.find(p => p.name === 'Facebook')?.value || 0}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg">
              <span className="text-sm font-bold font-mono">ZL</span>
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Zalo Sourced</div>
              <div className="text-2xl font-bold font-mono">
                {stats?.platforms.find(p => p.name === 'Zalo')?.value || 0}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
              <span className="text-sm font-bold font-mono">VN</span>
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">VN Boards Sourced</div>
              <div className="text-2xl font-bold font-mono">
                {stats?.platforms.reduce((acc, curr) => {
                  if (curr.name !== 'LinkedIn' && curr.name !== 'Facebook' && curr.name !== 'Zalo') {
                    return acc + curr.value;
                  }
                  return acc;
                }, 0) || 0}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Key Locations</div>
              <div className="text-2xl font-bold font-mono">{stats?.locations.length || 0}</div>
            </div>
          </div>
        </section>

        {/* ECharts Section */}
        <DashboardCharts stats={stats} isDark={isDark} />

        {/* Toolbar & Filters */}
        <section className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, recruiters or skills..."
                className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Platform Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider shrink-0">Platform:</span>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
              >
                <option value="All">All Platforms</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="Zalo">Zalo</option>
                <option value="VietnamWorks">VietnamWorks</option>
                <option value="TopCV">TopCV</option>
                <option value="CareerViet">CareerViet</option>
                <option value="Glints">Glints</option>
                <option value="ViecLam24h">ViecLam24h</option>
                <option value="CareerLink">CareerLink</option>
                <option value="Joboko">Joboko</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider shrink-0">Location:</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
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
            </div>
          </div>

          {/* Fetch Live Data Button */}
          <button
            onClick={handleFetchLiveData}
            disabled={liveFetching}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={liveFetching ? 'animate-spin' : ''} />
            {liveFetching ? 'Fetching Live Data...' : 'Fetch Live Data'}
          </button>
        </section>

        {/* Main Dashboard Layout Split */}
        <section className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Left Block: Primary Data Table */}
          <div className={`transition-all duration-300 w-full ${selectedJob || activeTab !== 'none' ? 'lg:w-2/3' : 'lg:w-full'} flex flex-col gap-4`}>
            {/* Role Filter Tabs */}
            <div className="flex bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 shrink-0 self-start shadow-sm gap-1">
              {[
                { id: 'All', label: 'All Construction' },
                { id: 'Site Manager', label: 'Site Managers' },
                { id: 'Project Manager', label: 'Project Managers' },
                { id: 'HSE', label: 'HSE Officers' },
                { id: 'Civil Engineer', label: 'Civil Engineers' }
              ].map(tab => {
                const isActive = activeRoleTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRoleTab(tab.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <JobTable
              jobs={jobs}
              selectedJobId={selectedJob?.id}
              onSelectJob={handleSelectJob}
            />
          </div>

          {/* Right Block: Tabbed details / AI Recruiter / Agent Reach Scraper */}
          <div className="w-full lg:w-1/3 flex flex-col min-h-[500px]">
            {/* Tab Selector */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-2">
              <button
                onClick={() => setActiveTab('details')}
                disabled={!selectedJob}
                className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-all ${
                  !selectedJob
                    ? 'text-zinc-300 dark:text-zinc-700 border-transparent cursor-not-allowed'
                    : activeTab === 'details'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Job Details
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'chat'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                AI Recruiter
              </button>
              <button
                onClick={() => setActiveTab('scraper')}
                className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'scraper'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Agent Reach
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'comparison'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                So Sánh Bộ Quét
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-grow">
              {activeTab === 'details' && selectedJob && (
                <DetailsPanel
                  job={selectedJob}
                  onClose={() => {
                    setSelectedJob(null);
                    setActiveTab('scraper');
                  }}
                  isApplied={!!appliedJobs[selectedJob.id]}
                  onToggleApply={() => toggleApplyState(selectedJob.id)}
                />
              )}

              {activeTab === 'chat' && (
                /* Gemini Chat panel */
                <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col h-full justify-between min-h-[450px]">
                  <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-3 shrink-0">
                    <MessageSquareCode size={18} className="text-blue-500" />
                    <div className="text-sm font-semibold">Gemini Job Analyst</div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-grow overflow-y-auto space-y-3 pr-1 max-h-[300px]">
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`rounded-lg px-3 py-2 text-xs max-w-[85%] leading-relaxed ${
                            m.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/40'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 rounded-lg px-3 py-2 text-xs border border-zinc-200/50 dark:border-zinc-800/40 animate-pulse">
                          Analyzing postings...
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex gap-2 shrink-0">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about qualifications, salary, locations..."
                      className="flex-grow bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'scraper' && (
                /* Agent Reach Scraper panel */
                <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col h-full min-h-[450px]">
                  <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4 shrink-0">
                    <Sparkles size={18} className="text-blue-500" />
                    <div className="text-sm font-semibold">Agent Reach Live Scraper</div>
                  </div>

                  {/* Search controls inside Scraper */}
                  <form onSubmit={handleScrape} className="space-y-3 mb-4 shrink-0">
                    <div>
                      <label className="block text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                        Search Query
                      </label>
                      <input
                        type="text"
                        value={scraperQuery}
                        onChange={(e) => setScraperQuery(e.target.value)}
                        placeholder="e.g. site manager renewable"
                        className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                          Platform Priority
                        </label>
                        <select
                          value={scraperPlatform}
                          onChange={(e) => setScraperPlatform(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="All">All Platforms</option>
                          <option value="LinkedIn">LinkedIn Priority</option>
                          <option value="Facebook">Facebook Priority</option>
                          <option value="Zalo">Zalo Priority</option>
                          <option value="VN_Sites">Vietnam Job Boards (VietnamWorks, TopCV, CareerViet...)</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <button
                          type="submit"
                          disabled={scraperLoading}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium transition-colors text-xs disabled:opacity-50 h-8 flex items-center justify-center gap-1.5"
                        >
                          {scraperLoading ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" /> Scraping...
                            </>
                          ) : (
                            'Run Scrape'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Scrape results list */}
                  <div className="flex-grow overflow-y-auto space-y-3 max-h-[220px] pr-1">
                    {scraperResults.length === 0 ? (
                      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 py-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                        {scraperLoading ? 'Exa Search running live...' : 'Click "Run Scrape" to scrape live listings from Facebook/LinkedIn using Exa MCP.'}
                      </div>
                    ) : (
                      scraperResults.map((job) => {
                        const isAlreadyAdded = jobs.some(j => j.id === job.id);
                        return (
                          <div
                            key={job.id}
                            className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-lg p-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                                  {job.title}
                                </h4>
                                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                                  {job.company} • {job.location}
                                </div>
                              </div>
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold ${getPlatformBadgeClass(job.platform)}`}>
                                {job.platform}
                              </span>
                            </div>

                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                              {job.raw_text}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[9px] font-mono text-zinc-400">{job.post_date}</span>
                              
                              <button
                                onClick={() => handleAddScrapedJob(job)}
                                disabled={isAlreadyAdded}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                                  isAlreadyAdded
                                    ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-600 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                }`}
                              >
                                {isAlreadyAdded ? (
                                  <>
                                    <Check size={10} /> Added
                                  </>
                                ) : (
                                  <>
                                    <Plus size={10} /> Add to Board
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'comparison' && (
                <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col h-full min-h-[450px]">
                  <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4 shrink-0">
                    <BarChart3 size={18} className="text-blue-500" />
                    <div className="text-sm font-semibold">So Sánh Bộ Quét (Exa vs Scrapling)</div>
                  </div>

                  {/* Settings Query & Platform */}
                  <div className="space-y-3 mb-4 bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/40 shrink-0">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Từ Khóa & Nguồn Cào Chung</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      Từ khóa: <span className="font-mono text-blue-500 font-bold">"{scraperQuery}"</span> | Nguồn: <span className="font-semibold text-zinc-900 dark:text-zinc-200">{scraperPlatform === 'All' ? 'Tất cả' : scraperPlatform}</span>
                    </div>
                  </div>

                  {/* Run Buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
                    <button
                      onClick={handleScrape}
                      disabled={scraperLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium transition-colors text-xs disabled:opacity-50 flex items-center justify-center gap-1.5 h-9"
                    >
                      {scraperLoading ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" /> Chạy Exa...
                        </>
                      ) : (
                        'Chạy Exa (Agent Reach)'
                      )}
                    </button>
                    
                    <button
                      onClick={handleScraplingScrape}
                      disabled={scraplingLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 font-medium transition-colors text-xs disabled:opacity-50 flex items-center justify-center gap-1.5 h-9"
                    >
                      {scraplingLoading ? (
                        <>
                          <RefreshCw size={12} className="animate-spin" /> Chạy Scrapling...
                        </>
                      ) : (
                        'Chạy Scrapling Scraper'
                      )}
                    </button>
                  </div>

                  {/* Metrics Comparison Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
                    {/* Exa Metrics */}
                    <div className="bg-blue-50/30 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20 rounded-lg p-3">
                      <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2">Bộ Quét Exa (Agent Reach)</div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Số tin cào:</span>
                          <span className="font-bold font-mono">{agentReachMetrics ? agentReachMetrics.postings_found : '--'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Tốc độ:</span>
                          <span className="font-bold font-mono text-amber-500">{agentReachMetrics ? `${agentReachMetrics.speed_ms} ms` : '--'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Thành công:</span>
                          <span className="font-bold font-mono text-emerald-500">{agentReachMetrics ? `${agentReachMetrics.success_rate}%` : '--'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Scrapling Metrics */}
                    <div className="bg-purple-50/30 dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-900/20 rounded-lg p-3">
                      <div className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-2">Bộ Quét Scrapling (GitHub)</div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Số tin cào:</span>
                          <span className="font-bold font-mono">{scraplingMetrics ? scraplingMetrics.postings_found : '--'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Tốc độ:</span>
                          <span className="font-bold font-mono text-amber-500">{scraplingMetrics ? `${scraplingMetrics.speed_ms} ms` : '--'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Thành công:</span>
                          <span className="font-bold font-mono text-emerald-500">{scraplingMetrics ? `${scraplingMetrics.success_rate}%` : '--'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scrapling Results List */}
                  <div className="flex-grow overflow-y-auto space-y-3 max-h-[160px] pr-1">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Kết Quả Từ Bộ Quét Scrapling</div>
                    {scraplingResults.length === 0 ? (
                      <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 py-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                        {scraplingLoading ? 'Scrapling đang cào dữ liệu...' : 'Click "Chạy Scrapling Scraper" để xem tin cào bằng Scrapling.'}
                      </div>
                    ) : (
                      scraplingResults.map((job) => {
                        const isAlreadyAdded = jobs.some(j => j.id === job.id);
                        return (
                          <div
                            key={job.id}
                            className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-lg p-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                                  {job.title}
                                </h4>
                                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                                  {job.company} • {job.location}
                                </div>
                              </div>
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold ${getPlatformBadgeClass(job.platform)}`}>
                                {job.platform}
                              </span>
                            </div>

                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2">
                              {job.raw_text}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[9px] font-mono text-zinc-400">{job.post_date}</span>
                              
                              <button
                                onClick={() => handleAddScrapedJob(job)}
                                disabled={isAlreadyAdded}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                                  isAlreadyAdded
                                    ? 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-600 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                }`}
                              >
                                {isAlreadyAdded ? (
                                  <>
                                    <Check size={10} /> Đã Thêm
                                  </>
                                ) : (
                                  <>
                                    <Plus size={10} /> Add to Board
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
