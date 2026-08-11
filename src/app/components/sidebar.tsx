"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./sidebar.scss";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img
            className="sidebar__logo"
            src="/icons/gamepad_icon.svg"
            alt="Gamepad Icon"
          />
          GAMECASE
        </div>

        <div className="sidebar__stats">
          <h2>AVG SCORE</h2>
          <div className="sidebar__stats-body">
            <span className="sidebar__stats-rating">9</span>
            <div className="sidebar__stats-info">
              <span className="sidebar__rated">10 rated</span>
              <span className="sidebar__total">12 total</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link
            href="/dashboard"
            className={`nav-item ${pathname === "/dashboard" ? "active" : ""}`}
          >
            <span>
              <img src="/icons/dashboard_icon.svg" alt="Dashboard Icon" />
            </span>{" "}
            Dashboard
          </Link>
          <Link
            href="/mycollection"
            className={`nav-item ${pathname === "/mycollection" ? "active" : ""}`}
          >
            <span>
              <img src="/icons/collection_icon.svg" alt="Collection Icon" />
            </span>{" "}
            My Collection
          </Link>
          <Link
            href="/browse"
            className={`nav-item ${pathname === "/browse" ? "active" : ""}`}
          >
            <span>
              <img src="/icons/search_icon.svg" alt="Search Icon" />
            </span>{" "}
            Browse Games
          </Link>
        </nav>

        <div className="status-group">
          <p className="status-title">BY STATUS</p>
          <div className="status-list">
            <Link href="/mycollection" className="status-item">
              <span className="status-label">
                <span className="status-dot"></span> All Games
              </span>
              <span className="status-count">12</span>
            </Link>
            <Link href="/mycollection?status=playing" className="status-item">
              <span className="status-label">
                <span className="status-dot playing"></span> Playing
              </span>
              <span className="status-count">2</span>
            </Link>
            <Link href="/mycollection?status=completed" className="status-item">
              <span className="status-label">
                <span className="status-dot completed"></span> Completed
              </span>
              <span className="status-count">7</span>
            </Link>
            <Link href="/mycollection?status=wishlist" className="status-item">
              <span className="status-label">
                <span className="status-dot wishlist"></span> Wishlist
              </span>
              <span className="status-count">2</span>
            </Link>
            <Link href="/mycollection?status=dropped" className="status-item">
              <span className="status-label">
                <span className="status-dot dropped"></span> Dropped
              </span>
              <span className="status-count">1</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="user-footer">
        <div className="avatar">A</div>
        <div className="user-details">
          <span className="user-name">Alex Rivera</span>
          <span className="user-stats">12 games tracked</span>
        </div>
      </div>
    </aside>
  );
}
