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
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user?.image ? (
            <img
              src={user.image}
              alt={displayName}
              width={32}
              height={32}
              style={{ borderRadius: "999px", objectFit: "cover" }}
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(124, 58, 237, 0.2)",
                color: "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              {initial || "?"}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "14px", color: "var(--text-primary)" }}>
              {displayName}
            </span>
            {email ? (
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
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
