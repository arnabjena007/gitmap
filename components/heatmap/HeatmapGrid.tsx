"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import HeatmapCell from "./HeatmapCell";
import {
  generateHeatmapData,
  getMonthLabels,
  WeekData,
} from "./heatmapUtils";
import { HeatmapTheme } from "@/lib/themes";

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

interface HeatmapGridProps {
  themeObj: HeatmapTheme;
  cellSize?: number;
  gap?: number;
  shape?: "sharp" | "rounded" | "circle";
  showNumbers?: boolean;
  useGradient?: boolean;
  showCounts?: boolean;
  animationEnabled?: boolean;
  days?: number;
  /** If provided, use this data instead of generating */
  data?: WeekData[];
}

export default function HeatmapGrid({
  themeObj,
  cellSize = 12,
  gap = 3,
  shape = "rounded",
  showNumbers = false,
  useGradient = false,
  showCounts = false,
  animationEnabled = true,
  days = 365,
  data: externalData,
}: HeatmapGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    // Initial size
    setWidth(containerRef.current.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const data = useMemo(
    () => externalData ?? generateHeatmapData(days),
    [days, externalData]
  );

  const numColumns = data.length;

  const { activeCellSize, activeGap } = useMemo(() => {
    if (width <= 0) {
      return { activeCellSize: cellSize, activeGap: gap };
    }
    
    // Day labels take ~28px margin. Add 4px margin = 32px safety margin.
    const availableWidth = width - 32;
    
    // Let's try to fit with the requested gap
    let calculatedS = Math.floor((availableWidth - (numColumns - 1) * gap) / numColumns);
    let calculatedG = gap;
    
    // If the cell size gets too small, reduce the gap to 2px or 1px to gain space!
    if (calculatedS < 6 && gap > 2) {
      calculatedG = 2;
      calculatedS = Math.floor((availableWidth - (numColumns - 1) * 2) / numColumns);
    }
    if (calculatedS < 6) {
      calculatedG = 1;
      calculatedS = Math.floor((availableWidth - (numColumns - 1) * 1) / numColumns);
    }
    
    // If the calculated cell size is smaller than the requested cellSize, scale down to fit!
    if (calculatedS < cellSize) {
      return {
        activeCellSize: Math.max(4, calculatedS),
        activeGap: calculatedG,
      };
    }
    
    return { activeCellSize: cellSize, activeGap: gap };
  }, [width, numColumns, cellSize, gap]);

  const monthLabels = useMemo(() => getMonthLabels(data), [data]);
  const totalCells = data.reduce((acc, w) => acc + w.days.length, 0);

  return (
    <div ref={containerRef} className="overflow-hidden w-full">
      <div style={{ display: "inline-flex", flexDirection: "column", gap: 0, width: "100%" }}>
        {/* Month Labels Row */}
        <div style={{ display: "flex", marginLeft: 28, marginBottom: 4 }}>
          {data.map((_, weekIdx) => {
            const label = monthLabels.find((m) => m.col === weekIdx);
            return (
              <div
                key={weekIdx}
                style={{
                  width: activeCellSize + activeGap,
                  fontSize: Math.max(8, Math.min(10, activeCellSize)),
                  color: "var(--muted)",
                  fontFamily: "var(--font-geist-mono)",
                  flexShrink: 0,
                  userSelect: "none",
                }}
              >
                {label?.label ?? ""}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div style={{ display: "flex", gap: 0 }}>
          {/* Day Labels */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: activeGap,
              marginRight: 4,
              paddingTop: 0,
            }}
          >
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                style={{
                  height: activeCellSize,
                  width: 22,
                  fontSize: Math.max(7, Math.min(9, activeCellSize - 2)),
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  fontFamily: "var(--font-geist-mono)",
                  userSelect: "none",
                  flexShrink: 0,
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <motion.div
            key={`${days}-${themeObj.id}-${activeCellSize}-${activeGap}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", gap: activeGap }}
          >
            {data.map((week, weekIdx) => (
              <div
                key={weekIdx}
                style={{ display: "flex", flexDirection: "column", gap: activeGap }}
              >
                {week.days.map((day, dayIdx) => {
                  const globalIdx = weekIdx * 7 + dayIdx;
                  const delay = animationEnabled
                    ? (globalIdx / totalCells) * 0.8
                    : 0;
                  return (
                    <HeatmapCell
                      key={dayIdx}
                      day={day}
                      theme={themeObj}
                      cellSize={activeCellSize}
                      gap={activeGap}
                      shape={shape}
                      showNumbers={showNumbers}
                      useGradient={useGradient}
                      showCounts={showCounts}
                      animationEnabled={animationEnabled}
                      delay={delay}
                      isDimmed={hoveredLevel !== null && day !== null && day.level !== hoveredLevel}
                    />
                  );
                })}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 8,
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "var(--muted)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            Less
          </span>
          {themeObj.levels.map((color, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredLevel(i)}
              onMouseLeave={() => setHoveredLevel(null)}
              style={{
                width: Math.min(10, activeCellSize),
                height: Math.min(10, activeCellSize),
                backgroundImage: useGradient && i > 0
                  ? `linear-gradient(135deg, ${color}, ${themeObj.levels[Math.min(4, i + 1)]})`
                  : undefined,
                backgroundColor: useGradient && i > 0 ? undefined : color,
                borderRadius: shape === "circle" ? "50%" : shape === "sharp" ? "0px" : "2px",
                flexShrink: 0,
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: hoveredLevel === i ? "scale(1.35)" : "scale(1)",
                opacity: hoveredLevel !== null && hoveredLevel !== i ? 0.35 : 1,
                boxShadow: hoveredLevel === i && i > 0 ? `0 0 8px ${color}` : "none",
              }}
            />
          ))}
          <span
            style={{
              fontSize: 10,
              color: "var(--muted)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            More
          </span>
        </div>
      </div>
    </div>
  );
}
