type Props = { size?: number; className?: string; ring?: boolean; title?: string };

/** The OSMAYA mark: four drop-shaped petals meeting at a centre, optionally inside a thin circle. */
export function PetalMark({ size = 24, className, ring = true, title }: Props) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
      stroke="currentColor"
    >
      {ring && <circle cx="20" cy="20" r="18.5" strokeWidth="1" />}
      <g strokeWidth="1.3" strokeLinejoin="round">
        <path d="M20 20C15.6 15.6 15.6 9 20 5.5 24.4 9 24.4 15.6 20 20Z" />
        <path d="M20 20C24.4 15.6 31 15.6 34.5 20 31 24.4 24.4 24.4 20 20Z" />
        <path d="M20 20C24.4 24.4 24.4 31 20 34.5 15.6 31 15.6 24.4 20 20Z" />
        <path d="M20 20C15.6 24.4 9 24.4 5.5 20 9 15.6 15.6 15.6 20 20Z" />
      </g>
    </svg>
  );
}
