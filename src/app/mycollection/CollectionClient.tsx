"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CollectionFilterBar from "../components/collection-filter-bar/CollectionFilterBar";
import CollectionGameCard from "../components/collection-game-card/CollectionGameCard";
import { useSearchParams, useRouter } from "next/navigation";

function MyCollectionClient({ initialGames }: { initialGames: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status") ?? "ALL";
  const list = searchParams.get("list")?.toLowerCase() ?? null;

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("score_desc");

  const handleFilterChange = (type: "status" | "list", value: string) => {
    if (type === "status") {
      if (value === "ALL") {
        router.push("/mycollection");
      } else {
        router.push(`/mycollection?status=${value}`);
      }
    } else if (type === "list") {
      router.push(`/mycollection?list=${value}`);
    }
  };

  const counts = useMemo(
    () => ({
      ALL: initialGames.length,
      PLAYING: initialGames.filter((g) => g.status === "PLAYING").length,
      COMPLETED: initialGames.filter((g) => g.status === "COMPLETED").length,
      WISHLIST: initialGames.filter((g) => g.status === "WISHLIST").length,
      DROPPED: initialGames.filter((g) => g.status === "DROPPED").length,
      FAVORITES: initialGames.filter(
        (g) => g.rating !== null && g.rating === 10,
      ).length,
      DISAPPOINTMENTS: initialGames.filter(
        (g) => g.rating !== null && g.rating < 5,
      ).length,
    }),
    [initialGames],
  );

  const filteredGames = useMemo(() => {
    return initialGames
      .filter((game) => {
        if (list === "favorites") {
          if (game.rating === null || game.rating !== 10) return false;
        } else if (list === "disappointments") {
          if (game.rating === null || game.rating >= 5) return false;
        } else {
          const matchesStatus = status === "ALL" || game.status === status;
          if (!matchesStatus) return false;
        }

        const matchesSearch = game.title
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "score_desc") return (b.rating ?? 0) - (a.rating ?? 0);
        if (sort === "score_asc") return (a.rating ?? 0) - (b.rating ?? 0);
        if (sort === "title_asc") return a.title.localeCompare(b.title);
        return 0;
      });
  }, [initialGames, status, list, search, sort]);

  if (initialGames.length === 0) {
    return (
      <div className="collection-page__empty">
        <p>Vaša kolekcija je prazna.</p>
        <Link href="/browse" className="collection-page__explore-btn">
          Pretraži i dodaj igre
        </Link>
      </div>
    );
  }

  return (
    <>
      <CollectionFilterBar
        counts={counts}
        selectedStatus={list ? null : status}
        selectedList={list}
        onFilterChange={handleFilterChange}
        searchQuery={search}
        onSearchChange={setSearch}
        sortBy={sort}
        onSortChange={setSort}
      />

      {filteredGames.length === 0 ? (
        <div className="collection-page__empty">
          <p>Nema igara koje odgovaraju odabranim filtrima.</p>
        </div>
      ) : (
        <ul className="collection-page__grid">
          {filteredGames.map((game) => (
            <CollectionGameCard key={game.id} game={game} />
          ))}
        </ul>
      )}
    </>
  );
}

export default MyCollectionClient;
