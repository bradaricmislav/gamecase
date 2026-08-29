import { Suspense } from "react";
import StatsOverview from "../components/stats-overview/StatsOverview";
import { getTopRatedGames, getUserStats } from "../actions/userGames";
import CollectionGameCard from "../components/collection-game-card/CollectionGameCard";
import ScoreBreakdown from "../components/score-breakdown/ScoreBreakdown";
import TopGenres from "../components/top-genres/TopGenres";
import CurrentlyPlaying from "../components/currently-playing/CurrentlyPlaying";
import Statuses from "../components/statuses/Statuses";
import Link from "next/link";
import "./Dashboard.scss";

export const dynamic = "force-dynamic";

async function Dashboard() {
  const stats = await getUserStats();
  const topGames = await getTopRatedGames();

  const isEmpty = !stats || stats.totalCount === 0;

  if (isEmpty) {
    return (
      <main className="dashboard">
        <h1>Nadzorna ploča</h1>
        <div className="dashboard__empty">
          <h2>Vaša kolekcija je prazna</h2>
          <p>
            Još nema dodanih igara u vašoj kolekciji. Idite na pretraživanje
            kako biste ih dodali.
          </p>
          <Link href="/browse" className="dashboard__empty-btn">
            Pretraži i dodaj igre
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <h1>Nadzorna ploča</h1>
      <StatsOverview stats={stats} />
      <div className="dashboard__grid">
        <section className="dashboard__top-rated">
          <div className="dashboard__section-header">
            <h2 className="dashboard__top-rated-title">NAJBOLJE OCJENJENO</h2>
            <Link className="dashboard__top-rated-link" href="/mycollection">
              Prikaži sve{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16px"
                viewBox="0 -960 960 960"
                width="16px"
                fill="currentColor"
              >
                <path
                  className="arrow_icon"
                  d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"
                />
              </svg>
            </Link>
          </div>
          {topGames.length > 0 ? (
            <ul className="dashboard__top-rated-list">
              {topGames.map((game) => (
                <CollectionGameCard key={game.id} game={game} />
              ))}
            </ul>
          ) : (
            <p className="dashboard__empty-text">Još nema ocjenjenih igara.</p>
          )}
        </section>
        <section className="dashboard__score-chart">
          <div className="dashboard__section-header">
            <h2 className="dashboard__score-title">RASPODJELA OCJENA</h2>
          </div>
          <Suspense fallback={<div>Učitavanje raspodjele...</div>}>
            <ScoreBreakdown />
          </Suspense>
          <div className="dashboard__section-header">
            <h2 className="dashboard__genre-title">TOP ŽANROVI</h2>
          </div>
          <Suspense fallback={<div>Učitavanje žanrova...</div>}>
            <TopGenres />
          </Suspense>
        </section>
      </div>
      <section className="dashboard__currently-playing">
        <div className="dashboard__section-header">
          <h2 className="dashboard__currently-playing-title">
            TRENUTNO SE IGRA
          </h2>
          <Link
            className="dashboard__currently-playing-link"
            href="/mycollection?status=PLAYING"
          >
            Prikaži sve{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16px"
              viewBox="0 -960 960 960"
              width="16px"
              fill="currentColor"
            >
              <path
                className="arrow_icon"
                d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"
              />
            </svg>
          </Link>
        </div>
        <Suspense fallback={<div>Učitavanje trenutnih igara...</div>}>
          <CurrentlyPlaying />
        </Suspense>
      </section>
      <section className="dashboard__statuses">
        <div className="dashboard__section-header">
          <h2 className="dashboard__statuses-title">KOLEKCIJA PO STATUSU</h2>
        </div>
        <Suspense fallback={<div>Učitavanje statusa...</div>}>
          <Statuses stats={stats} />
        </Suspense>
      </section>
    </main>
  );
}

export default Dashboard;
