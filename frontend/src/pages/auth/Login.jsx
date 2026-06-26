import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/login.css";



const Login = () => {
    const navigate = useNavigate()

    const [loginData, setLoginData] = useState({
        studentId: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        studentId: "",
        password: ""
    });

    const handleChange = (field) => (e) => {
        setLoginData((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async () => {
        const newErrors = {
            studentId: "",
            password: ""
        };

        if (!loginData.studentId.trim()) newErrors.studentId = "Student ID is required";
        if (!loginData.password) newErrors.password = "Password is required";

        setErrors(newErrors);
        const hasErrors = Object.values(newErrors).some((e) => e !== "");
        if (hasErrors) return;

        try{
            const loginFetch = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(loginData)
            })

            const data = await loginFetch.json()

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
        );

            if (!loginFetch.ok) {
                setErrors((prev) => ({
                    ...prev,
                    password: data.message
                }));
                return;
            }
            
            if(data.user.role === "admin"){
                navigate("/adminDashboard")
            }else if(data.user.role === "student"){
                navigate("/studentDashboard")
            }
        }
        catch(error){
            console.error(error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <div className="login-avatar">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                            <polyline points="10 17 15 12 10 7"/>
                            <line x1="15" y1="12" x2="3" y2="12"/>
                        </svg>
                    </div>
                    <h2>Welcome back</h2>
                    <p>Sign in to your student account</p>
                </div>

                <div className="login-form">

                    <div className={`login-field ${errors.studentId ? "has-error" : ""}`}>
                        <label>Student ID</label>
                        <div className="input-wrap">
                            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2"/>
                                <path d="M8 10h8M8 14h4"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="e.g. 2024-00001"
                                value={loginData.studentId}
                                onChange={handleChange("studentId")}
                            />
                        </div>
                        {errors.studentId && <span className="field-error">{errors.studentId}</span>}
                    </div>

                    <div className={`login-field ${errors.password ? "has-error" : ""}`}>
                        <label>Password</label>
                        <div className="input-wrap">
                            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={loginData.password}
                                onChange={handleChange("password")}
                            />
                        </div>
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    <div className="login-options">
                        <a href="/forgot-password" className="forgot-link">Forgot password?</a>
                    </div>

                    <button className="login-btn" onClick={handleSubmit}>
                        Sign In
                    </button>

                </div>

                <p className="login-footer">
                    Don't have an account? <Link to={"/register"}>Register</Link>
                </p>

            </div>
        </div>
    );
};

export default Login;