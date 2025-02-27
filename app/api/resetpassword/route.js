import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs"; // นำเข้า bcryptjs

// เชื่อมต่อ MySQL
const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tax_db",
});

export async function POST(req) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ message: "Invalid request." }, { status: 400 });
        }

        // ตรวจสอบ Token ในฐานข้อมูล
        const [rows] = await db.execute("SELECT * FROM password_resets WHERE token = ?", [token]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "Invalid or expired token." }, { status: 400 });
        }

        const userEmail = rows[0].email;

        // แฮชรหัสผ่านใหม่ก่อนอัปเดต
        const hashedPassword = await bcrypt.hash(password, 10); // ใช้ 10 เป็น salt rounds

        // อัปเดตรหัสผ่านใหม่ที่แฮชแล้ว
        await db.execute("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, userEmail]);

        // ลบ Token หลังจากใช้งาน
        await db.execute("DELETE FROM password_resets WHERE token = ?", [token]);

        return NextResponse.json({ message: "Password reset successfully." }, { status: 200 });

    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
    }
}
