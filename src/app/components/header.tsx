"use client";

import "./header.scss";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-actions">
        <button className="theme-toggle" title="Promijeni temu">
          <img src="./icons/light-mode_icon.svg" alt="Light Mode Icon" />
        </button>

        <div className="user-badge">
          <div className="badge-avatar">M</div>
          <span className="badge-name">Mislav</span>
        </div>

        <button className="signout-btn">SIGN OUT</button>
      </div>
    </header>
  );
}
