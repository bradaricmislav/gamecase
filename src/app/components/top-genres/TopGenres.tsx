import { getUserCollection } from "@/app/actions/userGames";
import "./TopGenres.scss";

async function TopGenres() {
  const games = await getUserCollection();
  const topGenres: { name: string | null; count: number }[] = [];

  games.forEach((game: any) => {
    const genreName = game.genre;

    const existingGenre = topGenres.find((item) => item.name === genreName);

    if (existingGenre) {
      existingGenre.count++;
    } else {
      topGenres.push({ name: genreName, count: 1 });
    }
  });

  const top5Genres = topGenres.sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <ul className="top-genres">
      {topGenres.map((genre, index) => (
        <li className="top-genres__genre" key={genre.name}>
          <div className="top-genres__left">
            <span>{index + 1}</span>
            {genre.name}
          </div>
          {genre.count}
        </li>
      ))}
    </ul>
  );
}

export default TopGenres;
