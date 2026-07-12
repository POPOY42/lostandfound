import { useState } from "react";
import "../../styles/login.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {

    const navigate = useNavigate()


    const [step, setStep] = useState(1); // 1: username, 2: phone verify, 3: new password, 4: done

    const [userId, setUserId] = useState(null);

    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [usernameLoading, setUsernameLoading] = useState(false);

    const [contactNumber, setContactNumber] = useState("");
    const [contactError, setContactError] = useState("");
    const [contactLoading, setContactLoading] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleFindUser = async () => {
        if (!username.trim()) {
            setUsernameError("Please enter your username.");
            return;
        }

        try {
            setUsernameLoading(true);
            setUsernameError("");

            const response = await fetch(
                "http://localhost:5000/api/users/forgot-password/find-user",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: username.trim() })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setUsernameError(data.message || "We couldn't find an account with that username.");
                return;
            }

            setUserId(data.userId);
            setStep(2);
        } catch (error) {
            console.error(error);
            setUsernameError("Something went wrong. Please try again.");
        } finally {
            setUsernameLoading(false);
        }
    };

    const handleVerifyContact = async () => {
        if (!contactNumber.trim()) {
            setContactError("Please enter your registered phone number.");
            return;
        }

        try {
            setContactLoading(true);
            setContactError("");

            const response = await fetch(
                "http://localhost:5000/api/users/forgot-password/verify-contact",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, contactNumber: contactNumber.trim() })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setContactError(data.message || "That phone number doesn't match our records.");
                return;
            }

            setStep(3);
        } catch (error) {
            console.error(error);
            setContactError("Something went wrong. Please try again.");
        } finally {
            setContactLoading(false);
        }
    };

    const handleResetPassword = async () => {
        const newErrors = {};
        if (!newPassword) newErrors.newPassword = "New password is required";
        else if (newPassword.length < 8)
            newErrors.newPassword = "Password must be at least 8 characters";
        if (confirmPassword !== newPassword)
            newErrors.confirmPassword = "Passwords do not match";

        setPasswordErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            setPasswordLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/users/forgot-password/reset",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, newPassword })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPasswordErrors({ form: data.message || "Failed to reset password." });
                return;
            }

            setStep(4);
        } catch (error) {
            console.error(error);
            setPasswordErrors({ form: "Something went wrong. Please try again." });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="forgot-page">
            <div className="forgot-card">
                <div className="forgot-header">
                    <div className="forgot-icon">🔑</div>
                    <h1>Reset your password</h1>
                    <p>
                        {step === 1 && "Enter your username to get started."}
                        {step === 2 && "Confirm your identity using your registered phone number."}
                        {step === 3 && "Choose a new password for your account."}
                        {step === 4 && "You're all set!"}
                    </p>
                </div>

                {/* Progress steps */}
                {step < 4 && (
                    <div className="forgot-progress">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="forgot-progress-step">
                                <div className={`forgot-progress-dot ${step >= s ? "active" : ""}`}>
                                    {step > s ? "✓" : s}
                                </div>
                                {s < 3 && (
                                    <div className={`forgot-progress-line ${step > s ? "active" : ""}`} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 1: Username */}
                {step === 1 && (
                    <div className="forgot-form">
                        <div className={`forgot-field ${usernameError ? "has-error" : ""}`}>
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setUsernameError("");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleFindUser()}
                            />
                            {usernameError && <span className="forgot-field-error">{usernameError}</span>}
                        </div>

                        <button
                            className="forgot-submit-btn"
                            onClick={handleFindUser}
                            disabled={usernameLoading}
                        >
                            {usernameLoading ? "Checking…" : "Continue"}
                        </button>
                    </div>
                )}

                {/* Step 2: Phone number verification */}
                {step === 2 && (
                    <div className="forgot-form">
                        <div className={`forgot-field ${contactError ? "has-error" : ""}`}>
                            <label>Registered Phone Number</label>
                            <input
                                type="text"
                                placeholder="e.g. 09171234567"
                                value={contactNumber}
                                onChange={(e) => {
                                    setContactNumber(e.target.value);
                                    setContactError("");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleVerifyContact()}
                            />
                            {contactError && <span className="forgot-field-error">{contactError}</span>}
                        </div>

                        <button
                            className="forgot-submit-btn"
                            onClick={handleVerifyContact}
                            disabled={contactLoading}
                        >
                            {contactLoading ? "Verifying…" : "Verify"}
                        </button>

                        <button className="forgot-back-btn" onClick={() => setStep(1)}>
                            ← Back
                        </button>
                    </div>
                )}

                {/* Step 3: New password */}
                {step === 3 && (
                    <div className="forgot-form">
                        {passwordErrors.form && (
                            <div className="forgot-error-banner">{passwordErrors.form}</div>
                        )}

                        <div className={`forgot-field ${passwordErrors.newPassword ? "has-error" : ""}`}>
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="At least 8 characters"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
                                }}
                            />
                            {passwordErrors.newPassword && (
                                <span className="forgot-field-error">{passwordErrors.newPassword}</span>
                            )}
                        </div>

                        <div className={`forgot-field ${passwordErrors.confirmPassword ? "has-error" : ""}`}>
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Re-enter your new password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                            />
                            {passwordErrors.confirmPassword && (
                                <span className="forgot-field-error">{passwordErrors.confirmPassword}</span>
                            )}
                        </div>

                        <button
                            className="forgot-submit-btn"
                            onClick={handleResetPassword}
                            disabled={passwordLoading}
                        >
                            {passwordLoading ? "Resetting…" : "Reset Password"}
                        </button>
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <div className="forgot-success">
                        <div className="forgot-success-icon">✅</div>
                        <p>Your password has been reset successfully.</p>
                        <button
                            className="forgot-submit-btn"
                            onClick={() => navigate("/")}
                        >
                            Back to Login
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <button
                        type="button"
                        className="forgot-footer-link"
                        onClick={() => navigate("/")}
                    >
                        ← Back to Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;