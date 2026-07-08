"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CodeBlock from "@/components/ui/CodeBlock";

type PM = "pnpm" | "npm" | "bun" | "yarn";

const INSTALL_CMDS: Record<PM, string> = {
  pnpm: "pnpm add @arnabjena007/gitmap",
  npm: "npm install @arnabjena007/gitmap",
  bun: "bun add @arnabjena007/gitmap",
  yarn: "yarn add @arnabjena007/gitmap",
};

const TABS: PM[] = ["pnpm", "npm", "bun", "yarn"];

export default function Installation() {
  const [active, setActive] = useState<PM>("pnpm");

  return (
    <section id="installation" className="py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3">
            <span className="text-xs font-mono text-[#39D353] tracking-widest uppercase">
              Getting Started
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-2">Installation</h2>
          <p className="text-sm text-[#A1A1AA] mb-8">
            Add Gitmap to your project with your preferred package manager.
          </p>

          <div className="rounded-2xl border border-[#27272A] bg-[#18181B] overflow-hidden max-w-xl">
            {/* Tab bar */}
            <div className="flex border-b border-[#27272A]">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className={`relative px-4 py-2.5 text-xs font-mono transition-colors ${
                    active === tab
                      ? "text-[#FAFAFA]"
                      : "text-[#52525B] hover:text-[#A1A1AA]"
                  }`}
                >
                  {tab}
                  {active === tab && (
                    <motion.div
                      layoutId="install-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-px bg-[#39D353]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Code */}
            <div className="p-4">
              <CodeBlock
                code={INSTALL_CMDS[active]}
                language="bash"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
