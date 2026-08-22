"use client";

import { useState } from "react";
import { upsertUserGame } from "@/app/actions/userGames";
import { GameStatus } from "@/generated/prisma/enums";
import "./Status.scss";

const STATUS_OPTIONS: {
  id: GameStatus;
  label: string;
  color: string;
  bg_color: string;
}[] = [
  {
    id: GameStatus.PLAYING,
    label: "PLAYING",
    color: "#f59e0b",
    bg_color: "#F59E0B1F",
  },
  {
    id: GameStatus.COMPLETED,
    label: "COMPLETED",
    color: "#22C55E",
    bg_color: "#22C55E1F",
  },
  {
    id: GameStatus.WISHLIST,
    label: "WISHLIST",
    color: "#38bdf8",
    bg_color: "#38BDF81F",
  },
  {
    id: GameStatus.DROPPED,
    label: "DROPPED",
    color: "#F43F5E",
    bg_color: "#F43F5E1F",
  },
];

interface StatusSelectProps {
  game?: {
    id: number;
    title: string;
    coverUrl?: string | null;
    developer?: string | null;
    genres?: string[];
    releaseYear?: number | null;
  };
  initialStatus?: GameStatus | null;
  onChange?: (status: GameStatus | null) => void;
}

export default function StatusSelect({
  game,
  initialStatus = null,
  onChange,
}: StatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = useState<GameStatus | null>(
    initialStatus,
  );

  const saveStatusToDb = async (status: GameStatus | null) => {
    if (!game || !game.id) {
      console.warn(
        "The game object was not passed to the StatusSelect component!",
      );
      return;
    }

    await upsertUserGame({
      apiGameId: game.id,
      title: game.title ?? "Unknown Game",
      coverUrl: game.coverUrl,
      developer: game.developer,
      genre: game.genres?.[0] ?? null,
      releaseYear: game.releaseYear,
      status: status,
    });
  };

  const handleSelect = async (id: GameStatus) => {
    const nextStatus = selectedStatus === id ? null : id;

    setSelectedStatus(nextStatus);
    onChange?.(nextStatus);

    await saveStatusToDb(nextStatus);
  };

  return (
    <div className="status-box">
      <h2 className="status-box__title">YOUR STATUS</h2>

      <ul className="status-box__list">
        {STATUS_OPTIONS.map((st) => {
          const isActive = selectedStatus === st.id;

          return (
            <li key={st.id} className="status-box__item">
              <button
                type="button"
                className={`status-btn ${isActive ? "status-btn--active" : ""}`}
                style={
                  {
                    "--status-color": st.color,
                    "--status-bg-color": st.bg_color,
                  } as React.CSSProperties
                }
                onClick={() => handleSelect(st.id)}
              >
                <span className="status-btn__dot" />
                <span className="status-btn__label">{st.label}</span>
                {isActive && <span className="status-btn__check">✓</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
