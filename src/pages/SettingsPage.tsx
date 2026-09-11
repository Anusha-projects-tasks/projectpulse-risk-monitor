import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  ShieldAlert,
  Bell,
  Sliders,
  Database,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetToDefaults } = useApp();

  const [gapWeight, setGapWeight] = useState(30);
  const [overloadWeight, setOverloadWeight] = useState(25);
  const [deadlineWeight, setDeadlineWeight] = useState(25);
  const [blockedWeight, setBlockedWeight] = useState(20);
  const [leaveWeight, setLeaveWeight] = useState(20);
  const [ownerWeight, setOwnerWeight] = useState(15);
  const [commsWeight, setCommsWeight] = useState(10);

  const [slackAlerts, setSlackAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [autoReassign, setAutoReassign] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl" id="page-settings">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Enterprise Risk Scoring &amp; Platform Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure heuristic weights for the rule-based calculation engine, automated alerting thresholds, and team constraints.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Platform configuration and heuristic weights updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Risk Calculation Rule Weights */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Heuristic Rule Scoring Points (Max 100 Cap)
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Adjust the risk penalties applied to projects and tasks when specific operational friction points are detected.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Progress Gap &gt; 20% (Points)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={gapWeight}
                onChange={(e) => setGapWeight(parseInt(e.target.value, 10) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Workload Overload (&gt;40h/wk)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={overloadWeight}
                onChange={(e) => setOverloadWeight(parseInt(e.target.value, 10) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Critical Deadline Approaching (&le; 2 Days)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={deadlineWeight}
                onChange={(e) => setDeadlineWeight(parseInt(e.target.value, 10) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Blocked Upstream Dependency
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={blockedWeight}
                onChange={(e) => setBlockedWeight(parseInt(e.target.value, 10) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assigned Member on Leave / Unavailable
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={leaveWeight}
                onChange={(e) => setLeaveWeight(parseInt(e.target.value, 10) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Missing Technical Lead / Unassigned Owner
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={ownerWeight}
                onChange={(e) => setOwnerWeight(parseInt(e.target.value, 10) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Communication Delay (&gt; 72 Hours Silent)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={commsWeight}
                onChange={(e) => setCommsWeight(parseInt(e.target.value, 10) || 0)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Automated Actions & Notifications */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Automation &amp; Broadcast Triggers</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">
                  Automated Task Reassignment Recommendations
                </span>
                <span className="text-slate-500 text-[11px]">
                  Proactively suggest replacement engineers when leave requests are submitted.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoReassign}
                onChange={(e) => setAutoReassign(e.target.checked)}
                className="rounded text-indigo-600 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Slack &amp; Webhook Escalations</span>
                <span className="text-slate-500 text-[11px]">
                  Post to #risk-alerts when any task risk score crosses 70 threshold.
                </span>
              </div>
              <input
                type="checkbox"
                checked={slackAlerts}
                onChange={(e) => setSlackAlerts(e.target.checked)}
                className="rounded text-indigo-600 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Weekly Executive Digest</span>
                <span className="text-slate-500 text-[11px]">
                  Send weekly project health breakdown to engineering leadership.
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={(e) => setEmailDigest(e.target.checked)}
                className="rounded text-indigo-600 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Database & Mock Reset */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <Database className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Local Persistence Engine</h3>
          </div>

          <p className="text-xs text-slate-500">
            All edits, new tasks, risk tickets, messages, and leave requests persist automatically in browser LocalStorage.
          </p>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-bold text-slate-800 text-xs block">Reset Factory Demo Data</span>
              <span className="text-[11px] text-slate-400">
                Clear all custom entries and restore the initial enterprise project dataset.
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all tasks, risks, and messages to initial enterprise demo state?')) {
                  resetToDefaults();
                }
              }}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold rounded-lg text-xs flex items-center space-x-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow-xs transition"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
