import { getGameDetails } from "@/app/actions/igdb";
import { getUserGameDetails } from "@/app/actions/userGames";
import { notFound } from "next/navigation";
import BackButton from "@/app/components/back-button/BackButton";
import RatingSelect from "@/app/components/rating-select/RatingSelect";
import StatusSelect from "@/app/components/status/Status";
import GameHeroActions from "@/app/components/game-hero-actions/GameHeroActions";
import { getRatingColor } from "@/app/components/collection-game-card/CollectionGameCard";
import "./GameDetails.scss";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GameDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = Number(id);

  const game = await getGameDetails(id);
  const userGame = await getUserGameDetails(numericId);

  const isWishlisted = userGame?.status === "WISHLIST";

  if (!game) {
    notFound();
  }

  const gameData = {
    id: numericId,
    title: game.title,
    coverUrl: game.coverUrl,
    backdropUrl: game.backdropUrl,
    developer: game.developer,
    genres: game.genres,
    releaseYear: game.releaseYear,
  };

  return (
    <div className="game-page">
      <div
        className="game-page__hero"
        style={{
          backgroundImage: game.backdropUrl
            ? `linear-gradient(to bottom, rgba(15,23,42,0.4), #0f172a), url(${game.backdropUrl})`
            : "none",
        }}
      >
        <div className="game-page__top-nav">
          <BackButton />
        </div>

        <div className="game-page__hero-content">
          <div className="game-page__hero-left">
            {game.coverUrl && (
              <img
                src={game.coverUrl}
                alt={game.title}
                className="game-page__cover"
              />
            )}

            {game.rating && (
              <span
                className="game-page__game-rating"
                style={{
                  backgroundColor: getRatingColor(game.rating),
                  color: "#1e2a3a",
                }}
              >
                {game.rating}
              </span>
            )}

            <div className="game-page__info">
              <h1>{game.title}</h1>
              <p className="game-page__meta">
                {game.developer} • {game.releaseYear}
              </p>
            </div>
          </div>

          <GameHeroActions gameData={gameData} userGame={userGame} />
        </div>
      </div>

      <div className="game-page__details">
        {!isWishlisted && (
          <RatingSelect game={gameData} initialRating={userGame?.rating} />
        )}

        <section className="game-page__section">
          <h2 className="game-page__section-title">DETAILS</h2>
          <dl className="game-page__grid">
            <div className="game-page__grid-item">
              <dt className="game-page__grid-label">PLATFORM</dt>
              <dd className="game-page__grid-value">
                {game.platforms?.join(", ")}
              </dd>
            </div>

            <div className="game-page__grid-item">
              <dt className="game-page__grid-label">GENRE</dt>
              <dd className="game-page__grid-value">{game.genres?.[0]}</dd>
            </div>

            <div className="game-page__grid-item">
              <dt className="game-page__grid-label">RELEASE YEAR</dt>
              <dd className="game-page__grid-value">{game.releaseYear}</dd>
            </div>

            <div className="game-page__grid-item">
              <dt className="game-page__grid-label">DEVELOPER</dt>
              <dd className="game-page__grid-value">{game.developer}</dd>
            </div>

            <div className="game-page__grid-item">
              <dt className="game-page__grid-label">HOURS PLAYED</dt>
              <dd className="game-page__grid-value">
                {userGame?.hoursPlayed ? `${userGame.hoursPlayed}h` : "0h"}
              </dd>
            </div>

            <div className="game-page__grid-item">
              <dt className="game-page__grid-label">SCORE</dt>
              <dd className="game-page__grid-value">
                {userGame?.rating ? `${userGame.rating}/10` : "N/A"}
              </dd>
            </div>
          </dl>
        </section>

        <StatusSelect game={gameData} initialStatus={userGame?.status} />

        <div className="game-page__about-game">
          <section className="game-page__section">
            <h2 className="game-page__section-title">ABOUT THE GAME</h2>
            <p className="game-page__game-summary">{game.summary}</p>
          </section>

          <section className="game-page__section">
            <h2 className="game-page__section-title">GENRES</h2>
            <ul className="game-page__genres">
              {game.genres?.map((genre: string, index: number) => (
                <li className="game-page__genre" key={index}>
                  {genre}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {userGame?.review && (
          <section className="game-page__section">
            <h2 className="game-page__section-title">MY REVIEW</h2>
            <div className="game-page__user-review">
              <p>{userGame.review}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
