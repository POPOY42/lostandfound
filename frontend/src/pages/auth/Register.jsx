import { useState } from "react";
import "../../styles/register.css";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        name: "",
        surname: "",
        username: "",
        contactNumber: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        surname: "",
        username: "",
        contactNumber: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (field) => (e) => {
        setRegisterData((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async () => {
        const newErrors = {
            name: "",
            surname: "",
            username: "",
            contactNumber: "",
            password: "",
            confirmPassword: ""
        };

        if (!registerData.name.trim()) newErrors.name = "Name is required";
        if (!registerData.surname.trim()) newErrors.surname = "Surname is required";
        if (!registerData.username.trim()) newErrors.username = "Username is required";
        if (!registerData.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
        if (!registerData.password) {
            newErrors.password = "Password is required";
        } else if (registerData.password.length < 8) {
            newErrors.password = "Must be at least 8 characters";
        }
        if (!registerData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        
        setErrors(newErrors);
        const hasErrors = Object.values(newErrors).some((e) => e !== "");
        if (hasErrors) return;

        try{
            const response = await fetch("https://lostandfound-8afg.onrender.com/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(registerData)
            })

            const data = await response.json()

            if(!response.ok){
                setErrors((prev) =>({
                    ...prev,
                    username: data.message
                }))
                return
            }
            navigate("/")
        }catch(error){
            console.error(error)
        }

    };

    return (
        <div className="register-page">
            <div className="register-card">

                <div className="register-header">
                    <div className="register-avatar">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <line x1="19" y1="8" x2="19" y2="14"/>
                            <line x1="22" y1="11" x2="16" y2="11"/>
                        </svg>
                    </div>
                    <h2>Create your account</h2>
                    <p>Fill in the details below to get started</p>
                </div>

                <div className="register-form">

                    <div className="register-row">
                        <div className={`register-field ${errors.name ? "has-error" : ""}`}>
                            <label>Name</label>
                            <div className="input-wrap">
                                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="4"/>
                                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={registerData.name}
                                    onChange={handleChange("name")}
                                />
                            </div>
                            {errors.name && <span className="field-error">{errors.name}</span>}
                        </div>

                        <div className={`register-field ${errors.surname ? "has-error" : ""}`}>
                            <label>Surname</label>
                            <div className="input-wrap">
                                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="4"/>
                                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={registerData.surname}
                                    onChange={handleChange("surname")}
                                />
                            </div>
                            {errors.surname && <span className="field-error">{errors.surname}</span>}
                        </div>
                    </div>

                    <div className={`register-field ${errors.username ? "has-error" : ""}`}>
                        <label>Username</label>

                        <div className="input-wrap">
                            <svg
                                className="input-icon"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>

                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={registerData.username}
                                onChange={handleChange("username")}
                            />
                        </div>

                        {errors.username && (
                            <span className="field-error">
                                {errors.username}
                            </span>
                        )}
                    </div>

                    <div className={`register-field ${errors.contactNumber ? "has-error" : ""}`}>
                        <label>Contact Number</label>

                        <div className="input-wrap">
                            <svg
                                className="input-icon"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 4.18 2 2 0 0 1 5.06 2h3a2 2 0 0 1 2 1.72l.38 2.49a2 2 0 0 1-.57 1.73L8.09 10.91a16 16 0 0 0 5 5l1.97-1.76a2 2 0 0 1 1.73-.57l2.49.38A2 2 0 0 1 22 16.92z"/>
                            </svg>

                            <input
                                type="text"
                                placeholder="09XXXXXXXXX"
                                maxLength={11}
                                value={registerData.contactNumber}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (/^\d*$/.test(value)) {
                                        setRegisterData((prev) => ({
                                            ...prev,
                                            contactNumber: value
                                        }));

                                        setErrors((prev) => ({
                                            ...prev,
                                            contactNumber: ""
                                        }));
                                    }
                                }}
                            />
                        </div>

                        {errors.contactNumber && (
                            <span className="field-error">
                                {errors.contactNumber}
                            </span>
                        )}
                    </div>

                    <div className={`register-field ${errors.password ? "has-error" : ""}`}>
                        <label>Password</label>
                        <div className="input-wrap">
                            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <input
                                type="password"
                                placeholder="At least 8 characters"
                                value={registerData.password}
                                onChange={handleChange("password")}
                            />
                        </div>
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    <div className={`register-field ${errors.confirmPassword ? "has-error" : ""}`}>
                        <label>Confirm Password</label>
                        <div className="input-wrap">
                            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                <path d="M9 16l2 2 4-4"/>
                            </svg>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={registerData.confirmPassword}
                                onChange={handleChange("confirmPassword")}
                            />
                        </div>
                        {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                    </div>

                    <button className="register-btn" onClick={handleSubmit}>
                        Register
                    </button>

                </div>

                <p className="register-footer">
                    Already have an account? <Link to={"/"}>Login</Link>
                </p>

            </div>
        </div>
    );
};

export default Register;