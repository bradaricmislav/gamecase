import "./StatsOverview.scss";
import { getRatingColor } from "../collection-game-card/CollectionGameCard";

export interface StatsOverviewData {
  avgRating: number;
  ratedGamesCount: number;
  totalCount: number;
  playingCount: number;
  completedCount: number;
  wishlistCount: number;
  droppedCount: number;
  totalHours: number;
}

function StatsOverview({ stats }: { stats: StatsOverviewData }) {
  const getRatingLabel = (score: number) => {
    if (score >= 9) return "Remek-djelo";
    if (score >= 8) return "Izrsno";
    if (score >= 7) return "Dobro";
    if (score >= 5) return "Prosječno";
    return "Loše";
  };

  return (
    <ul className="stats-overview">
      <li className="stats-overview__stat">
        <span
          style={{ backgroundColor: getRatingColor(stats.avgRating) }}
          className="stats-overview__rating-badge"
        >
          {stats.avgRating}
        </span>
        <div className="stats-overview__info">
          <p className="stats-overview__label">PROSJEČNA OCJENA</p>
          <strong className="stats-overview__impression">
            {getRatingLabel(stats.avgRating)}
          </strong>
          <small className="stats-overview__rated-games-ratio">
            {stats.ratedGamesCount}/{stats.totalCount} ocjenjeno
          </small>
        </div>
      </li>
      <li className="stats-overview__stat">
        <p className="stats-overview__label">UKUPNO</p>
        <strong className="stats-overview__value">{stats.totalCount}</strong>
      </li>
      <li className="stats-overview__stat">
        <p className="stats-overview__label">ZAVRŠENO</p>
        <strong className="stats-overview__value stats-overview__value--completed">
          {stats.completedCount}
        </strong>
      </li>
      <li className="stats-overview__stat">
        <p className="stats-overview__label">TRENUTNO IGRAM</p>
        <strong className="stats-overview__value stats-overview__value--playing">
          {stats.playingCount}
        </strong>
      </li>
      <li className="stats-overview__stat">
        <p className="stats-overview__label">LISTA ŽELJA</p>
        <strong className="stats-overview__value stats-overview__value--wishlist">
          {stats.wishlistCount}
        </strong>
      </li>
      <li className="stats-overview__stat">
        <p className="stats-overview__label">SATI</p>
        <strong className="stats-overview__value stats-overview__value--hours">
          {stats.totalHours}
        </strong>
      </li>
    </ul>
  );
}

export default StatsOverview;
