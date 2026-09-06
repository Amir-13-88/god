interface IconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

const PATHS: Record<string, React.ReactNode> = {
  search: (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  book: (<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-4.5" /><path d="M9 7h7M9 11h5" /></>),
  cards: (<><rect x="3" y="7" width="13" height="14" rx="2" /><path d="M8 3h11a2 2 0 0 1 2 2v11" /><path d="M7 13l3-3 3 3M7 17h6" /></>),
  repeat: (<><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></>),
  gear: (<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" /></>),
  download: (<><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 21h16" /></>),
  upload: (<><path d="M12 15V3" /><path d="m7 8 5-5 5 5" /><path d="M4 21h16" /></>),
  speaker: (<><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" /></>),
  plus: (<path d="M12 5v14M5 12h14" />),
  check: (<path d="m4 12.5 5.5 5.5L20 6.5" />),
  x: (<path d="M6 6l12 12M18 6 6 18" />),
  trash: (<><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></>),
  wifi: (<><path d="M5 12.5a10 10 0 0 1 14 0" /><path d="M8.5 15.5a5.5 5.5 0 0 1 7 0" /><circle cx="12" cy="19" r="1" fill="currentColor" /></>),
  wifioff: (<><path d="M5 12.5a10 10 0 0 1 5.2-2.7M15.5 10.6a10 10 0 0 1 3.5 1.9" /><path d="M8.5 15.5a5.5 5.5 0 0 1 7 0" /><circle cx="12" cy="19" r="1" fill="currentColor" /><path d="M3 3l18 18" /></>),
  install: (<><path d="M12 3v10" /><path d="m8 9 4 4 4-4" /><path d="M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3" /></>),
  star: (<path d="m12 2.5 2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.5l-5.9 3.2 1.3-6.6L2.5 9.5l6.6-.8L12 2.5Z" />),
  chevL: (<path d="m14 6-6 6 6 6" />),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>),
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  layers: (<><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>),
  refresh: (<><path d="M21 12a9 9 0 1 1-2.6-6.4" /><path d="M21 3v6h-6" /></>),
  alert: (<><path d="M12 3 2.5 20h19L12 3Z" /><path d="M12 10v4M12 17.5h.01" /></>),
  sparkle: (<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16Z" />),
  phone: (<><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 18h4" /></>),
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></>),
  shuffle: (<><path d="M3 7h4l10 10h4" /><path d="m17 13 4 4-4 4" /><path d="M3 17h4l3-3" /><path d="M14 7h7" /><path d="m17 3 4 4-4 4" /></>),
  moon: (<path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5Z" />),
  arrow: (<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>),
};

export default function Icon({ name, className = "w-5 h-5", strokeWidth = 2 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name] ?? null}
    </svg>
  );
}
