import Link from "next/link";
import { AuthControls } from "@/components/auth/AuthButtons";
export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">
          <span className="logo-icon">🌙</span>
          <span>DreamDecode</span>
        </Link>
        <nav className="header-nav">
          <Link href="/" className="nav-link">
            Главная
          </Link>
          <Link href="/dreams" className="nav-link">
            Мои сны
          </Link>
          <Link href="/analytics" className="nav-link">
            Аналитика
          </Link>
          <Link href="/view-db" className="nav-link">
            View DB
          </Link>
          <AuthControls />
          <Link href="/dream/new" className="btn btn-primary" style={{ margin: "0" }}>
            + Записать
          </Link>
        </nav>
      </div>
    </header>
  );
}
