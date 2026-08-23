import { getUserCollection } from "@/app/actions/userGames";
import { getGameDetails } from "@/app/actions/igdb";
import { getRatingColor } from "../collection-game-card/CollectionGameCard";
import Link from "next/link";
import "./CurrentlyPlaying.scss";

async function CurrentlyPlaying() {
  const collection = await getUserCollection();
  const playingGames = collection
    .filter((g) => g.status === "PLAYING")
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 4);

  if (playingGames.length === 0) {
    return (
      <div className="empty">
        <p>You are not currently playing any game.</p>
      </div>
    );
  }

  const gamesWithDetails = await Promise.all(
    playingGames.map(async (userGame) => {
      const details = await getGameDetails(String(userGame.apiGameId));
      return {
        ...userGame,
        backdropUrl: details?.backdropUrl || userGame.coverUrl,
      };
    }),
  );

  const itemCount = gamesWithDetails.length;

  return (
    <ul className={`now-playing-grid items-${itemCount}`}>
      {gamesWithDetails.map((game) => (
        <li key={game.id} className="now-playing-card">
          <Link href={`/games/${game.apiGameId}`} className="card-link">
            {game.backdropUrl && (
              <div
                className="backdrop-image"
                style={{ backgroundImage: `url(${game.backdropUrl})` }}
              />
            )}
            <div className="card-overlay" />

            <div className="card-content">
              {game.rating !== null && (
                <div
                  style={{ backgroundColor: getRatingColor(game.rating) }}
                  className="rating-badge"
                >
                  {game.rating}
                </div>
              )}

              <div className="info">
                <div className="status-label">
                  <span className="dot">•</span> NOW PLAYING
                </div>
                <h3 className="title">{game.title}</h3>
                <p className="meta">
                  {game.developer} <span className="separator">·</span>{" "}
                  {game.hoursPlayed}h
                </p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default CurrentlyPlaying;
