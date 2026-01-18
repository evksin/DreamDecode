"use client";

import { signIn, signOut } from "next-auth/react";

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
