import { getGameDetails } from "@/app/actions/igdb";
import { notFound } from "next/navigation";
import BackButton from "@/app/components/back-button";
import "./gameDetails.scss";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GameDetailPage({ params }: PageProps) {
  const { id } = await params;
  const game = await getGameDetails(id);

  if (!game) {
    notFound();
  }

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
          {game.coverUrl && (
            <img
              src={game.coverUrl}
              alt={game.title}
              className="game-page__cover"
            />
          )}

          <div className="game-page__info">
            <h1>{game.title}</h1>
            <p className="game-page__meta">
              {game.developer} • {game.releaseYear}
            </p>

            {game.rating && (
              <div className="game-page__rating">
                <span className="badge-rating">{game.rating} / 10</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="game-page__details">
        <section className="game-page__section">
          <h2>About the Game</h2>
          <p>{game.summary}</p>
        </section>

        <section className="game-page__section">
          <h2>Platforms</h2>
          <div className="tag-group">
            {game.platforms.map((p: string) => (
              <span key={p} className="tag-platform">
                {p}
              </span>
            ))}
          </div>
        </section>

        <section className="game-page__section">
          <h2>Genres</h2>
          <div className="tag-group">
            {game.genres.map((g: string) => (
              <span key={g} className="tag-genre">
                {g}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
