import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "../../styles-user/userdashboard.css";
import sanRafaelLogo from "../../assets/san rafael logo.jpg"
const navItems = [
  {
    to: "/userDashboard",
    label: "Home",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
      </svg>
    )
  },
  {
    to: "/userDashboard/user-lost-items",
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
    to: "/userDashboard/user-found-items",
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
    to: "/userDashboard/user-claimed-items",
    label: "Claimed Items",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    )
  },

    {
        to: "/userDashboard/user-my-claims",
        label: "My Claims",
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
                <path d="M9 12l2 2 4-4" />
                <path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3" />
                <path d="M16 5h5v5" />
                </svg>
            )
    },
  {
    to: "/userDashboard/user-my-items",
    label: "My Items",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1z" />
        <path d="M9 5h6v2H9z" />
      </svg>
    )
  },
  {
    to: "/userDashboard/user-profile",
    label: "Profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    )
  },
  {
    to: "/userDashboard/user-guide",
    label: "User Guide",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M9 7h7M9 11h7" />
      </svg>
    )
  }
];

const UserDashboard = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const isActive = (to) => {
        if (to === "/userDashboard") return location.pathname === "/userDashboard";
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
    <div className="user-dash-layout">

      {/* Mobile topbar */}
      <div className="user-dash-topbar">
        <button className="user-dash-hamburger-btn" onClick={() => setSidebarOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="user-dash-brand-text-mobile">
          <h1>Barangay San Rafael <br /> Lost and Found</h1>
          <span>USER PANEL</span>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="user-dash-sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
        <aside className={`user-dash-sidebar ${sidebarOpen ? "open" : ""}`}>
            <div className="user-dash-brand">
            <div className="user-dash-brand-icon">
                <img src={sanRafaelLogo} alt="" width={40}/>
            </div>
            <div className="user-dash-brand-text">
                <h1>Barangay San Rafael <br /> Lost and Found</h1>
                <span>USER PANEL</span>
            </div>
            {/* Close button (mobile) */}
            <button className="user-dash-sidebar-close-btn" onClick={closeSidebar}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
            </div>

            <nav className="user-dash-nav">
            {navItems.map((item) => (
                <Link
                    key={item.to}
                    to={item.to}
                    className={`user-dash-nav-link ${isActive(item.to) ? "active" : ""}`}
                    onClick={closeSidebar}
                >
                    <span className="user-dash-nav-icon">{item.icon}</span>
                    {item.label}
                </Link>
            ))}
            </nav>

            <div className="user-dash-sidebar-footer">
                <div className="user-dash-user">
                        <div className="user-dash-user-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="user-dash-user-info">
                            <span className="user-dash-user-name">
                                {user?.name}
                            </span>
                            <span className="user-dash-user-role">User</span>
                        </div>
                </div>

                <button className="user-dash-logout-btn" onClick={() => setShowLogoutModal(true)}>
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

        <main className="user-dash-main">
            <Outlet />
        </main>


        {showLogoutModal && (
            <div
                className="user-dash-logout-modal-overlay"
                onClick={() => setShowLogoutModal(false)}
            >
                <div
                    className="user-dash-logout-modal"
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className="user-dash-logout-icon">
                        🚪
                    </div>
                    <h2>Logout</h2>
                    <p>
                        Are you sure you want to logout?
                    </p>
                    <div className="user-dash-logout-actions">
                        <button
                            className="user-dash-cancel-btn"
                            onClick={() => setShowLogoutModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="user-dash-confirm-btn"
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

export default UserDashboard;