import React from 'react';
import { ExecutionStep } from '../types';
import { Code, Play, ArrowRight, CornerDownRight, CheckCircle2 } from 'lucide-react';

interface CodeVisualizerProps {
  currentStep: ExecutionStep;
  variables: {
    user_input: string;
    reply: string;
    loop_count: number;
    status: 'idle' | 'running' | 'terminated';
  };
}

export default function CodeVisualizer({ currentStep, variables }: CodeVisualizerProps) {
  // Define python code lines
  const codeLines = [
    { text: 'def simple_chatbot():', indent: 0, line: 1 },
    { text: '    print("Bot: Live and waiting...")', indent: 0, line: 2 },
    { text: '    loop_count = 0', indent: 0, line: 3 },
    { text: '    while True:', indent: 0, line: 4 },
    { text: '        # 1. Get input from user', indent: 1, line: 5, step: 'input' },
    { text: '        user_input = input("You: ").strip().lower()', indent: 1, line: 6, step: 'input' },
    { text: '        loop_count += 1', indent: 1, line: 7, step: 'input' },
    { text: '        ', indent: 1, line: 8 },
    { text: '        # 2. Key Concepts: if-elif-else logic', indent: 1, line: 9 },
    { text: '        if user_input == "hello":', indent: 1, line: 10, step: 'check-if' },
    { text: '            reply = "Hi!"', indent: 2, line: 11, step: 'check-if' },
    { text: '            ', indent: 1, line: 12 },
    { text: '        elif user_input == "how are you":', indent: 1, line: 13, step: 'check-elif-how' },
    { text: '            reply = "I\'m fine, thanks!"', indent: 2, line: 14, step: 'check-elif-how' },
    { text: '            ', indent: 1, line: 15 },
    { text: '        elif user_input == "bye":', indent: 1, line: 16, step: 'check-elif-bye' },
    { text: '            reply = "Goodbye!"', indent: 2, line: 17, step: 'check-elif-bye' },
    { text: '            print("Bot:", reply)', indent: 2, line: 18, step: 'check-elif-bye' },
    { text: '            break  # Exit interactive loop', indent: 2, line: 19, step: 'loop-break' },
    { text: '            ', indent: 1, line: 20 },
    { text: '        else:', indent: 1, line: 21, step: 'check-else' },
    { text: '            reply = "I couldn\'t find a rule for that!"', indent: 2, line: 22, step: 'check-else' },
    { text: '            ', indent: 1, line: 23 },
    { text: '        # 3. Output logic', indent: 1, line: 24, step: 'output-print' },
    { text: '        print("Bot:", reply)', indent: 1, line: 25, step: 'output-print' },
  ];

  const getStepExplanation = (step: ExecutionStep) => {
    switch (step) {
      case 'input':
        return {
          title: 'Step 1: Get User Input',
          desc: 'The input() function pauses wait-state for user transmission, converting it via .lower().',
          color: 'border-t border-[#262626] bg-[#161616] text-[#E5E5E5]'
        };
      case 'check-if':
        return {
          title: 'Step 2a: Evaluate "hello"',
          desc: 'Triggered the if block condition. Because input matches "hello", variables.reply is assigned "Hi!".',
          color: 'border-t border-[#262626] bg-[#161616] text-[#E5E5E5]'
        };
      case 'check-elif-how':
        return {
          title: 'Step 2b: Evaluate "how are you"',
          desc: 'First check failed, nested elif evaluated to True. variables.reply is assigned "I\'m fine, thanks!"',
          color: 'border-t border-[#262626] bg-[#161616] text-[#E5E5E5]'
        };
      case 'check-elif-bye':
        return {
          title: 'Step 2c: Evaluate "bye"',
          desc: 'Triggered the break logic block. The chat terminates after signaling a farewell reply.',
          color: 'border-t border-[#262626] bg-[#161616] text-[#E5E5E5]'
        };
      case 'check-else':
        return {
          title: 'Step 2d: Fallback Case (else)',
          desc: 'None of the rules match. The else catch-all triggers with a helpful helper query.',
          color: 'border-t border-[#262626] bg-[#161616] text-[#E5E5E5]'
        };
      case 'output-print':
        return {
          title: 'Step 3: Print Output',
          desc: 'The print() function outputs the stored response value from variables.reply to the screen console.',
          color: 'border-t border-[#262626] bg-[#161616] text-[#E5E5E5]'
        };
      case 'loop-break':
        return {
          title: 'Loop Break Triggered',
          desc: 'Break expression encountered. The while True loop yields execution, terminating the server scope.',
          color: 'border-t border-[#262626] bg-[#161616] text-[#E5E5E5]'
        };
      case 'idle':
      default:
        return {
          title: 'Awaiting Transmission',
          desc: 'Enter comments or choose predefined prompts to kick off the execution sequence viewer.',
          color: 'border-t border-[#262626] bg-[#0A0A0A] text-[#737373]'
        };
    }
  };

  const exp = getStepExplanation(currentStep);

  return (
    <div className="flex flex-col h-full bg-[#121212] rounded border border-[#262626] shadow-xl overflow-hidden" id="visualizer-container">
      {/* Container Header */}
      <div className="bg-[#0A0A0A] border-b border-[#262626] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A1A1A] border border-[#262626] rounded text-[#D4D4D4]">
            <Code size={16} className="stroke-[1.5]" />
          </div>
          <div>
            <span className="text-[9px] tracking-[0.1em] text-[#737373] uppercase font-sans font-bold block">Execution Trace</span>
            <h3 className="font-serif italic font-medium text-lg leading-none text-white tracking-wide mt-0.5">Control Flow</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] border border-[#262626] rounded font-mono text-[9px] text-[#A3A3A3]">
          <span className={`w-2 h-2 rounded-full ${
            variables.status === 'running' 
              ? 'bg-white animate-pulse' 
              : variables.status === 'terminated' 
                ? 'bg-[#525252]' 
                : 'bg-[#525252]'
          }`} />
          {variables.status.toUpperCase()}
        </div>
      </div>

      {/* Code Area */}
      <div className="p-5 flex-1 overflow-y-auto font-mono text-xs text-[#E5E5E5] leading-normal scrollbar-none max-h-[460px] bg-[#0F0F0F]">
        <div className="space-y-1 relative">
          {codeLines.map((lineObj) => {
            const isHighlighted = lineObj.step === currentStep || (currentStep === 'loop-break' && lineObj.step === 'check-elif-bye');
            
            return (
              <div 
                key={lineObj.line}
                className={`flex rounded-xs transition-all duration-300 py-1 ${
                  isHighlighted 
                    ? 'bg-[#1D1D1D] font-medium text-white border-l border-white -ml-1 pl-1' 
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                {/* Line number */}
                <span className="w-6 text-right select-none pr-3 text-[#525252] text-[10px] font-light leading-5">
                  {lineObj.line}
                </span>

                {/* Indent spacing */}
                <span className="whitespace-pre">
                  {'    '.repeat(lineObj.indent)}
                </span>

                {/* Styled text highlights */}
                <span className="leading-5 text-[#E5E5E5]">
                  {lineObj.text.startsWith('def ') || lineObj.text.includes('while ') || lineObj.text.includes('if ') || lineObj.text.includes('elif ') || lineObj.text.includes('else:') ? (
                    <span className="text-white font-semibold font-serif italic">{lineObj.text}</span>
                  ) : lineObj.text.includes('#') ? (
                    <span className="text-[#525252] italic font-normal">{lineObj.text}</span>
                  ) : (
                    <span className="text-[#A3A3A3]">{lineObj.text}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Variables Inspector */}
      <div className="p-5 border-t border-[#262626] bg-[#0A0A0A]">
        <span className="text-[9px] uppercase tracking-[0.15em] text-[#737373] font-mono font-bold block mb-3">Memory Variables Monitor</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="p-3 bg-[#121212] rounded border border-[#262626] flex flex-col">
            <span className="text-[9px] text-[#737373] font-mono uppercase tracking-wider mb-1">user_input</span>
            <span className="font-mono text-xs font-semibold text-white truncate" title={variables.user_input || '""'}>
              {variables.user_input ? `"${variables.user_input}"` : 'None'}
            </span>
          </div>
          <div className="p-3 bg-[#121212] rounded border border-[#262626] flex flex-col">
            <span className="text-[9px] text-[#737373] font-mono uppercase tracking-wider mb-1">reply</span>
            <span className="font-mono text-xs font-semibold text-white truncate" title={variables.reply || '""'}>
              {variables.reply ? `"${variables.reply}"` : 'None'}
            </span>
          </div>
          <div className="p-3 bg-[#121212] rounded border border-[#262626] flex flex-col">
            <span className="text-[9px] text-[#737373] font-mono uppercase tracking-wider mb-1">loop_count</span>
            <span className="font-mono text-xs font-semibold text-white truncate">
              {variables.loop_count}
            </span>
          </div>
          <div className="p-3 bg-[#121212] rounded border border-[#262626] flex flex-col">
            <span className="text-[9px] text-[#737373] font-mono uppercase tracking-wider mb-1">break_loop</span>
            <span className="font-mono text-xs font-semibold text-white">
              {variables.status === 'terminated' ? 'True' : 'False'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Step Bubble */}
      <div className={`p-4 transition-colors duration-300 min-h-[96px] ${exp.color}`}>
        <div className="flex gap-3 items-start">
          {currentStep === 'idle' ? (
            <Play size={13} className="mt-1 flex-shrink-0 animate-pulse text-[#525252]" />
          ) : (
            <CheckCircle2 size={13} className="mt-1 flex-shrink-0 text-white" />
          )}
          <div>
            <h4 className="font-serif italic font-medium text-sm leading-snug text-white">{exp.title}</h4>
            <p className="text-[11px] font-sans text-[#A3A3A3] mt-1 leading-relaxed">{exp.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
