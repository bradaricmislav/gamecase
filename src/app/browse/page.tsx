import SearchBar from "../components/searchBar";
import { searchGames } from "../actions/igdb";
import Genre from "../components/genre";
import PlatformFilter from "../components/platform-filter";
import DateFilter from "../components/date-filter";
import AddButton from "../components/add-button";
import "./browse.scss";
import Link from "next/link";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const games = query ? await searchGames(query) : [];

  return (
    <div className="browse-container">
      <h1>BROWSE GAMES</h1>

      <div className="browse-container__filters">
        <SearchBar />
        {query && games.length === 0 && (
          <p>No games found for the search term "{query}".</p>
        )}
        <Genre />
        <PlatformFilter />
        <DateFilter />
      </div>

      {!query && (
        <p>Enter the game name into the search bar to view results.</p>
      )}

      <ul className="games-list">
        {games.map((game: any) => (
          <li key={game.id} className="games-list__game">
            <Link href={`/games/${game.id}`} className="games-list__game-card">
              <div className="games-list__game-info">
                <img
                  className="games-list__game-cover"
                  src={game.coverUrl || "/placeholder-cover.png"}
                  alt={game.title}
                />
                <div className="games-list__game-details">
                  <h2>{game.title}</h2>
                  <ul className="games-list__game-meta">
                    {game.developer && <li>{game.developer}</li>}
                    {game.genres?.[0] && <li>{game.genres[0]}</li>}
                    {game.releaseYear && <li>{game.releaseYear}</li>}
                  </ul>
                  <ul className="games-list__game-platforms">
                    {game.platforms?.map((platform: string, index: number) => (
                      <li key={index}>{platform}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="games-list__actions">
                <ul className="games-list__game-genres">
                  {game.genres?.map((genre: string, index: number) => (
                    <li key={index}>{genre}</li>
                  ))}
                </ul>
                <AddButton gameId={game.id} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
