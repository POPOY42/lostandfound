import { useState } from "react";
import "../../styles/settings.css";

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const getStrength = (password) => {
  if (!password) return { score: 0, label: "", key: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 1, label: "Weak", key: "weak" };
  if (score === 2) return { score: 2, label: "Fair", key: "fair" };
  if (score === 3) return { score: 3, label: "Good", key: "good" };
  return { score: 4, label: "Strong", key: "strong" };
};

const PasswordField = ({ label, placeholder, value, onChange, error, showStrength }) => {
  const [visible, setVisible] = useState(false);
  const strength = showStrength ? getStrength(value) : null;

  return (
    <div className="cp-field">
      <label className="cp-field-label">{label}</label>
      <div className="cp-input-wrap">
        <input
          className={`cp-input${error ? " has-error" : ""}`}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          spellCheck={false}
        />
        <button className="cp-toggle" onClick={() => setVisible((v) => !v)} type="button" tabIndex={-1}>
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {showStrength && value && (
        <div className="cp-strength">
          <div className="cp-strength-bars">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`cp-strength-bar${i <= strength.score ? " " + strength.key : ""}`}
              />
            ))}
          </div>
          <span className={`cp-strength-label ${strength.key}`}>{strength.label}</span>
        </div>
      )}
      {error && <p className="cp-hint">{error}</p>}
    </div>
  );
};

const ChangePasswordModal = ({ onClose }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!current) e.current = "Enter your current password.";
    if (!next) e.next = "Enter a new password.";
    else if (next.length < 8) e.next = "At least 8 characters required.";
    else if (next === current) e.next = "New password can't match the current one.";
    if (!confirm) e.confirm = "Please confirm your new password.";
    else if (confirm !== next) e.confirm = "Passwords don't match.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setSuccess(true);
    setTimeout(() => onClose?.(), 1200);
  };

  const isReady = current && next && confirm;

  return (
    <div className="cp-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="cp-card">
        <div className="cp-header">
          <div>
            <div className="cp-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9d8fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <p className="cp-title">Change password</p>
            <p className="cp-subtitle">Use a strong password you don't reuse.</p>
          </div>
          <button className="cp-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <PasswordField
          label="Current password"
          placeholder="••••••••"
          value={current}
          onChange={(e) => { setCurrent(e.target.value); setErrors((prev) => ({ ...prev, current: "" })); }}
          error={errors.current}
        />

        <hr className="cp-divider" />

        <PasswordField
          label="New password"
          placeholder="••••••••"
          value={next}
          onChange={(e) => { setNext(e.target.value); setErrors((prev) => ({ ...prev, next: "" })); }}
          error={errors.next}
          showStrength
        />

        <PasswordField
          label="Confirm new password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setErrors((prev) => ({ ...prev, confirm: "" })); }}
          error={errors.confirm}
        />

        <div className="cp-actions">
          <button className="cp-btn cp-btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className={`cp-btn cp-btn-save${success ? " saved" : ""}`}
            onClick={handleSave}
            disabled={!isReady}
          >
            {success ? "✓ Updated" : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;