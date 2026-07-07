"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ChevronDown } from "lucide-react";
import HeatmapGrid from "@/components/heatmap/HeatmapGrid";
import { THEMES, getTheme } from "@/lib/themes";
import { RawContribution, transformRawContributions, generateSeededHeatmapData } from "@/components/heatmap/heatmapUtils";

type DayRange = 90 | 180 | 365;

const RANGE_OPTIONS: { label: string; value: DayRange }[] = [
  { label: "Last 90 days", value: 90 },
  { label: "Last 180 days", value: 180 },
  { label: "Last 365 days", value: 365 },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 cursor-pointer">
      <span className="text-xs text-[#A1A1AA] font-mono">{label}</span>
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#39D353]" : "bg-[#27272A]"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
    </label>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-[#A1A1AA] font-mono">{label}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-6 h-6 rounded border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3f3f46] text-xs transition-colors flex items-center justify-center"
        >
          −
        </button>
        <span className="w-6 text-center text-xs text-[#FAFAFA] font-mono">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-6 h-6 rounded border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3f3f46] text-xs transition-colors flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
}

function SelectDropdown<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-xs text-[#A1A1AA] font-mono">{label}</span>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            const opt = options.find((o) => String(o.value) === raw);
            if (opt) onChange(opt.value);
          }}
          className="appearance-none w-full bg-[#09090B] border border-[#27272A] text-[#FAFAFA] text-xs rounded-lg px-3 py-2 pr-8 cursor-pointer hover:border-[#3f3f46] transition-colors focus:outline-none font-mono"
        >
          {options.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none"
        />
      </div>
    </div>
  );
}

const contributionsCache = new Map<string, RawContribution[]>();

export default function Demo({
  onThemeChange,
}: {
  onThemeChange?: (themeId: string) => void;
}) {
  const [themeId, setThemeId] = useState("github-dark");
  const [range, setRange] = useState<DayRange>(365);
  const [cellSize, setCellSize] = useState(13);
  const [gap, setGap] = useState(3);
  const [rounded, setRounded] = useState(true);
  const [showCounts, setShowCounts] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [username, setUsername] = useState("octocat");
  const [inputVal, setInputVal] = useState("octocat");
  const [key, setKey] = useState(0);

  const [rawContributions, setRawContributions] = useState<RawContribution[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const trimmedUser = username.trim().toLowerCase();
    if (!trimmedUser) return;

    // Check memory cache first
    if (contributionsCache.has(trimmedUser)) {
      setRawContributions(contributionsCache.get(trimmedUser) || []);
      setLoading(false);
      setError(null);
      return;
    }

    async function fetchContributions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${trimmedUser}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch contributions: ${res.statusText}`);
        }
        const data = await res.json();
        if (active) {
          const contribs = data.contributions || [];
          contributionsCache.set(trimmedUser, contribs);
          setRawContributions(contribs);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || "An error occurred");
          setRawContributions(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchContributions();

    return () => {
      active = false;
    };
  }, [username]);

  const computedData = React.useMemo(() => {
    if (!rawContributions) {
      // Instantly generate seeded consistent preview data
      return generateSeededHeatmapData(username, range);
    }
    return transformRawContributions(rawContributions, range);
  }, [rawContributions, username, range]);

  const themeObj = getTheme(themeId);

  const handleLoad = useCallback(() => {
    const trimmed = inputVal.trim();
    if (trimmed) {
      setRawContributions(null);
      setUsername(trimmed);
      setKey((k) => k + 1);
    }
  }, [inputVal]);

  const handleThemeChange = (id: string) => {
    setThemeId(id);
    onThemeChange?.(id);
  };

  return (
    <section id="demo" className="py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-2">Interactive Demo</h2>
          <p className="text-sm text-[#A1A1AA]">
            Fully interactive — adjust controls to see changes in real time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-[#27272A] bg-[#18181B] overflow-hidden"
        >
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3.5 border-b border-[#27272A]">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Range */}
              <div className="relative">
                <select
                  value={range}
                  onChange={(e) => setRange(Number(e.target.value) as DayRange)}
                  className="appearance-none bg-[#09090B] border border-[#27272A] text-[#A1A1AA] text-xs rounded-lg px-3 py-1.5 pr-7 cursor-pointer hover:border-[#3f3f46] hover:text-[#FAFAFA] transition-colors focus:outline-none font-mono"
                >
                  {RANGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={11}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none"
                />
              </div>

              {/* Theme selector */}
              <div className="relative">
                <select
                  value={themeId}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="appearance-none bg-[#09090B] border border-[#27272A] text-[#A1A1AA] text-xs rounded-lg px-3 py-1.5 pr-7 cursor-pointer hover:border-[#3f3f46] hover:text-[#FAFAFA] transition-colors focus:outline-none font-mono"
                >
                  {THEMES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={11}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none"
                />
              </div>
            </div>

            {/* Username + Load */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0 border border-[#27272A] rounded-lg overflow-hidden">
                <span className="px-2 text-xs text-[#52525B] font-mono bg-[#09090B] border-r border-[#27272A] h-full flex items-center py-1.5">
                  @
                </span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLoad()}
                  className="bg-[#09090B] text-xs text-[#FAFAFA] font-mono px-2 py-1.5 w-24 outline-none placeholder:text-[#52525B]"
                  placeholder="username"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLoad}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3f3f46] text-[#FAFAFA] text-xs font-medium transition-colors"
              >
                <RefreshCw size={12} />
                Load
              </motion.button>
            </div>
          </div>

          {/* Heatmap */}
          <div
            className="p-5 sm:p-8 overflow-x-auto"
            style={{ backgroundColor: themeObj.background, transition: "background-color 0.3s" }}
          >
            <div className="mb-3 flex items-center justify-between gap-2 flex-wrap min-h-[24px]">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono"
                  style={{ color: themeObj.textColor ?? "#A1A1AA" }}
                >
                  @{username}&apos;s contributions
                </span>
                {loading && (
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-[#39D353]/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39D353] animate-pulse" />
                    updating...
                  </span>
                )}
              </div>
              {error && (
                <span className="text-[10px] font-mono text-[#52525B]">
                  (using offline preview)
                </span>
              )}
            </div>
            
            <div className="relative">
              <HeatmapGrid
                key={`${key}-${range}`}
                themeObj={themeObj}
                cellSize={cellSize}
                gap={gap}
                shape={rounded ? "rounded" : "sharp"}
                showCounts={showCounts}
                animationEnabled={animationEnabled}
                days={range}
                data={computedData}
              />
            </div>
          </div>

          {/* Live Controls */}
          <div className="border-t border-[#27272A] px-5 py-4">
            <div className="text-[10px] text-[#52525B] font-mono uppercase tracking-wider mb-3">
              Live Controls
            </div>
            <div className="flex flex-wrap gap-6 items-start">
              <Stepper
                label="Cell Size"
                value={cellSize}
                min={8}
                max={20}
                step={1}
                onChange={setCellSize}
              />
              <Stepper
                label="Gap"
                value={gap}
                min={1}
                max={6}
                step={1}
                onChange={setGap}
              />
              <Toggle label="Rounded" checked={rounded} onChange={setRounded} />
              <Toggle label="Show Counts" checked={showCounts} onChange={setShowCounts} />
              <Toggle label="Animation" checked={animationEnabled} onChange={setAnimationEnabled} />
              <SelectDropdown
                label="Theme"
                value={themeId}
                options={THEMES.map((t) => ({ label: t.name, value: t.id }))}
                onChange={handleThemeChange}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
