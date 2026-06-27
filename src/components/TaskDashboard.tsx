import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Zap, 
  AlertTriangle, 
  Sparkles, 
  Compass, 
  Activity, 
  ArrowRight, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Sliders, 
  Play, 
  Check,
  Plus,
  GripVertical,
  Pin,
  Shield,
  Lock
} from 'lucide-react';
import { Task, ContextState, UserActivity, TaskPriority, TaskDeadlineType } from '../types';
import { sanitizeInput, validateInput } from '../utils/security';

interface TaskDashboardProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onToggleSubStep: (taskId: string, subStepId: string) => void;
  context: ContextState;
  onSetActivity: (activity: UserActivity) => void;
  onExecuteTaskAutonomously: (id: string) => void;
  onAddTask: (
    title: string, 
    category: string, 
    priority: TaskPriority, 
    deadline: TaskDeadlineType,
    dueDate: string,
    dueTime: string
  ) => void;
  onReorderTasks: (newTasks: Task[]) => void;
  onResetOrder: () => void;
  isOrderOverridden: boolean;
  onTogglePin: (id: string) => void;
}

export default function TaskDashboard({
  tasks,
  onToggleTask,
  onToggleSubStep,
  context,
  onSetActivity,
  onExecuteTaskAutonomously,
  onAddTask,
  onReorderTasks,
  onResetOrder,
  isOrderOverridden,
  onTogglePin,
}: TaskDashboardProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>('t1');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Work');
  const [newPriority, setNewPriority] = useState<TaskPriority>('Medium');
  const [newDeadline, setNewDeadline] = useState<TaskDeadlineType>('Soft');
  const [newDueDate, setNewDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newDueTime, setNewDueTime] = useState('17:00');

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceTaskId = e.dataTransfer.getData('text/plain');
    if (!sourceTaskId) return;

    const sourceIndex = tasks.findIndex(t => t.id === sourceTaskId);
    if (sourceIndex === -1 || sourceIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const draggedTask = tasks[sourceIndex];
    if (draggedTask.autonomousEnabled) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newTasks = [...tasks];
    const [removed] = newTasks.splice(sourceIndex, 1);
    newTasks.splice(targetIndex, 0, removed);

    onReorderTasks(newTasks);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  // Interactive task form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeInput(newTitle);
    const sanitizedCategory = sanitizeInput(newCategory || 'Work');
    
    if (!validateInput(sanitizedTitle, 150)) return;
    
    onAddTask(sanitizedTitle, sanitizedCategory, newPriority, newDeadline, newDueDate, newDueTime);
    setNewTitle('');
    setNewCategory('Work');
    setNewPriority('Medium');
    setNewDeadline('Soft');
    setNewDueDate(new Date().toISOString().split('T')[0]);
    setNewDueTime('17:00');
    setShowAddForm(false);
  };

  const getPriorityColor = (score: number) => {
    if (score >= 90) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (score >= 80) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  const getPriorityBadgeColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High': return 'text-rose-300 bg-rose-500/20';
      case 'Medium': return 'text-amber-300 bg-amber-500/20';
      case 'Low': return 'text-emerald-300 bg-emerald-500/20';
    }
  };

  const getStatusBadge = (task: Task) => {
    if (task.completed) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          <Check className="w-3 h-3" /> Complete
        </span>
      );
    }
    if (task.status === 'In Progress') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 animate-pulse">
          <Activity className="w-3 h-3" /> Active focus
        </span>
      );
    }
    if (task.status === 'Autonomous Done') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
          <Sparkles className="w-3 h-3" /> Auto-Done
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
        Pending
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full text-slate-100 font-sans">
      
      {/* Dynamic Context Intercept Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-4 border-b border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/15 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 tracking-wider font-semibold uppercase">ACTIVE TRACKER</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <h3 className="text-sm font-semibold text-white mt-0.5">
              Current activity: <span className="text-emerald-400 font-bold">{context.activity}</span>
            </h3>
          </div>
        </div>

        {/* Quick Context Switchers */}
        <div className="flex flex-wrap gap-1.5 items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-500 font-mono px-2 py-1">Set Active State:</span>
          {(['Normal', 'Deep Focus', 'In Meeting', 'Driving', 'Low Energy / Fatigue'] as UserActivity[]).map((activity) => (
            <button
              key={activity}
              onClick={() => onSetActivity(activity)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                context.activity === activity 
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {activity}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        
        {/* Core State Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Brain Load</div>
            <div className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
              <TrendingUp className={`w-4 h-4 ${context.cognitiveLoad === 'Overloaded' ? 'text-rose-400' : 'text-indigo-400'}`} />
              {context.cognitiveLoad}
            </div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Energy Level</div>
            <div className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              {context.energyLevel}%
            </div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Notification Block</div>
            <div className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-400" />
              {context.escalationSensitivity}
            </div>
          </div>
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">AI Task Rate</div>
            <div className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              {Math.round((tasks.filter(t => t.autonomousEnabled).length / tasks.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Task List Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-md font-bold text-white font-sans tracking-tight">Today&apos;s Tasks</h4>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400/80 bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10">
                <Shield className="w-3 h-3 text-emerald-400" /> Secure Sandbox Active
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">Tasks sorted based on your current focus and energy.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> New Task
          </button>
        </div>

        {/* Add Task Form with motion */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="bg-slate-950/55 p-4 rounded-xl border border-slate-800/85 space-y-3.5 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Task Name</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Draft Quarterly slide deck summary"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mt-1 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Work, Admin, Finance"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mt-1 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Task Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 mt-1"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Deadline Urgency</label>
                  <select
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value as TaskDeadlineType)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500 mt-1"
                  >
                    <option value="Soft">Soft Deadline (flexible calendar slot)</option>
                    <option value="Hard">Hard Deadline (strict cut-off block)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500 mt-1 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Due Time</label>
                  <input
                    type="time"
                    required
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500 mt-1 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-emerald-400 transition-all"
                >
                  Add Task
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Manual Override Visual Indicator Banner */}
        {isOrderOverridden && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex gap-2.5 items-start">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-amber-300">Manual Ordering is On</h5>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  You have changed the order of your tasks. Automatic sorting by AI is paused.
                </p>
              </div>
            </div>
            <button
              onClick={onResetOrder}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold font-sans px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition-all shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Let AI Sort Tasks
            </button>
          </div>
        )}

        {/* Task Cards Container */}
        <div className="space-y-3">
          {tasks.map((task, index) => {
            const isExpanded = expandedTaskId === task.id;
            const isHighPriority = task.priorityScore >= 90;
            const isDraggable = !task.completed && !task.autonomousEnabled;
            const isDragged = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            const totalSubSteps = task.subSteps.length;
            const completedSubSteps = task.subSteps.filter(s => s.completed).length;
            const progressPercent = task.completed ? 100 : (totalSubSteps > 0 ? Math.round((completedSubSteps / totalSubSteps) * 100) : 0);

            return (
              <div
                key={task.id}
                id={`task-card-${task.id}`}
                draggable={isDraggable}
                onDragStart={(e) => handleDragStart(e, index, task.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`group border rounded-xl overflow-hidden transition-all bg-slate-950/40 hover:bg-slate-950/75 ${
                  isExpanded ? 'border-slate-700 ring-1 ring-slate-800 shadow-lg' : 'border-slate-800/70'
                } ${isDragged ? 'opacity-30 border-dashed border-emerald-500/40' : ''} ${
                  isDragOver ? 'border-t-2 border-t-emerald-500 bg-slate-900/60' : ''
                } ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
              >
                {/* Task Item Summary Row */}
                <div
                  onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                  className="p-4 flex gap-3.5 items-start cursor-pointer select-none"
                >
                  {/* Drag Grip Handle / Spacer */}
                  {isDraggable ? (
                    <div className="mt-1 text-slate-600 group-hover:text-slate-400 cursor-grab shrink-0 transition-colors">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-4 shrink-0" />
                  )}

                  {/* Custom checkmark button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTask(task.id);
                    }}
                    className={`mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none`}
                  >
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  {/* Task Text & Badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-500 uppercase">{task.category}</span>
                      {task.deadlineType === 'Hard' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-rose-400 bg-rose-500/15 px-1.5 py-0.2 rounded border border-rose-500/20">
                          <AlertTriangle className="w-2.5 h-2.5" /> Hard Cutoff
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${getPriorityBadgeColor(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                      {task.isUrgent && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.2 rounded border border-rose-500/30 animate-pulse">
                          <AlertTriangle className="w-2.5 h-2.5 text-rose-400" /> Urgent
                        </span>
                      )}
                      {getStatusBadge(task)}
                      {task.pinned && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-sky-400 bg-sky-500/15 px-1.5 py-0.2 rounded border border-sky-500/20">
                          <Pin className="w-2.5 h-2.5 fill-sky-400/20" /> Pinned
                        </span>
                      )}
                      {!task.autonomousEnabled && isOrderOverridden && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-400 bg-amber-500/15 px-1.5 py-0.2 rounded border border-amber-500/20">
                          Manual Priority
                        </span>
                      )}
                    </div>

                    <h5 className={`text-sm font-semibold tracking-tight mt-1 transition-all leading-tight ${
                      task.completed ? 'text-slate-500 line-through' : 'text-white'
                    }`}>
                      {task.title}
                      {totalSubSteps > 0 && (
                        <span className="ml-2 text-xs font-normal text-slate-500 font-mono">
                          ({completedSubSteps}/{totalSubSteps} steps)
                        </span>
                      )}
                    </h5>
                  </div>

                  {/* Pin Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(task.id);
                    }}
                    className={`mt-1.5 shrink-0 p-1.5 rounded-lg border transition-all cursor-pointer ${
                      task.pinned 
                        ? 'text-sky-400 bg-sky-500/15 border-sky-500/30 hover:bg-sky-500/25' 
                        : 'text-slate-500 hover:text-slate-300 bg-transparent border-transparent hover:bg-slate-800/40'
                    }`}
                    title={task.pinned ? "Unpin task" : "Pin task to top"}
                  >
                    <Pin className={`w-3.5 h-3.5 ${task.pinned ? 'fill-sky-400' : ''}`} />
                  </button>

                  {/* Priority badge on right */}
                  <div className="text-right flex flex-col items-end justify-between self-stretch">
                    <div className={`text-xs font-mono font-bold px-2 py-1 rounded border ${getPriorityColor(task.priorityScore)}`}>
                      Score: {task.priorityScore}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {task.dueDate}
                    </div>
                  </div>
                </div>

                {/* Expanded details with sub-steps */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-slate-800 bg-slate-950/80 px-4 py-4 space-y-4"
                    >
                      {/* Analysis & Context */}
                      <div className="space-y-1.5 bg-slate-900/30 border border-slate-800/40 rounded-xl p-3">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                          AI Notes
                        </span>
                        <p className="text-slate-300 text-xs leading-relaxed font-sans">
                          {task.explanation}
                        </p>
                      </div>

                      {/* Progress Indicator */}
                      {totalSubSteps > 0 && (
                        <div className="space-y-2 bg-slate-900/30 border border-slate-800/40 rounded-xl p-3">
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                            <span className="flex items-center gap-1.5 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              Steps: {completedSubSteps} of {totalSubSteps} done
                            </span>
                            <span className="font-bold text-emerald-400">{progressPercent}%</span>
                          </div>
                          <div className="w-full bg-slate-950/60 rounded-full h-1.5 overflow-hidden border border-slate-800">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 h-full rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Autonomous Action Delegate block */}
                      {task.autonomousEnabled && !task.completed && (
                        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> AI Help Available
                            </span>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              ProAct AI has pre-drafted files and checked details. You can let the AI finish this task for you.
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onExecuteTaskAutonomously(task.id);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-sans px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all shrink-0 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-slate-950" /> Let AI Do This
                          </button>
                        </div>
                      )}

                      {/* Sub-steps List */}
                      <div className="space-y-2.5">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex justify-between">
                          <span>Steps list</span>
                          <span>Time</span>
                        </div>
                        <div className="space-y-2">
                          {task.subSteps.map((step) => (
                            <div
                              key={step.id}
                              className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors border ${
                                step.completed ? 'bg-slate-900/40 border-slate-800/50 text-slate-500' : 'bg-slate-900 border-slate-800/80 text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <button
                                  onClick={() => onToggleSubStep(task.id, step.id)}
                                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                                >
                                  {step.completed ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Circle className="w-4 h-4" />
                                  )}
                                </button>
                                <span className={`${step.completed ? 'line-through text-slate-500' : ''}`}>
                                  {step.title}
                                </span>
                              </div>
                              <span className="font-mono text-slate-500">{step.estimatedMinutes}m</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Task Info Footer */}
                      <div className="text-[11px] text-slate-500 flex justify-between items-center bg-slate-900/40 p-2 rounded border border-slate-800/30 font-mono">
                        <span>CREATED BY PROACT AI</span>
                        <span>ID: {task.id.toUpperCase()}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
