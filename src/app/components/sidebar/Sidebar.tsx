import SidebarNav from "./SidebarClient";
import { getUserStats } from "@/app/actions/userGames";
import { getCurrentUser } from "@/app/actions/auth";
import { getInitials } from "@/app/utils/functions";
import "./Sidebar.scss";

export default async function Sidebar() {
  const stats = await getUserStats();
  const username = await getCurrentUser();

  return (
    <aside className="sidebar sidebar-area">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img
            className="sidebar__logo"
            src="/icons/gamepad_icon.svg"
            alt="Gamepad Icon"
          />
          GAMECASE
        </div>

        <SidebarNav stats={stats} />
      </div>

      {username ? (
        <div className="user-footer">
          <div className="avatar">{getInitials(username ?? "")}</div>
          <div className="user-details">
            <span className="user-name">{username}</span>
            <span className="user-stats">{stats.totalCount} games tracked</span>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
