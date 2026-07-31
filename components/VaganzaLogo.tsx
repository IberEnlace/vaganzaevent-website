import Image from "next/image";

export function VaganzaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? "logo-compact" : ""}`} aria-label="Vaganza Events and Entertainment">
      <Image src="/vaganza-logo.png" alt="Vaganza Events & Entertainment" width={500} height={500} priority />
    </div>
  );
}
