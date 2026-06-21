import React from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { ChatMessage } from '@/types';
import { motion } from 'motion/react';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end w-full mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[85%] bg-[#cc6600] text-[#fdf5e6] px-4 py-3 rounded-2xl rounded-tr-sm shadow-md"
        >
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </motion.div>
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
    <div className="flex justify-start w-full mb-4 group relative">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[85%] bg-white/5 dark:bg-[#1a0a00]/80 border border-[#c9a227]/20 text-[#3d1f00] dark:text-[#f5e6c8] px-4 py-4 rounded-2xl rounded-tl-sm relative"
      >
        <div className="prose prose-sm md:prose-base dark:prose-invert prose-p:leading-relaxed prose-p:mb-4 pb-2 last:prose-p:mb-0">
          {message.text.split('\\n\\n').map((paragraph, i) => (
            <p key={i} className="whitespace-pre-wrap">{paragraph}</p>
          ))}
        </div>
        
        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          className="absolute -right-12 bottom-2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[#a89070] opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Copy message"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </motion.div>
    </div>
  );
}
