import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export const runtime = "nodejs"; // ✅ ทำให้ API ใช้ Node.js Runtime

export async function POST(req) {
    try {
        const { firstname, lastname, email, password } = await req.json();

        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "tax_db",
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute(
            "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)",
            [firstname, lastname, email, hashedPassword]
        );

        connection.end();
        return Response.json({ message: "User registered successfully" }, { status: 200 });

    } catch (error) {
        return Response.json({ message: "Error saving user", error: error.message }, { status: 500 });
    }
}
