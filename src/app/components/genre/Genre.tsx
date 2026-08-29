"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "./Genre.scss";

export default function Genre() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get("genre") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;

    if (value) {
      params.set("genre", value);
    } else {
      params.delete("genre");
    }

    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  return (
    <select
      className="genre-select"
      name="genre"
      id="genre"
      value={currentGenre}
      onChange={handleChange}
    >
      <option value="">Svi žanrovi</option>
      <option value="action">Akcija</option>
      <option value="arcade">Arkade</option>
      <option value="fighting">Borilačke</option>
      <option value="platformer">Platformeri</option>
      <option value="point-and-click">Pokaži i klikni</option>
      <option value="puzzle">Logičke / Zagonetke</option>
      <option value="racing">Utrke</option>
      <option value="role-playing">Igre uloga (RPG)</option>
      <option value="shooter">Pucačine</option>
      <option value="simulation">Simulacije</option>
      <option value="sport">Sport</option>
      <option value="strategy">Strategije</option>
      <option value="survival">Preživljavanje</option>
      <option value="visual-novel">Vizualni romani</option>
    </select>
  );
}
