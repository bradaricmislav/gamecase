import Link from "next/link";
import "./Statuses.scss";

export interface StatsOverviewData {
  playingCount: number;
  completedCount: number;
  wishlistCount: number;
  droppedCount: number;
}

async function Statuses({ stats }: { stats: StatsOverviewData }) {
  const getStatusColor = (status: string) => {
    if (status === "PLAYING") return "#F59E0B";
    if (status === "COMPLETED") return "#22C55E";
    if (status === "WISHLIST") return "#38BDF8";
    return "#F43F5E";
  };

  return (
    <ul className="statuses">
      <li className="statuses__status">
        <Link
          style={{ color: getStatusColor("PLAYING") }}
          href="/mycollection?status=PLAYING"
        >
          <div className="statuses__stat-header">
            <span
              className="dot"
              style={{ backgroundColor: getStatusColor("PLAYING") }}
            />
            PLAYING
          </div>
          {stats.playingCount}
        </Link>
      </li>
      <li className="statuses__status">
        <Link
          style={{ color: getStatusColor("COMPLETED") }}
          href="/mycollection?status=COMPLETED"
        >
          <div className="statuses__stat-header">
            <span
              className="dot"
              style={{ backgroundColor: getStatusColor("COMPLETED") }}
            />
            COMPLETED
          </div>
          {stats.completedCount}
        </Link>
      </li>
      <li className="statuses__status">
        <Link
          style={{ color: getStatusColor("WISHLIST") }}
          href="/mycollection?status=WISHLIST"
        >
          <div className="statuses__stat-header">
            <span
              className="dot"
              style={{ backgroundColor: getStatusColor("WISHLIST") }}
            />
            WISHLIST
          </div>
          {stats.wishlistCount}
        </Link>
      </li>
      <li className="statuses__status">
        <Link
          style={{ color: getStatusColor("DROPPED") }}
          href="/mycollection?status=DROPPED"
        >
          <div className="statuses__stat-header">
            <span
              className="dot"
              style={{ backgroundColor: getStatusColor("DROPPED") }}
            />
            DROPPED
          </div>
          {stats.droppedCount}
        </Link>
      </li>
    </ul>
  );
}

export default Statuses;
