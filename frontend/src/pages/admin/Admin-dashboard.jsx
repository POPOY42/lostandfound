import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../../styles/Admindashboard.css";
import { useNavigate } from "react-router-dom";

const navItems = [
  {
    to: "/adminDashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    )
  },
  {
    to: "/adminDashboard/lost-items",
    label: "Lost Items",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-3.8-3.8" />
        <path d="M9 9l4 4M13 9l-4 4" />
      </svg>
    )
  },
  {
    to: "/adminDashboard/found-items",
    label: "Found Items",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6" />
        <path d="M2 13h20l-1.6 7.2a2 2 0 0 1-2 1.8H5.6a2 2 0 0 1-2-1.8L2 13z" />
        <path d="M9 13a3 3 0 0 0 6 0" />
      </svg>
    )
  },
  {
    to: "/adminDashboard/claimed-items",
    label: "Claimed Items",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    )
  },

  {
    to: "/adminDashboard/claim-requests",
    label: "Claim Requests",
    icon: (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
    )
  },
  {
    to: "/adminDashboard/users",
    label: "Users",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    to: "/adminDashboard/settings",
    label: "Settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  }
];


const AdminDashboard = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isActive = (to) => {
        if (to === "/adminDashboard") return location.pathname === "/adminDashboard";
        return location.pathname.startsWith(to);
    };

    const closeSidebar = () => setSidebarOpen(false);

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        setTimeout(() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            setShowLogoutModal(false);
            closeSidebar();

            navigate("/");
        }, 3000);
    };

  return (
    <div className="admin-layout">

      {/* Mobile topbar */}
      <div className="admin-topbar">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="admin-brand-text-mobile">
          <h1>Title</h1>
          <span>ADMIN PANEL</span>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7v6c0 5 4 9 9 9s9-4 9-9V7l-9-5z" />
            </svg>
          </div>
          <div className="admin-brand-text">
            <h1>Title</h1>
            <span>ADMIN PANEL</span>
          </div>
          {/* Close button (mobile) */}
          <button className="sidebar-close-btn" onClick={closeSidebar}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-nav-link ${isActive(item.to) ? "active" : ""}`}
              onClick={closeSidebar}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
            <div className="admin-user">
                    <div className="admin-user-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="admin-user-info">
                        <span className="admin-user-name">
                            {user?.name}
                        </span>
                        <span className="admin-user-role">Administrator</span>
                    </div>
            </div>

            <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
                </svg>

                Logout
            </button>
        </div>
</aside>

        <main className="admin-main">
            <Outlet />
        </main>


        {showLogoutModal && (
            <div
                className="logout-modal-overlay"
                onClick={() => setShowLogoutModal(false)}
            >
                <div
                    className="logout-modal"
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className="logout-icon">
                        🚪
                    </div>
                    <h2>Logout</h2>
                    <p>
                        Are you sure you want to logout?
                    </p>
                    <div className="logout-actions">
                        <button
                            className="cancel-btn"
                            onClick={() => setShowLogoutModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="confirm-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminDashboard;