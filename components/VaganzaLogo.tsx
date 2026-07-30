export function VaganzaLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`logo ${compact ? "logo-compact" : ""}`} aria-label="Vaganza Events and Entertainment">
      <svg viewBox="0 0 98 98" role="img" aria-hidden="true">
        <path d="M49 8 61 36l29 1-23 18 8 29-26-16-26 16 8-29L8 37l29-1Z" />
        <circle cx="49" cy="49" r="17" />
        <path d="M40 45h18M42 52h14" />
      </svg>
      <span><strong>VAGANZA</strong>{!compact && <small>EVENTS · ENTERTAINMENT</small>}</span>
    </div>
  );
}
