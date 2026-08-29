"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "./DateFilter.scss";

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <select
      className="date-select"
      name="release-date"
      id="release-date"
      value={currentSort}
      onChange={handleChange}
    >
      <option value="">Datum izlaska</option>
      <option value="desc">Padajući</option>
      <option value="asc">Rastući</option>
    </select>
  );
}
