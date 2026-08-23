import { Suspense } from "react";
import LoginForm from "@/app/components/login-form/LoginForm";
import "./Login.scss";

export const dynamic = "force-dynamic";

export default function Login() {
  return (
    <main className="login-page">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
