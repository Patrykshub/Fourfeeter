import type { ReactNode } from "react";

interface ISectionLabelProps {
  children: ReactNode;
}

export const SectionLabel = ({ children }: ISectionLabelProps) => (
  <div className="flex items-center gap-2">
    <span className="inline-block h-0.5 w-6 shrink-0 bg-neon" />
    <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </h2>
  </div>
);
