"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertUserGame } from "@/app/actions/userGames";
import { getCurrentUser } from "@/app/actions/auth";
import "./RatingSelect.scss";

interface RatingSelectProps {
  game: {
    id: number;
    title: string;
    coverUrl?: string | null;
    developer?: string | null;
    genres?: string[];
    releaseYear?: number | null;
  };
  initialRating?: number | null;
  onChange?: (rating: number | null) => void;
  onHoverChange?: (rating: number | null) => void;
}

const getRatingColorClass = (num: number) => {
  if (num <= 4) return "red";
  if (num <= 7) return "yellow";
  return "green";
};

function RatingSelect({
  game,
  initialRating = null,
  onChange,
  onHoverChange,
}: RatingSelectProps) {
  const router = useRouter();
  const [selectedRating, setSelectedRating] = useState<number | null>(
    initialRating,
  );
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating ?? selectedRating;

  const checkAuthAndExecute = async (action: () => Promise<void>) => {
    const user = await getCurrentUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    await action();
  };

  const handleMouseEnter = (num: number) => {
    setHoverRating(num);
    onHoverChange?.(num);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
    onHoverChange?.(null);
  };

  const saveRatingToDb = async (rating: number | null) => {
    await upsertUserGame({
      apiGameId: game.id,
      title: game.title,
      coverUrl: game.coverUrl,
      developer: game.developer,
      genre: game.genres?.[0] ?? null,
      releaseYear: game.releaseYear,
      rating: rating,
    });
  };

  const handleSelect = (num: number) => {
    checkAuthAndExecute(async () => {
      const nextRating = selectedRating === num ? null : num;

      setSelectedRating(nextRating);
      onChange?.(nextRating);

      await saveRatingToDb(nextRating);
    });
  };

  const handleClear = () => {
    checkAuthAndExecute(async () => {
      setSelectedRating(null);
      onChange?.(null);
      onHoverChange?.(null);

      await saveRatingToDb(null);
    });
  };

  return (
    <div className="rating-box">
      <span className="rating-box__title">OCIJENI IGRU</span>

      <div className="rating-grid" onMouseLeave={handleMouseLeave}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
          const isActive = activeRating !== null && num <= activeRating;
          const colorClass = getRatingColorClass(num);

          return (
            <button
              key={num}
              type="button"
              className={`rating-btn ${isActive ? `active active--${colorClass}` : ""}`}
              onMouseEnter={() => handleMouseEnter(num)}
              onClick={() => handleSelect(num)}
            >
              {num}
            </button>
          );
        })}
      </div>

      {selectedRating !== null && (
        <button
          type="button"
          className="rating-box__clear"
          onClick={handleClear}
        >
          Obriši ocjenu
        </button>
      )}
    </div>
  );
}

export default RatingSelect;
