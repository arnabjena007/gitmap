"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayData } from "./heatmapUtils";
import { HeatmapTheme } from "@/lib/themes";

interface HeatmapCellProps {
  day: DayData | null;
  theme: HeatmapTheme;
  cellSize: number;
  gap: number;
  shape?: "sharp" | "rounded" | "circle";
  showNumbers?: boolean;
  useGradient?: boolean;
  showCounts?: boolean;
  animationEnabled?: boolean;
  delay?: number;
  isDimmed?: boolean;
}

export default function HeatmapCell({
  day,
  theme,
  cellSize,
  shape = "rounded",
  showNumbers = false,
  useGradient = false,
  animationEnabled,
  delay = 0,
  isDimmed = false,
}: HeatmapCellProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<"top" | "bottom">("top");
  const cellRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!day) {
    return (
      <div
        style={{ width: cellSize, height: cellSize }}
        className="opacity-0"
      />
    );
  }

  // Border radius based on shape style
  let borderRadius = "0px";
  if (shape === "rounded") {
    borderRadius = `${Math.max(1.5, cellSize * 0.18)}px`;
  } else if (shape === "circle") {
    borderRadius = "50%";
  }

  // Background style (gradient vs solid)
  const bgStyle: React.CSSProperties = {};
  if (useGradient && day.level > 0) {
    const color1 = theme.levels[day.level];
    const color2 = theme.levels[Math.min(4, day.level + 1)];
    bgStyle.backgroundImage = `linear-gradient(135deg, ${color1}, ${color2})`;
  } else {
    bgStyle.backgroundColor = theme.levels[day.level];
  }

  const handleMouseEnter = () => {
    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      setTooltipPos(rect.top < 80 ? "bottom" : "top");
    }
    setShowTooltip(true);
  };

  const formattedDate = day.date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative" ref={cellRef} suppressHydrationWarning>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: isDimmed ? 0.15 : 1,
          scale: isDimmed ? 0.85 : 1,
        }}
        whileHover={isDimmed ? undefined : { scale: 1.25, zIndex: 10 }}
        onMouseEnter={isDimmed ? undefined : handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          width: cellSize,
          height: cellSize,
          borderRadius,
          cursor: isDimmed ? "default" : "pointer",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          ...bgStyle,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
          delay: mounted ? 0 : (animationEnabled ? delay : 0),
        }}
      >
        {showNumbers && day.count > 0 && cellSize >= 8 && (
          <span
            style={{
              fontSize: Math.max(5, Math.floor(cellSize * 0.52)),
              color: day.level >= 3 ? "#000" : "#fff",
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {day.count}
          </span>
        )}
      </motion.div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: tooltipPos === "top" ? 6 : -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: tooltipPos === "top" ? 6 : -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              [tooltipPos === "top" ? "bottom" : "top"]: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 50,
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
            className="backdrop-blur-md bg-background/95 border border-border text-foreground px-3 py-2 rounded-lg shadow-2xl font-mono text-[11px]"
          >
            <div className="font-semibold text-foreground">{formattedDate}</div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: theme.levels[day.level],
                  boxShadow: day.level > 0 ? `0 0 6px ${theme.levels[day.level]}` : "none",
                }}
              />
              <span className="text-muted">
                {day.count === 0
                  ? "No contributions"
                  : `${day.count} contribution${day.count !== 1 ? "s" : ""}`}
              </span>
            </div>
            {/* Arrow */}
            <div
              style={{
                position: "absolute",
                [tooltipPos === "top" ? "bottom" : "top"]: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 8,
                height: 8,
                backgroundColor: "var(--background)",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                rotate: tooltipPos === "top" ? "45deg" : "225deg",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
