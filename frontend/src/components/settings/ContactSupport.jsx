import { CiMail, CiPhone, CiGlobe, CiLocationOn } from "react-icons/ci";

import "../../styles/settings.css";

const ContactSupport = ({ onClose }) => {
  return (
    <div className="cs-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="cs-card">
        <div className="cs-header">
          <div>
            <div className="cs-icon-wrap">
              <CiHeadphonesIcon />
            </div>
            <p className="cs-title">Contact Support</p>
            <p className="cs-subtitle">
              Reach out to the system administrator for help with the Lost and
              Found System.
            </p>
          </div>
          <button className="cs-close" onClick={onClose}>×</button>
        </div>

        <div className="cs-info-grid">
          <div className="cs-info-item">
            <div className="cs-info-icon">
              <CiMail size={18} />
            </div>
            <div className="cs-info-text">
              <span className="cs-info-label">Email</span>
              <p className="cs-info-value">support@lostandfound.edu.ph</p>
            </div>
          </div>

          <div className="cs-info-item">
            <div className="cs-info-icon">
              <CiPhone size={18} />
            </div>
            <div className="cs-info-text">
              <span className="cs-info-label">Phone</span>
              <p className="cs-info-value">+63 912 345 6789</p>
            </div>
          </div>

          <div className="cs-info-item">
            <div className="cs-info-icon">
              <CiLocationOn size={18} />
            </div>
            <div className="cs-info-text">
              <span className="cs-info-label">Office</span>
              <p className="cs-info-value">Student Affairs Office</p>
            </div>
          </div>

          <div className="cs-info-item">
            <div className="cs-info-icon">
              <CiGlobe size={18} />
            </div>
            <div className="cs-info-text">
              <span className="cs-info-label">Office Hours</span>
              <p className="cs-info-value">Mon–Fri · 8:00 AM–5:00 PM</p>
            </div>
          </div>
        </div>

        <div className="cs-note">
          <strong>Before you reach out</strong>
          <p>
            Please include your full name, student ID, and a detailed
            description of your concern so we can resolve your issue more
            efficiently.
          </p>
        </div>

        <button className="cs-btn-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// Small inline headset icon to keep the icon consistent with our outline style
const CiHeadphonesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" />
  </svg>
);

export default ContactSupport;