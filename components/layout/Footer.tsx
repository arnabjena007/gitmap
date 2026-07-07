"use client";

import { motion } from "framer-motion";
import { Github } from "@/components/icons/Github";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-border mt-32"
    >
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>Built by</span>
          <a
            href="https://github.com/arnabjena007"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-accent transition-colors font-medium"
          >
            Arnab Jena
          </a>
        </div>

        <div className="flex items-center gap-5 text-xs text-muted/65">
          <a
            href="https://github.com/arnabjena007/gitmap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Github size={13} />
            GitHub
          </a>
          <span>MIT License</span>
        </div>
      </div>
    </motion.footer>
  );
}
