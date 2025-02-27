"use client"; // บอกว่าเป็น Client Component
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./forgotpassword.css"; // นำเข้าไฟล์ CSS

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            alert("Please enter your email.");
            return;
        }

        const res = await fetch("/api/forgotpassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        alert(data.message);

        // ส่งกลับไปหน้าล็อกอิน
        router.push("/login");
    };

    return (
        <div className="forgot-container">
            <div className="forgot-box">
                <h2 className="forgot-title">Forgot Password</h2>
                <p className="forgot-text">Enter your email to reset your password.</p>
                <form onSubmit={handleSubmit} className="forgot-form">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="forgot-input"
                    />
                    <button type="submit" className="forgot-button">Reset Password</button>
                </form>
                <a href="/login" className="back-to-login">Back to Login</a>
            </div>
        </div>
    );
}
