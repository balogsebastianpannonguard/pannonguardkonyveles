/**
 * A Könyvelés modul egyelőre csak a biztonsági oldalt tartalmazza, munkaterület nincs.
 * Az első valódi modul ide kerül (zárolt állapotban kezdve), a bal sáv és az áttekintés ezt olvassa.
 */
export type Module = { no: string; label: string; title: string; text: string; icon: import("lucide-react").LucideIcon; more?: boolean };
export const MODULES: Module[] = [];
