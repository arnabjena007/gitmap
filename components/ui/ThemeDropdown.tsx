"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { HeatmapTheme, THEMES } from "@/lib/themes";

interface ThemeDropdownProps {
  value: string;
  onChange: (id: string) => void;
}

export default function ThemeDropdown({ value, onChange }: ThemeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTheme = THEMES.find((t) => t.id === value) ?? THEMES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative z-50">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-background border border-border text-xs font-mono text-muted px-3 py-1.5 pr-8 rounded-lg hover:text-foreground hover:border-accent cursor-pointer focus:outline-none transition-colors select-none text-left min-w-[155px]"
      >
        {/* Theme Palette Squares */}
        <div className="flex gap-0.5 flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-[1.5px]" style={{ backgroundColor: selectedTheme.levels[1] }} />
          <span className="w-2.5 h-2.5 rounded-[1.5px]" style={{ backgroundColor: selectedTheme.levels[2] }} />
          <span className="w-2.5 h-2.5 rounded-[1.5px]" style={{ backgroundColor: selectedTheme.levels[3] }} />
          <span className="w-2.5 h-2.5 rounded-[1.5px]" style={{ backgroundColor: selectedTheme.levels[4] }} />
        </div>
        <span className="truncate">{selectedTheme.name}</span>
        <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-52 max-h-64 overflow-y-auto bg-background border border-border rounded-lg shadow-xl p-1.5 focus:outline-none scrollbar-none">
          {THEMES.map((theme) => {
            const isSelected = theme.id === value;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  onChange(theme.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-2 py-1.5 rounded-md text-left text-xs font-mono select-none hover:bg-card hover:text-foreground transition-colors ${
                  isSelected ? "text-foreground bg-card/60" : "text-muted"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {/* Theme Palette Squares */}
                  <div className="flex gap-0.5 flex-shrink-0">
                    <span className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: theme.levels[1] }} />
                    <span className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: theme.levels[2] }} />
                    <span className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: theme.levels[3] }} />
                    <span className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: theme.levels[4] }} />
                  </div>
                  <span className="truncate">{theme.name}</span>
                </div>
                {isSelected && <Check size={11} className="text-accent flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
