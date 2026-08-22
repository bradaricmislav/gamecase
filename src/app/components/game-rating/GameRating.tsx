"use client";

import "./gameDetails.scss"; // ili SCSS gdje ti stoje stilovi

const RATING_INFO: Record<number, { label: string; colorClass: string }> = {
  1: { label: "TERRIBLE", colorClass: "red" },
  2: { label: "BAD", colorClass: "red" },
  3: { label: "POOR", colorClass: "red" },
  4: { label: "WEAK", colorClass: "red" },
  5: { label: "MEDIOCRE", colorClass: "yellow" },
  6: { label: "FAIR", colorClass: "yellow" },
  7: { label: "GOOD", colorClass: "yellow" },
  8: { label: "GREAT", colorClass: "green" },
  9: { label: "AMAZING", colorClass: "green" },
  10: { label: "MASTERPIECE", colorClass: "green" },
};

interface HeroRatingBadgeProps {
  score: number | null;
}

export default function HeroRatingBadge({ score }: HeroRatingBadgeProps) {
  if (!score || !RATING_INFO[score]) return null;

  const { label, colorClass } = RATING_INFO[score];

  return (
    <div className={`hero-rating-card hero-rating-card--${colorClass}`}>
      <div className="hero-rating-card__box">
        <div className="hero-rating-card__notch" />
      </div>
      <span className="hero-rating-card__label">{label}</span>
    </div>
  );
}
