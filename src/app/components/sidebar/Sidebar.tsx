import SidebarNav from "./SidebarClient";
import { getUserStats } from "@/app/actions/userGames";
import "./Sidebar.scss";

export default async function Sidebar() {
  const stats = await getUserStats();

  return (
    <aside className="sidebar">
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

      <div className="user-footer">
        <div className="avatar">A</div>
        <div className="user-details">
          <span className="user-name">Alex Rivera</span>
          <span className="user-stats">{stats.totalCount} games tracked</span>
        </div>
      </div>
    </aside>
  );
}
