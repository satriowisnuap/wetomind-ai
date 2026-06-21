import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, FeatureType, WetonData } from '@/types';
import { getWeton } from '@/lib/javaCalendar';
import { FeatureSelector } from './FeatureSelector';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import { WetonBadge } from './WetonBadge';
import { JaweDatePicker } from './ui/JaweDatePicker';
import { RefreshCw, Send, Trash2, ArrowLeft, X, AlertTriangle, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─────────────────────────────────────────────────────────────────
// SessionStorage helpers (safe for SSR)
// ─────────────────────────────────────────────────────────────────
const FEATURE_LIST: FeatureType[] = [
  'BEDAH_KARAKTER', 'KOMPAS_KARIR', 'PETA_PERBAIKAN', 'UJI_JODOH', 'SINERGI_REKAN',
];

const SK = {
  userName:        'wm_userName',
  userBirthdate:   'wm_userBirthdate',
  partnerName:     'wm_partnerName',
  partnerBirthdate:'wm_partnerBirthdate',
  selectedFeature: 'wm_selectedFeature',
  msgs:            (f: FeatureType) => `wm_msgs_${f}`,
};

const ss = {
  get: (key: string): string => {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem(key) ?? '';
  },
  set: (key: string, val: string) => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(key, val);
  },
  del: (key: string) => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  },
  getMsgs: (f: FeatureType): ChatMessage[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(sessionStorage.getItem(SK.msgs(f)) ?? '[]') ?? []; }
    catch { return []; }
  },
  setMsgs: (f: FeatureType, msgs: ChatMessage[]) => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(SK.msgs(f), JSON.stringify(msgs));
  },
  clearAllMsgs: () => FEATURE_LIST.forEach(f => ss.del(SK.msgs(f))),
};
// ─────────────────────────────────────────────────────────────────

interface ChatPanelProps {
  onClose?: () => void;
  initialUserName?: string;
  initialUserBirthdate?: string;
}

const suggestedPrompts: Record<FeatureType, string[]> = {
  BEDAH_KARAKTER: ['Apa kelebihan utamaku?', 'Apa watak tersembunyi saya?'],
  KOMPAS_KARIR:   ['Pekerjaan apa yang cocok untukku?', 'Bagaimana cara terbaikku mencari rezeki?'],
  PETA_PERBAIKAN: ['Apa tantangan hidup terbesarku?', 'Bagaimana cara mengelola emosi?'],
  UJI_JODOH:      ['Bagaimana kecocokan asmara kami?', 'Apa yang harus dijaga agar hubungan langgeng?'],
  SINERGI_REKAN:  ['Bagaimana potensi bisnis kami berdua?', 'Apa pembagian peran yang ideal?'],
};

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day) return dateStr;
  return `${day} ${MONTHS_SHORT[month - 1]} ${year}`;
}

export function ChatPanel({ onClose, initialUserName = '', initialUserBirthdate = '' }: ChatPanelProps) {
  // ── Per-feature chat history ────────────────────────────────────
  // Initialised empty; hydrated from sessionStorage on first mount (see useEffect below)
  const [allMessages, setAllMessages] = useState<Record<FeatureType, ChatMessage[]>>(() => {
    const empty = {} as Record<FeatureType, ChatMessage[]>;
    FEATURE_LIST.forEach(f => { empty[f] = []; });
    return empty;
  });

  // ── Persistent scalar state (hydrated in useEffect) ─────────────
  const [selectedFeature, setSelectedFeatureRaw] = useState<FeatureType>('BEDAH_KARAKTER');
  const [userName,        setUserNameRaw]        = useState(initialUserName);
  const [userBirthdate,   setUserBirthdateRaw]   = useState(initialUserBirthdate);
  const [partnerName,     setPartnerNameRaw]      = useState('');
  const [partnerBirthdate,setPartnerBirthdateRaw] = useState('');

  // ── Other transient state ───────────────────────────────────────
  const [isDataExpanded,   setIsDataExpanded]   = useState(false);
  const [isLoading,        setIsLoading]        = useState(false);
  const [isStreaming,      setIsStreaming]       = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [currentWeton,     setCurrentWeton]     = useState<WetonData | null>(null);
  const [inputText,        setInputText]        = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Hydrate from sessionStorage on client mount ─────────────────
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    // Load per-feature messages
    const loaded = {} as Record<FeatureType, ChatMessage[]>;
    FEATURE_LIST.forEach(f => { loaded[f] = ss.getMsgs(f); });
    setAllMessages(loaded);

    // Load scalar data (prop values take priority over storage)
    const savedName      = ss.get(SK.userName);
    const savedBirthdate = ss.get(SK.userBirthdate);
    const savedFeature   = ss.get(SK.selectedFeature) as FeatureType;

    if (!initialUserName   && savedName)      setUserNameRaw(savedName);
    if (!initialUserBirthdate && savedBirthdate) setUserBirthdateRaw(savedBirthdate);
    if (FEATURE_LIST.includes(savedFeature))  setSelectedFeatureRaw(savedFeature);

    setPartnerNameRaw(ss.get(SK.partnerName));
    setPartnerBirthdateRaw(ss.get(SK.partnerBirthdate));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Wrapped setters that also persist to sessionStorage ─────────
  const setSelectedFeature = useCallback((f: FeatureType) => {
    setSelectedFeatureRaw(f);
    ss.set(SK.selectedFeature, f);
  }, []);

  const setUserName = useCallback((v: string) => {
    setUserNameRaw(v);
    ss.set(SK.userName, v);
  }, []);

  const setUserBirthdate = useCallback((v: string) => {
    setUserBirthdateRaw(v);
    ss.set(SK.userBirthdate, v);
  }, []);

  const setPartnerName = useCallback((v: string) => {
    setPartnerNameRaw(v);
    ss.set(SK.partnerName, v);
  }, []);

  const setPartnerBirthdate = useCallback((v: string) => {
    setPartnerBirthdateRaw(v);
    ss.set(SK.partnerBirthdate, v);
  }, []);

  // ── Derived: current feature's message list ─────────────────────
  const messages = allMessages[selectedFeature] ?? [];

  // Update messages for the active feature and persist immediately
  const setMessages = useCallback(
    (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      setAllMessages(prev => {
        const current = prev[selectedFeature] ?? [];
        const next    = typeof updater === 'function' ? updater(current) : updater;
        ss.setMsgs(selectedFeature, next);
        return { ...prev, [selectedFeature]: next };
      });
    },
    [selectedFeature],
  );

  // ── Sync props when they change (hero form → chat panel) ─────────
  useEffect(() => {
    if (initialUserName) setUserName(initialUserName);
  }, [initialUserName, setUserName]);

  useEffect(() => {
    if (initialUserBirthdate) setUserBirthdate(initialUserBirthdate);
  }, [initialUserBirthdate, setUserBirthdate]);

  // ── Weton live preview ───────────────────────────────────────────
  useEffect(() => {
    if (userBirthdate && userBirthdate.length === 10) {
      try { setCurrentWeton(getWeton(userBirthdate)); }
      catch { setCurrentWeton(null); }
    } else {
      setCurrentWeton(null);
    }
  }, [userBirthdate]);

  // ── Auto-scroll ──────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, currentWeton]);

  // ── Derived flags ────────────────────────────────────────────────
  const needsSecondPerson = selectedFeature === 'UJI_JODOH' || selectedFeature === 'SINERGI_REKAN';
  const isFormComplete    = userName && userBirthdate && (!needsSecondPerson || partnerName);
  const showFullForm      = messages.length === 0 || isDataExpanded;

  // ── Actions ──────────────────────────────────────────────────────
  // Clear only the active feature's chat
  const clearChat = () => {
    ss.del(SK.msgs(selectedFeature));
    setAllMessages(prev => ({ ...prev, [selectedFeature]: [] }));
    setShowClearConfirm(false);
  };

  // Full reset: wipe all messages + user data
  const resetAll = () => {
    ss.clearAllMsgs();
    ss.del(SK.userName);
    ss.del(SK.userBirthdate);
    ss.del(SK.partnerName);
    ss.del(SK.partnerBirthdate);
    const empty = {} as Record<FeatureType, ChatMessage[]>;
    FEATURE_LIST.forEach(f => { empty[f] = []; });
    setAllMessages(empty);
    setUserNameRaw('');
    setUserBirthdateRaw('');
    setPartnerNameRaw('');
    setPartnerBirthdateRaw('');
    setCurrentWeton(null);
    setIsDataExpanded(false);
  };

  // ── Send message ─────────────────────────────────────────────────
  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    if (!userName || !userBirthdate) {
      setMessages(prev => [...prev, { role: 'error', text: 'Mohon isi nama dan tanggal lahir Anda terlebih dahulu di form bagian atas.' }]);
      return;
    }
    if (needsSecondPerson && !partnerName) {
      setMessages(prev => [...prev, { role: 'error', text: 'Mohon isi nama pasangan/rekan untuk fitur ini.' }]);
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputText('');
    setIsLoading(true);
    setIsStreaming(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature:         selectedFeature,
          userName,
          birthdate:       userBirthdate,
          partnerName:     needsSecondPerson ? partnerName     : undefined,
          birthdatePartner:needsSecondPerson ? partnerBirthdate: undefined,
          userMessage:     text,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      setIsLoading(false);
      setIsStreaming(true);

      // Append empty model message; will be filled by streaming chunks
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      const reader  = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            setMessages(prev => {
              const updated = [...prev];
              const lastMsg = updated[updated.length - 1];
              if (lastMsg && lastMsg.role === 'model') {
                lastMsg.text += chunk;
              }
              return updated;
            });
          }
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'error', text: error.message || 'Terjadi kesalahan sistem.' }]);
    } finally {
      setIsStreaming(false);
    }
  };

  // ────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[100dvh] bg-bg-primary border-l border-accent-gold/20 shadow-[-10px_0_30px_rgba(0,0,0,0.15)] relative w-full font-sans">

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-accent-gold/10 bg-bg-primary/80 backdrop-blur-md sticky top-0 z-10 w-full shrink-0">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-[#a89070] hover:text-accent-gold transition-colors rounded-lg hover:bg-accent-gold/8"
              title="Tutup Chat"
            >
              <ArrowLeft className="w-5 h-5 lg:hidden" />
              <X className="w-5 h-5 hidden lg:block" />
            </button>
          )}
          <h2 className="font-display text-lg font-bold text-text-primary">Konsultasi</h2>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[#a89070] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
              title="Bersihkan Chat"
            >
              <Trash2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-xs font-medium hidden sm:inline">Bersihkan</span>
            </button>
          )}
          <button
            onClick={resetAll}
            className="p-2 text-[#a89070] hover:text-[#c9a227] hover:bg-accent-gold/8 rounded-lg transition-all"
            title="Reset semua data &amp; riwayat chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 hide-scrollbar flex flex-col">

        {/* Form and Context Area */}
        <div className="mb-6 space-y-4">
          <FeatureSelector
            selectedFeature={selectedFeature}
            onSelect={setSelectedFeature}
          />

          <AnimatePresence mode="wait">
            {!showFullForm ? (
              <motion.div
                key="summary-form"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white/30 dark:bg-white/5 border border-[#c9a227]/15 rounded-xl p-3.5 mt-2 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#c9a227]/5 dark:hover:bg-white/8 transition-all duration-200"
                onClick={() => setIsDataExpanded(true)}
              >
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] uppercase tracking-wider text-[#a89070] font-bold">
                    Data Konsultasi
                  </div>
                  <div className="text-sm font-medium text-text-primary flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-semibold text-accent-gold">{userName || '—'}</span>
                    {userBirthdate && (
                      <span className="text-text-secondary text-xs">
                        ({formatDisplayDate(userBirthdate)})
                      </span>
                    )}
                    {needsSecondPerson && (
                      <>
                        <span className="text-accent-gold/40 text-xs">|</span>
                        <span className="font-semibold text-accent-amber">{partnerName || '—'}</span>
                        {partnerBirthdate && (
                          <span className="text-text-secondary text-xs">
                            ({formatDisplayDate(partnerBirthdate)})
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-accent-gold hover:text-accent-amber hover:bg-accent-gold/8 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDataExpanded(true);
                  }}
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Ubah</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="full-form"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white/40 dark:bg-white/5 border border-[#c9a227]/20 rounded-xl p-4 mt-2 space-y-4"
              >
                <div className="flex justify-between items-center pb-2 border-b border-[#c9a227]/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#a89070]">
                    Data Diri Konsultasi
                  </span>
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsDataExpanded(false)}
                      className="flex items-center gap-1 text-xs font-bold text-[#a89070] hover:text-accent-gold transition-colors"
                    >
                      <ChevronUp className="w-4 h-4" />
                      Sembunyikan
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#a89070] mb-1">Nama Anda</label>
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-[#c9a227]/40 focus:border-[#c9a227] outline-none py-1.5 text-[#3d1f00] dark:text-[#f5e6c8]"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Budiman"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#a89070] mb-1">Tanggal Lahir</label>
                    <JaweDatePicker
                      value={userBirthdate}
                      onChange={setUserBirthdate}
                      placeholder="Pilih tanggal lahir"
                    />
                  </div>
                </div>

                {needsSecondPerson && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#c9a227]/10"
                  >
                    <div>
                      <label className="block text-xs font-medium text-[#a89070] mb-1">Nama Pasangan / Rekan</label>
                      <input
                        type="text"
                        className="w-full bg-transparent border-b border-[#c9a227]/40 focus:border-[#c9a227] outline-none py-1.5 text-[#3d1f00] dark:text-[#f5e6c8]"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="Siti"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#a89070] mb-1">Tanggal Lahir (Opsional)</label>
                      <JaweDatePicker
                        value={partnerBirthdate}
                        onChange={setPartnerBirthdate}
                        placeholder="Pilih tanggal lahir"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {currentWeton && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center my-4">
              <WetonBadge weton={currentWeton} />
            </motion.div>
          )}

          {/* Suggested Prompts when empty */}
          {messages.length === 0 && isFormComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
              <p className="text-sm text-center text-[#a89070] mb-4">Mulai dengan pertanyaan di bawah ini</p>
              <div className="flex flex-col gap-2">
                {suggestedPrompts[selectedFeature].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="px-4 py-3 rounded-xl border border-[#c9a227]/20 bg-white/30 dark:bg-white/5 hover:bg-[#c9a227]/10 dark:hover:bg-white/10 text-[#3d1f00] dark:text-[#f5e6c8] text-sm text-center transition-all"
                  >
                    &ldquo;{prompt}&rdquo;
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Chat History */}
        <div className="flex flex-col flex-1 pb-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 pt-4 pb-6 mb-4 bg-gradient-to-t from-bg-primary to-transparent sticky bottom-0 shrink-0 w-full">
        <form
          className="relative max-w-4xl mx-auto flex items-center bg-white dark:bg-bg-secondary border border-accent-gold/30 rounded-2xl shadow-lg focus-within:border-accent-gold transition-colors"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
        >
          <input
            type="text"
            className="flex-1 bg-transparent px-4 py-3 outline-none text-text-primary placeholder:text-text-secondary/60"
            placeholder={isFormComplete ? 'Tuliskan pertanyaan Anda di sini...' : 'Lengkapi form data diri untuk memulai...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!isFormComplete || isLoading || isStreaming}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || !isFormComplete || isLoading || isStreaming}
            className="p-2 mr-2 rounded-full bg-accent-amber text-white disabled:opacity-40 hover:bg-accent-amber/80 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Clear Chat Confirmation Dialog */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 16 }}
              transition={{ type: 'spring', bounce: 0.28, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-bg-secondary border border-accent-gold/25 rounded-3xl shadow-2xl shadow-black/40 p-6 flex flex-col gap-5"
            >
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="font-display font-extrabold text-lg text-text-primary">Bersihkan Riwayat Chat?</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Riwayat percakapan pada sesi <span className="text-accent-gold font-semibold">ini</span> akan dihapus permanen.
                  Data diri dan riwayat fitur lain tetap tersimpan.
                </p>
              </div>

              <div className="h-px bg-accent-gold/10" />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-accent-gold/20 text-text-secondary hover:bg-accent-gold/5 hover:border-accent-gold/40 font-bold text-sm transition-all duration-150"
                >
                  Batal
                </button>
                <button
                  onClick={clearChat}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-500/90 hover:bg-red-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Ya, Bersihkan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
