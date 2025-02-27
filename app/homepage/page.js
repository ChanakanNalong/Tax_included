"use client";

import "./homepage.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaCreditCard, FaFileInvoiceDollar, FaUserCircle, FaBell, FaInfoCircle } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";

const revenueData = [
    { day: "Mon", amount: 100 },
    { day: "Tue", amount: 200 },
    { day: "Wed", amount: 150 },
    { day: "Thu", amount: 50 },
    { day: "Fri", amount: 75 },
    { day: "Sat", amount: 100 },
    { day: "Sun", amount: 120 },
];

const expenseData = [
    { name: "Food", value: 400 },
    { name: "Transport", value: 300 },
    { name: "Shopping", value: 300 },
    { name: "Other", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
    const username = "John Doe"; // ตัวอย่างชื่อผู้ใช้ (สามารถดึงมาจาก state หรือ context)
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) router.push("/login");
    }, [router]);

    return (
        <div className="layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2>Tax Dashboard</h2>
                <ul>
                    <li><a href="/dashboard">🏠 Dashboard</a></li>
                    <li><a href="/income">💰 Income</a></li>
                    <li><a href="/expenses">📊 Expenses</a></li>
                    <li><a href="/tax">⚖️ Tax</a></li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="header">
                    <h1>Tax Overview</h1>

                    <div className="header-actions">
                        {/* ส่วนของโปรไฟล์และชื่อผู้ใช้ */}
                        <div className="profile" onClick={() => router.push("/profile")}>
                            <FaUserCircle className="icon" />
                            <span className="username">{username}</span>
                        </div>

                        {/* ปุ่มแจ้งเตือน */}
                        <button className="notification-btn">
                            <FaBell className="icon" />
                        </button>

                        {/* ปุ่มช่วยเหลือ */}
                        <button className="help-btn">
                            <FaInfoCircle className="icon" />
                        </button>

                        {/* ปุ่มออกจากระบบ */}
                        <button className="logout-btn" onClick={() => {
                            localStorage.removeItem("token");
                            router.push("/login");
                        }}>
                            Logout
                        </button>
                    </div>
                </header>

                {/* Summary Cards */}
                <section className="summary-container">
                    <div className="summary-card">
                        <div className="icon"><GiReceiveMoney /></div>
                        <div>
                            <p className="amount">$500,000</p>
                            <p className="label">รายได้รวม</p>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="icon"><FaCreditCard /></div>
                        <div>
                            <p className="amount">$200,000</p>
                            <p className="label">รายจ่ายรวม</p>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="icon"><FaFileInvoiceDollar /></div>
                        <div>
                            <p className="amount">$50,000</p>
                            <p className="label">ค่าลดหย่อน</p>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="icon"><FaFileInvoiceDollar /></div>
                        <div>
                            <p className="amount">$50,000</p>
                            <p className="label">ค่าภาษีที่ต้องจ่าย</p>
                        </div>
                    </div>
                </section>

                {/* Charts */}
                <section className="chart-container">
                    {/* กราฟแท่ง */}
                    <div className="chart">
                        <h2>Revenue-Expenses Trend</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueData}>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* กราฟวงกลม */}
                    <div className="chart">
                        <h2>Display Revenue-Expense Proportion</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {expenseData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </main>
        </div >
    );
}
