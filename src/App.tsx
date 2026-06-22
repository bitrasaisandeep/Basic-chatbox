/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { Message, ExecutionStep } from './types';
import ChatbotConsole from './components/ChatbotConsole';
import CodeVisualizer from './components/CodeVisualizer';
import { BookOpen, Terminal, Sparkles, HelpCircle, ChevronRight, CornerRightDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const initialWelcomeMessage: Message = {
    id: 'welcome',
    sender: 'bot',
    text: "Hello! I am a simple rule-based chatbot.\n\nSend a message like 'hello', 'how are you', or 'bye' to watch the exact if-elif-else logic and loops run in real-time on the right card panel!",
    timestamp: new Date(),
  };

  const [messages, setMessages] = useState<Message[]>([initialWelcomeMessage]);
  const [currentStep, setCurrentStep] = useState<ExecutionStep>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loopCount, setLoopCount] = useState(1);
  const [status, setStatus] = useState<'idle' | 'running' | 'terminated'>('idle');
  
  const [variables, setVariables] = useState({
    user_input: '',
    reply: '',
    loop_count: 0,
    status: 'idle' as const,
  });

  const handleSendMessage = (text: string) => {
    if (isProcessing || status === 'terminated') return;

    const cleanInput = text.trim();
    const normalizedInput = cleanInput.toLowerCase();

    // Create the user's message
    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: cleanInput,
      timestamp: new Date(),
    };

    // Update conversation log with user input
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);
    setStatus('running');

    // Run the step-by-step execution simulation with visual delays
    // Step 1: Input source parsed
    setCurrentStep('input');
    setVariables({
      user_input: cleanInput,
      reply: '',
      loop_count: loopCount,
      status: 'running',
    });

    // Step 2: Evaluate condition
    setTimeout(() => {
      let matchedStep: ExecutionStep = 'check-else';
      let botReply = '';

      if (normalizedInput === 'hello') {
        matchedStep = 'check-if';
        botReply = 'Hi!';
      } else if (normalizedInput === 'how are you') {
        matchedStep = 'check-elif-how';
        botReply = "I'm fine, thanks!";
      } else if (normalizedInput === 'bye') {
        matchedStep = 'check-elif-bye';
        botReply = 'Goodbye!';
      } else {
        matchedStep = 'check-else';
        botReply = `I didn't quite get that. Try 'hello', 'how are you', or 'bye'.`;
      }

      setCurrentStep(matchedStep);
      setVariables((prev) => ({
        ...prev,
        reply: botReply,
      }));

      // Step 3: Print / Output response
      setTimeout(() => {
        if (normalizedInput === 'bye') {
          // Break is hit inside the bye choice
          setCurrentStep('loop-break');
          setStatus('terminated');
          
          const botMessage: Message = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: botReply,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsProcessing(false);
          setVariables((prev) => ({
            ...prev,
            status: 'terminated',
          }));
        } else {
          setCurrentStep('output-print');
          
          const botMessage: Message = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: botReply,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setLoopCount((prev) => prev + 1);

          // Return to idle state, waiting for next iteration of the loop
          setTimeout(() => {
            setCurrentStep('idle');
            setIsProcessing(false);
          }, 700);
        }
      }, 900);

    }, 800);
  };

  const handleReset = () => {
    setMessages([initialWelcomeMessage]);
    setCurrentStep('idle');
    setIsProcessing(false);
    setLoopCount(1);
    setStatus('idle');
    setVariables({
      user_input: '',
      reply: '',
      loop_count: 0,
      status: 'idle',
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex flex-col font-sans selection:bg-[#262626] selection:text-white" id="app-root">
      {/* Top Professional Header */}
      <header className="bg-[#0A0A0A] border-b border-[#262626] py-6 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#121212] border border-[#262626] rounded text-[#D4D4D4]">
              <Terminal size={20} className="stroke-[1.5]" />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#737373] block">PROTOCOL V1.0.4</span>
              <h1 className="font-serif italic font-medium text-3xl text-white tracking-tight mt-0.5">Basic Assistant</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 bg-[#121212] border border-[#262626] rounded-sm text-[10px] tracking-wider font-mono text-[#D4D4D4]">
              RULE-BASED ENGINE ACTIVE
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Core Concepts Guide Cards (Bento style grid) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="educational-concepts">
          {/* Concept 1: Functions */}
          <div className="bg-[#121212] rounded border border-[#262626] p-5 shadow-xs flex flex-col justify-between hover:border-[#333333] transition-colors duration-200">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-mono tracking-wider text-[#737373] uppercase bg-[#1A1A1A] border border-[#262626] px-2 py-0.5 rounded-xs">
                  01 / FUNC
                </span>
                <BookOpen size={13} className="text-[#525252]" />
              </div>
              <h4 className="font-serif font-medium text-white text-base">Functions (`def`)</h4>
              <p className="font-sans text-xs text-[#A3A3A3] mt-2.5 leading-relaxed">
                Functions bundle reusable instruction blocks. The chatbot is configured entirely inside a called functional wrapper.
              </p>
            </div>
          </div>

          {/* Concept 2: Loops */}
          <div className="bg-[#121212] rounded border border-[#262626] p-5 shadow-xs flex flex-col justify-between hover:border-[#333333] transition-colors duration-200">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-mono tracking-wider text-[#737373] uppercase bg-[#1A1A1A] border border-[#262626] px-2 py-0.5 rounded-xs">
                  02 / LOOP
                </span>
                <BookOpen size={13} className="text-[#525252]" />
              </div>
              <h4 className="font-serif font-medium text-white text-base">Loops (`while True`)</h4>
              <p className="font-sans text-xs text-[#A3A3A3] mt-2.5 leading-relaxed">
                An infinite loop keeps the terminal polling, waiting for input sequences until interrupted with a `break` statement.
              </p>
            </div>
          </div>

          {/* Concept 3: if-elif-else */}
          <div className="bg-[#121212] rounded border border-[#262626] p-5 shadow-xs flex flex-col justify-between hover:border-[#333333] transition-colors duration-200">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-mono tracking-wider text-[#737373] uppercase bg-[#1A1A1A] border border-[#262626] px-2 py-0.5 rounded-xs">
                  03 / COND
                </span>
                <BookOpen size={13} className="text-[#525252]" />
              </div>
              <h4 className="font-serif font-medium text-white text-base">If-Elif-Else Statement</h4>
              <p className="font-sans text-xs text-[#A3A3A3] mt-2.5 leading-relaxed">
                Checks matching queries sequentially. Evaluating positive branches halts further checks and triggers the corresponding block.
              </p>
            </div>
          </div>

          {/* Concept 4: Input / Output */}
          <div className="bg-[#121212] rounded border border-[#262626] p-5 shadow-xs flex flex-col justify-between hover:border-[#333333] transition-colors duration-200">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-mono tracking-wider text-[#737373] uppercase bg-[#1A1A1A] border border-[#262626] px-2 py-0.5 rounded-xs">
                  04 / STREAM
                </span>
                <BookOpen size={13} className="text-[#525252]" />
              </div>
              <h4 className="font-serif font-medium text-white text-base">Input & Output stream</h4>
              <p className="font-sans text-xs text-[#A3A3A3] mt-2.5 leading-relaxed">
                Maintains dialogue via standard <code>input()</code> captures mapped to console-evaluated <code>print()</code> responses.
              </p>
            </div>
          </div>
        </section>

        {/* Console & Execution Split Panel */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="workspace-grid">
          {/* Active Chatbot terminal console */}
          <div className="lg:col-span-5 h-full flex flex-col">
            <ChatbotConsole
              messages={messages}
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
              onReset={handleReset}
              status={status}
            />
          </div>

          {/* Code tracing block visualizer */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <CodeVisualizer
              currentStep={currentStep}
              variables={variables}
            />
          </div>
        </section>

        {/* Step-by-Step Educational flow helper banner */}
        <footer className="bg-[#121212] border border-[#262626] rounded p-5 mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="p-2.5 bg-[#1A1A1A] border border-[#262626] rounded text-[#A3A3A3] flex-shrink-0">
            <HelpCircle size={16} />
          </div>
          <div>
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-[#737373] font-bold">Logic Playground Guidelines</h5>
            <p className="font-sans text-xs text-[#A3A3A3] leading-relaxed mt-1">
              Transmit <strong className="text-white">"hello"</strong> to match the initial <code>if</code> query state, 
              <strong className="text-white"> "how are you"</strong> to transition into the <code>elif</code> scope, or 
              <strong className="text-white"> "bye"</strong> to force-terminate the infinite runtime loop via <code>break</code>. Unmatched statements route directly into <code>else</code>.
            </p>
          </div>
        </footer>

      </main>
    </div>
  );
}
