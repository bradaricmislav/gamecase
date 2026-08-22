"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import "./Header.scss";

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

  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLight(true);
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setIsLight(false);
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsLight(true);
    }
  };

  return (
    <header className="header">
      <h1 className="header__title">{pageTitle}</h1>
      <div className="header-actions">
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title="Change theme"
        >
          <img
            src={
              isLight
                ? "/icons/dark-mode_icon.svg"
                : "/icons/light-mode_icon.svg"
            }
            alt="Theme Mode Icon"
          />
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
