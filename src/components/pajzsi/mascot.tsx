export type Mood = "idle" | "think" | "talk" | "happy";

import { useId } from "react";

/**
 * Pajzsi, a Könyvelés kis őrangyala: égkék pajzs-test, kerek könyvelő-szemüveg, pirospozsgás arc, a feje tetején
 * barackszínű érme csillámmal és egy ceruzával a „füle” mögött. Pislog; gondolkodáskor felfelé néz és a szemüvege
 * mögött pöttyök jelennek meg, beszéléskor mozog a szája, örömkor mosolygó szemei és érméi pörögnek. Tiszta SVG.
 */
export function Mascot({ size = 56, mood = "idle", float = false }: { size?: number; mood?: Mood; float?: boolean }) {
  // Egyedi azonosító a színátmenetekhez, hogy több figura egymás mellett se ütközzön.
  const id = `pzi${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const look = mood === "think" ? { x: 1.1, y: -1.2 } : { x: 0.5, y: 0.4 };
  const eye = (cx: number) => (
    <g className="pg-blink">
      <circle cx={cx} cy="35" r="5.2" fill="#fff" />
      <circle cx={cx + look.x} cy={35 + look.y} r="2.7" fill="#0a1530" />
      <circle cx={cx + 1 + look.x} cy={34 + look.y} r="0.9" fill="#fff" />
    </g>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Pajzsi, a Könyvelés kis őrangyala"
      className={float ? "pg-float" : undefined}
      overflow="visible"
    >
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#b7e3ff" />
          <stop offset="0.5" stopColor="#4aa9ee" />
          <stop offset="1" stopColor="#0d1b3a" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eaf7ff" />
          <stop offset="1" stopColor="#72c7ff" />
        </linearGradient>
        <radialGradient id={`${id}o`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffe9c9" />
          <stop offset="0.6" stopColor="#ffb86b" />
          <stop offset="1" stopColor="#d98a2b" />
        </radialGradient>
        <radialGradient id={`${id}s`} cx="0.3" cy="0.2" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ceruza */}
      <g transform="rotate(28 50 10)">
        <rect x="47.5" y="-2" width="5" height="17" rx="1.2" fill="#ffd36b" stroke="#0a1530" strokeOpacity="0.3" strokeWidth="0.7" />
        <path d="M47.5 15h5l-2.5 4.6Z" fill="#f6d2a8" />
        <path d="M49.2 17.6h1.6l-.8 1.9Z" fill="#33405f" />
        <rect x="47.5" y="-2" width="5" height="3.5" rx="1.2" fill="#ff8aa6" />
      </g>

      {/* pajzs-test */}
      <path
        d="M32 8 55 15v16c0 14.5-9.8 24-23 28C18.8 55 9 45.5 9 31V15L32 8Z"
        fill={`url(#${id}b)`}
        stroke={`url(#${id}g)`}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M32 11.5 51.5 17.5v13.5c0 12.5-8.4 20.4-19.5 24" fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="22" cy="22" rx="12" ry="9" fill={`url(#${id}s)`} />

      {/* érme a fején */}
      <g className={mood === "happy" ? "pg-dot" : undefined}>
        <circle cx="32" cy="8" r="6.4" fill={`url(#${id}o)`} stroke="#0a1530" strokeOpacity="0.3" strokeWidth="0.8" />
        <circle cx="32" cy="8" r="4.2" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="0.9" strokeDasharray="1.4 1.6" />
        <path d="M30.2 8h3.6M32 6.2v3.6" stroke="#a85f12" strokeOpacity="0.75" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* szemek szemüveggel */}
      {mood === "happy" ? (
        <>
          <path d="M20 36.5c1.4-3.4 5.6-3.4 7 0" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M37 36.5c1.4-3.4 5.6-3.4 7 0" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          {eye(23.5)}
          {eye(40.5)}
        </>
      )}
      <g fill="none" stroke="#ffb86b" strokeWidth="1.8">
        <circle cx="23.5" cy="35" r="6.6" />
        <circle cx="40.5" cy="35" r="6.6" />
        <path d="M30.1 35h3.8" strokeLinecap="round" />
      </g>
      {mood === "think" && <path d="M36 25.6c2-1.6 5-1.8 7.2-.4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />}

      {/* pír és száj */}
      <ellipse cx="17.5" cy="44.5" rx="3" ry="2.1" fill="#ff9fb2" opacity={mood === "happy" ? 0.9 : 0.6} />
      <ellipse cx="46.5" cy="44.5" rx="3" ry="2.1" fill="#ff9fb2" opacity={mood === "happy" ? 0.9 : 0.6} />
      {mood === "talk" ? (
        <ellipse className="pg-talk" cx="32" cy="47.5" rx="3.4" ry="3" fill="#7a2742" stroke="#fff" strokeWidth="1.4" />
      ) : mood === "think" ? (
        <path d="M28.5 47.5h7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      ) : (
        <path d="M26.5 45.5c2.2 3.4 8.8 3.4 11 0" fill="#7a2742" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* gondolkodás pöttyei és örömérmék */}
      {mood === "think" && (
        <g fill="#ffd9ae">
          {[0, 1, 2].map((n) => (
            <circle key={n} className="pg-dot" cx={46 + n * 5.5} cy={9 - n * 2} r={1.6 + n * 0.5} style={{ animationDelay: `${n * 0.2}s` }} />
          ))}
        </g>
      )}
      {mood === "happy" && (
        <g>
          <circle className="pg-dot" cx="54" cy="20" r="3" fill="#ffb86b" />
          <circle className="pg-dot" style={{ animationDelay: "0.4s" }} cx="8" cy="22" r="2.4" fill="#72c7ff" />
        </g>
      )}
    </svg>
  );
}
