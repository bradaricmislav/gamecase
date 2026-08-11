import "./date-filter.scss";

function DateFilter() {
  return (
    <select className="date-select" name="release-date" id="release-date">
      <option value="">Release Date</option>
      <option value="desc">Descending</option>
      <option value="asc">Ascending</option>
    </select>
  );
}

export default DateFilter;
