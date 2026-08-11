"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import "./searchBar.scss";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/browse?query=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/browse");
    }
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <button className="search-form__submit" type="submit">
        <img src="/icons/search_icon.svg" alt="Search Icon" />
      </button>
      <input
        className="search-form__input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search games, developers, tags..."
      />
    </form>
  );
}
