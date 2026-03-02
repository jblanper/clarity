"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {/* reducedMotion="user" makes all m.* components instant when the OS
          preference is set — centralised so individual components don't need
          to each call useReducedMotion(). */}
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
