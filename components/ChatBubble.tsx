import React from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { ChatMessage } from '@/types';
import { motion, AnimatePresence } from 'motion/react';

interface ChatBubbleProps {
  message: ChatMessage;
}

// Reusable toast alert for "copied" feedback
function CopiedToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, y: 4, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.9 }}
          transition={{ duration: 0.18 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-accent-gold text-[#0a0400] text-[11px] font-bold px-2.5 py-1 shadow-lg pointer-events-none z-50"
        >
          ✓ Disalin!
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// Reusable copy button
function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`relative ${className ?? ''}`}>
      <CopiedToast show={copied} />
      <button
        onClick={handleCopy}
        aria-label="Salin pesan"
        className="p-1.5 rounded-lg transition-all duration-150 hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 text-text-secondary/60 hover:text-text-secondary"
      >
        {copied
          ? <Check className="w-3.5 h-3.5 text-green-500" />
          : <Copy className="w-3.5 h-3.5" />
        }
      </button>
    </div>
  );
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  if (isUser) {
    return (
      <div className="flex justify-end w-full mb-4 group">
        <div className="flex items-end gap-1.5 max-w-[85%]">
          {/* Copy button appears to the left of the user bubble */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 mb-1">
            <CopyButton text={message.text} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#cc6600] text-[#fdf5e6] px-4 py-3 rounded-2xl rounded-tr-sm shadow-md"
          >
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-start w-full mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[85%] bg-red-950/40 border border-red-500/30 text-red-200 px-4 py-3 rounded-2xl rounded-tl-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 mt-0.5 text-red-400 shrink-0" />
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </motion.div>
      </div>
    );
  }

  // Model response
  return (
    <div className="flex justify-start w-full mb-4 group">
      <div className="flex items-end gap-1.5 max-w-[85%]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 dark:bg-[#1a0a00]/80 border border-[#c9a227]/20 text-[#3d1f00] dark:text-[#f5e6c8] px-4 py-4 rounded-2xl rounded-tl-sm"
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0">
            {message.text.split('\\n\\n').map((paragraph, i) => (
              <p key={i} className="whitespace-pre-wrap">{paragraph}</p>
            ))}
          </div>
        </motion.div>
        {/* Copy button appears to the right of the AI bubble */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0 mb-1">
          <CopyButton text={message.text} />
        </div>
      </div>
    </div>
  );
}
