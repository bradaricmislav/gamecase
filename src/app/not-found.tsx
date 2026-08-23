import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Page Not Found</h2>
      <p>Could not find requested resource.</p>
      <Link href="/dashboard">Return to Dashboard</Link>
    </div>
  );
}
