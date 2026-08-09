import SearchBar from "../components/searchBar";
import { searchGames } from "@/app/actions/gamebrain";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const games = query ? await searchGames(query) : [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">BROWSE GAMES</h1>

      {/* Tražilica */}
      <SearchBar />

      {/* Prikaz rezultata */}
      {query && games.length === 0 && (
        <p className="text-gray-500">
          Nema pronađenih igara za pojam "{query}".
        </p>
      )}

      {!query && (
        <p className="text-gray-400">
          Upisi naziv igre u tražilicu za prikaz rezultata.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game: any) => (
          <div
            key={game.id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {game.coverUrl ? (
              <img
                src={game.coverUrl}
                alt={game.title}
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                Nema Slike
              </div>
            )}
            <div className="p-4">
              <h2 className="font-bold text-lg text-gray-800 line-clamp-1">
                {game.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {game.genre || "Nepoznat žanr"}
                {game.releaseYear && ` (${game.releaseYear})`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
