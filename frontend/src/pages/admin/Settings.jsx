import {
  CiUser,
  CiLock,
  CiRead,
  CiHeadphones,
  CiCircleInfo,
  CiPen,
} from "react-icons/ci";

import { HiOutlineUserGroup } from "react-icons/hi";

import "../../styles/settings.css";

const Settings = () => {
  return (
    <div className="settings-wrapper">
      <div className="settings-header">
        <h1>Settings</h1>
        <small>
          Manage your account and system preferences
        </small>
      </div>

      <div className="settings-box">

        {/* Account Settings */}
        <div className="settings-card">
          <div className="settings-card-info">
            <CiUser className="card-icon" />

            <h3>Account Settings</h3>

            <small>
              Manage your admin account
              <br />
              information.
            </small>
          </div>

          <div className="settings-card-actions">
            <button className="settings-btn">
              <CiUser />
              Change Username
            </button>

            <button className="settings-btn">
              <CiLock />
              Change Password
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="settings-card">
          <div className="settings-card-info">
            <CiRead className="card-icon" />

            <h3>Help & Support</h3>

            <small>
              Get guidance or reach out
              <br />
              to our support team.
            </small>
          </div>

          <div className="settings-card-actions settings-links">
            <a href="#" className="settings-link">
              <CiRead />
              User Guide
            </a>

            <hr className="divider" />

            <a href="#" className="settings-link">
              <CiHeadphones />
              Contact Support
            </a>
          </div>
        </div>

        {/* About System */}
        <div className="settings-card">
          <div className="settings-card-info">
            <CiCircleInfo className="card-icon" />

            <h3>About System</h3>

            <small>
              View version details and
              <br />
              the development team.
            </small>
          </div>

          <div className="settings-card-actions">
            <span className="version-badge">
              Version 1.0.0
            </span>

            <div className="settings-links">
              <a href="#" className="settings-link">
                <HiOutlineUserGroup />
                Developers
              </a>

              <hr className="divider" />

              <a href="#" className="settings-link">
                <CiPen />
                Design Team
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;