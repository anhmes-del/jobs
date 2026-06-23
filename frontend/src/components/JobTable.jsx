import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ExternalLink } from 'lucide-react';

export default function JobTable({ jobs, selectedJobId, onSelectJob }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(jobs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Helper to extract numeric years of experience from text and return progress bar percentage
  const getExperiencePercentage = (requirements) => {
    for (const req of requirements) {
      const match = req.match(/(\d+)\+?\s*years?/i);
      if (match) {
        const years = parseInt(match[1]);
        return {
          years,
          percent: Math.min((years / 10) * 100, 100)
        };
      }
    }
    return { years: 3, percent: 30 }; // Default fallback
  };

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
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  return (
    <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Table Content */}
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-[#121216] border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Title & Company</th>
              <th className="px-6 py-4">Platform</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Exp Level</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
            {currentJobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                  No job postings found matching the filters.
                </td>
              </tr>
            ) : (
              currentJobs.map((job) => {
                const isSelected = job.id === selectedJobId;
                const { years, percent } = getExperiencePercentage(job.key_requirements);
                
                // Color mapping: green for low experience (1-3 yrs), orange for medium (4-6 yrs), rose for high (7+ yrs)
                let barColor = 'bg-emerald-500';
                if (years >= 7) barColor = 'bg-rose-500';
                else if (years >= 4) barColor = 'bg-orange-400';

                return (
                  <tr
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className={`cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? 'bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100/40 dark:hover:bg-blue-900/30'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                    }`}
                  >
                    {/* Title & Company */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{job.title}</span>
                        {job.role && (
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase ${
                            job.role === 'Project Manager'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-400'
                              : job.role === 'HSE'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400'
                              : job.role === 'Civil Engineer'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-400'
                          }`}>
                            {job.role}
                          </span>
                        )}
                      </div>
                      <div className="text-zinc-500 dark:text-zinc-400 text-xs">{job.company}</div>
                    </td>

                    {/* Platform Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPlatformBadgeClass(job.platform)}`}>
                        {job.platform}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                      {job.location}
                    </td>

                    {/* Exp Level Progress Bar */}
                    <td className="px-6 py-4 w-40">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${barColor}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                          {years}+ yrs
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={job.post_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-500 dark:text-zinc-400 dark:hover:text-blue-400"
                      >
                        Source <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between bg-zinc-50/50 dark:bg-[#121216]">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Showing <span className="font-medium text-zinc-900 dark:text-zinc-100">{jobs.length ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {Math.min(startIndex + itemsPerPage, jobs.length)}
          </span>{' '}
          of <span className="font-medium text-zinc-900 dark:text-zinc-100">{jobs.length}</span> postings
        </div>

        <div className="flex items-center gap-1">
          {/* First Page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-400"
          >
            <ChevronsLeft size={16} />
          </button>
          {/* Previous Page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-400"
          >
            <ChevronLeft size={16} />
          </button>
          {/* Next Page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-400"
          >
            <ChevronRight size={16} />
          </button>
          {/* Last Page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-400"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
