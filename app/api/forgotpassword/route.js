import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import crypto from "crypto"; // ใช้ crypto ในการสร้าง token ที่ปลอดภัย

// เชื่อมต่อกับ MySQL ใน XAMPP
const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tax_db",
});

// ตั้งค่า Nodemailer สำหรับส่งอีเมล
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "chanakan111138526@gmail.com", // เปลี่ยนเป็นอีเมลของคุณ
        pass: "odfz abxa comj wkqn", // เปลี่ยนเป็นรหัสผ่าน 16 ตัวที่ได้จาก Google
    },
});

// ฟังก์ชันส่งอีเมลรีเซ็ตรหัสผ่าน
async function sendResetEmail(email, token) {
    const resetLink = `http://localhost:3000/resetpassword?token=${token}`;
    
    await transporter.sendMail({
        from: '"Your App" <chanakan111138526@gmail.com>',
        to: email,
        subject: "Password Reset Request",
        text: `Click this link to reset your password: ${resetLink}`,
        html: `<p>Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });
}

// API สำหรับ forgot password
export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required." }, { status: 400 });
        }

        // ค้นหา email ใน database
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "Email not found." }, { status: 404 });
        }

        // สร้างโทเค็นรีเซ็ตรหัสผ่านโดยใช้ crypto
        const resetToken = crypto.randomBytes(32).toString("hex");

        // บันทึกโทเค็นลงฐานข้อมูล
        await db.execute("INSERT INTO password_resets (email, token, created_at) VALUES (?, ?, NOW())", [email, resetToken]);

        // ส่งอีเมล
        await sendResetEmail(email, resetToken);

        return NextResponse.json({
            message: "Password reset link has been sent to your email.",
        }, { status: 200 });

    } catch (error) {
        console.error("Error handling forgot password:", error);
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
    }
}
