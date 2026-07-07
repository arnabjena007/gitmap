"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, ChevronDown } from "lucide-react";

interface CodeBlockProps {
  code?: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  
  // Custom multi-language support matching the screenshot layout
  languages?: {
    id: "tsx" | "js";
    label: string;
    code: string;
  }[];
}

const TSIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-sm"
  >
    <rect width="100" height="100" fill="#3178C6" />
    <text
      x="90"
      y="82"
      fill="white"
      fontSize="42"
      fontFamily="sans-serif"
      fontWeight="bold"
      textAnchor="end"
    >
      TS
    </text>
  </svg>
);

const JSIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="rounded-sm"
  >
    <rect width="100" height="100" fill="#F7DF1E" />
    <text
      x="90"
      y="82"
      fill="black"
      fontSize="42"
      fontFamily="sans-serif"
      fontWeight="bold"
      textAnchor="end"
    >
      JS
    </text>
  </svg>
);

// Safe, placeholder-based syntax highlighting
function highlight(code: string, lang: string): string {
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (lang === "bash" || lang === "sh") {
    return escaped
      .replace(/^(\$\s)/gm, '<span class="text-muted">$1</span>')
      .replace(/(pnpm|npm|npx|bun|yarn)/g, '<span class="text-accent">$1</span>')
      .replace(/(add|install|run|create)/g, '<span class="text-foreground/80">$1</span>');
  }

  if (lang === "tsx" || lang === "typescript" || lang === "jsx" || lang === "css" || lang === "html") {
    const strings: string[] = [];
    const comments: string[] = [];

    // Extract strings
    let temp = escaped.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, (match) => {
      strings.push(match);
      return `__STR_PLACEHOLDER_${strings.length - 1}__`;
    });

    // Extract comments
    temp = temp.replace(/(\/\/.*|\/\*[\s\S]*?\*\/|\<!--[\s\S]*?--\>)/g, (match) => {
      comments.push(match);
      return `__COM_PLACEHOLDER_${comments.length - 1}__`;
    });

    // Highlight keywords
    temp = temp.replace(
      /\b(import|export|from|const|let|var|function|return|default|type|interface|extends|implements|class|new|if|else|for|while|async|await)\b/g,
      '<span style="color: var(--syntax-keyword)">$1</span>'
    );

    // Highlight types / values
    temp = temp.replace(
      /\b(true|false|null|undefined|number|string|boolean|void)\b/g,
      '<span style="color: var(--syntax-type)">$1</span>'
    );

    // Highlight library names/hooks
    temp = temp.replace(
      /\b(React|useState|useEffect|useRef|useMemo|useCallback|Gitmap|App)\b/g,
      '<span style="color: var(--syntax-type)">$1</span>'
    );

    // Highlight TSX/JSX tag names (e.g. Gitmap or div) but keep brackets <, >, / neutral
    temp = temp.replace(
      /(&lt;\/??)([a-zA-Z][a-zA-Z0-9]*)/g,
      '$1<span style="color: var(--syntax-tag)">$2</span>'
    );

    // Restore comments
    temp = temp.replace(/__COM_PLACEHOLDER_(\d+)__/g, (_, index) => {
      return `<span style="color: var(--syntax-comment)">${comments[parseInt(index, 10)]}</span>`;
    });

    // Restore strings
    temp = temp.replace(/__STR_PLACEHOLDER_(\d+)__/g, (_, index) => {
      return `<span style="color: var(--syntax-string)">${strings[parseInt(index, 10)]}</span>`;
    });

    return temp;
  }

  return escaped;
}

export default function CodeBlock({
  code = "",
  language = "tsx",
  className = "",
  showLineNumbers = false,
  languages,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [selectedLangId, setSelectedLangId] = useState<"tsx" | "js">("tsx");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasMultiLang = languages && languages.length > 0;
  
  // Resolve active code & active highlight language
  const activeCode = hasMultiLang
    ? languages.find((l) => l.id === selectedLangId)?.code || ""
    : code;
  const activeLang = hasMultiLang
    ? (selectedLangId === "tsx" ? "tsx" : "html")
    : language;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlighted = highlight(activeCode, activeLang);
  const lines = highlighted.split("\n");

  return (
    <div
      className={`relative group rounded-xl border border-border bg-background overflow-hidden ${className}`}
    >
      {/* Code Block Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        {/* Left Badge */}
        <span className="text-[10px] text-muted font-mono uppercase tracking-widest">
          {hasMultiLang ? "Embed Code" : language}
        </span>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Copy Button */}
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-6 h-6 rounded text-muted hover:text-foreground transition-colors"
            title="Copy code to clipboard"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-[#39D353]"
                >
                  <Check size={13} />
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Copy size={13} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Language Switch Dropdown */}
          {hasMultiLang && (
            <div className="relative flex items-center border-l border-border pl-3" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 py-0.5 px-1.5 hover:bg-background/80 rounded border border-border/50 transition-colors"
              >
                {selectedLangId === "tsx" ? <TSIcon size={13} /> : <JSIcon size={13} />}
                <ChevronDown size={10} className="text-muted" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-44 backdrop-blur-md bg-background/95 border border-border rounded-lg shadow-2xl p-1 z-50 flex flex-col gap-0.5"
                  >
                    <button
                      onClick={() => {
                        setSelectedLangId("tsx");
                        setDropdownOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-mono text-left w-full transition-colors ${
                        selectedLangId === "tsx"
                          ? "bg-accent/10 text-accent font-semibold"
                          : "text-muted hover:text-foreground hover:bg-card/45"
                      }`}
                    >
                      <TSIcon size={14} />
                      <span>TypeScript (.tsx)</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLangId("js");
                        setDropdownOpen(false);
                      }}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-mono text-left w-full transition-colors ${
                        selectedLangId === "js"
                          ? "bg-accent/10 text-accent font-semibold"
                          : "text-muted hover:text-foreground hover:bg-card/45"
                      }`}
                    >
                      <JSIcon size={14} />
                      <span>JavaScript (.jsx)</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="select-none text-[#3f3f46] w-8 shrink-0 text-right mr-4 text-xs">
                    {i + 1}
                  </span>
                )}
                <span
                  dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
                  className="text-[#e6edf3]"
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
