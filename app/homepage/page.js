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
    const username = "John Doe";
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) router.push("/login");
    }, [router]);

    return (
        <div className="layout">
            {/* Sidebar ซ้าย */}
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
                <header className="header">
                    <h1>Tax Overview</h1>
                    <div className="header-actions">
                        <div className="profile" onClick={() => router.push("/profile")}>
                            <FaUserCircle className="icon" />
                            <span className="username">{username}</span>
                        </div>
                        <button className="notification-btn"><FaBell className="icon" /></button>
                        <button className="help-btn"><FaInfoCircle className="icon" /></button>
                        <button className="logout-btn" onClick={() => {
                            localStorage.removeItem("token");
                            router.push("/login");
                        }}>Logout</button>
                    </div>
                </header>

                {/* Summary Cards */}
                <section className="summary-container">
                    <div className="summary-card"><GiReceiveMoney /><p>$500,000</p><p>รายได้รวม</p></div>
                    <div className="summary-card"><FaCreditCard /><p>$200,000</p><p>รายจ่ายรวม</p></div>
                    <div className="summary-card"><FaFileInvoiceDollar /><p>$50,000</p><p>ค่าลดหย่อน</p></div>
                    <div className="summary-card"><FaFileInvoiceDollar /><p>$50,000</p><p>ค่าภาษีที่ต้องจ่าย</p></div>
                </section>

                {/* Charts */}
                <section className="chart-container">
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

            {/* Sidebar ขวา */}
            <aside className="right-sidebar">
                <h2>Notifications</h2>
                <ul>
                    <li>📢 อัปเดตภาษีล่าสุด</li>
                    <li>🔔 แจ้งเตือนการจ่ายภาษี</li>
                    <li>📑 เอกสารที่ต้องยื่น</li>
                </ul>

                <h2>Quick Actions</h2>
                <button>📤 ส่งเอกสาร</button>
                <button>📊 ดูรายงาน</button>
            </aside>
        </div>
    );
}
