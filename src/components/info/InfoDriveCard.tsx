import type { LucideIcon } from "lucide-react";

interface IInfoDriveCardProps {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
}

export const InfoDriveCard = ({
  icon: Icon,
  number,
  title,
  description,
}: IInfoDriveCardProps) => (
  <div className="relative overflow-hidden rounded-lg border border-white/10 p-5">
    <span className="pointer-events-none absolute right-3 top-1 text-5xl font-bold text-white/5">
      {number}
    </span>
    <Icon className="text-neon" size={24} />
    <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-white">
      {title}
    </h3>
    <p className="mt-2 text-sm leading-relaxed text-gray-400">{description}</p>
  </div>
);
