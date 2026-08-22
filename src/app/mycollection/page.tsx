import { getUserCollection } from "../actions/userGames";
import MyCollectionClient from "./CollectionClient";
import "./Collection.scss";

export default async function MyCollection() {
  const userGames = await getUserCollection();

  return (
    <main className="collection-page">
      <header className="collection-page__header">
        <h1>My Collection</h1>
      </header>

      <MyCollectionClient initialGames={userGames} />
    </main>
  );
}
