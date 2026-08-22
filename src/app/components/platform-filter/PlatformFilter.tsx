"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "./PlatformFilter.scss";

export default function PlatformFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPlatform = searchParams.get("platform") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;

    if (value) {
      params.set("platform", value);
    } else {
      params.delete("platform");
    }

    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  return (
    <select
      className="platform-select"
      name="platform"
      id="platform"
      value={currentPlatform}
      onChange={handleChange}
    >
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
