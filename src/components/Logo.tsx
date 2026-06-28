import { Link } from "@tanstack/react-router";
const logoAsset = { url: "/crisppdf-logo.png" };

interface LogoProps {
  size?: number;
  withText?: boolean;
  asLink?: boolean;
  className?: string;
}

export function Logo({ size = 32, withText = true, asLink = true, className = "" }: LogoProps) {
  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={logoAsset.url}
        alt="CrispPDF logo"
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        className="rounded-lg"
        style={{ width: size, height: size }}
      />
      {withText && (
        <span className="hidden font-display text-lg font-semibold tracking-tight xs:inline sm:inline">
          Crisp<span className="text-gradient">PDF</span>
        </span>
      )}
    </span>
  );
  if (!asLink) return inner;
  return (
    <Link to="/" className="group inline-flex items-center" aria-label="CrispPDF home">
      {inner}
    </Link>
  );
}
