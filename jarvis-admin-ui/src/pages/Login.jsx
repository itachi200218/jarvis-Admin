import { useState } from "react";
import { loginUser } from "../api/userApi";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
    const [loginInput, setLoginInput] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const data = await loginUser(loginInput, password);

            // ✅ EXPECT JWT FROM BACKEND
            if (data?.token) {
                localStorage.setItem("token", data.token); // ✅ FIXED
                setMessage("✅ Login successful");

                setTimeout(() => {
                    navigate("/dashboard");
                }, 300);
            } else {
                setMessage("❌ Invalid credentials");
            }
        } catch (err) {
            setMessage("❌ Login failed");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleLogin}>
                <h2>Login</h2>

                <input
                    placeholder="Username or Email"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>

                {message && <p>{message}</p>}

                {/*<p className="auth-link">*/}
                {/*    No account? <Link to="/register">Register</Link>*/}
                {/*</p>*/}
            </form>
        </div>
    );
}
