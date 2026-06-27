import React, { useState } from 'react';
import { Shield, Brain, Cpu, Layers, Bell, Zap, Database, Terminal } from 'lucide-react';

export default function SpecsHub() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'prioritization' | 'escalation' | 'guardrails'>('architecture');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full text-slate-100">
      {/* Specs Header */}
      <div className="bg-slate-950/80 p-5 border-b border-slate-800 flex justify-between items-center">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">AI Core Blueprint</span>
          <h2 className="text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2 mt-1">
            <Cpu className="w-5 h-5 text-emerald-400" /> How ProAct AI Works
          </h2>
        </div>
        <div className="flex gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800/80 text-xs font-mono">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${activeTab === 'architecture' ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/25' : 'text-slate-400 hover:text-slate-200'}`}
          >
            How it Works
          </button>
          <button
            onClick={() => setActiveTab('prioritization')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${activeTab === 'prioritization' ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/25' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Task Priority
          </button>
          <button
            onClick={() => setActiveTab('escalation')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${activeTab === 'escalation' ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/25' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Alert System
          </button>
          <button
            onClick={() => setActiveTab('guardrails')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${activeTab === 'guardrails' ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/25' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Security
          </button>
        </div>
      </div>

      {/* Spec Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-emerald-400" /> 1. Simple System Layout
              </h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                ProAct AI is designed to look at your everyday tools and help you plan. It reads updates from your emails, calendar, and chat apps to build your daily list of tasks automatically.
              </p>
            </div>

            {/* Architecture flow */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-emerald-400 font-bold mb-1">// Simple Data Reading Loop</div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">API Feeds</span>
                <span>(Gmail, Slack, Calendar, Plaid API)</span>
                <span className="text-slate-500">➔</span>
                <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-semibold">Reading Engine</span>
              </div>
              <div className="pl-6 border-l border-slate-800 my-1 py-1 space-y-1">
                <div>↳ <strong className="text-white">Continuous Reading:</strong> Scanning email and chat text to find things you need to do.</div>
                <div>↳ <strong className="text-white">Active Status:</strong> Updating your focus state and energy levels every 5 minutes.</div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded">Context Engine</span>
                <span>(Activity, Energy, Focus state)</span>
                <span className="text-slate-500">➔</span>
                <span className="bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded font-semibold">Task Sorter</span>
              </div>
            </div>

            {/* API Ingestion Table */}
            <div>
              <h4 className="text-sm font-semibold text-emerald-400 uppercase font-mono tracking-wider mb-3">How We Connect to Other Tools</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                      <th className="py-2.5 px-3">Connection</th>
                      <th className="py-2.5 px-3">Data Read</th>
                      <th className="py-2.5 px-3">AI Action Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800/60 hover:bg-slate-950/20">
                      <td className="py-2.5 px-3 font-semibold text-white">Google Calendar</td>
                      <td className="py-2.5 px-3 text-slate-300">Busy times, attendees, meeting importance</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-mono">Protects quiet hours and sets aside focus blocks</td>
                    </tr>
                    <tr className="border-b border-slate-800/60 hover:bg-slate-950/20">
                      <td className="py-2.5 px-3 font-semibold text-white">Gmail / Exchange</td>
                      <td className="py-2.5 px-3 text-slate-300">Unread bills, agreements, and requests</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-mono">Drafts response emails, adds bills to your task list</td>
                    </tr>
                    <tr className="border-b border-slate-800/60 hover:bg-slate-950/20">
                      <td className="py-2.5 px-3 font-semibold text-white">Slack Enterprise</td>
                      <td className="py-2.5 px-3 text-slate-300">Direct chat messages and urgent blockers</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-mono">Breaks down sub-tasks and alerts you when running late</td>
                    </tr>
                    <tr className="border-b border-slate-800/60 hover:bg-slate-950/20">
                      <td className="py-2.5 px-3 font-semibold text-white">Relational Banking (Plaid)</td>
                      <td className="py-2.5 px-3 text-slate-300">Checking accounts and bill details</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-mono">Checks that you have enough money and gets payment drafts ready</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Context Engine */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">The Smart Status Checker</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Instead of sending annoying alerts when you are busy, our status checker checks your calendar and focus level to group notifications and send them at the right time.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-mono text-indigo-400 font-semibold uppercase">State: Deep Focus</div>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Mutes all alerts. Saves them silently so you can review them during a quick break.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-mono text-amber-400 font-semibold uppercase">State: On the Go</div>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Switches to voice alerts. Allows you to confirm or postpone urgent tasks hands-free.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-mono text-emerald-400 font-semibold uppercase">State: Low Energy</div>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Detects when you are tired. Moves heavy thinking tasks to tomorrow and highlights easy tasks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prioritization' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" /> 2. Smart Task Importance & Sorting
              </h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                ProAct AI replaces normal manual priority tags with a dynamic helper. The system automatically recalculates which tasks are most important based on deadlines and your energy level.
              </p>
            </div>

            {/* Equation block */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
              <span className="text-emerald-400 font-semibold tracking-wider uppercase text-[10px] block mb-2">// Dynamic Priority Score</span>
              <div className="text-sm font-semibold text-white mb-3 bg-slate-900 p-3 rounded border border-slate-800/80 text-center">
                Score = (U_base × W_dead) + (E_match × W_circ) + (F_friction × W_hist)
              </div>
              <div className="space-y-1 text-slate-400">
                <div>• <strong className="text-slate-200">U_base:</strong> How close you are to the deadline. Score goes up quickly as the deadline gets closer.</div>
                <div>• <strong className="text-slate-200">E_match:</strong> How well your energy matches the difficulty of the task.</div>
                <div>• <strong className="text-slate-200">F_friction:</strong> Score helper based on whether you usually postpone this kind of task.</div>
              </div>
            </div>

            {/* Features lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Breaking Down Massive Tasks</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  When a huge task is added, the AI splits it into small, simple steps. It schedules these on your calendar and links the documents you need so you can start working instantly.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Letting AI Draft Simple Actions</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  For simple repetitive tasks (like paying bills or booking times), the AI prepares everything first and gives you a single button to finish the job with one click.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'escalation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" /> 3. Smart Alert System
              </h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Standard alerts are easy to miss. ProAct AI uses a smart series of steps to reach you. If an important deadline is coming up and you aren't responding, the alert gets slightly more active.
              </p>
            </div>

            {/* Escalation Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                    <th className="py-2.5 px-3">Alert Step</th>
                    <th className="py-2.5 px-3">When it Happens</th>
                    <th className="py-2.5 px-3">How it Reaches You</th>
                    <th className="py-2.5 px-3">AI Helper Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800/60 hover:bg-slate-950/20">
                    <td className="py-3 px-3 font-semibold text-slate-200">1. Quiet Badge</td>
                    <td className="py-3 px-3 text-slate-400">Normal times</td>
                    <td className="py-3 px-3 text-slate-300">Quiet icons on your screen</td>
                    <td className="py-3 px-3 text-slate-400">Saves updates quietly</td>
                  </tr>
                  <tr className="border-b border-slate-800/60 hover:bg-slate-950/20 bg-amber-500/5">
                    <td className="py-3 px-3 font-semibold text-amber-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> 2. Active Alert
                    </td>
                    <td className="py-3 px-3 text-slate-300">30 minutes after missing a task block</td>
                    <td className="py-3 px-3 text-slate-200 font-semibold">Pop-up alert and voice read-out</td>
                    <td className="py-3 px-3 text-amber-300 font-medium">Offers ready-made drafts</td>
                  </tr>
                  <tr className="border-b border-slate-800/60 hover:bg-slate-950/20 bg-rose-500/5">
                    <td className="py-3 px-3 font-semibold text-rose-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> 3. Smart Adjustment
                    </td>
                    <td className="py-3 px-3 text-slate-200">15 minutes before strict deadline</td>
                    <td className="py-3 px-3 text-white font-bold">Quiet overlay on screen or headphone voice</td>
                    <td className="py-3 px-3 text-rose-300 font-bold">Drafts a message explaining you might be late</td>
                  </tr>
                  <tr className="border-b border-slate-800/60 hover:bg-slate-950/20 bg-red-950/40">
                    <td className="py-3 px-3 font-semibold text-red-500">4. Urgent Direct Contact</td>
                    <td className="py-3 px-3 text-slate-100">Deadline time (not responding)</td>
                    <td className="py-3 px-3 text-red-200">Phone call to your phone</td>
                    <td className="py-3 px-3 text-red-400 font-bold">Asks you for confirmation to move the meeting</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Fatigue Prevention */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-emerald-400" /> Preventing Alert Overload
              </h4>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                To build trust and avoid annoying you, the system has a strict alert budget. The AI cannot send more than 3 active voice or screen pop-ups in 8 hours. If the budget is used up, it only updates quietly.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'guardrails' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" /> 4. Security, Privacy & Database Structures
              </h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Handling bills and personal emails requires high security. ProAct AI processes everything in a secure environment and always asks for your confirmation before sending emails or paying bills.
              </p>
            </div>

            {/* Relational Schema block */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" /> Recommended Database Schema (PostgreSQL)
              </h4>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto space-y-4">
                <div>
                  <span className="text-indigo-400 font-semibold">// user_context_history</span>
                  <pre className="mt-1 text-slate-400">
{`CREATE TABLE user_context_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  activity VARCHAR(50) NOT NULL,       -- 'Deep Focus', 'Driving', 'Meeting'
  energy_score INTEGER CHECK (energy_score BETWEEN 0 AND 100),
  cognitive_load VARCHAR(20) NOT NULL, -- 'Low', 'Medium', 'High'
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                  </pre>
                </div>
                <div>
                  <span className="text-indigo-400 font-semibold">// task_execution_step</span>
                  <pre className="mt-1 text-slate-400">
{`CREATE TABLE task_execution_step (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  estimated_minutes INTEGER NOT NULL,
  order_index INTEGER NOT NULL
);`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Zero-Trust Security Policy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-emerald-400 font-semibold uppercase flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Privacy Protection
                </div>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Personal details, names, and billing values are hidden and cleaned before processing to keep your data 100% private.
                </p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-mono text-emerald-400 font-semibold uppercase flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" /> Your Approval Required
                </div>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  Paying bills, sending client emails, and changing meetings require your direct approval. The AI handles the preparation, but you have full control over the final action.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="bg-slate-950 p-4 border-t border-slate-800 text-center text-[11px] text-slate-500 font-mono">
        PROACT-AI-SYSTEMS // FOR DEVELOPER REFERENCE ONLY
      </div>
    </div>
  );
}
