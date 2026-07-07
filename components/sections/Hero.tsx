"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Github } from "@/components/icons/Github";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="pt-36 pb-20 px-6 text-center">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#27272A] text-xs text-[#A1A1AA] font-mono mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39D353] animate-pulse" />
              v1.0.0 — Now available
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={item}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#FAFAFA] tracking-tight leading-none mb-6"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Gitmap
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-[#A1A1AA] max-w-md leading-relaxed mb-10"
          >
            Beautiful GitHub contribution heatmaps
            <br className="hidden sm:block" />
            for React applications.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={item} className="flex flex-wrap gap-3 justify-center">
            <motion.a
              href="#installation"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("installation")?.scrollIntoView({ behavior: "smooth" });
              }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#39D353] text-[#09090B] font-semibold text-sm transition-all hover:bg-[#4ae063] shadow-lg shadow-[#39D353]/10"
            >
              Get Started
              <ArrowRight size={15} />
            </motion.a>

            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#27272A] text-[#A1A1AA] font-semibold text-sm hover:text-[#FAFAFA] hover:border-[#3f3f46] transition-all"
            >
              <Github size={15} />
              GitHub
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-8 mt-16 justify-center"
          >
            {[
              { label: "npm downloads", value: "12k+" },
              { label: "GitHub stars", value: "840" },
              { label: "Themes", value: "6" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[#FAFAFA]">{stat.value}</div>
                <div className="text-xs text-[#52525B] mt-1 font-mono">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
