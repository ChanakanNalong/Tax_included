import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "tax_db",
};

// ใช้ Connection Pool
const pool = mysql.createPool(dbConfig);

// ✅ API สำหรับเพิ่มรายได้ (POST)
export async function POST(req) {
    let connection;
    try {
        const body = await req.json();
        const { user_id, salary, freelance, royalty, dividend, rental, independent_profession, contractor, other_income } = body;

        // ตรวจสอบค่าเป็นตัวเลข
        const toNumber = (value) => (isNaN(parseFloat(value)) ? 0 : parseFloat(value));

        // คำนวณรายได้รวม
        const sum_income =
            toNumber(salary) + toNumber(freelance) + toNumber(royalty) +
            toNumber(dividend) + toNumber(rental) + toNumber(independent_profession) +
            toNumber(contractor) + toNumber(other_income);

        connection = await pool.getConnection();

        // บันทึกข้อมูลใน income
        const [incomeResult] = await connection.execute(
            `INSERT INTO income (
                user_id, salary, freelance, royalty, dividend, rental, 
                independent_profession, contractor, other_income, sum_income
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, toNumber(salary), toNumber(freelance), toNumber(royalty),
                toNumber(dividend), toNumber(rental), toNumber(independent_profession),
                toNumber(contractor), toNumber(other_income), sum_income
            ]
        );

        // ใช้ income_id ที่ได้จากการบันทึกข้อมูลใน income เพื่อบันทึกข้อมูลลงใน expense
        const income_id = incomeResult.insertId;

        // คำนวณค่าใช้จ่ายแต่ละประเภท
        const salary_expense = toNumber(salary) * 0.5;
        const freelance_expense = toNumber(freelance) * 0.5;
        const royalty_expense = toNumber(royalty) * 0.5;
        const rental_expense = toNumber(rental);
        const independent_profession_expense = toNumber(independent_profession) * 0.3;
        const contractor_expense = toNumber(contractor) * 0.7;
        const other_income_expense = toNumber(other_income) * 0.6;

        // คำนวณค่าใช้จ่ายรวมทั้งหมด
        const sum_expense =
            salary_expense + freelance_expense + royalty_expense +
            rental_expense + independent_profession_expense +
            contractor_expense + other_income_expense;

        // บันทึกค่าใช้จ่ายลงในตาราง expense
        await connection.execute(
            `INSERT INTO expense (
                user_id, income_id, salary_expense, freelance_expense, royalty_expense, rental_expense,
                independent_profession_expense, contractor_expense, other_income_expense, sum_expense
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, income_id, salary_expense, freelance_expense, royalty_expense,
                rental_expense, independent_profession_expense, contractor_expense,
                other_income_expense, sum_expense
            ]
        );

        return NextResponse.json({ message: "Income and expense data saved successfully", id: income_id }, { status: 201 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });

    } finally {
        if (connection) {
            connection.release();
        }
    }
}
