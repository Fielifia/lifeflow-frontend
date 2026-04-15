import { useState } from "react";
import API from "../api/api";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            await API.post("/auth/register", { email, password });
            alert("Account created");
        } catch {
            alert("Registration failed");
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>

            <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />

            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />

            <button onClick={handleRegister}>Create account</button>
        </div>
    );
}
