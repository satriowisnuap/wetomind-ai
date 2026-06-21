import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, FeatureType, WetonData } from '@/types';
import { getWeton } from '@/lib/javaCalendar';
import { FeatureSelector } from './FeatureSelector';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import { WetonBadge } from './WetonBadge';
import { JaweDatePicker } from './ui/JaweDatePicker';
import { RefreshCw, Send, Trash2, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatPanelProps {
  onClose?: () => void;
  initialUserName?: string;
  initialUserBirthdate?: string;
}

const suggestedPrompts: Record<FeatureType, string[]> = {
  BEDAH_KARAKTER: ['Apa kelebihan utamaku?', 'Apa watak tersembunyi saya?'],
  KOMPAS_KARIR: ['Pekerjaan apa yang cocok untukku?', 'Bagaimana cara terbaikku mencari rezeki?'],
  PETA_PERBAIKAN: ['Apa tantangan hidup terbesarku?', 'Bagaimana cara mengelola emosi?'],
  UJI_JODOH: ['Bagaimana kecocokan asmara kami?', 'Apa yang harus dijaga agar hubungan langgeng?'],
  SINERGI_REKAN: ['Bagaimana potensi bisnis kami berdua?', 'Apa pembagian peran yang ideal?'],
};

export function ChatPanel({ onClose, initialUserName = '', initialUserBirthdate = '' }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const [selectedFeature, setSelectedFeature] = useState<FeatureType>('BEDAH_KARAKTER');
  
  // User Data
  const [userName, setUserName] = useState(initialUserName);
  const [userBirthdate, setUserBirthdate] = useState(initialUserBirthdate);

  useEffect(() => {
    if (initialUserName) {
      setUserName(initialUserName);
    }
  }, [initialUserName]);

  useEffect(() => {
    if (initialUserBirthdate) {
      setUserBirthdate(initialUserBirthdate);
    }
  }, [initialUserBirthdate]);
  const [currentWeton, setCurrentWeton] = useState<WetonData | null>(null);
  
  // Partner Data
  const [partnerName, setPartnerName] = useState('');
  const [partnerBirthdate, setPartnerBirthdate] = useState('');

  const [inputText, setInputText] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update Weton immediately when birthdate changes for UI indication
  useEffect(() => {
    if (userBirthdate && userBirthdate.length === 10) {
      try {
        const weton = getWeton(userBirthdate);
        setCurrentWeton(weton);
      } catch (e) {
        setCurrentWeton(null);
      }
    } else {
      setCurrentWeton(null);
    }
  }, [userBirthdate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, currentWeton]);

  const needsSecondPerson = selectedFeature === 'UJI_JODOH' || selectedFeature === 'SINERGI_REKAN';

  const clearChat = () => {
    setMessages([]);
  };

  const resetAll = () => {
    setMessages([]);
    setUserName('');
    setUserBirthdate('');
    setPartnerName('');
    setPartnerBirthdate('');
    setCurrentWeton(null);
  };

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

    const newMessage: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);
    setIsStreaming(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feature: selectedFeature,
          userName,
          birthdate: userBirthdate,
          partnerName: needsSecondPerson ? partnerName : undefined,
          birthdatePartner: needsSecondPerson ? partnerBirthdate : undefined,
          userMessage: text,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      setIsLoading(false);
      setIsStreaming(true);
      
      const aiMessageIndex = messages.length + 1; // messages updated in next tick
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      const reader = response.body?.getReader();
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

  const isFormComplete = userName && userBirthdate && (!needsSecondPerson || partnerName);

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
            <button onClick={clearChat} className="p-2 text-[#a89070] hover:text-red-500 transition-colors" title="Bersihkan Chat">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={resetAll} className="p-2 text-[#a89070] hover:text-[#c9a227] transition-colors" title="Ganti Data Diri">
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
            onSelect={(feat) => {
              setSelectedFeature(feat);
              setMessages([]); // clear chat on switch
            }}
          />

          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/40 dark:bg-white/5 border border-[#c9a227]/20 rounded-xl p-4 mt-2 space-y-4"
              >
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
                    "{prompt}"
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
      <div className="p-4 bg-gradient-to-t from-bg-primary to-transparent sticky bottom-0 shrink-0 w-full mb-safe">
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
            placeholder={isFormComplete ? "Tuliskan pertanyaan Anda di sini..." : "Lengkapi form data diri untuk memulai..."}
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

    </div>
  );
}
