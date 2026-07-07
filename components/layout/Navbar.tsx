"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Github } from "@/components/icons/Github";
import CommandMenu from "@/components/ui/CommandMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setCmdOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <motion.nav
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/80"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-[6px] flex items-center justify-center"
              style={{ background: "var(--accent)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="3" height="3" rx="0.5" fill="var(--background)" />
                <rect x="5.5" y="1" width="3" height="3" rx="0.5" fill="var(--background)" fillOpacity="0.6" />
                <rect x="10" y="1" width="3" height="3" rx="0.5" fill="var(--background)" fillOpacity="0.3" />
                <rect x="1" y="5.5" width="3" height="3" rx="0.5" fill="var(--background)" fillOpacity="0.8" />
                <rect x="5.5" y="5.5" width="3" height="3" rx="0.5" fill="var(--background)" fillOpacity="0.4" />
                <rect x="10" y="5.5" width="3" height="3" rx="0.5" fill="var(--background)" fillOpacity="0.1" />
                <rect x="1" y="10" width="3" height="3" rx="0.5" fill="var(--background)" fillOpacity="0.2" />
                <rect x="5.5" y="10" width="3" height="3" rx="0.5" fill="var(--background)" fillOpacity="0.05" />
              </svg>
            </div>
            <span className="text-foreground font-semibold text-sm tracking-tight">
              Gitmap
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            {/* ⌘K search hint */}
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-muted/80 text-xs font-mono hover:border-accent hover:text-foreground transition-colors mr-2"
            >
              <Search size={11} className="text-muted" />
              <span>Search</span>
              <kbd className="ml-1 bg-card px-1 rounded text-[10px]">⌘K</kbd>
            </button>

            <a
              href="https://github.com/arnabjena007/gitmap"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-card transition-colors"
              aria-label="GitHub"
            >
              <Github size={17} />
            </a>
          </div>
        </div>
      </motion.nav>

      <CommandMenu open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
}
