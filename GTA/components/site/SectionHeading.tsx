import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  return (
    <Reveal className={`flex max-w-3xl flex-col gap-4 ${alignCls} ${className}`}>
      {eyebrow && (
        <span className="eyebrow inline-flex items-center gap-2 text-neon-cyan">
          <span className="h-px w-8 bg-neon-cyan/70" />
          {eyebrow}
        </span>
      )}
      <h2 className="title-gta text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
      {subtitle && (
        <p className="max-w-2xl text-base leading-relaxed text-ash sm:text-lg">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
