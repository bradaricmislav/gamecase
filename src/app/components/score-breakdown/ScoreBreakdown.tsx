import { getUserCollection } from "@/app/actions/userGames";
import "./ScoreBreakdown.scss";

const ratingScale = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const ratingColor = (rating: number) => {
  if (rating >= 8) return "#66CC33";
  if (rating >= 5) return "#FFCC33";
  return "#FF4444";
};

async function ScoreBreakdown() {
  const games = await getUserCollection();

  const gamesPerRating = (rating: number) => {
    return games.filter((game) => game.rating === rating).length;
  };

  return (
    <ul className="score-list">
      {ratingScale.map((rating) => (
        <li className="score-list__score" key={rating}>
          <span
            className="score-list__rating"
            style={{ backgroundColor: ratingColor(rating) }}
          >
            {rating}
          </span>
          <div className="score-list__track">
            <div
              className="score-list__track-fill"
              style={{
                backgroundColor: ratingColor(rating),
                width: `${(gamesPerRating(rating) / games.length) * 100}%`,
              }}
            ></div>
          </div>
          <span className="score-list__rating-count">
            {gamesPerRating(rating)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default ScoreBreakdown;
