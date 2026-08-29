"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { searchGames } from "../../actions/igdb";
import Link from "next/link";
import "./SearchBar.scss";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const data = await searchGames(query);
      setResults(data || []);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (query.trim().length >= 2) {
      router.push(`/browse?query=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/browse");
    }
  };

  return (
    <div className="search-bar-container" ref={containerRef}>
      <form className="search-form" onSubmit={handleSearch}>
        <button className="search-form__submit" type="submit">
          <img src="/icons/search_icon.svg" alt="Ikona pretraživanja" />
        </button>
        <input
          className="search-form__input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          placeholder="Pretraži igre, razvijatelje, oznake..."
        />
      </form>

      {isOpen && results.length > 0 && (
        <div className="search-dropdown">
          {results.slice(0, 5).map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="search-dropdown__item"
              onClick={() => setIsOpen(false)}
            >
              <img
                src={game.coverUrl}
                alt={game.title}
                className="search-dropdown__cover"
              />
              <div className="search-dropdown__info">
                <span className="search-dropdown__title">{game.title}</span>
                <span className="search-dropdown__meta">
                  {game.releaseYear}{" "}
                  {game.genres?.[0] ? `• ${game.genres[0]}` : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
