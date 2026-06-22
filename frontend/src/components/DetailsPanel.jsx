import React, { useState } from 'react';
import { X, ExternalLink, Calendar, Briefcase, MapPin, DollarSign, Send, Check, Phone, Mail, MessageCircle } from 'lucide-react';

export default function DetailsPanel({ job, onClose, isApplied, onToggleApply }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(job.raw_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!job) return null;

  return (
    <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-md flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug">
            {job.title}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">{job.company}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Quick metadata badges */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
          <MapPin size={16} className="text-zinc-400" />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
          <Briefcase size={16} className="text-zinc-400" />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{job.project_type} Project</span>
        </div>
        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
          <DollarSign size={16} className="text-zinc-400" />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 truncate">{job.salary}</span>
        </div>
        <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/40">
          <Calendar size={16} className="text-zinc-400" />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{job.post_date}</span>
        </div>
      </div>

      {/* Recruiter Details Card */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
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
              View Recruiter Profile <ExternalLink size={10} />
            </a>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
            job.platform === 'LinkedIn'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
          }`}>
            {job.platform} Post
          </span>
        </div>
      </div>

      {/* Recruiter Contact Channels */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
          Direct Contact Channels
        </h4>
        <div className="flex flex-col gap-2.5">
          {/* Email */}
          {job.email && job.email !== 'N/A' && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <Mail size={14} className="text-emerald-500 shrink-0" />
                <span className="font-semibold">Email:</span>
                <span className="font-mono text-xs truncate max-w-[140px]" title={job.email}>{job.email}</span>
              </div>
              <a
                href={`mailto:${job.email}`}
                className="text-xs text-blue-500 hover:underline font-semibold"
              >
                Send Email
              </a>
            </div>
          )}
          
          {/* Phone */}
          {job.phone && job.phone !== 'N/A' && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <Phone size={14} className="text-blue-500 shrink-0" />
                <span className="font-semibold">Phone:</span>
                <span className="font-mono text-xs">{job.phone}</span>
              </div>
              <a
                href={`tel:${job.phone}`}
                className="text-xs text-blue-500 hover:underline font-semibold"
              >
                Call Now
              </a>
            </div>
          )}

          {/* Zalo */}
          {job.zalo && job.zalo !== 'N/A' && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <MessageCircle size={14} className="text-cyan-500 shrink-0" />
                <span className="font-semibold">Zalo:</span>
                <span className="font-mono text-xs">{job.zalo}</span>
              </div>
              <a
                href={`https://zalo.me/${job.zalo}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500 hover:underline font-semibold"
              >
                Open Zalo Chat
              </a>
            </div>
          )}

          {/* Facebook */}
          {job.facebook && job.facebook !== 'N/A' && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                <ExternalLink size={14} className="text-indigo-500 shrink-0" />
                <span className="font-semibold">Facebook:</span>
                <span className="truncate max-w-[120px] font-mono text-xs" title={job.facebook}>Link</span>
              </div>
              <a
                href={job.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500 hover:underline font-semibold shrink-0"
              >
                Open Profile
              </a>
            </div>
          )}

          {(!job.email || job.email === 'N/A') && (!job.phone || job.phone === 'N/A') && (!job.facebook || job.facebook === 'N/A') && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400 italic">
              No direct contact details extracted. Please apply via the recruiter profile or source link.
            </div>
          )}
        </div>
      </div>

      {/* Key Requirements */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
          Extracted Requirements
        </h4>
        <ul className="space-y-2">
          {job.key_requirements.map((req, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Social Post Simulator Card */}
      <div className="flex-grow mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Post Preview (Cached by Scraper)
          </h4>
          <button
            onClick={handleCopy}
            className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold animate-fade-in"
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>

        {/* Simulator Frame */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/30 dark:bg-[#121216]/50 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="p-3.5 flex items-center gap-3 border-b border-zinc-200/40 dark:border-zinc-800/40">
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shrink-0 ${
              job.platform === 'Facebook'
                ? 'bg-blue-600'
                : job.platform === 'LinkedIn'
                ? 'bg-blue-800'
                : 'bg-emerald-600'
            }`}>
              {job.recruiter_name ? job.recruiter_name.substring(0, 2) : 'HR'}
            </div>
            
            {/* Name and Meta */}
            <div className="flex-grow min-w-0">
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {job.recruiter_name || 'HR Recruiter'}
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <span>{job.post_date}</span>
                <span>•</span>
                <span className="capitalize">{job.platform}</span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-3.5 text-xs text-zinc-700 dark:text-zinc-350 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto font-sans bg-white/50 dark:bg-[#0c0c0f]/50">
            {job.raw_text}
          </div>

          {/* Footer Status Bar */}
          <div className="bg-zinc-50/50 dark:bg-[#15151b]/40 px-3.5 py-2 border-t border-zinc-200/40 dark:border-zinc-800/40 flex items-center justify-between text-[9px] text-zinc-400 dark:text-zinc-500">
            <span>🛡️ Content cached securely via Agent Reach</span>
            <span className="font-mono text-[8px] uppercase">ID: {job.id.substring(0, 10)}...</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
        {/* Contact Recruiter */}
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
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-lg py-2.5 px-4 font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm text-center"
        >
          <Send size={16} />
          Contact Recruiter
        </a>

        {/* Mark as Applied */}
        <button
          onClick={onToggleApply}
          className={`flex-1 border rounded-lg py-2.5 px-4 font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm ${
            isApplied
              ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
              : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 dark:bg-[#262626] dark:hover:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200'
          }`}
        >
          {isApplied ? (
            <>
              <Check size={16} /> Applied
            </>
          ) : (
            'Mark as Applied'
          )}
        </button>
      </div>
    </div>
  );
}
