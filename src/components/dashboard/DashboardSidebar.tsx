import Link from "next/link";
import { Star, History, Settings, Globe, Bookmark, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SidebarItem = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

const items: SidebarItem[] = [
  { key: "mine", label: "Сны", href: "/dashboard", icon: MessageSquare },
  { key: "public", label: "Публичные", href: "/dashboard/public", icon: Globe },
  { key: "favorites", label: "Избранное", href: "/dashboard/favorites", icon: Star },
  { key: "history", label: "История", href: "/dashboard/history", icon: History },
  { key: "settings", label: "Настройки", href: "/dashboard/settings", icon: Settings },
];

type DashboardSidebarProps = {
  activeKey: SidebarItem["key"];
  name: string;
  email?: string | null;
  image?: string | null;
};

export function DashboardSidebar({ activeKey, name, email, image }: DashboardSidebarProps) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <aside
      style={{
        width: "280px",
        background: "linear-gradient(180deg, #e0f2fe 0%, #e2e8f0 100%)",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid rgba(148, 163, 184, 0.4)",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        height: "fit-content",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        {image ? (
          <img
            src={image}
            alt={name}
            width={48}
            height={48}
            style={{ borderRadius: "999px", objectFit: "cover" }}
          />
        ) : (
          <div
            aria-hidden="true"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(59, 130, 246, 0.2)",
              color: "#0f172a",
              fontWeight: 600,
              fontSize: "18px",
            }}
          >
            {initial || "?"}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600, color: "#0f172a" }}>{name}</span>
          {email ? (
            <span style={{ fontSize: "12px", color: "#475569" }}>{email}</span>
          ) : null}
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;

          return (
            <Link
              key={item.key}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "12px",
                textDecoration: "none",
                color: isActive ? "#0f172a" : "#475569",
                background: isActive ? "rgba(148, 163, 184, 0.35)" : "transparent",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "24px", fontSize: "12px", color: "#64748b" }}>
        <Bookmark size={14} style={{ marginRight: "6px" }} />
        Личный кабинет DreamDecode
      </div>
    </aside>
  );
}
