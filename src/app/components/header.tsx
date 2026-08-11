"use client";

import { usePathname } from "next/navigation";
import "./header.scss";

const getPageTitle = (pathname: string): string => {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname === "/mycollection") return "Collection";
  if (pathname === "/browse") return "Browse";

  if (pathname.startsWith("/games/")) return "Game Details";
  if (pathname.startsWith("/games")) return "Browse Games";

  return "";
};

export default function Header() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="header">
      <h1 className="header__title">{pageTitle}</h1>
      <div className="header-actions">
        <button className="theme-toggle" title="Promijeni temu">
          <img src="/icons/light-mode_icon.svg" alt="Light Mode Icon" />
        </button>

        <div className="user-badge">
          <div className="badge-avatar">M</div>
          <span className="badge-name">Mislav</span>
        </div>

        <button className="signout-btn">SIGN OUT</button>
      </div>
    </header>
  );
}
