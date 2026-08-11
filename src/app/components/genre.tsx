import "./genre.scss";

function Genre() {
  return (
    <select className="genre-select" name="genre" id="genre">
      <option value="">All Genres</option>
      <option value="action">Action</option>
      <option value="action">Action</option>
      <option value="arcade">Arcade</option>
      <option value="fighting">Fighting</option>
      <option value="platformer">Platformer</option>
      <option value="point-and-click">Point and Click</option>
      <option value="puzzle">Puzzle</option>
      <option value="racing">Racing</option>
      <option value="role-playing">Role Playing</option>
      <option value="shooter">Shooter</option>
      <option value="simulation">Simulation</option>
      <option value="sport">Sport</option>
      <option value="strategy">Strategy</option>
      <option value="survival">Survival</option>
      <option value="visual-novel">Visual Novel</option>
    </select>
  );
}

export default Genre;
