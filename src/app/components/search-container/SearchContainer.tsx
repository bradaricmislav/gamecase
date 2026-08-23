"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/games/search?q=${query}`);
      const data = await res.json();
      setResults(data);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);
    router.push(`/browse?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search games..."
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        <button type="submit">🔍</button>
      </form>

      {isOpen && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((game: any) => (
            <div
              key={game.id}
              className="dropdown-item"
              onClick={() => {
                setIsOpen(false);
                router.push(`/games/${game.id}`);
              }}
            >
              <img src={game.coverUrl} alt={game.title} width={40} />
              <div>
                <h4>{game.title}</h4>
                <span>
                  {game.releaseDate} • {game.platform}
                </span>
              </div>
              <div className="rating-badge">{game.rating}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
