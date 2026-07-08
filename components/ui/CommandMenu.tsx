"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Package, BookOpen, Code2, Palette } from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandMenu({ open, onClose }: CommandMenuProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const items: CommandItem[] = [
    {
      id: "installation",
      label: "Installation",
      description: "Get started with gitmap",
      icon: <Package size={16} />,
      action: () => {
        document.getElementById("installation")?.scrollIntoView({ behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "quickstart",
      label: "Quick Start",
      description: "Your first heatmap in 60 seconds",
      icon: <Code2 size={16} />,
      action: () => {
        document.getElementById("quickstart")?.scrollIntoView({ behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "themes",
      label: "Themes",
      description: "GitHub, Dracula, Tokyo Night, and more",
      icon: <Palette size={16} />,
      action: () => {
        document.getElementById("themes")?.scrollIntoView({ behavior: "smooth" });
        onClose();
      },
    },
    {
      id: "api",
      label: "API Reference",
      description: "Full props documentation",
      icon: <BookOpen size={16} />,
      action: () => {
        document.getElementById("api")?.scrollIntoView({ behavior: "smooth" });
        onClose();
      },
    },
  ];

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setSelected((s) => Math.min(s + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
      if (e.key === "Enter") filtered[selected]?.action();
    },
    [open, onClose, filtered, selected]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setSelected(0);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#27272A]">
                <Search size={16} className="text-[#A1A1AA] shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search documentation..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelected(0);
                  }}
                  className="flex-1 bg-transparent text-sm text-[#FAFAFA] placeholder:text-[#52525B] outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-[#A1A1AA] hover:text-[#FAFAFA]">
                    <X size={14} />
                  </button>
                )}
                <kbd className="text-[10px] bg-[#27272A] text-[#A1A1AA] px-1.5 py-0.5 rounded border border-[#3f3f46] font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="p-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-[#A1A1AA]">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  filtered.map((item, i) => (
                    <motion.button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelected(i)}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        selected === i
                          ? "bg-[#27272A] text-[#FAFAFA]"
                          : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                      }`}
                    >
                      <span className={selected === i ? "text-[#39D353]" : "text-[#52525B]"}>
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-[#52525B] truncate">{item.description}</div>
                        )}
                      </div>
                      <ArrowRight size={12} className="opacity-40 shrink-0" />
                    </motion.button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-[#27272A] px-4 py-2 flex gap-4 text-[10px] text-[#52525B] font-mono">
                <span><kbd className="font-sans">↑↓</kbd> navigate</span>
                <span><kbd className="font-sans">↵</kbd> open</span>
                <span><kbd className="font-sans">ESC</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
