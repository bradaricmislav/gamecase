import SearchBar from "../components/search-bar/SearchBar";
import { searchGames } from "../actions/igdb";
import { getUserCollection } from "../actions/userGames";
import Genre from "../components/genre/Genre";
import PlatformFilter from "../components/platform-filter/PlatformFilter";
import DateFilter from "../components/date-filter/DateFilter";
import AddButton from "../components/add-button/AddButton";
import "./Browse.scss";
import Link from "next/link";

interface BrowsePageProps {
  searchParams: Promise<{
    query?: string;
    genre?: string;
    platform?: string;
    sort?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { query, genre, platform, sort } = await searchParams;

  const hasActiveFilters = Boolean(query || genre || platform || sort);

  const [games, userCollection] = await Promise.all([
    searchGames(query || "", genre, platform, sort),
    getUserCollection(),
  ]);

  const userGamesMap = new Map(userCollection.map((ug) => [ug.apiGameId, ug]));

  return (
    <div className="browse-container">
      <h1>BROWSE GAMES</h1>

      <div className="browse-container__filters">
        <SearchBar />
        <Genre />
        <PlatformFilter />
        <DateFilter />
      </div>

      {!hasActiveFilters && (
        <p>Enter a game name or select filters to view results.</p>
      )}

      {hasActiveFilters && games.length === 0 && (
        <p>No games found matching your search criteria.</p>
      )}

      <ul className="games-list">
        {games.map((game: any) => {
          const userGame = userGamesMap.get(game.id);

          return (
            <li key={game.id} className="games-list__game">
              <Link
                href={`/games/${game.id}`}
                className="games-list__game-card"
              >
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
                      {game.platforms?.map(
                        (platform: string, index: number) => (
                          <li key={index}>{platform}</li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>

                <div className="games-list__actions">
                  <ul className="games-list__game-genres">
                    {game.genres?.map((genre: string, index: number) => (
                      <li key={index}>{genre}</li>
                    ))}
                  </ul>
                  <AddButton
                    game={game}
                    initialStatus={userGame?.status ?? null}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
