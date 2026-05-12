import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Upload, Paperclip, Bot, User, Trash2, BookOpen, BrainCircuit, FileUp } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AIService } from '@/src/services/ai';

export default function HomeworkAI() {
  const SUBJECTS = ['Mathe', 'Deutsch', 'Englisch', 'Erdkunde', 'Französisch', 'Latein'];
  
  const [subject, setSubject] = useState('Mathe');
  const [chats, setChats] = useState<Record<string, { role: string; text: string }[]>>(() => {
    const initialChats: Record<string, { role: string; text: string }[]> = {};
    SUBJECTS.forEach(s => {
      initialChats[s] = [
        { role: 'assistant', text: `Hallo! Ich bin deine intelligente KI für ${s}. Lade ein Bild deiner Hausaufgabe hoch oder erkläre mir dein Problem, und wir lösen es gemeinsam Schritt für Schritt.` }
      ];
    });
    return initialChats;
  });
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = chats[subject] || [];

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', text: input };
    const currentMessages = [...messages, userMsg];
    
    setChats(prev => ({
      ...prev,
      [subject]: currentMessages
    }));
    
    setInput('');
    setIsTyping(true);

    try {
      const response = await AIService.chatHomework(messages, input, subject);
      setChats(prev => ({
        ...prev,
        [subject]: [...(prev[subject] || []), { role: 'assistant', text: response }]
      }));
    } catch (error) {
      console.error("Chat Fehler:", error);
      setChats(prev => ({
        ...prev,
        [subject]: [...(prev[subject] || []), { role: 'assistant', text: "Entschuldigung, es gab ein Problem mit der Verbindung. Bitte versuchen Sie es später erneut." }]
      }));
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const clearChat = () => {
    setChats(prev => ({
      ...prev,
      [subject]: [
        { role: 'assistant', text: `Chat gelöscht. Wie kann ich dir heute in ${subject} helfen?` }
      ]
    }));
  };

  return (
    <div className="pt-24 pb-10 px-6 h-screen flex flex-col max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
        
        {/* Left Sidebar - Subjects */}
        <div className="hidden lg:flex flex-col w-64 space-y-4">
          <div className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <BrainCircuit className="text-indigo-500" size={18} />
              Fächer
            </h3>
            <div className="space-y-2">
              {SUBJECTS.map(s => (
                <button 
                  key={s} 
                  onClick={() => {
                    setSubject(s);
                    setInput('');
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group",
                    subject === s ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {s}
                  <ChevronRight size={14} className={cn("transition-opacity", subject === s ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-lg">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4 text-white">
              <BookOpen size={20} />
            </div>
            <h4 className="font-bold mb-2">Lerntipps</h4>
            <p className="text-white/60 text-xs">Nutze ForzKI, um komplexe Themen in einfache Worte zu fassen.</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-zinc-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden relative">
          {/* Chat Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between backdrop-blur-xl bg-black/20 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-white font-bold leading-none mb-1">{subject} KI</h2>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Bereit zu helfen
                </span>
              </div>
            </div>
            <button 
              onClick={clearChat}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
              title="Chat für dieses Fach leeren"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide" ref={scrollRef}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center",
                  msg.role === 'assistant' ? "bg-indigo-600" : "bg-white/10"
                )}>
                  {msg.role === 'assistant' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-zinc-400" />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'assistant' ? "bg-zinc-900 text-zinc-200" : "bg-indigo-600 text-white"
                )}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900 flex items-center gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-6 bg-black/40 border-t border-white/5">
            <div className="max-w-4xl mx-auto flex items-end gap-3 bg-zinc-900/80 p-2 rounded-3xl border border-white/10 ring-1 ring-white/5 focus-within:ring-indigo-500/50 transition-all">
              <button className="p-3 text-zinc-500 hover:text-white transition-all hover:bg-white/5 rounded-2xl flex-shrink-0">
                <Paperclip size={20} />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Frag mich etwas..."
                className="w-full bg-transparent border-none outline-none py-3 text-white text-sm resize-none scrollbar-hide max-h-32 min-h-[44px]"
              />
              <div className="flex gap-2">
                <button className="p-3 bg-white/5 text-indigo-400 hover:bg-white/10 rounded-2xl transition-all h-12 w-12 flex items-center justify-center">
                  <FileUp size={20} />
                </button>
                <button
                  onClick={handleSend}
                  className="p-3 bg-indigo-600 text-white hover:bg-indigo-500 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 h-12 w-12 flex items-center justify-center"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 text-center mt-3 uppercase font-bold tracking-widest">Die KI kann Fehler machen. Überprüfe wichtige Informationen.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size?: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
