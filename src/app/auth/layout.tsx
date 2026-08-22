export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--auth-bg-color)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      {children}
    </div>
  );
}
