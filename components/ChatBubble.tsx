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

function parseInlineMarkdown(text: string): React.ReactNode[] {
  // Regex to match bold (**text** or __text__) and italic (*text* or _text_)
  const inlineRegex = /(\*\*[\s\S]+?\*\*|\*[\s\S]+?\*|__[\s\S]+?__|_[\s\S]+?_)/g;
  const matches = [...text.matchAll(inlineRegex)];

  if (matches.length === 0) {
    return [text];
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, index) => {
    const matchText = match[0];
    const matchIndex = match.index!;

    // Add text before match
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    if (matchText.startsWith('**') && matchText.endsWith('**')) {
      const content = matchText.substring(2, matchText.length - 2);
      parts.push(
        <strong key={index} className="font-bold text-accent-gold dark:text-[#d4af37]">
          {parseInlineMarkdown(content)}
        </strong>
      );
    } else if (matchText.startsWith('__') && matchText.endsWith('__')) {
      const content = matchText.substring(2, matchText.length - 2);
      parts.push(
        <strong key={index} className="font-bold text-accent-gold dark:text-[#d4af37]">
          {parseInlineMarkdown(content)}
        </strong>
      );
    } else if (matchText.startsWith('*') && matchText.endsWith('*')) {
      const content = matchText.substring(1, matchText.length - 1);
      parts.push(
        <em key={index} className="italic text-text-primary/95 dark:text-[#fbeed7]/95">
          {parseInlineMarkdown(content)}
        </em>
      );
    } else if (matchText.startsWith('_') && matchText.endsWith('_')) {
      const content = matchText.substring(1, matchText.length - 1);
      parts.push(
        <em key={index} className="italic text-text-primary/95 dark:text-[#fbeed7]/95">
          {parseInlineMarkdown(content)}
        </em>
      );
    }

    lastIndex = matchIndex + matchText.length;
  });

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

function MarkdownRenderer({ text }: { text: string }) {
  // Normalize newline characters
  const cleanText = text.replace(/\r\n/g, '\n');
  const lines = cleanText.split('\n');

  const blocks: React.ReactNode[] = [];
  let currentListType: 'ul' | 'ol' | null = null;
  let currentListItems: string[] = [];

  const pushCurrentList = (key: string | number) => {
    if (currentListType && currentListItems.length > 0) {
      if (currentListType === 'ul') {
        blocks.push(
          <ul key={`ul-${key}`} className="list-disc pl-5 mb-4 space-y-1.5 text-text-primary dark:text-[#fbeed7] marker:text-accent-gold">
            {currentListItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
      } else {
        blocks.push(
          <ol key={`ol-${key}`} className="list-decimal pl-5 mb-4 space-y-1.5 text-text-primary dark:text-[#fbeed7] marker:text-accent-gold marker:font-semibold">
            {currentListItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
      }
      currentListType = null;
      currentListItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for headings
    const heading3Match = line.match(/^###\s+(.*)$/);
    const heading2Match = line.match(/^##\s+(.*)$/);

    // Check for bullet list item
    const bulletMatch = line.match(/^[-*]\s+(.*)$/);

    // Check for numbered list item
    const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);

    if (heading3Match) {
      pushCurrentList(i);
      blocks.push(
        <h3 key={`h3-${i}`} className="text-sm md:text-base font-bold text-accent-gold dark:text-[#d4af37] mt-4 mb-2 first:mt-0">
          {parseInlineMarkdown(heading3Match[1])}
        </h3>
      );
    } else if (heading2Match) {
      pushCurrentList(i);
      blocks.push(
        <h2 key={`h2-${i}`} className="text-base md:text-lg font-extrabold text-accent-gold dark:text-[#d4af37] mt-5 mb-2 first:mt-0">
          {parseInlineMarkdown(heading2Match[1])}
        </h2>
      );
    } else if (bulletMatch) {
      if (currentListType !== 'ul') {
        pushCurrentList(i);
        currentListType = 'ul';
      }
      currentListItems.push(bulletMatch[1]);
    } else if (numberMatch) {
      if (currentListType !== 'ol') {
        pushCurrentList(i);
        currentListType = 'ol';
      }
      currentListItems.push(numberMatch[2]);
    } else {
      // Regular text line
      if (trimmed === '') {
        pushCurrentList(i);
        continue;
      }

      pushCurrentList(i);
      blocks.push(
        <p key={`p-${i}`} className="mb-4 last:mb-0 leading-relaxed text-text-primary dark:text-[#fbeed7] whitespace-pre-wrap">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  }

  pushCurrentList('tail');

  return <div className="space-y-1">{blocks}</div>;
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
          className="bg-white/5 dark:bg-[#1a0a00]/80 border border-[#c9a227]/20 text-[#3d1f00] dark:text-[#f5e6c8] px-4.5 py-4 rounded-2xl rounded-tl-sm w-full"
        >
          <div className="prose prose-sm md:prose-base dark:prose-invert prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0">
            <MarkdownRenderer text={message.text} />
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
