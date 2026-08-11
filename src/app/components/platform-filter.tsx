import "./platform-filter.scss";

function PlatformFilter() {
  return (
    <select className="platform-select" name="platform" id="platform">
      <option value="">All Platforms</option>
      <option value="pc">PC</option>
      <option value="ps5">PS5</option>
      <option value="ps4">PS4</option>
      <option value="xbox">Xbox</option>
      <option value="switch">Switch</option>
      <option value="mobile">Mobile</option>
    </select>
  );
}

export default PlatformFilter;
