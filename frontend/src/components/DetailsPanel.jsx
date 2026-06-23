import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Calendar, Briefcase, MapPin, DollarSign, Send, Check, Phone, Mail, MessageCircle, Copy, CheckCheck } from 'lucide-react';

export default function DetailsPanel({ job, onClose, isApplied, onToggleApply, isOpen }) {
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(job.raw_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  if (!job || !isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 dark:bg-black/50 z-40 drawer-backdrop ${isClosing ? 'backdrop-exit' : 'backdrop-enter'}`}
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] z-50 bg-white dark:bg-[#0c0c0f] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col ${isClosing ? 'drawer-exit' : 'drawer-enter'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#121216]/50 shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug truncate">
              {job.title}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{job.company}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0 ml-3"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto px-6 py-5 space-y-5">
          {/* Quick metadata badges */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
              <MapPin size={14} className="text-zinc-400 shrink-0" />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
              <Briefcase size={14} className="text-zinc-400 shrink-0" />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{job.project_type} Project</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
              <DollarSign size={14} className="text-zinc-400 shrink-0" />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 truncate">{job.salary}</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
              <Calendar size={14} className="text-zinc-400 shrink-0" />
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{job.post_date}</span>
            </div>
          </div>

          {/* Recruiter Details Card */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Recruiter Profile
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{job.recruiter_name}</div>
                <a
                  href={job.recruiter_profile}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  View Profile <ExternalLink size={10} />
                </a>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide ${
                job.platform === 'LinkedIn'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : job.platform === 'Facebook'
                  ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
                  : job.platform === 'Zalo'
                  ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/20 dark:text-cyan-400'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
              }`}>
                {job.platform}
              </span>
            </div>
          </div>

          {/* Recruiter Contact Channels */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
              Direct Contact Channels
            </h4>
            <div className="flex flex-col gap-2">
              {job.email && job.email !== 'N/A' && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <Mail size={13} className="text-emerald-500 shrink-0" />
                    <span className="font-mono text-xs truncate max-w-[180px]" title={job.email}>{job.email}</span>
                  </div>
                  <a href={`mailto:${job.email}`} className="text-[10px] text-blue-500 hover:underline font-semibold shrink-0">
                    Send
                  </a>
                </div>
              )}
              
              {job.phone && job.phone !== 'N/A' && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <Phone size={13} className="text-blue-500 shrink-0" />
                    <span className="font-mono text-xs">{job.phone}</span>
                  </div>
                  <a href={`tel:${job.phone}`} className="text-[10px] text-blue-500 hover:underline font-semibold shrink-0">
                    Call
                  </a>
                </div>
              )}

              {job.zalo && job.zalo !== 'N/A' && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <MessageCircle size={13} className="text-cyan-500 shrink-0" />
                    <span className="font-mono text-xs">{job.zalo}</span>
                  </div>
                  <a href={`https://zalo.me/${job.zalo}`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline font-semibold shrink-0">
                    Zalo
                  </a>
                </div>
              )}

              {job.facebook && job.facebook !== 'N/A' && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <ExternalLink size={13} className="text-indigo-500 shrink-0" />
                    <span className="font-mono text-xs">Facebook</span>
                  </div>
                  <a href={job.facebook} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline font-semibold shrink-0">
                    Open
                  </a>
                </div>
              )}

              {(!job.email || job.email === 'N/A') && (!job.phone || job.phone === 'N/A') && (!job.facebook || job.facebook === 'N/A') && (
                <div className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                  No direct contact details extracted. Apply via the recruiter profile or source link.
                </div>
              )}
            </div>
          </div>

          {/* Key Requirements */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
              Extracted Requirements
            </h4>
            <ul className="space-y-1.5">
              {job.key_requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Post Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Post Preview
              </h4>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-600 dark:text-blue-400 font-semibold transition-colors"
              >
                {copied ? <><CheckCheck size={10} /> Copied!</> : <><Copy size={10} /> Copy</>}
              </button>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/30 dark:bg-[#121216]/50 overflow-hidden">
              {/* Post Header */}
              <div className="p-3 flex items-center gap-2.5 border-b border-zinc-200/40 dark:border-zinc-800/40">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0 ${
                  job.platform === 'Facebook' ? 'bg-indigo-600'
                    : job.platform === 'LinkedIn' ? 'bg-blue-600'
                    : job.platform === 'Zalo' ? 'bg-cyan-600'
                    : 'bg-emerald-600'
                }`}>
                  {job.recruiter_name ? job.recruiter_name.substring(0, 2) : 'HR'}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {job.recruiter_name || 'HR Recruiter'}
                  </div>
                  <div className="text-[9px] text-zinc-500 dark:text-zinc-400">
                    {job.post_date} • {job.platform}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-3 text-[11px] text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto bg-white/50 dark:bg-[#0c0c0f]/50">
                {job.raw_text}
              </div>

              {/* Footer */}
              <div className="bg-zinc-50/50 dark:bg-[#15151b]/40 px-3 py-1.5 border-t border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-between text-[8px] text-zinc-400 dark:text-zinc-500">
                <span>🛡️ Cached via Agent Reach</span>
                <span className="font-mono uppercase">ID: {job.id.substring(0, 10)}...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Action Buttons at Bottom */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#121216]/50 flex gap-3 shrink-0">
          <a
            href={
              job.email && job.email !== 'N/A'
                ? `mailto:${job.email}`
                : job.phone && job.phone !== 'N/A'
                ? `tel:${job.phone}`
                : job.recruiter_profile
            }
            target={job.email && job.email !== 'N/A' ? '_self' : '_blank'}
            rel="noreferrer"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 px-4 font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 text-xs"
          >
            <Send size={14} />
            Contact
          </a>

          <button
            onClick={onToggleApply}
            className={`flex-1 border rounded-lg py-2.5 px-4 font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 text-xs ${
              isApplied
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200'
            }`}
          >
            {isApplied ? (
              <><Check size={14} /> Applied</>
            ) : (
              'Mark Applied'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
