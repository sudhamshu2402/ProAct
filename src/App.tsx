import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Terminal, 
  LayoutDashboard, 
  BookOpen, 
  Clock, 
  CheckCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Info,
  Mic,
  Shield,
  Lock
} from 'lucide-react';

import { Task, ContextState, UserActivity, TaskPriority, TaskDeadlineType, ChatMessage } from './types';
import { INITIAL_TASKS, INITIAL_CONTEXT, DEFAULT_MESSAGES, PRESET_SCENARIOS } from './mockData';
import TaskDashboard from './components/TaskDashboard';
import ChatAssistant from './components/ChatAssistant';
import SpecsHub from './components/SpecsHub';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [context, setContext] = useState<ContextState>(INITIAL_CONTEXT);
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'simulation' | 'specs'>('simulation');
  const [customOrderIds, setCustomOrderIds] = useState<string[] | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Format current local time nicely
  const getCurrentTimeStr = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Compute tasks order based on manual override vs AI suggested order with pins kept at the top
  const getOrderedTasks = () => {
    const currentTasks = [...tasks];
    return currentTasks.sort((a, b) => {
      const pinA = a.pinned ? 1 : 0;
      const pinB = b.pinned ? 1 : 0;
      
      if (pinA !== pinB) {
        return pinB - pinA; // Pinned tasks always come first
      }
      
      // Within same partition, respect manual override if present
      if (customOrderIds) {
        const indexA = customOrderIds.indexOf(a.id);
        const indexB = customOrderIds.indexOf(b.id);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      }
      
      // Default: preserve the context/priority sorted order
      return tasks.indexOf(a) - tasks.indexOf(b);
    });
  };

  const orderedTasks = getOrderedTasks();
  const isOrderOverridden = customOrderIds !== null;

  const handleReorderTasks = (newTasks: Task[]) => {
    setCustomOrderIds(newTasks.map(t => t.id));
    setTasks(newTasks);
  };

  const handleResetOrder = () => {
    setCustomOrderIds(null);
    const restored = [...tasks].sort((a, b) => b.priorityScore - a.priorityScore);
    setTasks(restored);
  };

  const handleTogglePin = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        return {
          ...task,
          pinned: !task.pinned
        };
      }
      return task;
    }));
  };

  // Recalculate priority scores based on active user context
  const computeReorderedTasks = (currentTasks: Task[], currentContext: ContextState): Task[] => {
    return currentTasks.map(task => {
      let baseScore = 50;

      // Deadline weighting
      if (task.deadlineType === 'Hard') {
        baseScore += 30;
      } else {
        baseScore += 10;
      }

      // Context compatibility adjustment
      if (currentContext.activity === 'Low Energy / Fatigue') {
        if (task.priority === 'Low') {
          baseScore += 25; // Boost low priority tasks in low energy context
        } else if (task.priority === 'High') {
          baseScore -= 20; // Penalize heavy high priority tasks
        }
      } else if (currentContext.activity === 'Deep Focus') {
        if (task.priority === 'High') {
          baseScore += 20; // Boost high priority tasks
        }
      } else if (currentContext.activity === 'In Meeting') {
        // Boost meeting-specific or collaborative items
        if (task.category.includes('Management') || task.category.includes('Sync') || task.category.includes('Legal')) {
          baseScore += 25;
        } else {
          baseScore -= 15;
        }
      } else if (currentContext.activity === 'Driving') {
        // Penalize everything except automated autonomous actions
        if (task.autonomousEnabled) {
          baseScore += 20;
        } else {
          baseScore -= 30;
        }
      }

      // Calculate Urgency based on due date & time
      let isUrgent = false;
      if (!task.completed) {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0]; // e.g. "2026-06-27"
        const dueDateLower = task.dueDate.toLowerCase();
        const isToday = dueDateLower.includes('today') || task.dueDate === todayStr;

        if (isToday) {
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          const diff = task.dueTimeMinutes - currentMinutes;
          // Urgent if due within 3 hours (180 minutes) or overdue
          if (diff <= 180) {
            isUrgent = true;
          }
        } else {
          // If due date is in the past (YYYY-MM-DD format)
          const datePattern = /^\d{4}-\d{2}-\d{2}$/;
          if (datePattern.test(task.dueDate) && task.dueDate < todayStr) {
            isUrgent = true;
          }
        }
      }

      if (isUrgent) {
        baseScore += 40; // Massive boost for urgent tasks
      }

      // Clamp priority score between 0 and 100
      const finalScore = Math.min(100, Math.max(10, baseScore));

      return {
        ...task,
        priorityScore: finalScore,
        isUrgent,
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore); // Sort descending
  };

  // Dynamic context switching
  const handleSetActivity = (activity: UserActivity) => {
    let load: 'Low' | 'Medium' | 'High' | 'Overloaded' = 'Medium';
    let energy = 75;
    let sensitivity: 'Silent' | 'Normal' | 'Urgent' | 'Critical' = 'Normal';

    switch (activity) {
      case 'Deep Focus':
        load = 'High';
        energy = 90;
        sensitivity = 'Silent';
        break;
      case 'In Meeting':
        load = 'High';
        energy = 65;
        sensitivity = 'Urgent';
        break;
      case 'Driving':
        load = 'Low';
        energy = 85;
        sensitivity = 'Critical';
        break;
      case 'Low Energy / Fatigue':
        load = 'Low';
        energy = 30;
        sensitivity = 'Normal';
        break;
      case 'Normal':
      default:
        load = 'Medium';
        energy = 75;
        sensitivity = 'Normal';
        break;
    }

    const nextContext: ContextState = { activity, cognitiveLoad: load, energyLevel: energy, escalationSensitivity: sensitivity };
    setContext(nextContext);
    setCustomOrderIds(null);

    // Re-prioritize task list matching new context
    const updatedTasks = computeReorderedTasks(tasks, nextContext);
    setTasks(updatedTasks);

    // Add immediate AI briefing notification message in chat feed
    const systemBriefs: Record<UserActivity, string> = {
      'Deep Focus': "🔒 **Context Changed to Deep Focus**: System has enabled *Silent Shield*. All peripheral Slack pings and email updates are paused. High energy objectives (P_score boosted) are prioritized.",
      'In Meeting': "🤝 **Context Changed to In Meeting**: System adjusted to *Urgent-Only notifications*. Surfacing management and sync tasks. Active messaging summaries are queued.",
      'Driving': "🚗 **Context Changed to Driving**: Switching to hands-free voice interface. System has disabled visual overlays and placed a strict filter on incoming notifications. Only autonomous tasks can execute.",
      'Low Energy / Fatigue': "⚡ **Context Changed to Low Energy**: Biometric tracking logged high fatigue. Re-prioritizing: *High-energy focus blocks postponed* to tomorrow. Surface-level administrative tasks promoted for execution.",
      'Normal': "🌐 **Context Changed to Normal**: Re-instating standard daily tracking. Cognitive fatigue thresholds set to baseline.",
    };

    setMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'ai',
        text: systemBriefs[activity],
        timestamp: getCurrentTimeStr(),
      }
    ]);
  };

  // Complete a master task
  const handleToggleTask = (id: string) => {
    const updated = tasks.map(task => {
      if (task.id === id) {
        const nextCompleted = !task.completed;
        const subSteps = task.subSteps.map(sub => ({ ...sub, completed: nextCompleted }));
        return {
          ...task,
          completed: nextCompleted,
          status: nextCompleted ? 'Completed' as const : 'Pending' as const,
          subSteps,
        };
      }
      return task;
    });

    setTasks(updated);

    const completedTask = tasks.find(t => t.id === id);
    if (completedTask && !completedTask.completed) {
      // Trigger short AI confirmation log
      setMessages(prev => [
        ...prev,
        {
          id: `comp-${Date.now()}`,
          sender: 'ai',
          text: `✅ **Objective Met**: You have completed **&quot;${completedTask.title}&quot;**. System has updated your cognitive burden vectors and allocated a 10-minute micro-break.`,
          timestamp: getCurrentTimeStr(),
        }
      ]);
    }
  };

  // Complete specific micro sub-step
  const handleToggleSubStep = (taskId: string, subStepId: string) => {
    const updated = tasks.map(task => {
      if (task.id === taskId) {
        const subSteps = task.subSteps.map(sub => {
          if (sub.id === subStepId) {
            return { ...sub, completed: !sub.completed };
          }
          return sub;
        });

        const allCompleted = subSteps.every(sub => sub.completed);
        return {
          ...task,
          subSteps,
          completed: allCompleted,
          status: allCompleted ? ('Completed' as const) : ('In Progress' as const),
        };
      }
      return task;
    });

    setTasks(updated);
  };

  // Add a brand new task dynamically
  const handleAddTask = (
    title: string, 
    category: string, 
    priority: TaskPriority, 
    deadline: TaskDeadlineType,
    dueDate: string,
    dueTime: string
  ) => {
    let dueTimeMinutes = 1020; // 17:00 default
    if (dueTime) {
      const parts = dueTime.split(':');
      if (parts.length === 2) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        if (!isNaN(hours) && !isNaN(minutes)) {
          dueTimeMinutes = hours * 60 + minutes;
        }
      }
    }

    // format the displayed dueDate nicely
    const displayDueDate = dueDate ? dueDate : 'Today';

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      category,
      priority,
      deadlineType: deadline,
      dueDate: displayDueDate,
      dueTimeMinutes,
      priorityScore: 50, // will be recalculated instantly
      completed: false,
      autonomousEnabled: false,
      status: 'Pending',
      explanation: 'Manually added objective. System has ingested this into your cognitive roadmap.',
      subSteps: [
        { id: `step-${Date.now()}-1`, title: 'Define requirement outlines', completed: false, estimatedMinutes: 15 },
        { id: `step-${Date.now()}-2`, title: 'Review completed deliverables', completed: false, estimatedMinutes: 15 },
      ],
    };

    const nextTasksList = computeReorderedTasks([...tasks, newTask], context);
    setTasks(nextTasksList);
    if (customOrderIds) {
      setCustomOrderIds([...customOrderIds, newTask.id]);
    }

    setMessages(prev => [
      ...prev,
      {
        id: `add-${Date.now()}`,
        sender: 'ai',
        text: `🆕 **Task Scheduled**: I have decomposed your task **&quot;${title}&quot;** into micro-steps and prioritized it in today&apos;s road-map matching your current alertness state.`,
        timestamp: getCurrentTimeStr(),
      }
    ]);
  };

  // Trigger simulated autonomous execution
  const handleExecuteTaskAutonomously = (id: string) => {
    const targetTask = tasks.find(t => t.id === id);
    if (!targetTask) return;

    setIsAiTyping(true);

    // Simulate real-time API call delay
    setTimeout(() => {
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          const completedSubsteps = task.subSteps.map(s => ({ ...s, completed: true }));
          return {
            ...task,
            completed: true,
            status: 'Autonomous Done' as const,
            subSteps: completedSubsteps,
            explanation: 'Executed autonomously via direct API. Statements filed and verified.',
          };
        }
        return task;
      }));

      setIsAiTyping(false);

      setMessages(prev => [
        ...prev,
        {
          id: `auton-${Date.now()}`,
          sender: 'ai',
          text: `⚡ **Autonomous Execution Succeeded**:\n\nObjective **&quot;${targetTask.title}&quot;** is complete. ProAct AI has completed the steps, verified balances/data outputs, and sent receipts to your audit folder. No manual typing required.`,
          timestamp: getCurrentTimeStr(),
        }
      ]);
    }, 1500);
  };

  // Preset Scenario Trigger Buttons
  const handleTriggerPreset = (type: 'overdue' | 'slump' | 'escalation') => {
    setIsAiTyping(true);

    const scenarioTexts = PRESET_SCENARIOS[type];
    
    // Add user trigger immediately
    setMessages(prev => [...prev, scenarioTexts[0] as ChatMessage]);

    // Simulate natural response latency
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        scenarioTexts[1] as ChatMessage,
        scenarioTexts[2] as ChatMessage,
      ]);
      setIsAiTyping(false);

      // Adjust context parameters depending on scenario trigger
      if (type === 'overdue') {
        setContext(prev => ({ ...prev, cognitiveLoad: 'Overloaded', escalationSensitivity: 'Urgent' }));
      } else if (type === 'slump') {
        setContext(prev => ({ ...prev, activity: 'Low Energy / Fatigue', energyLevel: 35 }));
        // Promote low energy tasks
        setTasks(t => computeReorderedTasks(t, { ...context, activity: 'Low Energy / Fatigue', energyLevel: 35 }));
      }
    }, 1200);
  };

  // Interactive Action selections inside message bubbles
  const handleTriggerAction = (actionId: string) => {
    setIsAiTyping(true);

    setTimeout(() => {
      setIsAiTyping(false);

      switch (actionId) {
        case 'confirm_focus':
          setContext(prev => ({ ...prev, activity: 'Deep Focus', escalationSensitivity: 'Silent', energyLevel: 90 }));
          setTasks(t => computeReorderedTasks(t, { ...context, activity: 'Deep Focus' }));
          setMessages(prev => [
            ...prev,
            {
              id: `act-${Date.now()}`,
              sender: 'ai',
              text: "🔒 **Focus Block Active**: I have set your status to **Deep Focus**. Direct notifications muted. Keep working on the design proposal; I&apos;ll intercept you if a hard deadline is at risk.",
              timestamp: getCurrentTimeStr(),
            }
          ]);
          break;

        case 'show_brief':
          setMessages(prev => [
            ...prev,
            {
              id: `act-${Date.now()}`,
              sender: 'ai',
              text: "📋 **Daily Brief Outline**:\n\n1. **Q2 Proposal** (15:00 Hard) - 2hr Focus blocked.\n2. **Corporate Insurance** (17:00 Hard) - Balance is good. Fully automated.\n3. **2 Contracts** (Soft) - Reviewing flagged indemnity clauses.",
              timestamp: getCurrentTimeStr(),
            }
          ]);
          break;

        case 'scen_draft_proposal':
          setTasks(prev => prev.map(t => {
            if (t.id === 't1') {
              const updatedSub = t.subSteps.map(s => s.id === 't1-s3' ? { ...s, completed: true } : s);
              return { ...t, subSteps: updatedSub, explanation: 'Drafting executive summary via Figma API integration.' };
            }
            return t;
          }));
          setMessages(prev => [
            ...prev,
            {
              id: `act-${Date.now()}`,
              sender: 'ai',
              text: "✍️ **Drafting Executive Summary**: I am querying Figma specs to draft the summary outline autonomously. Check the updated tasks panel; step 3 is now complete.",
              timestamp: getCurrentTimeStr(),
            }
          ]);
          break;

        case 'scen_delay_meeting':
          setTasks(prev => prev.map(t => {
            if (t.id === 't1') {
              return { ...t, dueDate: '16:00 Today', dueTimeMinutes: 960, explanation: 'Requested 1-hour extension. Calendar updated.' };
            }
            return t;
          }));
          setMessages(prev => [
            ...prev,
            {
              id: `act-${Date.now()}`,
              sender: 'ai',
              text: "📅 **Meeting Postponed**: I have dispatched an API request rescheduling the 15:00 Review by 1 hour. Attendees updated in Google Calendar. Deadline pushed to **16:00**.",
              timestamp: getCurrentTimeStr(),
            }
          ]);
          break;

        case 'pay_insurance_now':
          handleExecuteTaskAutonomously('t2');
          break;

        case 'test_voice':
          setMessages(prev => [
            ...prev,
            {
              id: `act-${Date.now()}`,
              sender: 'ai',
              text: "🎙️ **Voice Briefing Overlay Simulation**:\n\n*(Sustained synthetic chime)*\n\n*&quot;Alert. You have entered a 20-minute cognitive drift prior to your 3:00 PM Hard Proposal deadline. Press play below to listen to the pre-rendered outline summary.&quot;*",
              timestamp: getCurrentTimeStr(),
            }
          ]);
          break;

        default:
          setMessages(prev => [
            ...prev,
            {
              id: `act-${Date.now()}`,
              sender: 'ai',
              text: "⚙️ **Action Complete**: Successfully completed the request.",
              timestamp: getCurrentTimeStr(),
            }
          ]);
          break;
      }
    }, 1000);
  };

  // Custom User Prompt Submissions
  const handleSendMessage = (text: string) => {
    // Add User Message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: getCurrentTimeStr(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);

    // Natural processing simulation matching user text
    setTimeout(() => {
      setIsAiTyping(false);
      const query = text.toLowerCase();

      let reply = "I am processing your request. I can help with task lists, schedules, and break down your goals. Try asking 'schedule task' or 'pay insurance bill'.";

      if (query.includes('bill') || query.includes('insurance') || query.includes('pay')) {
        reply = "💳 **Bank Check**:\n\nI see your pending task: **Process Q2 Corporate Insurance Payment**. Your account has enough money ($15,420). I can pay this now if you say yes. Shall we proceed?";
      } else if (query.includes('schedule') || query.includes('add') || query.includes('create')) {
        reply = "📅 **AI Scheduler**:\n\nI can schedule your tasks based on your free time. Fill out the **\"New Task\"** form above, or type the details here and I will add it for you!";
      } else if (query.includes('proact') || query.includes('spec') || query.includes('architecture')) {
        reply = "🛠️ **System Blueprint Overview**:\n\nI am built with a smart status checker, custom alerts, and auto-draft actions. Click the **\"System Blueprint\"** tab above to see how it works!";
      } else if (query.includes('figma') || query.includes('proposal') || query.includes('design')) {
        reply = "🎨 **Product Design Proposal**:\n\nI checked your design links. The first 2 steps are done. I can draft the rest of the outline or reschedule your meeting. Just ask!";
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-reply-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: getCurrentTimeStr(),
        }
      ]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation & Brand Header */}
      <header className="bg-slate-900/80 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo & Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-xl font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-center">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white font-sans">ProAct AI</h1>
              </div>
              <p className="text-slate-400 text-xs">Your Smart Personal Assistant for Daily Tasks</p>
            </div>
          </div>

          {/* Controls: Workspace Switcher & Live Clock */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex gap-1.5 p-1 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-medium font-sans">
              <button
                onClick={() => setActiveWorkspaceTab('simulation')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                  activeWorkspaceTab === 'simulation' 
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Daily Tasks
              </button>
              <button
                onClick={() => setActiveWorkspaceTab('specs')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                  activeWorkspaceTab === 'specs' 
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" /> System Blueprint
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800/80 rounded-xl text-slate-400 font-mono text-xs">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{getCurrentTimeStr()}</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col min-h-0">
        
        {/* Dynamic Workspace Render */}
        <AnimatePresence mode="wait">
          {activeWorkspaceTab === 'simulation' ? (
            <div className="flex flex-col flex-1 min-h-[500px]">
              <motion.div
                key="simulation"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1"
              >
                {/* Full-width Interactive Task Dashboard (taking all 12 columns) */}
                <div className="lg:col-span-12 flex flex-col h-full min-h-0">
                  <TaskDashboard
                    tasks={orderedTasks}
                    onToggleTask={handleToggleTask}
                    onToggleSubStep={handleToggleSubStep}
                    context={context}
                    onSetActivity={handleSetActivity}
                    onExecuteTaskAutonomously={handleExecuteTaskAutonomously}
                    onAddTask={handleAddTask}
                    onReorderTasks={handleReorderTasks}
                    onResetOrder={handleResetOrder}
                    isOrderOverridden={isOrderOverridden}
                    onTogglePin={handleTogglePin}
                  />
                </div>
              </motion.div>

              {/* Collapsible Floating Voice Assistant Button / Overlay in Bottom Right Corner */}
              <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence mode="wait">
                  {!isChatOpen ? (
                    <motion.button
                      key="collapsed-voice-trigger"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setIsChatOpen(true)}
                      className="group relative flex items-center gap-2.5 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full p-4 md:px-5 md:py-3.5 shadow-2xl hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 border border-indigo-500/30 transition-all cursor-pointer"
                      aria-label="Open ProAct Voice Assistant"
                    >
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <Mic className="w-5 h-5 text-white animate-pulse" />
                      <span className="font-semibold text-sm hidden sm:inline tracking-tight font-sans">Voice Assistant</span>
                      
                      {/* Secure lock badge tooltip */}
                      <span className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-slate-900 border border-slate-800 text-slate-300 text-[10px] px-2 py-1 rounded-md font-mono whitespace-nowrap shadow-xl transition-all duration-200 flex items-center gap-1 z-50">
                        <Lock className="w-2.5 h-2.5 text-emerald-400" /> Secure Sandbox Active
                      </span>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="expanded-voice-panel"
                      initial={{ opacity: 0, y: 40, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 40, scale: 0.95 }}
                      className="w-[380px] max-w-[calc(100vw-3rem)] h-[580px] flex flex-col z-50"
                    >
                      <ChatAssistant
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        onTriggerPreset={handleTriggerPreset}
                        onTriggerAction={handleTriggerAction}
                        isAiTyping={isAiTyping}
                        onClose={() => setIsChatOpen(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 min-h-[500px] h-[750px] lg:h-full"
            >
              <SpecsHub />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Info Warning Bar on bottom */}
      <footer className="bg-slate-950 border-t border-slate-900 py-3.5 px-6 text-center text-[11px] text-slate-500 font-mono tracking-wide">
        PROACT-AI // DAILY TASK WORKSPACE. CLICK &quot;SYSTEM BLUEPRINT&quot; TO SEE HOW THE APP WORKS.
      </footer>

    </div>
  );
}
