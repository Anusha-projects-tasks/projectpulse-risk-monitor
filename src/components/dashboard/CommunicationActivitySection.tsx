import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  AtSign,
  HelpCircle,
  Hash,
  ArrowRight,
  Reply,
  CheckCircle,
} from 'lucide-react';

export const CommunicationActivitySection: React.FC = () => {
  const { messages, sendMessage, setCurrentPage } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'mentions' | 'help' | 'channels'>('all');
  const [quickInput, setQuickInput] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);

  const filteredMessages = messages.filter((m) => {
    if (activeTab === 'mentions') return m.isMention;
    if (activeTab === 'help') return m.isHelpRequest;
    if (activeTab === 'channels') return m.channel.startsWith('#');
    return true;
  });

  const handleSendQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    sendMessage({
      channel: replyToId ? '#task-sync' : '#project-general',
      content: quickInput.trim(),
    });

    setQuickInput('');
    setReplyToId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4" id="section-communication-activity">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">Communication Activity &amp; Live Feed</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time project discussions, engineer help requests, and incident triage threads.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('communication')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
        >
          <span>Open Full Messenger</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 rounded-lg font-medium transition ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Activity ({messages.length})
        </button>
        <button
          onClick={() => setActiveTab('mentions')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center space-x-1 transition ${
            activeTab === 'mentions'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AtSign className="w-3 h-3" />
          <span>Mentions</span>
        </button>
        <button
          onClick={() => setActiveTab('help')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center space-x-1 transition ${
            activeTab === 'help'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-3 h-3 text-rose-500" />
          <span>Help Requests</span>
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`px-3 py-1 rounded-lg font-medium flex items-center space-x-1 transition ${
            activeTab === 'channels'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Hash className="w-3 h-3" />
          <span>Project Channels</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {filteredMessages.slice(0, 5).map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-xl border text-xs transition ${
              !m.isRead
                ? 'bg-indigo-50/40 border-indigo-200'
                : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2">
                <img
                  src={m.senderAvatar}
                  alt={m.senderName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{m.senderName}</span>
                    <span className="font-mono text-[10px] text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                      {m.channel}
                    </span>
                    {m.isHelpRequest && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                        Help Request
                      </span>
                    )}
                    {m.isMention && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                        @Mention
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{m.timestamp}</span>
                </div>
              </div>

              <button
                onClick={() => setReplyToId(m.id)}
                className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center space-x-1"
              >
                <Reply className="w-3 h-3" />
                <span>Reply</span>
              </button>
            </div>

            <p className="mt-2 text-slate-700 leading-relaxed pl-9">{m.content}</p>
          </div>
        ))}
      </div>

      {/* Quick Reply Form */}
      <form onSubmit={handleSendQuick} className="pt-2 border-t border-slate-100 flex gap-2">
        <input
          type="text"
          placeholder={replyToId ? `Replying in thread...` : 'Post update to #project-general...'}
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
