import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Volume2, 
  VolumeX, 
  Mic, 
  Sparkles, 
  User, 
  Cpu, 
  HelpCircle, 
  Zap,
  Play,
  Square,
  X,
  Shield,
  Lock
} from 'lucide-react';
import { ChatMessage } from '../types';
import { sanitizeInput, validateInput } from '../utils/security';

interface ChatAssistantProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onTriggerPreset: (type: 'overdue' | 'slump' | 'escalation') => void;
  onTriggerAction: (actionId: string) => void;
  isAiTyping: boolean;
  onClose?: () => void;
}

export default function ChatAssistant({
  messages,
  onSendMessage,
  onTriggerPreset,
  onTriggerAction,
  isAiTyping,
  onClose,
}: ChatAssistantProps) {
  const [inputText, setInputText] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = sanitizeInput(inputText);
    if (!validateInput(sanitized, 500)) return;
    onSendMessage(sanitized);
    setInputText('');
  };

  const renderMessageText = (text: string) => {
    // Basic bold markdown formatter
    return text.split('\n').map((line, idx) => {
      // Find items like **text** and replace with strong
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="leading-relaxed mb-1 text-xs sm:text-sm">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full text-slate-100 font-sans">
      
      {/* Top Secure Header Bar with Close option */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800/60 flex justify-between items-center text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-1">
            Secure Session <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded text-[9px]">AES-256</span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-900 transition-colors cursor-pointer"
              title="Close Assistant"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Voice Assistant Persona & Briefing Panel */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/10">
              <Mic className="w-5 h-5" />
            </div>
            {isVoiceActive && (
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              Voice Reader <span className="text-[10px] font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">AUDIO ON</span>
            </h3>
            <p className="text-slate-400 text-xs">Reading your task updates out loud</p>
          </div>
        </div>

        {/* Play/Pause Briefing Waveform Trigger */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-xs font-mono w-full sm:w-auto">
          <button
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={`px-3 py-1 rounded flex items-center gap-1.5 font-bold transition-all w-full justify-center ${
              isVoiceActive ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isVoiceActive ? (
              <>
                <Square className="w-3 h-3 fill-white" /> Pause Audio
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-slate-300" /> Play Audio Update
              </>
            )}
          </button>
          
          {/* Mock voice waveform animation */}
          {isVoiceActive && (
            <div className="flex gap-0.5 px-2 h-4 items-center">
              {[0.4, 0.9, 0.6, 0.8, 0.3, 0.7, 0.5, 0.85, 0.4].map((scale, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ['20%', '100%', '20%'] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: "easeInOut"
                  }}
                  className="w-0.5 bg-emerald-400 rounded-full"
                  style={{ height: `${scale * 100}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Intercept Simulation Controllers */}
      <div className="bg-slate-950/60 p-3 border-b border-slate-800/80 flex flex-col gap-2">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Try Out AI Helper Actions:</span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onTriggerPreset('overdue')}
            className="text-[11px] font-semibold p-2 bg-rose-500/10 text-rose-300 hover:bg-rose-500/15 border border-rose-500/25 rounded-lg transition-all text-center leading-tight truncate cursor-pointer"
          >
            🚨 Urgent Deadline
          </button>
          <button
            onClick={() => onTriggerPreset('slump')}
            className="text-[11px] font-semibold p-2 bg-amber-500/10 text-amber-300 hover:bg-amber-500/15 border border-amber-500/25 rounded-lg transition-all text-center leading-tight truncate cursor-pointer"
          >
            ⚡ Low Energy Slump
          </button>
          <button
            onClick={() => onTriggerPreset('escalation')}
            className="text-[11px] font-semibold p-2 bg-purple-500/10 text-purple-300 hover:bg-purple-500/15 border border-purple-500/25 rounded-lg transition-all text-center leading-tight truncate cursor-pointer"
          >
            🛡️ How AI Reaches You
          </button>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/30">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 font-bold border ${
                  isAi 
                    ? 'bg-slate-900 text-emerald-400 border-slate-800' 
                    : 'bg-emerald-500 text-slate-950 border-emerald-400'
                }`}>
                  {isAi ? <Cpu className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message bubble */}
                <div className="space-y-2">
                  <div className={`p-3 rounded-2xl text-slate-200 border ${
                    isAi 
                      ? 'bg-slate-900/90 border-slate-800/80 rounded-tl-none' 
                      : 'bg-emerald-950/20 border-emerald-500/20 rounded-tr-none'
                  }`}>
                    {renderMessageText(msg.text)}
                    
                    {/* Message timestamp */}
                    <div className="text-[10px] text-slate-500 font-mono text-right mt-1.5">
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Render interactive decision actions if any */}
                  {isAi && msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-col gap-1.5 pl-1 pt-1">
                      {msg.actions.map((act) => (
                        <button
                          key={act.actionId}
                          onClick={() => onTriggerAction(act.actionId)}
                          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-slate-950/80 hover:bg-slate-950 border border-emerald-500/25 rounded-lg px-3 py-2 text-left flex items-center justify-between transition-all group cursor-pointer"
                        >
                          <span>{act.label}</span>
                          <span className="text-slate-500 group-hover:text-emerald-400 font-mono transition-colors">➔</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isAiTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 max-w-[80%]"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center">
                <Cpu className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3 flex gap-1 items-center rounded-tl-none">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Form Bar */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask ProAct AI to decompose task, check email drafts..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isAiTyping}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md shadow-emerald-500/10 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-500/80" /> Inputs fully sanitized & secure
          </span>
          <span>Zero-Knowledge Vault</span>
        </div>
      </form>
    </div>
  );
}
