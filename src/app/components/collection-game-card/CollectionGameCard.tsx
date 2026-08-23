import Link from "next/link";
import { GameStatus } from "@prisma/client";
import "./CollectionGameCard.scss";

export interface CollectionGame {
  id: string;
  apiGameId: number;
  title: string;
  coverUrl?: string | null;
  developer?: string | null;
  genre?: string | null;
  releaseYear?: number | null;
  status: GameStatus;
  rating?: number | null;
  hoursPlayed?: number | null;
}

export interface CollectionGameCardProps {
  game: CollectionGame;
}

export const getRatingColor = (rating?: number | null) => {
  if (!rating) return "#171F30";
  if (rating >= 8) return "#66CC33";
  if (rating >= 5) return "#ffc107";
  return "#ff4d4d";
};

const getStatusColor = (status: string) => {
  if (status === "COMPLETED") return "#22C55E";
  if (status === "PLAYING") return "#f59e0b";
  if (status === "WISHLIST") return "#38bdf8";
  return "#F43F5E";
};

function CollectionGameCard({ game }: CollectionGameCardProps) {
  return (
    <li className="game-card">
      <Link href={`/games/${game.apiGameId}`} className="game-card__link">
        <div className="game-card__game-info">
          <img
            className="game-card__game-cover"
            src={game.coverUrl || "/placeholder-cover.png"}
            alt={game.title}
          />
          <span
            style={{
              backgroundColor: getRatingColor(game.rating),
              color: game.rating ? "#1e2a3a" : "#2E3F58",
            }}
            className="game-card__game-rating"
          >
            {game.rating ? game.rating : "-"}
          </span>
          <div className="game-card__game-details">
            <h2 className="game-card__game-title">{game.title}</h2>
            <ul className="game-card__game-meta">
              <li>{game.developer}</li>
              <li>{game.genre}</li>
              <li>{game.releaseYear}</li>
            </ul>
          </div>
        </div>
        <div className="game-card__status">
          <time className="game-card__game-hours-played">
            {game.hoursPlayed}h
          </time>
          <span
            style={{
              color: getStatusColor(game.status),
              backgroundColor: `${getStatusColor(game.status)}1F`,
            }}
            className="game-card__game-status"
          >
            {game.status}
          </span>
        </div>
      </Link>
    </li>
  );
}

export default CollectionGameCard;
