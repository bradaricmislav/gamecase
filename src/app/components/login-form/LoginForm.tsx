"use client";

import { useState } from "react";
import Link from "next/link";
import { loginUser } from "@/app/actions/auth";
import "./LoginForm.scss";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUser({ email, password });

      if (!result.success) {
        setError(result.error || "Login failed");
        setLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <header className="auth-card__header">
        <div className="auth-card__brand">
          <div className="auth-card__logo-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="currentColor"
            >
              <path d="M180-200q-25 0-42.5-17.5T120-260v-440q0-25 17.5-42.5T180-760h600q25 0 42.5 17.5T840-700v440q0 25-17.5 42.5T780-200H180Zm0-60h600v-440H180v440Zm120-100h80v-80h80v-80h-80v-80h-80v80h-80v80h80v80Zm330 0q17 0 28.5-11.5T670-380q0-17-11.5-28.5T630-420q-17 0-28.5 11.5T590-380q0 17 11.5 28.5T630-340Zm90-90q17 0 28.5-11.5T760-470q0-17-11.5-28.5T720-510q-17 0-28.5 11.5T680-470q0 17 11.5 28.5T720-430ZM180-260v-440 440Z" />
            </svg>
          </div>
          <span className="auth-card__brand-name">GAMECASE</span>
        </div>
        <div className="auth-card__toggle">
          <Link
            href="/auth/login"
            className="auth-card__toggle-btn auth-card__toggle-btn--active"
          >
            LOG IN
          </Link>
          <Link href="/auth/register" className="auth-card__toggle-btn">
            REGISTER
          </Link>
        </div>
      </header>

      <div className="auth-card__content">
        <h1 className="auth-card__title">WELCOME BACK</h1>
        <p className="auth-card__subtitle">
          Log in to rate, review, and track your games.
        </p>

        {error && <div className="auth-card__error-box">{error}</div>}

        <form className="auth-card__form" onSubmit={handleSubmit}>
          <div className="auth-card__field">
            <label className="auth-card__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="auth-card__input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-card__field">
            <label className="auth-card__label" htmlFor="password">
              Password
            </label>
            <div className="auth-card__input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`auth-card__input ${
                  error ? "auth-card__input--error" : ""
                }`}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-card__eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="currentColor"
                >
                  <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="auth-card__options">
            <label className="auth-card__checkbox-label">
              <input
                type="checkbox"
                className="auth-card__checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="auth-card__submit-btn"
            disabled={loading}
          >
            {loading ? "LOGGING IN..." : "LOG IN"}
          </button>
        </form>

        <p className="auth-card__footer-text">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="auth-card__register-link">
            Create one
          </Link>
        </p>

        <div className="auth-card__info-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 -960 960 960"
            width="18px"
            fill="currentColor"
            className="auth-card__info-icon"
          >
            <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T900-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
          </svg>
          <span className="auth-card__info-text">
            <strong>Guests can browse</strong> but cannot rate or write reviews.
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
