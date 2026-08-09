"use server";

export type GameSearchResult = {
  id: number;
  title: string;
  coverUrl: string | null;
  developer: string | null;
  genre: string | null;
  releaseYear: number | null;
};

export async function searchGames(query: string): Promise<GameSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const apiKey = process.env.GAMEBRAIN_API_KEY;

  if (!apiKey) {
    console.error("❌ GREŠKA: GAMEBRAIN_API_KEY nije pronađen u .env.local!");
    return [];
  }

  try {
    const params = new URLSearchParams({
      query: query.trim(),
      limit: "20",
    });

    const res = await fetch(
      `https://api.gamebrain.co/v1/games?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) return [];

    const data = await res.json();
    const results = Array.isArray(data)
      ? data
      : data.results || data.games || data.data || [];

    // 🔍 ISPIŠI U TERMINAL JEDAN REZULTAT DA VIDIMO POLJA
    if (results.length > 0) {
      console.log("Primer jednog rezultata s API-ja:", results[0]);
    }

    // 🛠️ FILTRIRANJE:
    // Izbacujemo sve što nema sliku ili naziv, te po potrebi provjeravamo tip/kategoriju
    const cleanResults = results.filter((game: any) => {
      const title = (game.title || game.name || "").toLowerCase();

      // 1. Ako naziv sadrži riječi poput "sticker", "pack", "bundle", "dlc", preskoči
      const isStickerOrAddon =
        title.includes("sticker") ||
        title.includes("avatar") ||
        title.includes("theme");

      // 2. Ako API ima eksplicitno polje 'type' ili 'category'
      if (game.type && game.type !== "game") return false;
      if (game.category && game.category !== "game") return false;

      return !isStickerOrAddon;
    });

    return cleanResults.map((game: any) => ({
      id: game.id || Math.random(),
      title: game.title || game.name || "Nepoznat naslov",
      coverUrl:
        game.cover_image || game.image || game.cover || game.thumbnail || null,
      developer: game.developer || game.developer_name || null,
      genre: game.genre || game.genres?.[0]?.name || null,
      releaseYear: game.release_date
        ? new Date(game.release_date).getFullYear()
        : null,
    }));
  } catch (error) {
    console.error("💥 Greška pri dohvaćanju:", error);
    return [];
  }
}

// export async function getPopularGames(): Promise<GameSearchResult[]> {
//   const apiKey = process.env.GAMEBRAIN_API_KEY;

//   // 1. Provjera postoji li API ključ
//   if (!apiKey) {
//     console.error("GREŠKA: GAMEBRAIN_API_KEY nije definiran u .env.local!");
//     return [];
//   }

//   try {
//     const res = await fetch(`https://gamebrain.co/api/v1/games?page_size=20`, {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//       next: { revalidate: 3600 },
//     });

//     if (!res.ok) {
//       console.error(`GameBrain API Error: Status ${res.status}`);
//       return [];
//     }

//     const data = await res.json();

//     // 2. Osiguravamo da su rezultati polje/niz (čak i ako API vrati čudnu strukturu)
//     const results = Array.isArray(data) ? data : data.results || [];

//     if (!Array.isArray(results)) {
//       console.error("API nije vratio listu igara:", data);
//       return [];
//     }

//     return results.map((game: any) => ({
//       id: game.id,
//       title: game.name || game.title || "Nepoznat naslov",
//       coverUrl: game.image || game.cover_image || game.cover || null,
//       developer: game.developer || game.developer_name || null,
//       genre: Array.isArray(game.genres)
//         ? game.genres[0]?.name
//         : game.genre || null,
//       releaseYear: game.release_date
//         ? new Date(game.release_date).getFullYear()
//         : null,
//     }));
//   } catch (error) {
//     console.error("Greška pri dohvaćanju igara:", error);
//     return [];
//   }
// }
