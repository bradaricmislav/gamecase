"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameStatus } from "@prisma/client";
import { upsertUserGame } from "@/app/actions/userGames";
import { getCurrentUser } from "@/app/actions/auth";
import "./AddButton.scss";

interface AddButtonProps {
  game: {
    id: number;
    title: string;
    coverUrl?: string | null;
    developer?: string | null;
    genres?: string[];
    releaseYear?: number | null;
  };
  initialStatus?: GameStatus | null;
}

export default function AddButton({
  game,
  initialStatus = null,
}: AddButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState<GameStatus | null>(initialStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkAuthAndExecute = async (action: () => Promise<void>) => {
    const user = await getCurrentUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    await action();
  };

  const handleStatusChange = (newStatus: GameStatus) => {
    checkAuthAndExecute(async () => {
      setLoading(true);
      setStatus(newStatus);

      await upsertUserGame({
        apiGameId: game.id,
        title: game.title,
        coverUrl: game.coverUrl,
        developer: game.developer,
        genre: game.genres?.[0] || null,
        releaseYear: game.releaseYear,
        status: newStatus,
      });

      setLoading(false);
      setIsOpen(false);
    });
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    checkAuthAndExecute(async () => {
      setIsOpen(true);
    });
  };

  if (!isOpen && !status) {
    return (
      <button
        className="add-button__default"
        disabled={loading}
        onClick={handleOpen}
      >
        + DODAJ
      </button>
    );
  }

  if (!isOpen && status) {
    return (
      <button
        className={`add-button__badge add-button__badge--${status.toLowerCase()}`}
        disabled={loading}
        onClick={handleOpen}
      >
        {status}
      </button>
    );
  }

  return (
    <div
      className="add-button__status-group"
      onClick={(e) => e.preventDefault()}
    >
      <button
        className={`status-btn status-btn--playing ${status === GameStatus.PLAYING ? "active" : ""}`}
        onClick={() => handleStatusChange(GameStatus.PLAYING)}
      >
        IGRAM
      </button>
      <button
        className={`status-btn status-btn--completed ${status === GameStatus.COMPLETED ? "active" : ""}`}
        onClick={() => handleStatusChange(GameStatus.COMPLETED)}
      >
        ZAVRŠENO
      </button>
      <button
        className={`status-btn status-btn--wishlist ${status === GameStatus.WISHLIST ? "active" : ""}`}
        onClick={() => handleStatusChange(GameStatus.WISHLIST)}
      >
        LISTA ŽELJA
      </button>
      <button
        className={`status-btn status-btn--dropped ${status === GameStatus.DROPPED ? "active" : ""}`}
        onClick={() => handleStatusChange(GameStatus.DROPPED)}
      >
        ODBAČENO
      </button>
      <button className="status-btn status-btn--remove" onClick={handleClose}>
        ✕
      </button>
    </div>
  );
}
