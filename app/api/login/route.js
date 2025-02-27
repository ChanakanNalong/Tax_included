import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // นำเข้า jwt สำหรับสร้าง Token
import { NextResponse } from "next/server";

// เชื่อมต่อฐานข้อมูล MySQL (XAMPP)
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "", // ใส่รหัสผ่านถ้ามี
    database: "tax_db",
};

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const connection = await mysql.createConnection(dbConfig);

        // ค้นหาผู้ใช้จากอีเมล
        const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "User not found!" }, { status: 401 });
        }

        const user = rows[0];

        // ตรวจสอบรหัสผ่านที่ถูกเข้ารหัส
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json({ message: "Invalid password!" }, { status: 401 });
        }

        // สร้าง JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email }, // ข้อมูลที่จะเข้ารหัสใน token
            "your_secret_key", // กุญแจลับ
            { expiresIn: "1h" } // ตั้งเวลาหมดอายุของ token
        );

        // ส่ง JWT token กลับไปที่ client
        return NextResponse.json({ message: "Login successful!", token }, { status: 200 });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}
