import { Task, ContextState, ChatMessage } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Submit Q2 Product Design Proposal',
    category: 'Work / Design',
    priority: 'High',
    deadlineType: 'Hard',
    dueDate: '15:00 Today',
    dueTimeMinutes: 900, // 3:00 PM is 900 minutes from midnight
    priorityScore: 94,
    completed: false,
    autonomousEnabled: true,
    status: 'In Progress',
    explanation: 'Requires heavy focus. Strict deadline today. System has set aside 2 hours for you to focus.',
    subSteps: [
      { id: 't1-s1', title: 'Synthesize feedback from Slack design channels', completed: true, estimatedMinutes: 20 },
      { id: 't1-s2', title: 'Compile Figma prototype specifications and link assets', completed: true, estimatedMinutes: 30 },
      { id: 't1-s3', title: 'Draft executive summary & resource projections', completed: false, estimatedMinutes: 45 },
      { id: 't1-s4', title: 'Submit document to leadership and generate Slack summary', completed: false, estimatedMinutes: 15 },
    ],
  },
  {
    id: 't2',
    title: 'Process Q2 Corporate Insurance Premium Payment',
    category: 'Finance',
    priority: 'Low',
    deadlineType: 'Hard',
    dueDate: '17:00 Today',
    dueTimeMinutes: 1020, // 5:00 PM
    priorityScore: 88,
    completed: false,
    autonomousEnabled: true,
    status: 'Pending',
    explanation: 'Found in your email bills. Bank account has been checked. System can pay this now if you say yes.',
    subSteps: [
      { id: 't2-s1', title: 'Scan Gmail for Q2 Invoice attachment and crosscheck with statements', completed: true, estimatedMinutes: 5 },
      { id: 't2-s2', title: 'Verify banking ledger balance has sufficient cash reserves', completed: true, estimatedMinutes: 5 },
      { id: 't2-s3', title: 'Execute secure wire transfer via API authorization code', completed: false, estimatedMinutes: 5 },
    ],
  },
  {
    id: 't3',
    title: 'Review Pending Contract Agreements (2 counts)',
    category: 'Legal / Admin',
    priority: 'Medium',
    deadlineType: 'Soft',
    dueDate: '18:00 Today',
    dueTimeMinutes: 1080,
    priorityScore: 65,
    completed: false,
    autonomousEnabled: false,
    status: 'Pending',
    explanation: 'Found in your inbox. Standard review is done; highlighted section 4.2 for you to check.',
    subSteps: [
      { id: 't3-s1', title: 'Cross-reference liability coverage limits against guidelines', completed: false, estimatedMinutes: 15 },
      { id: 't3-s2', title: 'Sign DocuSign link forwarded in Gmail', completed: false, estimatedMinutes: 10 },
    ],
  },
  {
    id: 't4',
    title: 'Consolidate Weekly Team Performance Slides',
    category: 'Operations',
    priority: 'Low',
    deadlineType: 'Soft',
    dueDate: '18:00 Today',
    dueTimeMinutes: 1080,
    priorityScore: 55,
    completed: false,
    autonomousEnabled: true,
    status: 'Pending',
    explanation: 'Normal task. System has already drafted these slides by pulling updates from Slack and Jira.',
    subSteps: [
      { id: 't4-s1', title: 'Query Jira for completed sprint issues this week', completed: true, estimatedMinutes: 10 },
      { id: 't4-s2', title: 'Draft bullet points inside corporate slide template', completed: true, estimatedMinutes: 20 },
      { id: 't4-s3', title: 'Verify slide layout and format charts', completed: false, estimatedMinutes: 15 },
    ],
  },
  {
    id: 't5',
    title: 'Schedule Q3 Performance Strategy Sync',
    category: 'Management',
    priority: 'Medium',
    deadlineType: 'Soft',
    dueDate: 'Tomorrow',
    dueTimeMinutes: 1440,
    priorityScore: 42,
    completed: false,
    autonomousEnabled: false,
    status: 'Pending',
    explanation: 'Found a good free time slot on your calendar. Currently matching times with 3 directors.',
    subSteps: [
      { id: 't5-s1', title: 'Audit free blocks of attendees in Google Calendar', completed: true, estimatedMinutes: 10 },
      { id: 't5-s2', title: 'Send proposed meeting invites with AI-suggested topics', completed: false, estimatedMinutes: 10 },
    ],
  },
];

export const INITIAL_CONTEXT: ContextState = {
  activity: 'Normal',
  cognitiveLoad: 'Medium',
  energyLevel: 75,
  escalationSensitivity: 'Normal',
};

export const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'ai',
    text: "Good morning! I am **ProAct AI**, your smart personal assistant. I have checked your emails, calendar, and chat messages to help you plan your day in the best possible way.",
    timestamp: '08:30 AM',
  },
  {
    id: 'm2',
    sender: 'ai',
    text: "Today's most important task is the **Q2 Product Design Proposal** due at 3:00 PM (Strict deadline). I have set aside some quiet focus time for you from 10:00 AM to 12:00 PM when you are usually most awake and ready.",
    timestamp: '08:31 AM',
    actions: [
      { label: 'Confirm Focus Time', actionId: 'confirm_focus' },
      { label: 'Show Daily Plan', actionId: 'show_brief' },
    ],
  },
];

export const PRESET_SCENARIOS = {
  overdue: [
    {
      id: 'scen-o1',
      sender: 'user',
      text: '[Simulation Trigger] Initiate Deadline Overrun Warning',
      timestamp: '14:15 PM',
    },
    {
      id: 'scen-o2',
      sender: 'ai',
      text: "⚠️ **Urgent Alert: Approaching Deadline**\n\nI noticed you haven't been active for the last 20 minutes, and your **Q2 Product Design Proposal** is due in just **45 minutes** (3:00 PM) with several steps still left to do.",
      timestamp: '14:15 PM',
    },
    {
      id: 'scen-o3',
      sender: 'ai',
      text: "Here are three ways I can help you finish this task on time. Choose one to continue:",
      timestamp: '14:16 PM',
      actions: [
        { label: 'Let AI Draft the Outline (Auto)', actionId: 'scen_draft_proposal' },
        { label: 'Move 3:00 PM Meeting by 1 Hour', actionId: 'scen_delay_meeting' },
        { label: 'Read the Alert Out Loud', actionId: 'scen_audio_escalate' },
      ],
    },
  ],
  slump: [
    {
      id: 'scen-s1',
      sender: 'user',
      text: '[Simulation Trigger] Initiate 3 PM Energy Slump Adaptation',
      timestamp: '15:10 PM',
    },
    {
      id: 'scen-s2',
      sender: 'ai',
      text: "⚡ **Alert: Low Energy Detected**\n\nBased on your recent activity, you seem to be feeling a bit tired (predicted energy is 35%). You have a task that needs a lot of focus scheduled right now.",
      timestamp: '15:11 PM',
    },
    {
      id: 'scen-s3',
      sender: 'ai',
      text: "I have adjusted your plan for this afternoon:\n\n1. **Postponed**: Heavy tasks that need deep thinking have been moved to tomorrow morning.\n2. **Activated**: Simple tasks like *Corporate Insurance Payment* have been moved to right now since they are easier to do.\n\nWould you like me to pay the insurance premium now to check it off your list?",
      timestamp: '15:11 PM',
      actions: [
        { label: 'Pay Insurance Bill Now ($4,250)', actionId: 'pay_insurance_now' },
        { label: 'Save for the Evening Review', actionId: 'delegate_evening' },
      ],
    },
  ],
  escalation: [
    {
      id: 'scen-e1',
      sender: 'user',
      text: '[Simulation Trigger] Demonstrate Multi-Stage Notification Escalation',
      timestamp: '16:45 PM',
    },
    {
      id: 'scen-e2',
      sender: 'ai',
      text: "🛡️ **How ProAct Helps When You Are Busy**\n\nWhen a strict deadline is coming up and you aren't responding, ProAct AI will try to reach you in these simple steps:",
      timestamp: '16:45 PM',
    },
    {
      id: 'scen-e3',
      sender: 'ai',
      text: "1. 📱 **Step 1: Gentle vibration (0-5 min)** - Send a gentle buzz to your smartwatch.\n2. 🎙️ **Step 2: Voice alert (5-10 min)** - Read a quick summary of the tasks through your headphones.\n3. 🤖 **Step 3: Auto-Draft (10-15 min)** - Draft a message or email letting others know you might be late.\n4. 🚨 **Step 4: Phone call (15+ min)** - Call you or a team member to make sure you didn't miss the deadline.\n\nWould you like to try the voice alert now or draft a message?",
      timestamp: '16:46 PM',
      actions: [
        { label: 'Test Voice Alert', actionId: 'test_voice' },
        { label: 'Draft a Message automatically', actionId: 'test_slack_pivot' },
      ],
    },
  ],
};
