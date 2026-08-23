import { Suspense } from "react";
import RegisterForm from "@/app/components/register-form/RegisterForm";
import "./Register.scss";

export const dynamic = "force-dynamic";

export default function Register() {
  return (
    <main className="register-page">
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
