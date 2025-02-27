"use client";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ ใช้ชื่อ `jwtDecode` แทน
import "./income.css";

export default function Income() {
    const [formData, setFormData] = useState({
        user_id: null,
        salary: 0,
        freelance: 0,
        royalty: 0, // ✅ เปลี่ยนจาก copyright เป็น royalty
        dividend: 0, // ✅ เปลี่ยนจาก interest_dividend เป็น dividend
        rental: 0, // ✅ เปลี่ยนจาก rent เป็น rental
        profession: 0,
        contractor: 0,
        sell_products: 0, // ⚠️ เช็คว่าต้องใช้จริงไหม?
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setFormData((prev) => ({ ...prev, user_id: decoded.userId }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 })); // ✅ แปลงเป็นตัวเลข
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/income", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            alert(data.message);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to save income data");
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2 className="title">Income Form</h2>
                <form onSubmit={handleSubmit}>
                    <input type="number" name="salary" placeholder="Salary" onChange={handleChange} className="input" />
                    <input type="number" name="freelance" placeholder="Freelance" onChange={handleChange} className="input" />
                    <input type="number" name="royalty" placeholder="Royalty" onChange={handleChange} className="input" />
                    <input type="number" name="dividend" placeholder="Dividend" onChange={handleChange} className="input" />
                    <input type="number" name="rental" placeholder="Rental" onChange={handleChange} className="input" />
                    <input type="number" name="profession" placeholder="Profession" onChange={handleChange} className="input" />
                    <input type="number" name="contractor" placeholder="Contractor" onChange={handleChange} className="input" />
                    <input type="number" name="sell_products" placeholder="Sell Products" onChange={handleChange} className="input" />
                    <button type="submit" className="button">Save Income</button>
                </form>
            </div>
        </div>
    );
}
