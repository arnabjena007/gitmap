"use client";

import React, { useState, useCallback, useEffect } from "react";
import { ChevronDown, RefreshCw, SlidersHorizontal, Code, Sparkles } from "lucide-react";
import HeatmapGrid from "@/components/heatmap/HeatmapGrid";
import { THEMES, getTheme } from "@/lib/themes";
import { RawContribution, transformRawContributions, generateSeededHeatmapData } from "@/components/heatmap/heatmapUtils";
import CodeBlock from "@/components/ui/CodeBlock";
import ThemeDropdown from "@/components/ui/ThemeDropdown";

type DayRange = 90 | 180 | 365;

const contributionsCache = new Map<string, RawContribution[]>();

interface PageColors {
  pageBg: string;
  panelBg: string;
  borderColor: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
}

interface SyntaxColors {
  keyword: string;
  string: string;
  type: string;
  tag: string;
  comment: string;
}

function getSyntaxColors(themeId: string, accent: string): SyntaxColors {
  if (themeId === "default-dark") {
    return {
      keyword: "#ff7b72",
      string: "#a5d6ff",
      type: "#79c0ff",
      tag: "#7ee787",
      comment: "#6e7681",
    };
  }
  switch (themeId) {
    case "cherry":
      return { keyword: "#FF8A9A", string: "#FFCCD3", type: "#FCA5A5", tag: "#E11D48", comment: "#8E6A70" };
    case "mint":
      return { keyword: "#5EEAD4", string: "#D1FAE5", type: "#6EE7B7", tag: "#4DA393", comment: "#6B8580" };
    case "coral":
      return { keyword: "#FDBA74", string: "#FFEDD5", type: "#FCA5A5", tag: "#EA580C", comment: "#8F726B" };
    case "slate":
      return { keyword: "#93C5FD", string: "#EFF6FF", type: "#BFDBFE", tag: "#8CA7CF", comment: "#6B7280" };
    case "gold":
      return { keyword: "#FDE047", string: "#FEF9C3", type: "#F59E0B", tag: "#B89344", comment: "#857D73" };
    case "neon":
      return { keyword: "#22D3EE", string: "#ECFEFF", type: "#67E8F9", tag: "#00D0E0", comment: "#537075" };
    case "rose":
      return { keyword: "#F472B6", string: "#FCE7F3", type: "#F472B6", tag: "#DB2777", comment: "#8F6B79" };
    case "ocean":
      return { keyword: "#60A5FA", string: "#DBEAFE", type: "#93C5FD", tag: "#3295db", comment: "#5E7185" };
    case "forest":
      return { keyword: "#86EFAC", string: "#DCFCE7", type: "#86EFAC", tag: "#5a9a68", comment: "#647568" };
    case "lavender":
      return { keyword: "#C084FC", string: "#F3E8FF", type: "#C084FC", tag: "#765c9e", comment: "#786E85" };
    case "amber":
      return { keyword: "#FCD34D", string: "#FEF3C7", type: "#F59E0B", tag: "#9e7432", comment: "#857B70" };
    case "sunset":
      return { keyword: "#FDBA74", string: "#FFEDD5", type: "#FCA5A5", tag: "#d6613c", comment: "#8F726B" };
    case "cyberpunk":
      return { keyword: "#FF007F", string: "#FFFFFF", type: "#00FFFF", tag: "#FFFF00", comment: "#6E6E6E" };
    default:
      if (themeId.startsWith("random-")) {
        const match = accent.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (match) {
          const h = match[1];
          const s = match[2];
          return {
            keyword: `hsl(${h}, ${s}%, 70%)`,
            string: `hsl(${h}, 30%, 88%)`,
            type: `hsl(${h}, 60%, 78%)`,
            tag: `hsl(${h}, ${s}%, 60%)`,
            comment: `hsl(${h}, 15%, 50%)`,
          };
        }
      }
      return {
        keyword: "#ff7b72",
        string: "#a5d6ff",
        type: "#79c0ff",
        tag: "#7ee787",
        comment: "#6e7681",
      };
  }
}

function getPageColors(themeId: string, randomColors?: PageColors | null): PageColors {
  if (themeId.startsWith("random-") && randomColors) {
    return randomColors;
  }
  switch (themeId) {

    case "cherry":
      return {
        pageBg: "#140b0d",
        panelBg: "#1C1113",
        borderColor: "#331c21",
        textColor: "#ffeff2",
        mutedTextColor: "#9e757c",
        accentColor: "#e31e3d",
      };
    case "mint":
      return {
        pageBg: "#0b1413",
        panelBg: "#111D1C",
        borderColor: "#1f3633",
        textColor: "#eefaf7",
        mutedTextColor: "#769c95",
        accentColor: "#4DA393",
      };
    case "coral":
      return {
        pageBg: "#160c09",
        panelBg: "#21130E",
        borderColor: "#3c241c",
        textColor: "#fff0eb",
        mutedTextColor: "#a37a6d",
        accentColor: "#CF644C",
      };
    case "slate":
      return {
        pageBg: "#0e1115",
        panelBg: "#161A22",
        borderColor: "#263040",
        textColor: "#f0f4fa",
        mutedTextColor: "#7b8fa8",
        accentColor: "#8CA7CF",
      };
    case "gold":
      return {
        pageBg: "#14110e",
        panelBg: "#1D1813",
        borderColor: "#362d22",
        textColor: "#faf6ee",
        mutedTextColor: "#9c8973",
        accentColor: "#B89344",
      };
    case "neon":
      return {
        pageBg: "#050e10",
        panelBg: "#0B1A1D",
        borderColor: "#17373d",
        textColor: "#e6fcfc",
        mutedTextColor: "#5e8b91",
        accentColor: "#00D0E0",
      };
    case "rose":
      return {
        pageBg: "#150a0d",
        panelBg: "#211116",
        borderColor: "#3d1d27",
        textColor: "#ffeff3",
        mutedTextColor: "#a37584",
        accentColor: "#D64775",
      };
    case "ocean":
      return {
        pageBg: "#060b11",
        panelBg: "#09121c",
        borderColor: "#14283d",
        textColor: "#e6f3ff",
        mutedTextColor: "#7399bf",
        accentColor: "#3295db",
      };
    case "forest":
      return {
        pageBg: "#080c09",
        panelBg: "#0d140e",
        borderColor: "#19281b",
        textColor: "#edf5ee",
        mutedTextColor: "#7ca381",
        accentColor: "#5a9a68",
      };
    case "lavender":
      return {
        pageBg: "#0b080f",
        panelBg: "#120e17",
        borderColor: "#221a2c",
        textColor: "#f6f3fa",
        mutedTextColor: "#927fa8",
        accentColor: "#765c9e",
      };
    case "amber":
      return {
        pageBg: "#0c0a07",
        panelBg: "#14100b",
        borderColor: "#261f15",
        textColor: "#faf6f0",
        mutedTextColor: "#a8947c",
        accentColor: "#9e7432",
      };
    case "sunset":
      return {
        pageBg: "#0c0609",
        panelBg: "#140b10",
        borderColor: "#26151e",
        textColor: "#fff2f5",
        mutedTextColor: "#aa7a8f",
        accentColor: "#d6613c",
      };
    case "cyberpunk":
      return {
        pageBg: "#050608",
        panelBg: "#0b0c10",
        borderColor: "#1f2833",
        textColor: "#e6e6e6",
        mutedTextColor: "#808080",
        accentColor: "#ff007f",
      };
    case "default-dark":
    default:
      return {
        pageBg: "#09090B",
        panelBg: "#161B22",
        borderColor: "#30363D",
        textColor: "#C9D1D9",
        mutedTextColor: "#8B949E",
        accentColor: "#39D353",
      };
  }
}

export default function Home() {
  const [themeId, setThemeId] = useState("default-dark");

  const handleThemeChange = useCallback((id: string) => {
    setThemeId(id);
  }, []);

  const [range, setRange] = useState<DayRange>(365);
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close range dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rangeDropdownRef.current && !rangeDropdownRef.current.contains(e.target as Node)) {
        setRangeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [sizeMode, setSizeMode] = useState<"small" | "medium" | "large">("medium");
  const [sizeOpen, setSizeOpen] = useState(false);
  const sizeRef = React.useRef<HTMLDivElement>(null);

  const cellSize = sizeMode === "small" ? 9 : sizeMode === "large" ? 15 : 12;
  const gap = sizeMode === "small" ? 2 : sizeMode === "large" ? 4 : 3;

  const [shape, setShape] = useState<"sharp" | "rounded" | "circle">("rounded");
  const [shapeOpen, setShapeOpen] = useState(false);
  const shapeRef = React.useRef<HTMLDivElement>(null);

  // Close size/shape dropdowns on outside click
  React.useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) setSizeOpen(false);
      if (shapeRef.current && !shapeRef.current.contains(e.target as Node)) setShapeOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const [showNumbers, setShowNumbers] = useState(false);
  const [useGradient, setUseGradient] = useState(false);
  const [showCounts, setShowCounts] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customTheme, setCustomTheme] = useState<any | null>(null);
  const [randomPageColors, setRandomPageColors] = useState<PageColors | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const colors = getPageColors(themeId, randomPageColors);
    root.style.setProperty("--background", colors.pageBg);
    root.style.setProperty("--card", colors.panelBg);
    root.style.setProperty("--border", colors.borderColor);
    root.style.setProperty("--foreground", colors.textColor);
    root.style.setProperty("--muted", colors.mutedTextColor);
    root.style.setProperty("--accent", colors.accentColor);

    const sColors = getSyntaxColors(themeId, colors.accentColor);
    root.style.setProperty("--syntax-keyword", sColors.keyword);
    root.style.setProperty("--syntax-string", sColors.string);
    root.style.setProperty("--syntax-type", sColors.type);
    root.style.setProperty("--syntax-tag", sColors.tag);
    root.style.setProperty("--syntax-comment", sColors.comment);

    root.classList.remove("light");
    root.classList.add("dark");
  }, [themeId, randomPageColors]);

  const [username, setUsername] = useState("torvalds");
  const [inputVal, setInputVal] = useState("torvalds");
  const [key, setKey] = useState(0);

  const [rawContributions, setRawContributions] = useState<RawContribution[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const trimmedUser = username.trim().toLowerCase();
    if (!trimmedUser) return;

    if (contributionsCache.has(trimmedUser)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
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
      return generateSeededHeatmapData(username, range);
    }
    return transformRawContributions(rawContributions, range);
  }, [rawContributions, username, range]);

  const stats = React.useMemo(() => {
    const days = computedData.flatMap((w) => w.days).filter((d): d is NonNullable<typeof d> => d !== null);
    const sorted = [...days].sort((a, b) => a.date.getTime() - b.date.getTime());

    const total = sorted.reduce((s, d) => s + d.count, 0);

    // Current streak (from today backwards)
    let currentStreak = 0;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].count > 0) currentStreak++;
      else break;
    }

    // Longest streak
    let longest = 0, run = 0;
    for (const d of sorted) {
      if (d.count > 0) { run++; longest = Math.max(longest, run); }
      else run = 0;
    }

    // Busiest day
    const busiest = sorted.reduce((best, d) => d.count > best.count ? d : best, sorted[0]);
    const busiestLabel = busiest && busiest.count > 0
      ? busiest.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "—";

    return { total, currentStreak, longest, busiestLabel, busiestCount: busiest?.count ?? 0 };
  }, [computedData]);

  const themeObj = customTheme && themeId === customTheme.id
    ? customTheme
    : getTheme(themeId);

  const handleRandomizeTheme = useCallback(() => {
    const h = Math.floor(Math.random() * 360);
    const s = 70 + Math.floor(Math.random() * 25);
    const randomId = `random-${Date.now()}`;

    // Get a human-readable name for the hue
    let colorName = "Crimson";
    if (h >= 15 && h < 45) colorName = "Amber";
    else if (h >= 45 && h < 75) colorName = "Gold";
    else if (h >= 75 && h < 150) colorName = "Emerald";
    else if (h >= 150 && h < 195) colorName = "Cyan";
    else if (h >= 195 && h < 255) colorName = "Sapphire";
    else if (h >= 255 && h < 285) colorName = "Amethyst";
    else if (h >= 285 && h < 330) colorName = "Magenta";

    const randomThemeObj = {
      id: randomId,
      name: colorName,
      background: `hsl(${h}, 25%, 5%)`,
      levels: [
        `hsl(${h}, 18%, 10%)`,
        `hsl(${h}, ${s}%, 22%)`,
        `hsl(${h}, ${s}%, 38%)`,
        `hsl(${h}, ${s}%, 54%)`,
        `hsl(${h}, ${s}%, 70%)`
      ]
    };

    const randomColors = {
      pageBg: `hsl(${h}, 25%, 5%)`,
      panelBg: `hsl(${h}, 20%, 8%)`,
      borderColor: `hsl(${h}, 20%, 13%)`,
      textColor: `hsl(${h}, 30%, 94%)`,
      mutedTextColor: `hsl(${h}, 15%, 55%)`,
      accentColor: `hsl(${h}, ${s}%, 54%)`
    };

    setCustomTheme(randomThemeObj);
    setRandomPageColors(randomColors);
    setThemeId(randomId);
  }, []);



  const handleLoad = useCallback(() => {
    const trimmed = inputVal.trim();
    if (trimmed) {
      setRawContributions(null);
      setUsername(trimmed);
      setKey((k) => k + 1);
    }
  }, [inputVal]);

  const themeVal = themeId.startsWith("random-") && customTheme
    ? `{
    level0: "${customTheme.levels[0]}",
    level1: "${customTheme.levels[1]}",
    level2: "${customTheme.levels[2]}",
    level3: "${customTheme.levels[3]}",
    level4: "${customTheme.levels[4]}"
  }`
    : `"${themeId}"`;

  const usageCode = `import { Gitmap, useGitmapStats } from '@arnabjena007/gitmap';

export default function App() {
  const stats = useGitmapStats("${username}");

  return (
    <div>
      <Gitmap
        username="${username}"
        theme={${themeVal}}
        cellSize={${cellSize}}
        gap={${gap}}
        shape="${shape}"
        showNumbers={${showNumbers}}
        useGradient={${useGradient}}
      />

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
        <div><small>Total</small><strong>{stats.total}</strong></div>
        <div><small>Current Streak</small><strong>{stats.currentStreak}d</strong></div>
        <div><small>Longest Streak</small><strong>{stats.longestStreak}d</strong></div>
        <div><small>Busiest Day</small><strong>{stats.busiestDay}</strong></div>
      </div>
    </div>
  );
}`;

  const jsEmbedCode = `<!-- Target elements for Gitmap -->
<div id="gitmap-heatmap"></div>
<div id="gitmap-stats" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:16px"></div>

<!-- Load UMD Script from CDN -->
<script src="https://unpkg.com/@arnabjena007/gitmap@latest/dist/index.umd.js"></script>

<!-- Render Heatmap + Stats -->
<script>
  Gitmap.render("#gitmap-heatmap", {
    username: "${username}",
    theme: ${themeVal},
    cellSize: ${cellSize},
    gap: ${gap},
    shape: "${shape}",
    showNumbers: ${showNumbers},
    useGradient: ${useGradient},
    onStats: function(stats) {
      document.getElementById("gitmap-stats").innerHTML = [
        ["Total", stats.total],
        ["Current Streak", stats.currentStreak + "d"],
        ["Longest Streak", stats.longestStreak + "d"],
        ["Busiest Day", stats.busiestDay]
      ].map(function(s) {
        return '<div><small>' + s[0] + '</small><br><strong>' + s[1] + '</strong></div>';
      }).join("");
    }
  });
</script>`;

  const cssCode = `.custom-theme {
  --gitmap-level-0: #161b22;
  --gitmap-level-1: #0e4429;
  --gitmap-level-2: #006d32;
  --gitmap-level-3: #26a641;
  --gitmap-level-4: #39d353;
}`;

  const staticThemeCode = `const customTheme = {
  level0: "#161b22",
  level1: "#0e4429",
  level2: "#006d32",
  level3: "#26a641",
  level4: "#39d353",
};`;

  const customizationCode = `const customTheme = {
  level0: "#1b1f23",
  level1: "#132b43",
  level2: "#194a7a",
  level3: "#1d6cb0",
  level4: "#2190e3",
};

export default function App() {
  return (
    <Gitmap
      username="arnab-jena"
      theme={customTheme}
      cellSize={14}
      gap={4}
      shape="sharp"
      showNumbers={false}
      useGradient={true}
    />
  );
}`;

  return (
    <div className="max-w-[840px] mx-auto px-6 py-12 md:py-24 text-foreground">
      {/* Intro Header */}
      <header className="mb-10 text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2 lowercase" style={{ fontFamily: "var(--font-geist-sans)" }}>
          gitmap
        </h1>
        <p className="text-base text-muted leading-relaxed">
          a react component for visualizing github contributions and heatmap
        </p>
      </header>

      {/* Main Interactive Heatmap */}
      <section className="mb-14 select-none">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-2 select-none border-b border-border/30">
          <div className="flex flex-wrap items-center gap-3">
            {/* Range dropdown — custom to avoid OS-blue highlight */}
            <div className="relative" ref={rangeDropdownRef}>
              <button
                type="button"
                onClick={() => setRangeOpen(!rangeOpen)}
                className="flex items-center gap-2 appearance-none bg-card border border-border text-xs font-mono text-muted px-3 py-1.5 pr-7 rounded-lg hover:text-foreground hover:border-accent cursor-pointer focus:outline-none transition-colors"
              >
                Last {range} days
              </button>
              <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              {rangeOpen && (
                <div className="absolute left-0 mt-1 w-36 bg-card border border-border rounded-lg shadow-xl p-1 z-50 scrollbar-none">
                  {([90, 180, 365] as DayRange[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setRange(r); setRangeOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors ${range === r
                          ? "text-accent bg-accent/10 font-semibold"
                          : "text-muted hover:text-foreground hover:bg-background/60"
                        }`}
                    >
                      Last {r} days
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme selector */}
            <ThemeDropdown value={themeId} customTheme={customTheme} onChange={handleThemeChange} />

            {/* Randomize Button */}
            <button
              onClick={handleRandomizeTheme}
              className="p-1.5 rounded-lg border border-border bg-card text-muted hover:text-foreground hover:border-accent transition-colors flex items-center gap-1.5 text-xs font-mono"
              title="Generate a random dynamic HSL palette"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>Randomize</span>
            </button>
          </div>

          {/* Clean Username Input and Settings toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center text-xs font-mono">
              <span className="text-muted/65 mr-1">@</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLoad()}
                className="bg-transparent border-b border-border hover:border-accent focus:border-accent text-foreground py-1 w-28 outline-none placeholder:text-muted/40 transition-colors"
                placeholder="username"
              />
              <button
                onClick={handleLoad}
                className="ml-2 px-2.5 py-1 bg-card text-muted hover:text-foreground border border-border hover:border-accent rounded-lg transition-colors"
              >
                &rarr;
              </button>
            </div>
            {loading && (
              <span className="text-[10px] font-mono text-accent animate-pulse">
                loading...
              </span>
            )}

            {/* Settings Toggle */}
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowExport(false);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${showSettings
                  ? "bg-accent/15 border-accent text-accent"
                  : "bg-card border-border text-muted hover:text-foreground hover:border-accent"
                }`}
              aria-label="Toggle configurations panel"
            >
              <SlidersHorizontal size={13} />
            </button>

            {/* Export Toggle */}
            <button
              onClick={() => {
                setShowExport(!showExport);
                setShowSettings(false);
              }}
              className={`p-1.5 rounded-lg border transition-colors ${showExport
                  ? "bg-accent/15 border-accent text-accent"
                  : "bg-card border-border text-muted hover:text-foreground hover:border-accent"
                }`}
              aria-label="Export embed code"
            >
              <Code size={13} />
            </button>
          </div>
        </div>

        {/* Configurations drawer */}
        {showSettings && (
          <div className="flex flex-wrap items-center gap-5 p-4 mb-4 rounded-xl border border-border bg-card/20 transition-all duration-300 text-xs font-mono text-muted">
            {/* Size dropdown */}
            <div className="flex items-center gap-2">
              <span>Size:</span>
              <div className="relative" ref={sizeRef}>
                <button
                  type="button"
                  onClick={() => setSizeOpen(!sizeOpen)}
                  className="flex items-center gap-2 bg-background border border-border px-2 py-1 pr-6 rounded-md hover:text-foreground hover:border-accent cursor-pointer focus:outline-none transition-colors capitalize"
                >
                  {sizeMode}
                </button>
                <ChevronDown size={9} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                {sizeOpen && (
                  <div className="absolute left-0 mt-1 w-24 bg-card border border-border rounded-lg shadow-xl p-1 z-50 scrollbar-none">
                    {(["small", "medium", "large"] as const).map((s) => (
                      <button key={s} type="button"
                        onClick={() => { setSizeMode(s); setSizeOpen(false); }}
                        className={`w-full text-left px-2 py-1 rounded-md capitalize transition-colors ${
                          sizeMode === s ? "text-accent bg-accent/10 font-semibold" : "text-muted hover:text-foreground hover:bg-background/60"
                        }`}
                      >{s}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Shape dropdown */}
            <div className="flex items-center gap-2">
              <span>Shape:</span>
              <div className="relative" ref={shapeRef}>
                <button
                  type="button"
                  onClick={() => setShapeOpen(!shapeOpen)}
                  className="flex items-center gap-2 bg-background border border-border px-2 py-1 pr-6 rounded-md hover:text-foreground hover:border-accent cursor-pointer focus:outline-none transition-colors capitalize"
                >
                  {shape === "rounded" ? "Round" : shape.charAt(0).toUpperCase() + shape.slice(1)}
                </button>
                <ChevronDown size={9} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                {shapeOpen && (
                  <div className="absolute left-0 mt-1 w-24 bg-card border border-border rounded-lg shadow-xl p-1 z-50 scrollbar-none">
                    {(["sharp", "rounded", "circle"] as const).map((sh) => (
                      <button key={sh} type="button"
                        onClick={() => { setShape(sh); setShapeOpen(false); }}
                        className={`w-full text-left px-2 py-1 rounded-md capitalize transition-colors ${
                          shape === sh ? "text-accent bg-accent/10 font-semibold" : "text-muted hover:text-foreground hover:bg-background/60"
                        }`}
                      >{sh === "rounded" ? "Round" : sh}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Numbers Toggle */}
            <div className="flex items-center gap-2">
              <span>Numbers:</span>
              <button
                onClick={() => setShowNumbers(!showNumbers)}
                className={`px-2 py-1 rounded-md border transition-colors ${showNumbers
                    ? "bg-accent/10 border-accent text-accent font-semibold"
                    : "bg-background border-border text-muted hover:text-foreground hover:border-accent"
                  }`}
              >
                {showNumbers ? "ON" : "OFF"}
              </button>
            </div>

            {/* Gradient Toggle */}
            <div className="flex items-center gap-2">
              <span>Gradient:</span>
              <button
                onClick={() => setUseGradient(!useGradient)}
                className={`px-2 py-1 rounded-md border transition-colors ${useGradient
                    ? "bg-accent/10 border-accent text-accent font-semibold"
                    : "bg-background border-border text-muted hover:text-foreground hover:border-accent"
                  }`}
              >
                {useGradient ? "ON" : "OFF"}
              </button>
            </div>

          </div>
        )}

        {/* Export Drawer */}
        {showExport && (
          <div className="mb-4">
            <CodeBlock
              languages={[
                { id: "tsx", label: "React (TSX)", code: usageCode },
                { id: "js", label: "Vanilla HTML/JS", code: jsEmbedCode }
              ]}
            />
          </div>
        )}

        {/* Heatmap Grid container */}
        <div className="py-6 overflow-hidden rounded-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-mono text-muted">
              @{username}&apos;s contributions
            </span>
            <span className="text-xs font-mono text-accent font-semibold">
              {stats.total.toLocaleString()} total
            </span>
          </div>
          <HeatmapGrid
            key={`${key}-${range}`}
            themeObj={themeObj}
            cellSize={cellSize}
            gap={gap}
            shape={shape}
            showNumbers={showNumbers}
            useGradient={useGradient}
            showCounts={showCounts}
            animationEnabled={animationEnabled}
            days={range}
            data={computedData}
          />

          {/* Stats bar */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total", value: stats.total.toLocaleString(), sub: `in ${range}d` },
              { label: "Current Streak", value: `${stats.currentStreak}d`, sub: stats.currentStreak === 1 ? "day" : "days" },
              { label: "Longest Streak", value: `${stats.longest}d`, sub: stats.longest === 1 ? "day" : "days" },
              { label: "Busiest Day", value: stats.busiestLabel, sub: stats.busiestCount > 0 ? `${stats.busiestCount} contributions` : "no data" },
            ].map(({ label, value, sub }) => (
              <div
                key={label}
                className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg border border-border bg-card/30"
              >
                <span className="text-[10px] font-mono text-muted uppercase tracking-wider">{label}</span>
                <span className="text-base font-bold font-mono text-foreground leading-tight">{value}</span>
                <span className="text-[10px] font-mono text-muted/60">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-foreground" style={{ fontFamily: "var(--font-geist-sans)" }}>
          Installation
        </h2>
        <CodeBlock code="npm install gitmap" language="bash" />
      </section>

      {/* Usage */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-2 text-foreground" style={{ fontFamily: "var(--font-geist-sans)" }}>
          Usage
        </h2>
        <p className="text-sm text-muted mb-4">
          Import the component and pass the username/contributions, selector range, and values.
        </p>
        <CodeBlock code={usageCode} language="tsx" />
      </section>

      {/* Theming with CSS Variables */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-2 text-foreground" style={{ fontFamily: "var(--font-geist-sans)" }}>
          Theming with CSS Variables
        </h2>
        <p className="text-sm text-muted mb-4">
          For custom CSS/styling, custom keys, reference variables in CSS configuration:
        </p>
        <CodeBlock code={cssCode} language="css" />
      </section>

      {/* Static Themes */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-2 text-foreground" style={{ fontFamily: "var(--font-geist-sans)" }}>
          Static Themes
        </h2>
        <p className="text-sm text-muted mb-4">
          Alternatively, color objects can be passed via theme props:
        </p>
        <CodeBlock code={staticThemeCode} language="tsx" />
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-foreground" style={{ fontFamily: "var(--font-geist-sans)" }}>
          API Reference
        </h2>

        {/* Gitmap Props Table */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-muted font-mono mb-3 uppercase tracking-wider">
            Gitmap Props
          </h3>
          <div className="rounded-xl border border-border bg-card/20 overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-card border-b border-border font-mono text-muted/80 text-[11px] uppercase tracking-wider">
                  <th className="px-4 py-3">Prop</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Default</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">data</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">ContributionDay[]</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">[]</code></td>
                  <td className="px-4 py-3.5 text-muted">Array of contribution data objects containing dates and counts.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">username</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">string</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">undefined</code></td>
                  <td className="px-4 py-3.5 text-muted">GitHub username. Used to fetch contributions if data is not provided.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">theme</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">string | GitmapColors</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">&quot;github-dark&quot;</code></td>
                  <td className="px-4 py-3.5 text-muted">Preset theme name or a custom theme object.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">cellSize</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">number</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">12</code></td>
                  <td className="px-4 py-3.5 text-muted">Size of each grid cell block in pixels.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">gap</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">number</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">3</code></td>
                  <td className="px-4 py-3.5 text-muted">Margin/gap between each cell in pixels.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">rounded</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">boolean</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">true</code></td>
                  <td className="px-4 py-3.5 text-muted">Whether grid cells have rounded borders.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">showCounts</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">boolean</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">false</code></td>
                  <td className="px-4 py-3.5 text-muted">Whether to display tooltip counts on hover.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">onDayClick</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">(day: ContributionDay) =&gt; void</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">undefined</code></td>
                  <td className="px-4 py-3.5 text-muted">Callback fired when a contribution day cell is clicked.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ContributionDay Table */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-muted font-mono mb-3 uppercase tracking-wider">
            ContributionDay
          </h3>
          <div className="rounded-xl border border-border bg-card/20 overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-card border-b border-border font-mono text-muted/80 text-[11px] uppercase tracking-wider">
                  <th className="px-4 py-3">Prop</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Default</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">date</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">string</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">-</code></td>
                  <td className="px-4 py-3.5 text-muted">Expected YYYY-MM-DD Date Format.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">count</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">number</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">0</code></td>
                  <td className="px-4 py-3.5 text-muted">Value count for corresponding day.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">level</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">0 | 1 | 2 | 3 | 4</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">-</code></td>
                  <td className="px-4 py-3.5 text-muted">Intensity level for corresponding color.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* GitmapColors Table */}
        <div>
          <h3 className="text-sm font-semibold text-muted font-mono mb-3 uppercase tracking-wider">
            GitmapColors
          </h3>
          <div className="rounded-xl border border-border bg-card/20 overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-card border-b border-border font-mono text-muted/80 text-[11px] uppercase tracking-wider">
                  <th className="px-4 py-3">Prop</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Default</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-sans">
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">level0</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">string</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">-</code></td>
                  <td className="px-4 py-3.5 text-muted">Hex or RGBA color code for level 0.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">level1</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">string</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">-</code></td>
                  <td className="px-4 py-3.5 text-muted">Hex or RGBA color code for level 1.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">level2</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">string</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">-</code></td>
                  <td className="px-4 py-3.5 text-muted">Hex or RGBA color code for level 2.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">level3</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">string</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">-</code></td>
                  <td className="px-4 py-3.5 text-muted">Hex or RGBA color code for level 3.</td>
                </tr>
                <tr className="hover:bg-card/40 transition-colors">
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-foreground bg-card border border-border px-1.5 py-0.5 rounded">level4</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-accent">string</code></td>
                  <td className="px-4 py-3.5"><code className="font-mono text-xs text-muted/65">-</code></td>
                  <td className="px-4 py-3.5 text-muted">Hex or RGBA color code for level 4.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Customization */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-2 text-foreground" style={{ fontFamily: "var(--font-geist-sans)" }}>
          Customization
        </h2>
        <p className="text-sm text-muted mb-4">
          Custom configurations can be added using custom table options:
        </p>
        <CodeBlock code={customizationCode} language="tsx" />
      </section>
    </div>
  );
}
