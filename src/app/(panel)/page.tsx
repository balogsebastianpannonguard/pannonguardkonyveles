import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CircleAlert,
  CircleCheck,
  Calculator,
  DatabaseZap,
  LogIn,
  MonitorSmartphone,
  PartyPopper,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { formatStamp, greeting } from "@/lib/dates";
import { loadActivity } from "@/lib/overview";
import { countActiveSessions, requireUser } from "@/lib/session";
import { ensureWorkspace } from "@/lib/workspace";

export const metadata: Metadata = { title: "Áttekintés" };

const today = new Intl.DateTimeFormat("hu-HU", { timeZone: "Europe/Budapest", year: "numeric", month: "long", day: "numeric", weekday: "long" });

export default function OverviewPage({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <Overview searchParams={searchParams} />
    </Suspense>
  );
}

async function Overview({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const [user, params] = await Promise.all([requireUser(), searchParams]);
  const now = new Date();
  const [activity, sessions, workspace] = await Promise.all([
    loadActivity(user.session.userId, now),
    countActiveSessions(user.session.userId),
    ensureWorkspace(user.session.userId),
  ]);

  const cards: { label: string; value: string; note: string; icon: LucideIcon; tone: string; href?: string }[] = [
    {
      label: "Kétlépcsős azonosítás",
      value: user.totpEnabledAt ? "Aktív" : "Hiányzik",
      note: user.totpEnabledAt ? `${formatStamp(user.totpEnabledAt)} óta védett a fiókod` : "Állítsd be a hitelesítőt",
      icon: ShieldCheck,
      tone: user.totpEnabledAt ? "text-volt-bright" : "text-amber-300",
    },
    {
      label: "Aktív munkamenet",
      value: String(sessions),
      note: sessions === 1 ? "csak ez az eszköz" : "eszközön vagy belépve",
      icon: MonitorSmartphone,
      tone: "text-azure",
      href: "/biztonsag",
    },
    {
      label: "Belépések (30 nap)",
      value: String(activity.logins30),
      note: activity.previousLogin ? `Előző: ${formatStamp(activity.previousLogin)}` : "Ez az első belépésed – üdv a csapatban!",
      icon: activity.failures ? CircleAlert : LogIn,
      tone: activity.failures ? "text-amber-300" : "text-white",
      href: "/biztonsag",
    },
    {
      label: "Saját adattér",
      value: "Privát",
      note: `${formatStamp(workspace.createdAt)} óta – csak te látod`,
      icon: DatabaseZap,
      tone: "text-azure",
    },
  ];

  return (
    <div className="space-y-8">
      {params.udv === "1" && (
        <div className="pg-rise flex items-center gap-4 rounded-2xl border border-volt/25 bg-linear-to-r from-volt/15 to-transparent p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-volt/20 text-volt">
            <PartyPopper size={22} aria-hidden />
          </span>
          <div>
            <p className="font-semibold">A fiókod elkészült, a hitelesítő aktív.</p>
            <p className="text-sm text-white/60">Innentől a belépéshez a jelszavad és a telefonod kódja is kell.</p>
          </div>
        </div>
      )}

      <section className="pg-panel pg-rise relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-ember/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-volt/20 blur-3xl" />
        <Sparkly />
        <div className="relative">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-volt uppercase">
            <Calculator size={15} aria-hidden /> Könyvelés · {today.format(now)}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            {greeting(now)},
            <br />
            <span className="pg-accent-text">{user.firstName}!</span>
          </h1>
          <p className="mt-4 max-w-xl text-white/65">
            Örülünk, hogy itt vagy. Ez a PannonGuard Könyvelés modul otthona. Egyelőre csak a biztonsági oldal van itt; a fiókod és a belépéseid ott láthatók, minden más hamarosan érkezik.
          </p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, note, icon: Icon, tone, href }, index) => {
          const body = (
            <>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-white/60">{label}</p>
                <Icon size={18} aria-hidden className={tone} />
              </div>
              <p className={`mt-3 font-display text-3xl font-semibold ${tone}`}>{value}</p>
              <p className="mt-1 truncate text-xs text-white/45">{note}</p>
            </>
          );
          const className = "pg-card pg-rise block rounded-2xl bg-linear-to-br from-volt/10 to-transparent p-5";
          const style = { animationDelay: `${0.1 + index * 0.06}s` };
          return href ? (
            <Link key={label} href={href} className={`${className} hover:bg-white/5`} style={style}>
              {body}
            </Link>
          ) : (
            <div key={label} className={className} style={style}>
              {body}
            </div>
          );
        })}
      </div>

      <p className="flex items-center gap-2 text-xs text-white/40">
        <CircleCheck size={14} aria-hidden className="text-volt" /> A fiókod kétlépcsős azonosítással védett; a biztonsági
        részleteket a Biztonság oldalon látod.
      </p>
    </div>
  );
}

/** Díszítő, kedves „pénzérme-eső”: lebegő érmék és csillámok. Tisztán vizuális, nem valódi adat. */
function Sparkly() {
  const coins = [
    { x: 70, y: 70, r: 22, d: "0s" },
    { x: 205, y: 55, r: 16, d: "-1.1s" },
    { x: 238, y: 150, r: 26, d: "-2.2s" },
    { x: 120, y: 175, r: 18, d: "-0.6s" },
    { x: 190, y: 235, r: 14, d: "-1.7s" },
    { x: 62, y: 235, r: 12, d: "-2.8s" },
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 300"
      className="pointer-events-none absolute top-1/2 right-4 hidden size-72 -translate-y-1/2 md:block lg:right-10 lg:size-80"
    >
      <defs>
        <radialGradient id="pg-coin" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffe9c9" />
          <stop offset="0.6" stopColor="#ffb86b" />
          <stop offset="1" stopColor="#d98a2b" />
        </radialGradient>
      </defs>
      {coins.map(({ x, y, r, d }, index) => (
        <g key={index} className="pg-float" style={{ animationDelay: d }}>
          <circle cx={x} cy={y} r={r} fill="url(#pg-coin)" />
          <circle cx={x} cy={y} r={r * 0.68} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.4" strokeDasharray="2 3" />
          <text x={x} y={y + r * 0.3} textAnchor="middle" fontSize={r * 0.9} fontWeight="700" fill="#a85f12" fillOpacity="0.8">
            Ft
          </text>
        </g>
      ))}
      {[
        [150, 110, 7],
        [270, 90, 5],
        [30, 150, 6],
        [160, 270, 5],
      ].map(([x, y, size], index) => (
        <path
          key={index}
          className="pg-node-ping"
          style={{ animationDelay: `${index * 0.8}s` }}
          d={`M${x} ${y - size}L${x + size * 0.3} ${y - size * 0.3}L${x + size} ${y}L${x + size * 0.3} ${y + size * 0.3}L${x} ${y + size}L${x - size * 0.3} ${y + size * 0.3}L${x - size} ${y}L${x - size * 0.3} ${y - size * 0.3}Z`}
          fill="#72c7ff"
        />
      ))}
    </svg>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="pg-skeleton h-64 rounded-[2rem]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="pg-skeleton h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
