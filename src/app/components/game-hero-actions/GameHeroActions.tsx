"use client";

import { useState, useTransition } from "react";
import { upsertUserGame, removeUserGame } from "@/app/actions/userGames";
import { getCurrentUser } from "@/app/actions/auth";
import { createPortal } from "react-dom";
import "./GameHeroActions.scss";
import { useRouter } from "next/navigation";

interface GameHeroActionsProps {
  gameData: {
    id: number;
    title: string;
    coverUrl?: string | null;
    backdropUrl?: string | null;
    developer?: string | null;
  };
  userGame?: {
    hoursPlayed?: number | null;
    review?: string | null;
  } | null;
}

export default function GameHeroActions({
  gameData,
  userGame,
}: GameHeroActionsProps) {
  const [isPending, startTransition] = useTransition();

  const [activeModal, setActiveModal] = useState<"hours" | "review" | null>(
    null,
  );

  const [hoursPlayed, setHoursPlayed] = useState<number>(
    userGame?.hoursPlayed || 0,
  );
  const [review, setReview] = useState<string>(userGame?.review || "");

  const isInCollection = Boolean(userGame);

  const router = useRouter();

  const handleOpenModal = async (modalType: "hours" | "review") => {
    const user = await getCurrentUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setActiveModal(modalType);
  };

  const handleSaveHours = () => {
    startTransition(async () => {
      await upsertUserGame({
        apiGameId: gameData.id,
        title: gameData.title,
        coverUrl: gameData.coverUrl,
        developer: gameData.developer,
        hoursPlayed: Number(hoursPlayed),
      });
      setActiveModal(null);
    });
  };

  const handleSaveReview = () => {
    startTransition(async () => {
      await upsertUserGame({
        apiGameId: gameData.id,
        title: gameData.title,
        coverUrl: gameData.coverUrl,
        developer: gameData.developer,
        review,
      });
      setActiveModal(null);
    });
  };

  const handleDelete = async () => {
    const user = await getCurrentUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to remove "${gameData.title}" from your library?`,
      )
    )
      return;

    startTransition(async () => {
      await removeUserGame(gameData.id);
      router.push("/mycollection");
    });
  };

  return (
    <>
      <div className="hero-actions">
        <button
          type="button"
          className="hero-actions__btn"
          onClick={() => handleOpenModal("hours")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#FFFFFF"
          >
            <path d="m614-310 51-51-149-149v-210h-72v240l170 170ZM480-96q-79.38 0-149.19-30T208.5-208.5Q156-261 126-330.96t-30-149.5Q96-560 126-630q30-70 82.5-122t122.46-82q69.96-30 149.5-30t149.55 30.24q70 30.24 121.79 82.08 51.78 51.84 81.99 121.92Q864-559.68 864-480q0 79.38-30 149.19T752-208.5Q700-156 629.87-126T480-96Zm0-384Zm.48 312q129.47 0 220.5-91.5Q792-351 792-480.48q0-129.47-91.02-220.5Q609.95-792 480.48-792 351-792 259.5-700.98 168-609.95 168-480.48 168-351 259.5-259.5T480.48-168Z" />
          </svg>{" "}
          Log Hours {userGame?.hoursPlayed ? `(${userGame.hoursPlayed}h)` : ""}
        </button>

        <button
          type="button"
          className="hero-actions__btn"
          onClick={() => handleOpenModal("review")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#FFFFFF"
          >
            <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
          </svg>{" "}
          {userGame?.review ? "Edit Review" : "Write Review"}
        </button>

        {isInCollection && (
          <button
            type="button"
            className="hero-actions__btn hero-actions__btn--danger"
            onClick={handleDelete}
            disabled={isPending}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#f43f5e"
            >
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>{" "}
            Delete
          </button>
        )}
      </div>

      {activeModal === "hours" &&
        createPortal(
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Log Hours Played</h3>
              <input
                type="number"
                min="0"
                value={hoursPlayed}
                onChange={(e) =>
                  setHoursPlayed(Math.max(0, Number(e.target.value)))
                }
                placeholder="e.g. 25"
              />
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setActiveModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn-save"
                  onClick={handleSaveHours}
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save Hours"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {activeModal === "review" &&
        createPortal(
          <div className="modal-overlay" onClick={() => setActiveModal(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Write Review</h3>
              <textarea
                rows={5}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your thoughts on this game..."
              />
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setActiveModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn-save"
                  onClick={handleSaveReview}
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save Review"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
