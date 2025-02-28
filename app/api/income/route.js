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
        // console.log("🔹 Raw Input Data:", body); // ✅ Log ตรงนี้ (หลังจากอ่านค่า req.json())

        const { user_id, salary, freelance, royalty, dividend, rental, independent_profession, contractor, other_income } = body;

        // ตรวจสอบค่าเป็นตัวเลข
        const toNumber = (value) => (isNaN(parseFloat(value)) || value == null ? 0 : parseFloat(value));

        // คำนวณรายได้รวม
        const sum_income =
            toNumber(salary) + toNumber(freelance) + toNumber(royalty) +
            toNumber(dividend) + toNumber(rental) + toNumber(independent_profession) +
            toNumber(contractor) + toNumber(other_income);

        // console.log("🔹 รายได้รวม:", sum_income); // ✅ Log ค่ารายได้รวม

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

        const income_id = incomeResult.insertId;
        // console.log("🔹 บันทึก income สำเร็จ: income_id =", income_id); // ✅ Log ค่า income_id ที่เพิ่ง insert

        // คำนวณค่าใช้จ่ายเงินได้ประเภทที่ 1 และ 2 (หัก 50% แต่ไม่เกิน 100,000 บาท)
        const incomeType1And2 = toNumber(salary) + toNumber(freelance);
        const maxDeduction = Math.min(incomeType1And2 * 0.5, 100000);

        const salaryRatio = incomeType1And2 > 0 ? toNumber(salary) / incomeType1And2 : 0;
        const freelanceRatio = incomeType1And2 > 0 ? toNumber(freelance) / incomeType1And2 : 0;

        const salaryExpense = parseFloat((maxDeduction * salaryRatio).toFixed(2));
        const freelanceExpense = parseFloat((maxDeduction * freelanceRatio).toFixed(2));

        // คำนวณค่าใช้จ่ายประเภทอื่น ๆ
        const expenses = {
            salary_expense: salaryExpense,
            freelance_expense: freelanceExpense,
            royalty_expense: parseFloat((toNumber(royalty) * 0.5).toFixed(2)),
            rental_expense: parseFloat(toNumber(rental).toFixed(2)),
            independent_profession_expense: parseFloat((toNumber(independent_profession) * 0.3).toFixed(2)),
            contractor_expense: parseFloat((toNumber(contractor) * 0.7).toFixed(2)),
            other_income_expense: parseFloat((toNumber(other_income) * 0.6).toFixed(2)),
        };

        const sum_expense = Object.values(expenses).reduce((sum, exp) => sum + exp, 0);
        // console.log("🔹 ค่าใช้จ่ายรวมทั้งหมด:", sum_expense); // ✅ Log ค่าใช้จ่ายรวม

        // บันทึกลงในฐานข้อมูล
        await connection.execute(
            `INSERT INTO expense (
                user_id, income_id, salary_expense, freelance_expense, royalty_expense, rental_expense,
                independent_profession_expense, contractor_expense, other_income_expense, sum_expense
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, income_id,
                expenses.salary_expense, expenses.freelance_expense, expenses.royalty_expense,
                expenses.rental_expense, expenses.independent_profession_expense,
                expenses.contractor_expense, expenses.other_income_expense, sum_expense
            ]
        );

        // console.log("🔹 บันทึก expense สำเร็จ"); // ✅ Log ว่าบันทึก expense แล้ว

        // ✅ ตรวจสอบค่าที่ถูกบันทึก
        // const [checkExpense] = await connection.execute(
        //     "SELECT * FROM expense WHERE income_id = ?", [income_id]
        // );
        // console.log("🔹 Database Expense Data:", checkExpense); // ✅ Log ข้อมูลจากฐานข้อมูล

        return NextResponse.json({ message: "Income and expense data saved successfully", id: income_id }, { status: 201 });

    } catch (error) {
        console.error("❌ Error:", error);
        return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });

    } finally {
        if (connection) {
            connection.release();
        }
    }
}
