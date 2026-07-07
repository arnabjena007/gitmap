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
            <img
              src="/icon.png"
              alt="Gitmap logo"
              width={24}
              height={24}
              className="rounded-[6px]"
            />
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
