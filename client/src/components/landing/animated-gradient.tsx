"use client";

import { motion } from "framer-motion";

export function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(42, 197, 202, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(202, 73, 42, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(42, 197, 202, 0.1) 0%, transparent 50%)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
