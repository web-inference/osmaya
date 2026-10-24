import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type BtnProps = ComponentProps<"button"> & { children: ReactNode };

/** Ivory pill ending in an amber circle-arrow. Renders a link when href is given. */
export function PrimaryButton({ children, className = "", href, ...rest }: BtnProps & { href?: string }) {
  const inner = (
    <>
      <span>{children}</span>
      <span className="btn-dot" aria-hidden="true">
        <ArrowUpRight size={20} strokeWidth={1.75} />
      </span>
    </>
  );
  if (href) {
    return (
      <a href={href} className={`btn-primary ${className}`} data-cursor="link">
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={`btn-primary ${className}`} data-cursor="link" {...rest}>
      {inner}
    </button>
  );
}

export function ArrowPill({ label, href, className = "" }: { label: string; href: string; className?: string }) {
  return (
    <a href={href} aria-label={label} className={`arrow-pill glass ${className}`} data-cursor="link">
      <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />
    </a>
  );
}

export function IconCircle({ label, children, className = "", ...rest }: ComponentProps<"button"> & { label: string }) {
  return (
    <button type="button" aria-label={label} className={`icon-circle glass ${className}`} data-cursor="link" {...rest}>
      {children}
    </button>
  );
}
