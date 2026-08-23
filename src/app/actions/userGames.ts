"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import { GameStatus } from "@/generated/prisma";
import { CollectionGame } from "../components/collection-game-card/CollectionGameCard";
import { getSessionUser } from "./auth";

export type UpsertGameInput = {
  apiGameId: number;
  title: string;
  coverUrl?: string | null;
  developer?: string | null;
  genre?: string | null;
  releaseYear?: number | null;
  status?: GameStatus | null;
  rating?: number | null;
  hoursPlayed?: number;
  review?: string;
};

export async function upsertUserGame(input: UpsertGameInput) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const newRating =
      input.status === GameStatus.WISHLIST ? null : input.rating;

    const userGame = await prisma.userGame.upsert({
      where: {
        userId_apiGameId: {
          userId: session.userId,
          apiGameId: input.apiGameId,
        },
      },
      update: {
        ...(input.status !== undefined && {
          status: input.status ?? GameStatus.BACKLOG,
        }),
        ...(newRating !== undefined && { rating: newRating }),
        ...(input.hoursPlayed !== undefined && {
          hoursPlayed: input.hoursPlayed,
        }),
        ...(input.review !== undefined && { review: input.review }),
        ...(input.coverUrl && { coverUrl: input.coverUrl }),
      },
      create: {
        userId: session.userId,
        apiGameId: input.apiGameId,
        title: input.title,
        coverUrl: input.coverUrl ?? null,
        developer: input.developer ?? null,
        genre: input.genre ?? null,
        releaseYear: input.releaseYear ?? null,
        status: input.status ?? GameStatus.BACKLOG,
        rating:
          input.status === GameStatus.WISHLIST ? null : (input.rating ?? null),
        hoursPlayed: input.hoursPlayed ?? 0,
        review: input.review ?? "",
      },
    });

    revalidatePath(`/game/${input.apiGameId}`);
    revalidatePath("/library");

    return { success: true, data: userGame };
  } catch (error) {
    console.error("Error while saving game: ", error);
    return { success: false, error: "It's not possible to save the game." };
  }
}

export async function getUserGameDetails(apiGameId: number) {
  try {
    const session = await getSessionUser();
    if (!session) return null;

    const userGame = await prisma.userGame.findUnique({
      where: {
        userId_apiGameId: {
          userId: session.userId,
          apiGameId,
        },
      },
    });

    return userGame;
  } catch (error) {
    console.error("Error while fetching game details:", error);
    return null;
  }
}

export async function getUserCollection() {
  try {
    const session = await getSessionUser();
    if (!session) return [];

    const collection = await prisma.userGame.findMany({
      where: {
        userId: session.userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return collection;
  } catch (error) {
    console.error("Error while fetching collection:", error);
    return [];
  }
}

export async function removeUserGame(apiGameId: number) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    await prisma.userGame.delete({
      where: {
        userId_apiGameId: {
          userId: session.userId,
          apiGameId,
        },
      },
    });

    revalidatePath(`/game/${apiGameId}`);
    revalidatePath("/library");

    return { success: true };
  } catch (error) {
    console.error("Error while deleting game:", error);
    return { success: false, error: "It's not possible to delete game." };
  }
}

export async function getUserStats() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return {
        avgRating: 0,
        ratedGamesCount: 0,
        totalCount: 0,
        playingCount: 0,
        completedCount: 0,
        wishlistCount: 0,
        droppedCount: 0,
        totalHours: 0,
        favoritesCount: 0,
        disappointmentsCount: 0,
      };
    }

    const games = await prisma.userGame.findMany({
      where: {
        userId: session.userId,
      },
      select: {
        status: true,
        rating: true,
        hoursPlayed: true,
      },
    });
    const totalCount = games.length;
    const ratedGames = games.filter(
      (game: any) => game.rating !== null && game.rating > 0,
    );
    const ratedGamesCount = ratedGames.length;

    const sumRating = ratedGames.reduce(
      (total: any, game: any) => total + (game.rating ?? 0),
      0,
    );
    const avgRating =
      ratedGamesCount > 0
        ? Number((sumRating / ratedGamesCount).toFixed(1))
        : 0;

    const playingCount = games.filter(
      (game: any) => game.status === GameStatus.PLAYING,
    ).length;
    const completedCount = games.filter(
      (game: any) => game.status === GameStatus.COMPLETED,
    ).length;
    const wishlistCount = games.filter(
      (game: any) => game.status === GameStatus.WISHLIST,
    ).length;
    const droppedCount = games.filter(
      (game: any) => game.status === GameStatus.DROPPED,
    ).length;

    const totalHours = games.reduce(
      (total: any, game: any) => total + game.hoursPlayed,
      0,
    );

    const favoritesCount = games.filter(
      (game: any) => game.rating === 10,
    ).length;

    const disappointmentsCount = games.filter(
      (game: any) => game.rating !== null && game.rating < 5,
    ).length;

    return {
      avgRating,
      ratedGamesCount,
      totalCount,
      playingCount,
      completedCount,
      wishlistCount,
      droppedCount,
      totalHours,
      favoritesCount,
      disappointmentsCount,
    };
  } catch (error) {
    console.error("Error while fetching user data: ", error);
    return {
      avgRating: 0,
      ratedGamesCount: 0,
      totalCount: 0,
      playingCount: 0,
      completedCount: 0,
      wishlistCount: 0,
      droppedCount: 0,
      totalHours: 0,
      favoritesCount: 0,
      disappointmentsCount: 0,
    };
  }
}

export async function getTopRatedGames(limit = 6): Promise<CollectionGame[]> {
  try {
    const session = await getSessionUser();
    if (!session) return [];

    const topGames = await prisma.userGame.findMany({
      where: {
        userId: session.userId,
        rating: { not: null },
      },
      orderBy: {
        rating: "desc",
      },
      take: limit,
    });

    return topGames;
  } catch (error) {
    console.error("Error while fetching top rated games.", error);
    return [];
  }
}

export async function getFavoriteGames() {
  try {
    const session = await getSessionUser();
    if (!session) return [];

    const collection = await prisma.userGame.findMany({
      where: {
        userId: session.userId,
        rating: 10,
      },
      orderBy: { updatedAt: "desc" },
    });

    return collection;
  } catch (error) {
    console.error("Error while fetching favorite games:", error);
    return [];
  }
}
