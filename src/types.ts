export interface SubStep {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes: number;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskDeadlineType = 'Hard' | 'Soft';

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: TaskPriority;
  deadlineType: TaskDeadlineType;
  dueDate: string; // e.g. "14:00 Today" or YYYY-MM-DD
  dueTimeMinutes: number; // minutes from start of day, for calculation
  priorityScore: number; // out of 100
  subSteps: SubStep[];
  completed: boolean;
  autonomousEnabled: boolean;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Autonomous Done';
  explanation: string;
  pinned?: boolean;
  isUrgent?: boolean;
}

export type UserActivity = 'Deep Focus' | 'In Meeting' | 'Driving' | 'Low Energy / Fatigue' | 'Normal';

export interface ContextState {
  activity: UserActivity;
  cognitiveLoad: 'Low' | 'Medium' | 'High' | 'Overloaded';
  energyLevel: number; // 0 to 100
  escalationSensitivity: 'Silent' | 'Normal' | 'Urgent' | 'Critical';
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actions?: { label: string; actionId: string }[];
  scenarioType?: string;
}
