"use server";

export type GameSearchResult = {
  id: number;
  title: string;
  coverUrl: string | null;
  developer: string | null;
  genres: string[];
  releaseYear: number | null;
  platforms: string[];
};

// 1. Pomoćna funkcija za dohvaćanje Twitch OAuth Tokena
async function getTwitchAccessToken(): Promise<string | null> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_SECRET_ID;

  if (!clientId || !clientSecret) {
    console.error(
      "❌ GREŠKA: TWITCH_CLIENT_ID ili TWITCH_CLIENT_SECRET nisu postavljeni u .env.local!",
    );
    return null;
  }

  try {
    const res = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
      next: { revalidate: 3600000 }, // Keširaj token (traje ~60 dana)
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token;
  } catch (error) {
    console.error("💥 Greška pri dohvaćanju Twitch tokena:", error);
    return null;
  }
}

// 2. Glavna funkcija za pretragu igara
export async function searchGames(query: string): Promise<GameSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const token = await getTwitchAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID;

  if (!token || !clientId) return [];

  try {
    // Escaping navodnika u pretrazi da ne razbije IGDB upit
    const safeQuery = query.trim().replace(/"/g, '\\"');

    // IGDB Apicalypse Upit: Dohvaćamo točna polja koja nam trebaju
    const queryBody = `
      search "${safeQuery}";
      fields name, cover.url, first_release_date, genres.name, platforms.name, summary, involved_companies.developer, involved_companies.company.name;
      limit 20;
    `;

    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: queryBody,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ IGDB API Greška status:", res.status);
      return [];
    }

    const games = await res.json();

    return games.map((game: any) => {
      // Slika: IGDB vraća "//images.igdb.com/.../t_thumb.jpg". Prevarit ćemo ga na HD sliku ("t_cover_big")
      let coverUrl: string | null = null;
      if (game.cover?.url) {
        coverUrl = `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`;
      }

      // Developer
      const devCompany = game.involved_companies?.find((c: any) => c.developer);
      const developerName = devCompany?.company?.name || null;

      // Godina
      const parsedYear = game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear()
        : null;

      // Žanrovi
      const parsedGenres =
        game.genres?.map((g: any) => g.name).filter(Boolean) || [];

      // Platforme (SADA RADI ODMAH IZ 1 POZIVA!)
      const parsedPlatforms =
        game.platforms?.map((p: any) => p.name).filter(Boolean) || [];

      return {
        id: game.id,
        title: game.name || "Nepoznat naslov",
        coverUrl,
        developer: developerName,
        genres: parsedGenres,
        releaseYear: parsedYear,
        platforms: parsedPlatforms,
      };
    });
  } catch (error) {
    console.error("💥 Greška pri pretrazi na IGDB-u:", error);
    return [];
  }
}

export async function getGameDetails(id: string) {
  const token = await getTwitchAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID;

  if (!token || !clientId) return null;

  try {
    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: `
        fields name, cover.url, first_release_date, genres.name, platforms.name, summary, storyline, rating, involved_companies.developer, involved_companies.company.name, screenshots.url;
        where id = ${id};
      `,
      next: { revalidate: 86400 },
    });

    if (!res.ok) return null;

    const [game] = await res.json();
    if (!game) return null;

    const coverUrl = game.cover?.url
      ? `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`
      : null;

    const backdropUrl = game.screenshots?.[0]?.url
      ? `https:${game.screenshots[0].url.replace("t_thumb", "t_1080p")}`
      : null;

    const devCompany = game.involved_companies?.find((c: any) => c.developer);

    return {
      id: game.id,
      title: game.name,
      coverUrl,
      backdropUrl,
      developer: devCompany?.company?.name || "Nepoznat developer",
      releaseYear: game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear()
        : null,
      rating: game.rating ? Math.round(game.rating / 10) : null,
      genres: game.genres?.map((g: any) => g.name) || [],
      platforms: game.platforms?.map((p: any) => p.name) || [],
      summary:
        game.summary || game.storyline || "Nema dostupnog opisa za ovu igru.",
    };
  } catch (error) {
    console.error("Could not fetch game details: ", error);
    return null;
  }
}
