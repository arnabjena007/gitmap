"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CodeBlock from "@/components/ui/CodeBlock";
import HeatmapGrid from "@/components/heatmap/HeatmapGrid";
import { getTheme } from "@/lib/themes";

const DEFAULT_CODE = `import { Gitmap } from 'gitmap';

export default function App() {
  return (
    <Gitmap
      username="octocat"
      theme="github-dark"
      cellSize={13}
      gap={3}
      rounded
    />
  );
}`;

// Parse theme from code
function parseTheme(code: string): string {
  const match = code.match(/theme="([^"]+)"/);
  return match?.[1] ?? "github-dark";
}

function parseCellSize(code: string): number {
  const match = code.match(/cellSize=\{(\d+)\}/);
  return match ? parseInt(match[1]) : 13;
}

function parseGap(code: string): number {
  const match = code.match(/gap=\{(\d+)\}/);
  return match ? parseInt(match[1]) : 3;
}

function parseRounded(code: string): boolean {
  return code.includes("rounded");
}

export default function QuickStart() {
  const [code, setCode] = useState(DEFAULT_CODE);

  const themeId = parseTheme(code);
  const cellSize = parseCellSize(code);
  const gap = parseGap(code);
  const rounded = parseRounded(code);
  const themeObj = getTheme(themeId);

  return (
    <section id="quickstart" className="py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="mb-3">
            <span className="text-xs font-mono text-[#39D353] tracking-widest uppercase">
              Usage
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-2">Quick Start</h2>
          <p className="text-sm text-[#A1A1AA]">
            Edit the code on the left — the preview updates instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-[#27272A] bg-[#18181B] overflow-hidden"
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#27272A]">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-2 text-xs text-[#52525B] font-mono">App.tsx</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-64 lg:h-80 p-4 bg-transparent text-sm text-[#e6edf3] font-mono resize-none outline-none leading-relaxed"
              style={{ tabSize: 2 }}
            />
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl border border-[#27272A] overflow-hidden"
            style={{ backgroundColor: themeObj.background, transition: "background-color 0.3s" }}
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA]/50">
                Preview
              </span>
            </div>
            <div className="p-6 overflow-x-auto flex items-center justify-center min-h-[260px] lg:min-h-[300px]">
              <HeatmapGrid
                key={`${themeId}-${cellSize}-${gap}-${rounded}`}
                themeObj={themeObj}
                cellSize={cellSize}
                gap={gap}
                shape={rounded ? "rounded" : "sharp"}
                animationEnabled={false}
              />
            </div>
          </motion.div>
        </div>

        {/* Full example */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6"
        >
          <p className="text-xs text-[#52525B] font-mono mb-3">
            {"// Full usage with all props"}
          </p>
          <CodeBlock
            language="tsx"
            showLineNumbers
            code={`import { Gitmap } from 'gitmap';

const data = [
  { date: '2026-01-01', count: 4 },
  { date: '2026-01-02', count: 0 },
  { date: '2026-01-03', count: 12 },
  // ... more days
];

export default function App() {
  return (
    <Gitmap
      data={data}
      theme="github-dark"
      cellSize={13}
      gap={3}
      rounded={true}
      showCounts={false}
      animate={true}
      onDayClick={(day) => console.log(day)}
    />
  );
}`}
          />
        </motion.div>
      </div>
    </section>
  );
}
