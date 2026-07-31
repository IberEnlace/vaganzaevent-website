import Image from "next/image";

export function VaganzaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? "logo-compact" : ""}`} aria-label="Vaganza Events and Entertainment">
      <Image src="/vaganza-logo-wide.png" alt="Vaganza Events & Entertainment" width={442} height={120} priority />
    </div>
  );
}
