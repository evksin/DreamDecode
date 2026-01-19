"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => signIn("google")}
    >
      Войти через Google
    </button>
  );
}

export function LogoutButton() {
  return (
    <button type="button" className="btn btn-secondary" onClick={() => signOut()}>
      Выйти
    </button>
  );
}

export function AuthControls() {
  const { status, data } = useSession();

  if (status === "loading") {
    return null;
  }

  if (status === "authenticated") {
    const user = data?.user;
    const displayName = user?.name ?? user?.email ?? "Пользователь";
    const email = user?.email ?? "";
    const initial = displayName.trim().charAt(0).toUpperCase();

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {user?.image ? (
            <img
              src={user.image}
              alt={displayName}
              width={24}
              height={24}
              style={{ borderRadius: "999px", objectFit: "cover" }}
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(124, 58, 237, 0.2)",
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              {initial || "?"}
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "160px",
              lineHeight: 1.15,
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={displayName}
            >
              {displayName}
            </span>
            {email ? (
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={email}
              >
                {email}
              </span>
            ) : null}
          </div>
        </div>
        <LogoutButton />
      </div>
    );
  }

  return (
    <Link className="btn btn-secondary" href="/login">
      Войти
    </Link>
  );
}
