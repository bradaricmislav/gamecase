import { Suspense } from "react";
import { getUserCollection } from "../actions/userGames";
import MyCollectionClient from "./CollectionClient";
import "./Collection.scss";

export const dynamic = "force-dynamic";

export default async function MyCollection() {
  const userGames = await getUserCollection();

  return (
    <main className="collection-page">
      <header className="collection-page__header">
        <h1>Moja kolekcija</h1>
      </header>

      <Suspense fallback={<div>Učitavanje kolekcije...</div>}>
        <MyCollectionClient initialGames={userGames} />
      </Suspense>
    </main>
  );
}
