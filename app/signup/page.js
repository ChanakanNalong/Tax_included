"use client"; // ต้องใส่บรรทัดนี้เพื่อระบุว่าเป็น Client Component
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./signup.css"; // นำเข้าไฟล์ CSS ที่แยกไว้
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa"; // ไอคอน

export default function Signup() {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const router = useRouter(); // ใช้ router สำหรับเปลี่ยนหน้า

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        alert(data.message);

        // เมื่อสมัครเสร็จแล้ว ให้ไปที่หน้า login
        router.push("/login"); // เปลี่ยนหน้าไปที่ /login
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">Sign Up</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="input-wrapper">
                        <FaUser className="input-icon" />
                        <input
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            onChange={handleChange}
                            required
                            className="signup-input"
                        />
                    </div>
                    <div className="input-wrapper">
                        <FaUser className="input-icon" />
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            onChange={handleChange}
                            required
                            className="signup-input"
                        />
                    </div>
                    <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                            className="signup-input"
                        />
                    </div>
                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                            className="signup-input"
                        />
                    </div>
                    <div className="input-wrapper">
                        <FaLock className="input-icon" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            required
                            className="signup-input"
                        />
                    </div>
                    
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
            </div>
        </div>
    );
}
