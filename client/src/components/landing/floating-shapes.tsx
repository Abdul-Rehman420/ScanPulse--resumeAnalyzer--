"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Shape {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  type: "circle" | "square" | "triangle";
}

const COLORS = [
  "rgba(42, 197, 202, 0.15)",
  "rgba(42, 197, 202, 0.1)",
  "rgba(202, 73, 42, 0.1)",
  "rgba(202, 73, 42, 0.08)",
  "rgba(42, 197, 202, 0.08)",
];

export function FloatingShapes() {
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const generated: Shape[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      color: COLORS[i % COLORS.length],
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      type: (["circle", "square", "triangle"] as const)[
        Math.floor(Math.random() * 3)
      ],
    }));
    setShapes(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
          }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 15, -10, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        >
          {shape.type === "circle" && (
            <div
              className="w-full h-full rounded-full"
              style={{ background: shape.color }}
            />
          )}
          {shape.type === "square" && (
            <div
              className="w-full h-full rounded-lg"
              style={{ background: shape.color, transform: "rotate(45deg)" }}
            />
          )}
          {shape.type === "triangle" && (
            <div
              className="w-0 h-0"
              style={{
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid ${shape.color}`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
