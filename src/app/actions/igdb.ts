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

async function getTwitchAccessToken(): Promise<string | null> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_SECRET_ID;

  if (!clientId || !clientSecret) {
    console.error("Twitch token error");
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
      next: { revalidate: 3600000 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token;
  } catch (error) {
    console.error("Error while accessing the token:", error);
    return null;
  }
}

export async function searchGames(
  query: string,
  genre?: string,
  platform?: string,
  sort?: string,
) {
  if (!query || query.trim().length < 2) return [];

  const token = await getTwitchAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID;

  if (!token || !clientId) return [];

  try {
    const safeQuery = query.trim().replace(/"/g, '\\"');

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
      console.error("IGDB API error status:", res.status);
      return [];
    }

    const games = await res.json();

    let mappedGames = games.map((game: any) => {
      let coverUrl: string | null = null;
      if (game.cover?.url) {
        coverUrl = `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`;
      }

      const devCompany = game.involved_companies?.find((c: any) => c.developer);
      const developerName = devCompany?.company?.name || null;

      const parsedYear = game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear()
        : null;

      const parsedGenres =
        game.genres?.map((g: any) => g.name).filter(Boolean) || [];

      const parsedPlatforms =
        game.platforms?.map((p: any) => p.name).filter(Boolean) || [];

      return {
        id: game.id,
        title: game.name || "Unknown title",
        coverUrl,

        developer: developerName,
        genres: parsedGenres,
        releaseYear: parsedYear,
        platforms: parsedPlatforms,
      };
    });

    if (genre) {
      const cleanGenre = genre.replace(/-/g, " ").toLowerCase();
      mappedGames = mappedGames.filter((game: any) =>
        game.genres.some((g: string) => g.toLowerCase().includes(cleanGenre)),
      );
    }

    if (platform) {
      const cleanPlatform = platform.toLowerCase();
      mappedGames = mappedGames.filter((game: any) =>
        game.platforms.some((p: string) =>
          p.toLowerCase().includes(cleanPlatform),
        ),
      );
    }

    if (sort) {
      mappedGames.sort((a: any, b: any) => {
        const yearA = a.releaseYear || 0;
        const yearB = b.releaseYear || 0;
        return sort === "asc" ? yearA - yearB : yearB - yearA;
      });
    }

    return mappedGames;
  } catch (error) {
    console.error("Error while searching on IGDB:", error);
    return [];
  }
}

import { getUserCollection } from "./userGames";

export async function getGameDetails(id: string) {
  const token = await getTwitchAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID;

  if (!token || !clientId) return null;

  try {
    const [res, userCollection] = await Promise.all([
      fetch("https://api.igdb.com/v4/games", {
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
      }),
      getUserCollection(),
    ]);

    if (!res.ok) return null;

    const [game] = await res.json();
    if (!game) return null;

    const userGame = userCollection.find(
      (ug) => String(ug.apiGameId) === String(id),
    );

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
      developer: devCompany?.company?.name || "Unknown developer",
      releaseYear: game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear()
        : null,
      rating: userGame?.rating ?? null,
      igdbRating: game.rating ? Math.round(game.rating / 10) : null,
      genres: game.genres?.map((g: any) => g.name) || [],
      platforms: game.platforms?.map((p: any) => p.name) || [],
      summary:
        game.summary ||
        game.storyline ||
        "There is no description available for this game.",
    };
  } catch (error) {
    console.error("Could not fetch game details: ", error);
    return null;
  }
}
