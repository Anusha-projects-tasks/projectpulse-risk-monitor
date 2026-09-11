import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  Hash,
  AtSign,
  HelpCircle,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Smile,
  ShieldAlert,
} from 'lucide-react';

export const CommunicationPage: React.FC = () => {
  const { messages, sendMessage, markMessageRead, teamMembers } = useApp();

  const [activeChannel, setActiveChannel] = useState<string>('#project-general');
  const [inputText, setInputText] = useState('');
  const [isHelpFlag, setIsHelpFlag] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const channels = [
    { id: '#project-general', name: 'project-general', desc: 'Main team delivery discussions' },
    { id: '#infrastructure', name: 'infrastructure', desc: 'K8s, DB sharding & AWS mesh' },
    { id: '#risk-alerts', name: 'risk-alerts', desc: 'Automated telemetry & warnings' },
    { id: '#incident-triage', name: 'incident-triage', desc: 'Active blockers & remediation' },
  ];

  const currentMessages = messages.filter((m) => {
    if (m.channel !== activeChannel && activeChannel !== '#all') return false;
    if (searchFilter.trim() && !m.content.toLowerCase().includes(searchFilter.toLowerCase()))
      return false;
    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage({
      channel: activeChannel,
      content: inputText.trim(),
      isHelpRequest: isHelpFlag,
    });

    setInputText('');
    setIsHelpFlag(false);
  };

  return (
    <div className="space-y-4 pb-12" id="page-communication">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Enterprise Communication &amp; Incident Chat
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              Live Stream Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized team channels, emergency triage threads, and automated milestone notification broadcasts.
          </p>
        </div>
      </div>

      {/* Main Slack-style Chat Interface */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        {/* Left: Channels & Team List */}
        <div className="md:col-span-4 lg:col-span-3 border-r border-slate-200 bg-slate-50/50 p-4 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chat history..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
            />
          </div>

          {/* Project Channels */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Project Channels
            </span>
            <div className="space-y-1">
              {channels.map((ch) => {
                const isActive = activeChannel === ch.id;
                const unreadCount = messages.filter((m) => m.channel === ch.id && !m.isRead).length;

                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Hash className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{ch.name}</span>
                    </div>
                    {unreadCount > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white'
                        }`}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Team Members Roster */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Staff Engineers ({teamMembers.length})
            </span>
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {teamMembers.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-white transition text-xs"
                >
                  <div className="relative">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
                        m.availabilityStatus === 'available'
                          ? 'bg-emerald-500'
                          : m.availabilityStatus === 'overloaded'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-800 truncate">{m.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between h-full bg-white">
          {/* Chat Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
            <div>
              <div className="flex items-center space-x-2">
                <Hash className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">{activeChannel}</h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {channels.find((c) => c.id === activeChannel)?.desc || 'Project channel'}
              </p>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              {currentMessages.length} Messages Logged
            </span>
          </div>

          {/* Messages Feed */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1 max-h-[480px]">
            {currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-xs">No messages posted in this channel yet.</p>
              </div>
            ) : (
              currentMessages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => markMessageRead(m.id)}
                  className={`p-3.5 rounded-xl border text-xs transition ${
                    m.isHelpRequest
                      ? 'bg-rose-50/40 border-rose-200'
                      : !m.isRead
                      ? 'bg-indigo-50/30 border-indigo-200'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={m.senderAvatar}
                        alt={m.senderName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">{m.senderName}</span>
                          {m.isHelpRequest && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 flex items-center gap-1">
                              <HelpCircle className="w-3 h-3" />
                              Critical Help Request
                            </span>
                          )}
                          {m.isMention && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                              @Mention
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{m.timestamp}</span>
                      </div>
                    </div>

                    {!m.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" title="Unread" />
                    )}
                  </div>

                  <p className="mt-2 text-slate-700 leading-relaxed pl-10 text-xs">{m.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Chat Composer */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-slate-50/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHelpFlag}
                  onChange={(e) => setIsHelpFlag(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                />
                <span className="font-bold text-rose-700 text-[11px]">
                  Flag as Blocked / Emergency Help Request (+10 Risk Points)
                </span>
              </label>
              <span className="text-[10px] text-slate-400">Markdown formatting supported</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder={`Message ${activeChannel}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
