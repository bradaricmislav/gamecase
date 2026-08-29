import SearchBar from "../components/search-bar/SearchBar";
import { searchGames } from "../actions/igdb";
import { getUserCollection } from "../actions/userGames";
import Genre from "../components/genre/Genre";
import PlatformFilter from "../components/platform-filter/PlatformFilter";
import DateFilter from "../components/date-filter/DateFilter";
import AddButton from "../components/add-button/AddButton";
import "./Browse.scss";
import Link from "next/link";
import { GameStatus } from "@prisma/client";

interface CatalogGame {
  id: number;
  title: string;
  coverUrl?: string | null;
  developer?: string | null;
  genres?: string[];
  platforms?: string[];
  releaseYear?: number | null;
}

interface UserCollectionItem {
  apiGameId: number;
  status: GameStatus;
}

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
    searchGames(query || "", genre, platform, sort) as Promise<CatalogGame[]>,
    getUserCollection() as Promise<UserCollectionItem[]>,
  ]);

  const userGamesMap = new Map<number, UserCollectionItem>(
    (userCollection || []).map((ug) => [ug.apiGameId, ug]),
  );

  return (
    <div className="browse-container">
      <h1>PRETRAŽIVANJE IGARA</h1>

      <div className="browse-container__filters">
        <SearchBar />
        <Genre />
        <PlatformFilter />
        <DateFilter />
      </div>

      {!hasActiveFilters && (
        <p>Unesite naziv igre ili odaberite filtre za prikaz rezultata.</p>
      )}

      {hasActiveFilters && games.length === 0 && (
        <p>
          Nije pronađena nijedna igra koja odgovara vašim kriterijima pretrage.
        </p>
      )}

      <ul className="games-list">
        {games.map((game) => {
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
                      {game.platforms?.map((platform, index) => (
                        <li key={index}>{platform}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="games-list__actions">
                  <ul className="games-list__game-genres">
                    {game.genres?.map((genre, index) => (
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
