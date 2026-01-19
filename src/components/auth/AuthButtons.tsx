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
  const { status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (status === "authenticated") {
    return <LogoutButton />;
  }

  return (
    <Link className="btn btn-secondary" href="/login">
      Войти
    </Link>
  );
}
