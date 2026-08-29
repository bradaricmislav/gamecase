"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getRatingColor } from "../collection-game-card/CollectionGameCard";

export interface Stats {
  avgRating: number;
  ratedGamesCount: number;
  totalCount: number;
  playingCount: number;
  completedCount: number;
  wishlistCount: number;
  droppedCount: number;
  favoritesCount?: number;
  disappointmentsCount?: number;
}

function SidebarNav({ stats }: { stats: Stats }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status")?.toLowerCase();
  const currentList = searchParams.get("list")?.toLowerCase();

  const isMyCollectionPage = pathname === "/mycollection";

  const isStatusActive = (statusParam: string | null) => {
    if (!isMyCollectionPage || currentList) return false;
    if (statusParam === null) return !currentStatus || currentStatus === "all";
    return currentStatus === statusParam;
  };

  const isListActive = (listParam: string) => {
    if (!isMyCollectionPage) return false;
    return currentList === listParam;
  };

  return (
    <>
      <div className="sidebar__stats">
        <h2>PROSJEČNA OCJENA</h2>
        <div className="sidebar__stats-body">
          <span
            style={{ backgroundColor: getRatingColor(stats.avgRating) }}
            className="sidebar__stats-rating"
          >
            {stats.avgRating}
          </span>
          <div className="sidebar__stats-info">
            <span className="sidebar__rated">
              {stats.ratedGamesCount} ocjenjeno
            </span>
            <span className="sidebar__total">{stats.totalCount} ukupno</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li>
            <Link
              href="/dashboard"
              className={`nav-item ${pathname === "/dashboard" ? "active" : ""}`}
            >
              <span>
                <img
                  src="/icons/dashboard_icon.svg"
                  alt="Ikona nadzorne ploče"
                />
              </span>
              Nadzorna ploča
            </Link>
          </li>

          <li>
            <Link
              href="/mycollection"
              className={`nav-item ${isMyCollectionPage ? "active" : ""}`}
            >
              <span>
                <img src="/icons/collection_icon.svg" alt="Ikona kolekcije" />
              </span>
              Moja kolekcija
            </Link>
          </li>

          <li>
            <Link
              href="/browse"
              className={`nav-item ${pathname === "/browse" ? "active" : ""}`}
            >
              <span>
                <img src="/icons/search_icon.svg" alt="Ikona pretraživanja" />
              </span>
              Pretraži igre
            </Link>
          </li>
        </ul>
      </nav>

      <div className="status-group">
        <p className="status-title">PO STATUSU</p>
        <ul className="status-list">
          <li className="status-item">
            <Link
              href="/mycollection"
              className={`status-link ${isStatusActive(null) ? "active" : ""}`}
            >
              <span className="status-label">
                <span className="status-dot"></span> Sve igre
              </span>
              <span className="status-count">{stats.totalCount}</span>
            </Link>
          </li>

          <li className="status-item">
            <Link
              href="/mycollection?status=PLAYING"
              className={`status-link ${isStatusActive("playing") ? "active" : ""}`}
            >
              <span className="status-label">
                <span className="status-dot playing"></span> Trenutno igram
              </span>
              <span className="status-count">{stats.playingCount}</span>
            </Link>
          </li>

          <li className="status-item">
            <Link
              href="/mycollection?status=COMPLETED"
              className={`status-link ${isStatusActive("completed") ? "active" : ""}`}
            >
              <span className="status-label">
                <span className="status-dot completed"></span> Završeno
              </span>
              <span className="status-count">{stats.completedCount}</span>
            </Link>
          </li>

          <li className="status-item">
            <Link
              href="/mycollection?status=WISHLIST"
              className={`status-link ${isStatusActive("wishlist") ? "active" : ""}`}
            >
              <span className="status-label">
                <span className="status-dot wishlist"></span> Lista želja
              </span>
              <span className="status-count">{stats.wishlistCount}</span>
            </Link>
          </li>

          <li className="status-item">
            <Link
              href="/mycollection?status=DROPPED"
              className={`status-link ${isStatusActive("dropped") ? "active" : ""}`}
            >
              <span className="status-label">
                <span className="status-dot dropped"></span> Napušteno
              </span>
              <span className="status-count">{stats.droppedCount}</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="status-group">
        <p className="status-title">POSEBNE LISTE</p>
        <ul className="status-list">
          <li className="status-item">
            <Link
              href="/mycollection?list=favorites"
              className={`status-link ${isListActive("favorites") ? "active" : ""}`}
            >
              <span className="status-label">
                <img src="/icons/star_icon.svg" alt="Ikona zvjezdice" />
                Omiljeno
              </span>
              {stats.favoritesCount !== undefined && (
                <span className="status-count">{stats.favoritesCount}</span>
              )}
            </Link>
          </li>

          <li className="status-item">
            <Link
              href="/mycollection?list=disappointments"
              className={`status-link ${isListActive("disappointments") ? "active" : ""}`}
            >
              <span className="status-label">
                <img
                  src="/icons/heart-broken_icon.svg"
                  alt="Ikona slomljenog srca"
                />{" "}
                Razočaranja
              </span>
              {stats.disappointmentsCount !== undefined && (
                <span className="status-count">
                  {stats.disappointmentsCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default SidebarNav;
