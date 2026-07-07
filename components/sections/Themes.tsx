"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import HeatmapGrid from "@/components/heatmap/HeatmapGrid";
import { THEMES, HeatmapTheme } from "@/lib/themes";
import { Check } from "lucide-react";

interface ThemeCardProps {
  theme: HeatmapTheme;
  active: boolean;
  onClick: () => void;
}

function ThemeCard({ theme, active, onClick }: ThemeCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-xl border text-left overflow-hidden transition-all duration-200 ${
        active
          ? "border-[#39D353] shadow-lg shadow-[#39D353]/10"
          : "border-[#27272A] hover:border-[#3f3f46]"
      }`}
    >
      {/* Mini Heatmap Preview */}
      <div
        className="p-3 overflow-hidden"
        style={{ backgroundColor: theme.background }}
      >
        <div className="pointer-events-none">
          <HeatmapGrid
            themeObj={theme}
            cellSize={8}
            gap={2}
            shape="rounded"
            animationEnabled={false}
            days={90}
          />
        </div>
      </div>

      {/* Label */}
      <div className="bg-[#18181B] px-3 py-2.5 flex items-center justify-between border-t border-[#27272A]">
        <span className="text-xs font-mono text-[#FAFAFA]">{theme.name}</span>
        {active && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4 rounded-full bg-[#39D353] flex items-center justify-center"
          >
            <Check size={10} className="text-black" />
          </motion.span>
        )}
      </div>
    </motion.button>
  );
}

export default function Themes({
  activeThemeId,
  onThemeSelect,
}: {
  activeThemeId?: string;
  onThemeSelect?: (id: string) => void;
}) {
  const [selected, setSelected] = useState(activeThemeId ?? "github-dark");

  const handleSelect = (id: string) => {
    setSelected(id);
    onThemeSelect?.(id);
  };

  return (
    <section id="themes" className="py-20 px-6">
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
              Customization
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-2">Themes</h2>
          <p className="text-sm text-[#A1A1AA]">
            Six handcrafted themes. Click any to apply it to the demo above.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {THEMES.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <ThemeCard
                theme={theme}
                active={selected === theme.id}
                onClick={() => handleSelect(theme.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
