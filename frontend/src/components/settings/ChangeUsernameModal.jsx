import { useState } from "react";
import "../../styles/settings.css";

const ChangeUsernameModal = ({ onClose , currentUsername}) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = (value) => {
    if (!value) return "Username can't be empty.";
    if (value.length < 3) return "At least 3 characters required.";
    if (value.length > 20) return "20 characters max.";
    if (!/^[a-zA-Z0-9_]+$/.test(value))
      return "Letters, numbers, and underscores only.";
    return "";
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setUsername(val);
    if (error) setError(validate(val));
  };

  const handleSave = () => {
    const err = validate(username);
    if (err) return setError(err);
    setSuccess(true);
    setTimeout(() => {
      onClose?.();
    }, 1200);
  };

  return (
    <div className="cu-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="cu-card">
        <div className="cu-header">
          <div>
            <div className="cu-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9d8fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <p className="cu-title">Change username</p>
            <p className="cu-subtitle">Pick something you'll actually remember.</p>
          </div>
          <button className="cu-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cu-current">
          <span className="cu-current-label">Current</span>
          <span className="cu-current-value">@{currentUsername}</span>
        </div>

        <label className="cu-field-label">New username</label>
        <div className="cu-input-wrap">
          <span className="cu-prefix">@</span>
          <input
            className={`cu-input${error ? " has-error" : ""}`}
            type="text"
            placeholder="new_username"
            value={username}
            onChange={handleChange}
            maxLength={20}
            autoFocus
            spellCheck={false}
          />
        </div>
        <div className={`cu-hint${error ? " cu-error" : ""}`}>
          {error || "3–20 chars · letters, numbers, underscores"}
        </div>

        <div className="cu-actions">
          <button className="cu-btn cu-btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className={`cu-btn cu-btn-save${success ? " saved" : ""}`}
            onClick={handleSave}
          >
            {success ? "✓ Saved" : "Save username"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeUsernameModal;