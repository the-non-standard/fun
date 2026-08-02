import {
  Flame,
  Users,
  Car,
  MapPin,
  PawPrint,
  Crosshair,
  Gem,
  Moon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Flame,
  Users,
  Car,
  MapPin,
  PawPrint,
  Crosshair,
  Gem,
  Moon,
};

/** Renders a lucide icon by the string name stored in lib/pricing.ts. */
export default function Icon({
  name,
  className,
  size = 22,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Cmp = MAP[name] ?? Sparkles;
  return <Cmp className={className} size={size} strokeWidth={2} />;
}
