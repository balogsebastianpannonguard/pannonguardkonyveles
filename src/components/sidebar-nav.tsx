"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Lock, ShieldCheck, type LucideIcon } from "lucide-react";
import { MODULES } from "@/lib/modules";

type NavGroup = { title: string; links: { href: string; label: string; icon: LucideIcon }[] };

const GROUPS: NavGroup[] = [
  { title: "Munka", links: [{ href: "/", label: "Áttekintés", icon: LayoutDashboard }] },
  { title: "Fiók", links: [{ href: "/biztonsag", label: "Biztonság", icon: ShieldCheck }] },
];

export function SidebarNav({ compact = false }: { compact?: boolean }) {
  return (
    <Suspense fallback={<NavList compact={compact} pathname={null} />}>
      <LiveNav compact={compact} />
    </Suspense>
  );
}

function LiveNav({ compact }: { compact: boolean }) {
  return <NavList compact={compact} pathname={usePathname()} />;
}

const NAV_MODULES = MODULES.filter((module) => !module.more);

const linkClass =
  "pg-nav-link flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white";

/** Zárolt modul: látszik a neve, de fejlesztés alatt áll, ezért nem kattintható. */
function LockedItem({ label, title, icon: Icon, compact }: { label: string; title: string; icon: LucideIcon; compact?: boolean }) {
  return (
    <span
      aria-disabled="true"
      title={`${title} – fejlesztés alatt`}
      className={`pg-locked flex cursor-not-allowed items-center rounded-xl text-sm font-medium text-white/40 ${
        compact ? "shrink-0 gap-2 px-3 py-2" : "gap-3 px-3.5 py-2"
      }`}
    >
      <Icon size={compact ? 16 : 17} aria-hidden className="text-white/30" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <Lock size={13} aria-label="Fejlesztés alatt" className="shrink-0 text-volt/70" />
    </span>
  );
}

function NavList({ compact, pathname }: { compact: boolean; pathname: string | null }) {
  const isActive = (href: string) =>
    pathname !== null && (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  const [work, account] = GROUPS;

  if (compact) {
    return (
      <nav aria-label="Fő navigáció" className="flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
        {[...work.links, ...account.links].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className="pg-nav-link flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <Icon size={16} aria-hidden className="text-white/45" />
            {label}
          </Link>
        ))}
        {NAV_MODULES.map(({ no, label, title, icon }) => (
          <LockedItem key={no} label={label} title={title} icon={icon} compact />
        ))}
      </nav>
    );
  }

  const renderLinks = (links: NavGroup["links"]) =>
    links.map(({ href, label, icon: Icon }) => (
      <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className={linkClass}>
        <Icon size={17} aria-hidden className="text-white/45 transition-colors" />
        {label}
      </Link>
    ));

  return (
    <nav aria-label="Fő navigáció" className="space-y-5">
      <div>
        <p className="mb-1.5 px-3.5 text-[0.62rem] font-semibold tracking-[0.2em] text-white/35 uppercase">{work.title}</p>
        <div className="flex flex-col gap-0.5">{renderLinks(work.links)}</div>
      </div>

      {NAV_MODULES.length > 0 && (
      <div>
          <p className="mb-1.5 flex items-center justify-between px-3.5 text-[0.62rem] font-semibold tracking-[0.2em] text-white/35 uppercase">
            Munkaterületek
            <span className="tracking-normal normal-case text-volt/70">fejlesztés alatt</span>
          </p>
          <div className="flex flex-col gap-0.5">
            {NAV_MODULES.map(({ no, label, title, icon }) => (
              <LockedItem key={no} label={label} title={title} icon={icon} />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-1.5 px-3.5 text-[0.62rem] font-semibold tracking-[0.2em] text-white/35 uppercase">{account.title}</p>
        <div className="flex flex-col gap-0.5">{renderLinks(account.links)}</div>
      </div>
    </nav>
  );
}
