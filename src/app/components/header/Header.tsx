"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { logoutUser } from "@/app/actions/auth";
import { getCurrentUser } from "@/app/actions/auth";
import "./Header.scss";
import Link from "next/link";

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
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLight(true);
      document.documentElement.classList.add("light");
    }

    getCurrentUser().then((name) => {
      setUsername(name);
    });
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

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Failed to sign out:", error);
      setLoading(false);
    }
  };

  return (
    <header className="header header-area">
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
        {username ? (
          <>
            <div className="user-badge">
              <div className="badge-avatar">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="badge-name">{username}</span>
            </div>

            <button
              className="signout-btn"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "SIGNING OUT..." : "SIGN OUT"}
            </button>
          </>
        ) : (
          <button className="login-btn">
            <Link className="login-link" href="/auth/login">
              LOG IN
            </Link>
          </button>
        )}
      </div>
    </header>
  );
}
