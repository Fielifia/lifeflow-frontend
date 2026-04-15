import { useState } from "react";
import API from "../api/api";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            setUser(true);
        } catch {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>

            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
