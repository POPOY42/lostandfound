import { useState, useEffect } from "react";
import "../../styles-user/myprofile.css";

const CONFIRM_COPY = {
    username: {
        title: "Save new username?",
        body: "Your username will be updated right away."
    },
    phone: {
        title: "Save new phone number?",
        body: "Barangay staff will use this number to reach you about your reports."
    },
    password: {
        title: "Update your password?",
        body: "You'll need to use your new password the next time you log in."
    }
};

const Profile = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const [user, setUser] = useState(storedUser);
    const [loading, setLoading] = useState(true);

    const [usernameForm, setUsernameForm] = useState({ username: "" });
    const [usernameErrors, setUsernameErrors] = useState({});
    const [usernameSaving, setUsernameSaving] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState("");

    const [phoneForm, setPhoneForm] = useState({ contactNumber: "" });
    const [phoneErrors, setPhoneErrors] = useState({});
    const [phoneSaving, setPhoneSaving] = useState(false);
    const [phoneMessage, setPhoneMessage] = useState("");

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");

    const [confirmTarget, setConfirmTarget] = useState(null);

    const fetchProfile = async () => {
        if (!storedUser?._id) return;
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/users/${storedUser._id}`);
            const data = await response.json();
            if (response.ok) {
                setUser(data);
                setUsernameForm({ username: data.username || "" });
                setPhoneForm({ contactNumber: data.contactNumber || "" });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleUsernameChange = (e) => {
        setUsernameForm({ username: e.target.value });
        setUsernameErrors({});
        setUsernameMessage("");
    };

    const handlePhoneChange = (e) => {
        setPhoneForm({ contactNumber: e.target.value });
        setPhoneErrors({});
        setPhoneMessage("");
    };

    const handlePasswordChange = (field) => (e) => {
        setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
        setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
        setPasswordMessage("");
    };

    const validateUsername = () => {
        const newErrors = {};
        if (!usernameForm.username.trim()) newErrors.username = "Username is required";
        setUsernameErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePhone = () => {
        const newErrors = {};
        if (!phoneForm.contactNumber.trim()) newErrors.contactNumber = "Phone number is required";
        setPhoneErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};
        if (!passwordForm.currentPassword) newErrors.currentPassword = "Current password is required";
        if (!passwordForm.newPassword) newErrors.newPassword = "New password is required";
        else if (passwordForm.newPassword.length < 8)
            newErrors.newPassword = "Password must be at least 8 characters";
        if (passwordForm.confirmPassword !== passwordForm.newPassword)
            newErrors.confirmPassword = "Passwords do not match";
        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const requestSave = (target) => {
        if (target === "username" && !validateUsername()) return;
        if (target === "phone" && !validatePhone()) return;
        if (target === "password" && !validatePassword()) return;
        setConfirmTarget(target);
    };

    const cancelConfirm = () => setConfirmTarget(null);

    const handleConfirmSave = () => {
        if (confirmTarget === "username") return saveUsername();
        if (confirmTarget === "phone") return savePhone();
        if (confirmTarget === "password") return savePassword();
    };

    const saveUsername = async () => {
        try {
            setUsernameSaving(true);
            setUsernameMessage("");

            const response = await fetch("http://localhost:5000/api/users/username", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user._id,
                    username: usernameForm.username.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setUsernameErrors({ form: data.message || "Failed to update username." });
                return;
            }

            const updatedUser = data.user || data;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUsernameMessage("Username updated successfully.");
        } catch (error) {
            console.error(error);
            setUsernameErrors({ form: "Something went wrong. Please try again." });
        } finally {
            setUsernameSaving(false);
            setConfirmTarget(null);
        }
    };

    // ── Phone number ──
    const savePhone = async () => {
        try {
            setPhoneSaving(true);
            setPhoneMessage("");

            const response = await fetch("http://localhost:5000/api/users/contact-number", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user._id,
                    contactNumber: phoneForm.contactNumber.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setPhoneErrors({ form: data.message || "Failed to update phone number." });
                return;
            }

            const updatedUser = data.user || data;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setPhoneMessage("Phone number updated successfully.");
        } catch (error) {
            console.error(error);
            setPhoneErrors({ form: "Something went wrong. Please try again." });
        } finally {
            setPhoneSaving(false);
            setConfirmTarget(null);
        }
    };

    // ── Password ──
    const savePassword = async () => {
        try {
            setPasswordSaving(true);
            setPasswordMessage("");

            const response = await fetch("http://localhost:5000/api/users/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user._id,
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setPasswordErrors({ form: data.message || "Failed to update password." });
                return;
            }

            setPasswordMessage("Password changed successfully.");
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            console.error(error);
            setPasswordErrors({ form: "Something went wrong. Please try again." });
        } finally {
            setPasswordSaving(false);
            setConfirmTarget(null);
        }
    };

    const isConfirmSaving =
        (confirmTarget === "username" && usernameSaving) ||
        (confirmTarget === "phone" && phoneSaving) ||
        (confirmTarget === "password" && passwordSaving);

    const getInitials = () => {
        if (!user?.name) return "?";
        const a = user.name.charAt(0) || "";
        const b = user.surname?.charAt(0) || "";
        return (a + b).toUpperCase();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="profile-page">
                <p className="profile-loading">Loading your profile…</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>My Profile</h1>
                <p>Manage your account details and security settings.</p>
            </div>

            <div className="profile-layout">
                {/* Summary card */}
                <div className="profile-summary-card">
                    <div className="profile-avatar">{getInitials()}</div>
                    <h2 className="profile-summary-name">
                        {user?.name} {user?.surname}
                    </h2>
                    <span className="profile-role-badge">{user?.role || "resident"}</span>

                    <div className="profile-summary-divider" />

                    <div className="profile-summary-row">
                        <span className="label">Username</span>
                        <span className="value">{user?.username || "—"}</span>
                    </div>
                    <div className="profile-summary-row">
                        <span className="label">Phone</span>
                        <span className="value">{user?.contactNumber || "—"}</span>
                    </div>
                    <div className="profile-summary-row">
                        <span className="label">Member since</span>
                        <span className="value">{formatDate(user?.createdAt)}</span>
                    </div>
                </div>

                {/* Settings forms */}
                <div className="profile-forms">
                    {/* Username */}
                    <div className="profile-card">
                        <h3 className="profile-card-title">Username</h3>
                        <p className="profile-card-subtitle">
                            This is the name other people see on your posts.
                        </p>

                        {usernameMessage && (
                            <div className="profile-success-banner">{usernameMessage}</div>
                        )}
                        {usernameErrors.form && (
                            <div className="profile-error-banner">{usernameErrors.form}</div>
                        )}

                        <div className={`profile-field ${usernameErrors.username ? "has-error" : ""}`}>
                            <label>Username</label>
                            <input
                                type="text"
                                value={usernameForm.username}
                                onChange={handleUsernameChange}
                            />
                            {usernameErrors.username && (
                                <span className="profile-field-error">{usernameErrors.username}</span>
                            )}
                        </div>

                        <button
                            className="profile-save-btn"
                            onClick={() => requestSave("username")}
                            disabled={usernameSaving}
                        >
                            {usernameSaving ? "Saving…" : "Save Username"}
                        </button>
                    </div>

                    {/* Phone number */}
                    <div className="profile-card">
                        <h3 className="profile-card-title">Phone Number</h3>
                        <p className="profile-card-subtitle">
                            Used by the barangay staff to reach you about your reports.
                        </p>

                        {phoneMessage && (
                            <div className="profile-success-banner">{phoneMessage}</div>
                        )}
                        {phoneErrors.form && (
                            <div className="profile-error-banner">{phoneErrors.form}</div>
                        )}

                        <div className={`profile-field ${phoneErrors.contactNumber ? "has-error" : ""}`}>
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={phoneForm.contactNumber}
                                onChange={handlePhoneChange}
                            />
                            {phoneErrors.contactNumber && (
                                <span className="profile-field-error">{phoneErrors.contactNumber}</span>
                            )}
                        </div>

                        <button
                            className="profile-save-btn"
                            onClick={() => requestSave("phone")}
                            disabled={phoneSaving}
                        >
                            {phoneSaving ? "Saving…" : "Save Phone Number"}
                        </button>
                    </div>

                    {/* Password */}
                    <div className="profile-card">
                        <h3 className="profile-card-title">Change Password</h3>
                        <p className="profile-card-subtitle">
                            Choose a strong password you don't use elsewhere.
                        </p>

                        {passwordMessage && (
                            <div className="profile-success-banner">{passwordMessage}</div>
                        )}
                        {passwordErrors.form && (
                            <div className="profile-error-banner">{passwordErrors.form}</div>
                        )}

                        <div className={`profile-field ${passwordErrors.currentPassword ? "has-error" : ""}`}>
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange("currentPassword")}
                            />
                            {passwordErrors.currentPassword && (
                                <span className="profile-field-error">{passwordErrors.currentPassword}</span>
                            )}
                        </div>

                        <div className="profile-field-row">
                            <div className={`profile-field ${passwordErrors.newPassword ? "has-error" : ""}`}>
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange("newPassword")}
                                />
                                {passwordErrors.newPassword && (
                                    <span className="profile-field-error">{passwordErrors.newPassword}</span>
                                )}
                            </div>

                            <div className={`profile-field ${passwordErrors.confirmPassword ? "has-error" : ""}`}>
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange("confirmPassword")}
                                />
                                {passwordErrors.confirmPassword && (
                                    <span className="profile-field-error">{passwordErrors.confirmPassword}</span>
                                )}
                            </div>
                        </div>

                        <button
                            className="profile-save-btn"
                            onClick={() => requestSave("password")}
                            disabled={passwordSaving}
                        >
                            {passwordSaving ? "Updating…" : "Update Password"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation modal - shared by all three save actions */}
            {confirmTarget && (
                <div className="profile-confirm-overlay" onClick={cancelConfirm}>
                    <div className="profile-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{CONFIRM_COPY[confirmTarget].title}</h2>
                        <p>{CONFIRM_COPY[confirmTarget].body}</p>

                        <div className="profile-confirm-actions">
                            <button
                                className="profile-confirm-cancel-btn"
                                onClick={cancelConfirm}
                                disabled={isConfirmSaving}
                            >
                                Cancel
                            </button>
                            <button
                                className="profile-confirm-save-btn"
                                onClick={handleConfirmSave}
                                disabled={isConfirmSaving}
                            >
                                {isConfirmSaving ? "Saving…" : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;