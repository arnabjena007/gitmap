"use client";

import { motion } from "framer-motion";

interface Prop {
  name: string;
  type: string;
  default: string;
  description: string;
  required?: boolean;
}

const PROPS: Prop[] = [
  {
    name: "data",
    type: "DayData[]",
    default: "—",
    description: "Array of { date, count } objects. If omitted, fetches from GitHub API.",
    required: false,
  },
  {
    name: "username",
    type: "string",
    default: "—",
    description: "GitHub username. Used when data is not provided.",
  },
  {
    name: "theme",
    type: "ThemeId | HeatmapTheme",
    default: '"github-dark"',
    description: 'Built-in theme name or a custom theme object with 5 color levels.',
  },
  {
    name: "cellSize",
    type: "number",
    default: "13",
    description: "Width and height of each cell in pixels.",
  },
  {
    name: "gap",
    type: "number",
    default: "3",
    description: "Gap between cells in pixels.",
  },
  {
    name: "rounded",
    type: "boolean",
    default: "true",
    description: "Whether cells have rounded corners.",
  },
  {
    name: "showCounts",
    type: "boolean",
    default: "false",
    description: "Show contribution count inside each cell (only visible at larger sizes).",
  },
  {
    name: "animate",
    type: "boolean",
    default: "true",
    description: "Enable staggered fade-in animation on mount.",
  },
  {
    name: "days",
    type: "number",
    default: "365",
    description: "Number of days to display. Typically 90, 180, or 365.",
  },
  {
    name: "onDayClick",
    type: "(day: DayData) => void",
    default: "undefined",
    description: "Callback fired when a day cell is clicked.",
  },
  {
    name: "onDayHover",
    type: "(day: DayData | null) => void",
    default: "undefined",
    description: "Callback fired on mouse enter/leave of a day cell.",
  },
  {
    name: "className",
    type: "string",
    default: '""',
    description: "Additional CSS class applied to the root element.",
  },
];

export default function ApiTable() {
  return (
    <section id="api" className="py-20 px-6">
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
              Reference
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-2">API Reference</h2>
          <p className="text-sm text-[#A1A1AA]">
            All available props for the{" "}
            <code className="text-xs bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 rounded-md font-mono text-[#FAFAFA]">
              &lt;Gitmap /&gt;
            </code>{" "}
            component.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-[#27272A] overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_2fr] text-xs font-mono uppercase tracking-wider text-[#52525B] bg-[#18181B] px-5 py-3 border-b border-[#27272A]">
            <span>Prop</span>
            <span>Type</span>
            <span>Default</span>
            <span>Description</span>
          </div>

          {/* Rows */}
          {PROPS.map((prop, i) => (
            <motion.div
              key={prop.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={`grid grid-cols-[1fr_1fr_1fr_2fr] px-5 py-3.5 text-sm border-b border-[#27272A] last:border-b-0 hover:bg-[#18181B]/50 transition-colors items-start gap-2`}
            >
              <div className="flex items-center gap-1.5 flex-wrap">
                <code className="text-xs font-mono text-[#FAFAFA] bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 rounded">
                  {prop.name}
                </code>
                {prop.required && (
                  <span className="text-[10px] text-[#39D353] font-mono">required</span>
                )}
              </div>
              <code className="text-xs font-mono text-[#7AA2F7] break-all">
                {prop.type}
              </code>
              <code className="text-xs font-mono text-[#A1A1AA]">
                {prop.default}
              </code>
              <span className="text-xs text-[#A1A1AA] leading-relaxed">
                {prop.description}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* TypeScript types */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 rounded-2xl border border-[#27272A] bg-[#18181B] overflow-hidden"
        >
          <div className="px-4 py-2.5 border-b border-[#27272A]">
            <span className="text-xs font-mono text-[#52525B]">TypeScript types</span>
          </div>
          <pre className="p-4 text-xs font-mono text-[#e6edf3] overflow-x-auto leading-relaxed">
            <span className="text-[#ff7b72]">interface </span>
            <span className="text-[#ffa657]">DayData </span>
            {"{\n"}
            {"  "}
            <span className="text-[#79c0ff]">date</span>: <span className="text-[#7AA2F7]">string</span>; <span className="text-[#6e7681]">{"// 'YYYY-MM-DD'"}</span>{"\n"}
            {"  "}
            <span className="text-[#79c0ff]">count</span>: <span className="text-[#7AA2F7]">number</span>;{"\n"}
            {"}\n\n"}
            <span className="text-[#ff7b72]">interface </span>
            <span className="text-[#ffa657]">HeatmapTheme </span>
            {"{\n"}
            {"  "}
            <span className="text-[#79c0ff]">id</span>: <span className="text-[#7AA2F7]">string</span>;{"\n"}
            {"  "}
            <span className="text-[#79c0ff]">name</span>: <span className="text-[#7AA2F7]">string</span>;{"\n"}
            {"  "}
            <span className="text-[#79c0ff]">background</span>: <span className="text-[#7AA2F7]">string</span>;{"\n"}
            {"  "}
            <span className="text-[#79c0ff]">levels</span>: [<span className="text-[#7AA2F7]">string, string, string, string, string</span>];{"\n"}
            {"}"}
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
