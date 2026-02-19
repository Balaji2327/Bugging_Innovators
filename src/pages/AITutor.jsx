import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, PaperAirplaneIcon, ArrowPathIcon, CodeBracketIcon, XMarkIcon } from '@heroicons/react/24/outline';
import API_BASE_URL from '../config';

const TOPICS = [
   'Binary Search',
   'Recursion',
   'Two Pointers',
   'Linked List',
   'Hash Maps',
   'Bubble Sort',
   'Dynamic Programming',
   'Graph Traversal',
];

const SYSTEM_GREETING = (topic) =>
   `Hello! I'm your AI DSA Tutor. Today we'll be working on **${topic}**.\n\nPlease paste your code below and I'll guide you through a Socratic viva — I'll ask questions to help you discover any issues yourself, rather than just giving you the answer. Ready? Go ahead and share your code!`;

const TypingIndicator = () => (
   <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
         <SparklesIcon className="w-4 h-4 text-white" />
      </div>
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl rounded-bl-sm px-4 py-3">
         <div className="flex gap-1 items-center h-4">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
         </div>
      </div>
   </div>
);

const MessageBubble = ({ msg }) => {
   const isAI = msg.role === 'ai';
   // Render markdown-like bold (**text**) and newlines
   const renderText = (text) => {
      return text.split('\n').map((line, i) => {
         const parts = line.split(/\*\*(.*?)\*\*/g);
         return (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>
               {parts.map((part, j) =>
                  j % 2 === 1 ? <strong key={j} className="text-orange-400 font-semibold">{part}</strong> : part
               )}
            </p>
         );
      });
   };

   return (
      <div className={`flex items-end gap-2 mb-4 ${isAI ? '' : 'flex-row-reverse'}`}>
         {/* Avatar */}
         <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
        ${isAI
               ? 'bg-gradient-to-br from-orange-500 to-red-600'
               : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
            {isAI ? <SparklesIcon className="w-4 h-4 text-white" /> : 'You'}
         </div>

         {/* Bubble */}
         <div className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed
        ${isAI
               ? 'bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl rounded-bl-sm text-gray-200'
               : 'bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl rounded-br-sm text-white'
            }`}>
            {msg.isCode ? (
               <pre className="font-mono text-xs bg-black/40 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                  <code>{msg.content}</code>
               </pre>
            ) : (
               renderText(msg.content)
            )}
            <p className={`text-xs mt-2 ${isAI ? 'text-gray-600' : 'text-blue-300'}`}>
               {msg.time}
            </p>
         </div>
      </div>
   );
};

const AITutor = () => {
   const [selectedTopic, setSelectedTopic] = useState('Binary Search');
   const [sessionStarted, setSessionStarted] = useState(false);
   const [messages, setMessages] = useState([]);
   const [input, setInput] = useState('');
   const [isTyping, setIsTyping] = useState(false);
   const [isCode, setIsCode] = useState(false);
   const messagesEndRef = useRef(null);
   const textareaRef = useRef(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages, isTyping]);

   const now = () =>
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

   const startSession = () => {
      setMessages([
         {
            role: 'ai',
            content: SYSTEM_GREETING(selectedTopic),
            time: now(),
         },
      ]);
      setSessionStarted(true);
   };

   const resetSession = () => {
      setSessionStarted(false);
      setMessages([]);
      setInput('');
   };

   const sendMessage = async () => {
      const trimmed = input.trim();
      if (!trimmed || isTyping) return;

      const userMsg = {
         role: 'user',
         content: trimmed,
         isCode,
         time: now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsCode(false);
      setIsTyping(true);

      try {
         // Build conversation history for context
         const conversationHistory = messages
            .map((m) => `${m.role === 'ai' ? 'Tutor' : 'Student'}: ${m.content}`)
            .join('\n');

         const payload = {
            student_code: trimmed,
            topic: selectedTopic,
            conversation_history: conversationHistory,
         };

         const res = await fetch(`${API_BASE_URL}/viva`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
         });

         if (!res.ok) throw new Error(`Server error: ${res.status}`);

         const data = await res.json();
         const aiMsg = {
            role: 'ai',
            content: data.question || "I couldn't generate a response. Please try again.",
            time: now(),
         };
         setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
         setMessages((prev) => [
            ...prev,
            {
               role: 'ai',
               content: `⚠️ Could not reach the backend. Make sure the FastAPI server is running on port 8000.\n\nError: ${err.message}`,
               time: now(),
            },
         ]);
      } finally {
         setIsTyping(false);
      }
   };

   const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         sendMessage();
      }
   };

   // --- Topic Selection Screen ---
   if (!sessionStarted) {
      return (
         <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-lg">
               <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-4">
                     <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">AI DSA Tutor</h1>
                  <p className="text-gray-400 mt-2">Your personal Socratic viva coach. Choose a topic to begin.</p>
               </div>

               <div className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-5">
                  <div>
                     <label className="block text-sm font-medium text-gray-400 mb-3">Select Topic</label>
                     <div className="grid grid-cols-2 gap-2">
                        {TOPICS.map((t) => (
                           <button
                              key={t}
                              onClick={() => setSelectedTopic(t)}
                              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left
                      ${selectedTopic === t
                                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                    : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-[#444]'
                                 }`}
                           >
                              {t}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4 text-sm text-gray-400 space-y-1">
                     <p className="text-white font-medium text-xs uppercase tracking-wider mb-2">How it works</p>
                     <p>📝 Paste your code or explain your approach</p>
                     <p>🤔 The AI will ask probing questions — not give answers</p>
                     <p>💡 Discover your own bugs through guided dialogue</p>
                  </div>

                  <button
                     onClick={startSession}
                     className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                     <SparklesIcon className="w-5 h-5" />
                     Start Viva Session — {selectedTopic}
                  </button>
               </div>
            </div>
         </div>
      );
   }

   // --- Chat Interface ---
   return (
      <div className="flex flex-col h-screen bg-black text-white">
         {/* Header */}
         <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] bg-[#0a0a0a]">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
               </div>
               <div>
                  <h2 className="font-bold text-white text-sm">AI DSA Tutor</h2>
                  <p className="text-xs text-orange-400">Topic: {selectedTopic}</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Live
               </span>
               <button
                  onClick={resetSession}
                  title="End session"
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all"
               >
                  <XMarkIcon className="w-5 h-5" />
               </button>
            </div>
         </div>

         {/* Messages */}
         <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            <div className="max-w-3xl mx-auto">
               {messages.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} />
               ))}
               {isTyping && <TypingIndicator />}
               <div ref={messagesEndRef} />
            </div>
         </div>

         {/* Input Area */}
         <div className="border-t border-[#1a1a1a] bg-[#0a0a0a] px-4 py-4">
            <div className="max-w-3xl mx-auto">
               {/* Code toggle */}
               <div className="flex items-center gap-2 mb-2">
                  <button
                     onClick={() => setIsCode((v) => !v)}
                     className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border transition-all
                ${isCode
                           ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                           : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-500 hover:text-gray-300'
                        }`}
                  >
                     <CodeBracketIcon className="w-3.5 h-3.5" />
                     {isCode ? 'Code Mode ON' : 'Code Mode'}
                  </button>
                  <span className="text-xs text-gray-600">Press Enter to send · Shift+Enter for new line</span>
               </div>

               <div className="flex gap-3 items-end">
                  <textarea
                     ref={textareaRef}
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     onKeyDown={handleKeyDown}
                     placeholder={isCode ? 'Paste your code here...' : 'Type your response or explanation...'}
                     rows={isCode ? 5 : 2}
                     className={`flex-1 resize-none rounded-xl border bg-[#111] text-white text-sm px-4 py-3 outline-none transition-all placeholder-gray-600
                focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20
                ${isCode ? 'font-mono border-purple-500/30' : 'border-[#2a2a2a]'}`}
                  />
                  <button
                     onClick={sendMessage}
                     disabled={!input.trim() || isTyping}
                     className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  >
                     {isTyping
                        ? <ArrowPathIcon className="w-5 h-5 text-white animate-spin" />
                        : <PaperAirplaneIcon className="w-5 h-5 text-white" />
                     }
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AITutor;
