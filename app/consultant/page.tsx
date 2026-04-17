'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  BookOpen,
  Scale,
  Shield,
  TrendingUp,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  MessageSquarePlus,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const SUGGESTED_QUESTIONS = [
  {
    icon: Scale,
    title: 'ҚР заңнамасы',
    question: 'ҚР-да өмірді сақтандыруды қандай заң реттейді және негізгі баптары қандай?',
    tint: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
  },
  {
    icon: TrendingUp,
    title: 'Салық шегерімі',
    question: 'Өмірді сақтандыру бойынша ЖТС салық шегерімін қалай алуға болады?',
    tint: 'bg-blue-50 hover:bg-blue-100/70 border-blue-200',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600',
  },
  {
    icon: Shield,
    title: 'Сақтандыру түрлері',
    question: 'Өмірді сақтандырудың қандай түрлері бар және олардың айырмашылығы қандай?',
    tint: 'bg-purple-50 hover:bg-purple-100/70 border-purple-200',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-600',
  },
  {
    icon: BookOpen,
    title: 'Тыныштық кезеңі',
    question: 'Сақтандыру шартынан қанша күн ішінде бас тартуға болады?',
    tint: 'bg-amber-50 hover:bg-amber-100/70 border-amber-200',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
  },
  {
    icon: HelpCircle,
    title: 'Сыйлықақы есептеу',
    question: 'Сақтандыру сыйлықақысы қалай есептеледі? Актуарлық формулаларды түсіндіріңіз.',
    tint: 'bg-rose-50 hover:bg-rose-100/70 border-rose-200',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-600',
  },
  {
    icon: Sparkles,
    title: 'Тәуекел факторлары',
    question: 'Сақтандыру сыйлықақысына қандай факторлар әсер етеді?',
    tint: 'bg-indigo-50 hover:bg-indigo-100/70 border-indigo-200',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-600',
  },
];

function renderMarkdown(text: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const lines = text.split('\n');
  const out: string[] = [];
  let inList = false;
  let inQuote = false;

  const closeList = () => {
    if (inList) {
      out.push('</ul>');
      inList = false;
    }
  };
  const closeQuote = () => {
    if (inQuote) {
      out.push('</blockquote>');
      inQuote = false;
    }
  };

  const inline = (s: string) => {
    let r = escape(s);
    r = r.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-emerald-600 underline underline-offset-2 hover:text-emerald-700">$1</a>'
    );
    r = r.replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-emerald-700 text-[0.9em] font-mono">$1</code>'
    );
    r = r.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-slate-900 font-semibold">$1</strong>');
    r = r.replace(/\*([^*]+)\*/g, '<em class="text-slate-700">$1</em>');
    return r;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('### ')) {
      closeList();
      closeQuote();
      out.push(`<h3 class="text-slate-900 font-semibold text-base mt-4 mb-2">${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      closeList();
      closeQuote();
      out.push(`<h2 class="text-slate-900 font-bold text-lg mt-4 mb-2">${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith('> ')) {
      closeList();
      if (!inQuote) {
        out.push('<blockquote class="border-l-2 border-emerald-500 bg-emerald-50 px-4 py-2 my-2 rounded-r-lg text-slate-700 italic">');
        inQuote = true;
      }
      out.push(inline(line.slice(2)));
    } else if (/^[-•*]\s+/.test(line)) {
      closeQuote();
      if (!inList) {
        out.push('<ul class="space-y-1 my-2 ml-1">');
        inList = true;
      }
      out.push(`<li class="flex items-start gap-2 text-slate-700"><span class="text-emerald-600 mt-1">•</span><span>${inline(line.replace(/^[-•*]\s+/, ''))}</span></li>`);
    } else if (line === '') {
      closeList();
      closeQuote();
      out.push('<div class="h-2"></div>');
    } else {
      closeList();
      closeQuote();
      out.push(`<p class="text-slate-700 leading-relaxed">${inline(line)}</p>`);
    }
  }
  closeList();
  closeQuote();
  return out.join('');
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-emerald-500"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function ConsultantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const answer: string =
        data.message || data.error || 'Кешіріңіз, жауап ала алмадым.';

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: answer, timestamp: Date.now() },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Кешіріңіз, сервермен байланыс кезінде қате орын алды. Біраздан кейін қайталап көріңіз.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {}
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  const hasConversation = messages.length > 0;

  return (
    <div className="relative min-h-screen">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-40 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-96 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            GPT-4o mini негізінде
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-3">
            AI-<span className="gradient-text">кеңесші</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Қазақстандағы сақтандыру, актуарлық есептеулер және ҚР заңнамасы бойынша сарапшы жауаптар
          </p>
        </motion.div>

        {/* Chat container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-900/5"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-slate-900 font-semibold text-sm">LifeGuard AI</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                    Онлайн
                  </span>
                </div>
                <p className="text-xs text-slate-500">Сақтандыру сарапшысы · ҚР заңнамасы</p>
              </div>
            </div>

            {hasConversation && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Жаңа сөйлесу"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span className="hidden sm:inline">Жаңа сөйлесу</span>
              </button>
            )}
          </div>

          {/* Messages area */}
          <div className="min-h-[420px] max-h-[560px] overflow-y-auto px-4 md:px-6 py-6 space-y-6 scroll-smooth bg-slate-50/50">
            {!hasConversation ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-4"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/15 to-teal-600/15 flex items-center justify-center border border-emerald-500/30 shadow-sm">
                    <Bot className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">Сәлеметсіз бе! 👋</h3>
                <p className="text-slate-600 text-center max-w-md mb-8 text-sm leading-relaxed">
                  Мен — LifeGuard KZ AI-кеңесшісімін. Сақтандыру, актуарлық есептеулер және
                  ҚР заңнамасы бойынша сұрақтарыңызға жауап беремін.
                </p>

                <div className="w-full">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 text-center">
                    Ұсынылған сұрақтар
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        onClick={() => sendMessage(q.question)}
                        className={`group relative overflow-hidden rounded-2xl p-4 text-left border ${q.tint} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${q.iconBg} flex items-center justify-center ${q.iconColor} ring-1 ring-inset ring-white/40`}>
                            <q.icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-slate-900 font-semibold text-sm mb-1 group-hover:text-emerald-700 transition-colors">
                              {q.title}
                            </h4>
                            <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                              {q.question}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`group max-w-[85%] ${
                        msg.role === 'user' ? 'order-2' : ''
                      }`}
                    >
                      <div
                        className={`relative rounded-2xl px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-tr-sm shadow-lg shadow-emerald-500/20'
                            : 'bg-white border border-slate-200 shadow-sm rounded-tl-sm'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <div
                            className="prose-sm"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                          />
                        ) : (
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        )}
                      </div>

                      <div
                        className={`flex items-center gap-2 mt-1.5 px-1 ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <span className="text-[10px] text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {msg.role === 'assistant' && (
                          <button
                            onClick={() => handleCopy(msg.content, i)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-600 transition-all"
                            title="Көшіру"
                          >
                            {copiedIndex === i ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {msg.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center order-3">
                        <User className="w-4 h-4 text-slate-600" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-slate-200 bg-white px-4 py-4">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Сұрағыңызды жазыңыз..."
                  rows={1}
                  disabled={loading}
                  className="w-full resize-none rounded-2xl bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 px-4 py-3 pr-14 text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all disabled:opacity-50"
                  style={{ minHeight: '48px', maxHeight: '160px' }}
                />
                <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 pointer-events-none hidden md:block">
                  Enter ↵
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all"
                aria-label="Жіберу"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>

            <p className="text-[10px] text-slate-500 text-center mt-2">
              AI дәлсіздіктерді қамтуы мүмкін. Нақты кеңес алу үшін лицензияланған сақтандыру компаниясына хабарласыңыз.
            </p>
          </div>
        </motion.div>

        {/* Footer quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-6"
        >
          <Link
            href="/calculator"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:border-emerald-400 text-slate-700 hover:text-slate-900 text-sm transition-all"
          >
            <Shield className="w-4 h-4" />
            Калькулятор
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:border-emerald-400 text-slate-700 hover:text-slate-900 text-sm transition-all"
          >
            <BookOpen className="w-4 h-4" />
            Әдіснама
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:border-emerald-400 text-slate-700 hover:text-slate-900 text-sm transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            Талдау
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
