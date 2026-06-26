import type { ReactNode } from "react";
import Tilt from "react-parallax-tilt";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  return (
    <Tilt
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      glareEnable
      glareMaxOpacity={0.08}
      glareColor="#6366F1"
      glarePosition="all"
      glareBorderRadius="12px"
      scale={1.015}
      transitionSpeed={500}
      className={className}
    >
      {children}
    </Tilt>
  );
}
