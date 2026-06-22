import React, { useState, useRef, useEffect } from 'react';
import { Message, PredefinedCommand, ExecutionStep } from '../types';
import { Send, Eye, CornerDownLeft, RefreshCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatbotConsoleProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  onReset: () => void;
  status: 'idle' | 'running' | 'terminated';
}

const QUICK_ACTIONS: PredefinedCommand[] = [
  { text: 'hello', description: 'Triggers the IF block', category: 'Hello' },
  { text: 'how are you', description: 'Triggers the FIRST ELIF block', category: 'Status' },
  { text: 'bye', description: 'Triggers the SECOND ELIF block (Exits)', category: 'Goodbye' },
  { text: 'what is your name?', description: 'Triggers the catch-all ELSE block', category: 'Custom' },
];

export default function ChatbotConsole({
  messages,
  onSendMessage,
  isProcessing,
  onReset,
  status,
}: ChatbotConsoleProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing || status === 'terminated') return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleQuickAction = (text: string) => {
    if (isProcessing || status === 'terminated') return;
    onSendMessage(text);
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] text-[#E5E5E5] rounded border border-[#262626] shadow-2xl overflow-hidden" id="chatbot-console">
      {/* Console Header */}
      <div className="bg-[#0A0A0A] px-5 py-4 flex items-center justify-between border-b border-[#262626]">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${status === 'terminated' ? 'bg-[#525252]' : 'bg-[#D4D4D4] animate-pulse'}`} />
          <div>
            <span className="text-[9px] tracking-[0.1em] text-[#737373] uppercase font-sans font-bold block">Protocol v1.0.4</span>
            <h3 className="font-serif italic font-medium text-lg leading-none text-white tracking-wide mt-0.5">
              Input / Output Client
            </h3>
          </div>
        </div>
        
        <button
          onClick={onReset}
          className="text-[11px] flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#262626] active:bg-black border border-[#262626] rounded-xs text-[#A3A3A3] hover:text-white transition-all font-mono cursor-pointer"
          title="Reset program execution values"
          id="btn-reset"
        >
          <RefreshCcw size={10} />
          <span>Reset Loop</span>
        </button>
      </div>

      {/* Messages Output Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 font-mono text-xs max-h-[350px] min-h-[300px] scrollbar-none bg-[#0F0F0F]">
        <div className="text-[10px] text-[#525252] border-b border-[#262626] pb-2 mb-3 text-center uppercase tracking-widest leading-normal font-mono">
          === SYSTEM ACTIVE: RULE-BASED LOGIC ===
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded px-5 py-3 leading-relaxed text-xs relative ${
                  msg.sender === 'user'
                    ? 'bg-[#262626] text-[#A3A3A3] rounded-tr-none'
                    : 'bg-[#1A1A1A] border-l-2 border-[#D4D4D4] text-[#E5E5E5] rounded-tl-none'
                }`}
              >
                {/* Prefix to indicate variable output */}
                <div className="text-[9px] text-[#737373] tracking-widest uppercase font-mono mb-1.5 flex items-center gap-1">
                  <span>{msg.sender === 'user' ? 'User' : 'Assistant'}</span>
                </div>
                <p className="whitespace-pre-line text-xs font-mono leading-relaxed">{msg.text}</p>
              </div>
              <span className="text-[9px] text-[#525252] mt-1 px-1 font-mono uppercase tracking-wider">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[#737373] italic py-1 font-mono"
          >
            <span className="w-1 h-1 bg-[#D4D4D4] rounded-full animate-bounce delay-75" />
            <span className="w-1 h-1 bg-[#D4D4D4] rounded-full animate-bounce delay-150" />
            <span className="w-1 h-1 bg-[#D4D4D4] rounded-full animate-bounce delay-300" />
            <span className="text-[10px] ml-1">Evaluating if-elif rules...</span>
          </motion.div>
        )}

        {status === 'terminated' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1A1A] border border-[#262626] rounded-xs p-4 text-[#A3A3A3] text-center space-y-1.5"
          >
            <p className="font-semibold text-[10px] text-white tracking-widest uppercase font-mono">⚠️ LOOP TERMINATED</p>
            <p className="text-[11px] font-sans leading-relaxed text-[#737373]">
              Encountered "break" statement. Interactive loop has exited. Click "Reset Loop" to rerun the chatbot.
            </p>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Triggers */}
      <div className="px-5 py-4 bg-[#0A0A0A] border-t border-[#262626]">
        <span className="text-[9px] text-[#737373] uppercase tracking-[0.1em] block mb-2.5 font-bold font-mono">
          Suggested Rules Simulation:
        </span>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action, idx) => {
            const isDisabled = isProcessing || status === 'terminated';
            return (
              <button
                key={idx}
                onClick={() => handleQuickAction(action.text)}
                disabled={isDisabled}
                className="group relative flex flex-col items-start text-left px-3.5 py-2 bg-[#121212] hover:bg-[#1A1A1A] disabled:opacity-30 disabled:hover:bg-[#121212] border border-[#262626] rounded transition-all cursor-pointer"
                title={action.description}
                id={`chip-${action.text.replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white font-mono font-medium group-hover:text-stone-300 transition-colors">
                    "{action.text}"
                  </span>
                  <span className="text-[9px] bg-[#1A1A1A] text-[#737373] group-hover:bg-[#262626] px-1 py-0.2 rounded font-mono transition-colors border border-[#262626]">
                    {action.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Keyboard Text Input */}
      <div className="p-4 bg-[#0A0A0A] border-t border-[#262626]">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing || status === 'terminated'}
            placeholder={
              status === 'terminated'
                ? "Click 'Reset Loop' to initiate..."
                : "Type 'hello', 'how are you', or 'bye'..."
            }
            className="flex-1 bg-[#1A1A1A] text-white border border-[#333333] focus:outline-none focus:ring-1 focus:ring-[#525252] focus:border-[#525252] rounded px-4 py-3 text-xs placeholder-[#525252] font-mono disabled:opacity-40"
            id="chat-input-text"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing || status === 'terminated'}
            className="p-3 bg-white hover:bg-neutral-200 active:bg-neutral-300 disabled:opacity-20 disabled:hover:bg-white text-black rounded transition-colors cursor-pointer flex items-center justify-center border border-white"
            title="Submit Input value"
            id="btn-submit-chat"
          >
            <Send size={13} className="stroke-[2.5]" />
          </button>
        </form>
        <div className="mt-2.5 flex items-center justify-between text-[10px] text-[#525252] font-mono select-none">
          <span className="flex items-center gap-1.5">
            <CornerDownLeft size={9} />
            Press enter to pipe to stream
          </span>
          <span>v1.0.4</span>
        </div>
      </div>
    </div>
  );
}
