"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css"; // เรียกใช้ไฟล์ CSS
import { FaEnvelope, FaLock} from "react-icons/fa"; // ไอคอน

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            if (!res.ok) {
                throw new Error("Login Failed!");
            }
    
            const data = await res.json();
            if (data.token) {
                localStorage.setItem("token", data.token); // บันทึก token ลง localStorage
                alert("Login Success!");
                router.push("/homepage"); // ไปที่หน้า income
            }
        } catch (error) {
            alert(error.message);
        }
    };
    

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">LOGIN</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                        {/* <FaEye
                            className="input-icon toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        /> */}
                    </div>
                    <div className="forgot-password" >
                        <a href="/forgotpassword">Forgot password</a>
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>

                <div className="separator">Login with social accounts</div>
                <div className="social-icons">
                    <img src="/images/gg.png" alt="Gmail" />
                    <img src="/images/apple.png" alt="Apple" />
                    <img src="/images/github.png" alt="GitHub" />
                </div>

                <div className="signup-link">
                    Don’t have an account? <a href="/signup">Sign up</a>
                </div>
            </div>
        </div>
    );
}
