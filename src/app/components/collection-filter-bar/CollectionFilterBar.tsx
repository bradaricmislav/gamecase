"use client";

import { GameStatus } from "@/generated/prisma";
import "./CollectionFilterBar.scss";

interface FilterBarProps {
  counts: {
    ALL: number;
    PLAYING: number;
    COMPLETED: number;
    WISHLIST: number;
    DROPPED: number;
    FAVORITES?: number;
    DISAPPOINTMENTS?: number;
  };
  selectedStatus: string | null;
  selectedList?: string | null;
  onFilterChange: (type: "status" | "list", value: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const STATUS_TABS = [
  { id: "ALL", label: "ALL", colorClass: "" },
  { id: GameStatus.PLAYING, label: "PLAYING", colorClass: "playing" },
  { id: GameStatus.COMPLETED, label: "COMPLETED", colorClass: "completed" },
  { id: GameStatus.WISHLIST, label: "WISHLIST", colorClass: "wishlist" },
  { id: GameStatus.DROPPED, label: "DROPPED", colorClass: "dropped" },
];

const SPECIAL_LIST_TABS = [
  {
    id: "favorites",
    label: "FAVORITES",
    icon: "/icons/star_icon.svg",
    countKey: "FAVORITES",
  },
  {
    id: "disappointments",
    label: "DISAPPOINTMENTS",
    icon: "/icons/heart-broken_icon.svg",
    countKey: "DISAPPOINTMENTS",
  },
];

export default function CollectionFilterBar({
  counts,
  selectedStatus,
  selectedList,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__tabs">
        {STATUS_TABS.map((tab) => {
          const count = counts[tab.id as keyof typeof counts] ?? 0;
          const isActive = !selectedList && selectedStatus === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange("status", tab.id)}
              className={`filter-bar__tab-item ${isActive ? "filter-bar__tab-item--active" : ""}`}
            >
              {tab.colorClass && (
                <span
                  className={`filter-bar__status-dot filter-bar__status-dot--${tab.colorClass}`}
                />
              )}
              <span className="filter-bar__tab-label">{tab.label}</span>
              <span className="filter-bar__tab-count">{count}</span>
            </button>
          );
        })}

        <span className="filter-bar__divider" />

        {SPECIAL_LIST_TABS.map((tab) => {
          const count = counts[tab.countKey as keyof typeof counts] ?? 0;
          const isActive = selectedList === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange("list", tab.id)}
              className={`filter-bar__tab-item ${isActive ? "filter-bar__tab-item--active" : ""}`}
            >
              <img
                src={tab.icon}
                alt={`${tab.label} Icon`}
                className="filter-bar__tab-icon"
              />
              <span className="filter-bar__tab-label">{tab.label}</span>
              <span className="filter-bar__tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="filter-bar__filter-controls">
        <div className="filter-bar__search-box">
          <span className="filter-bar__search-icon">
            <img src="icons/search_icon.svg" alt="Search Icon" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="filter-bar__sort-select"
        >
          <option value="score_desc">Score: High → Low</option>
          <option value="score_asc">Score: Low → High</option>
          <option value="title_asc">Title: A → Z</option>
          <option value="updated_desc">Recently Updated</option>
        </select>
      </div>
    </div>
  );
}
