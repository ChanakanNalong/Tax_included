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

        // ตัวอย่างการบันทึกค่าใช้จ่ายในตาราง expense
        // ตัวอย่างการบันทึกค่าใช้จ่ายในตาราง expense
const expenses = [
    { expense_type: "Salary Expense", amount: salary * 0.5 },
    { expense_type: "Freelance Expense", amount: freelance * 0.2 },
    { expense_type: "Royalty Expense", amount: royalty * 0.5 },
    // เพิ่มประเภทค่าใช้จ่ายที่ต้องการบันทึก
];

for (let expense of expenses) {
    await connection.execute(
        `INSERT INTO expense (
            user_id, income_id, salary_expense, freelance_expense, royalty_expense, rental_expense,
            independent_profession_expense, contractor_expense, other_income_expense, sum_expense
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            user_id, income_id, 
            expense.expense_type === 'Salary Expense' ? expense.amount : 0,
            expense.expense_type === 'Freelance Expense' ? expense.amount : 0,
            expense.expense_type === 'Royalty Expense' ? expense.amount : 0,
            0, 0, 0, 0, expense.amount // ตัวอย่างการจัดการค่าของค่าใช้จ่ายอื่นๆ
        ]
    );
}


        return NextResponse.json({ message: "Income and expense data saved successfully", id: incomeResult.insertId }, { status: 201 });

    } catch (error) {
        console.error("Error:", error); // เพิ่ม log นี้เพื่อดูข้อมูลเพิ่มเติม
        return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });

    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// ✅ API สำหรับอัปเดตข้อมูลรายได้ (PUT)
export async function PUT(req) {
    let connection;
    try {
        const body = await req.json();
        const { id, user_id, salary, freelance, royalty, dividend, rental, independent_profession, contractor, other_income } = body;

        if (!id) {
            return NextResponse.json({ error: "Income ID is required" }, { status: 400 });
        }

        const toNumber = (value) => (isNaN(parseFloat(value)) ? 0 : parseFloat(value));
        const sum_income =
            toNumber(salary) + toNumber(freelance) + toNumber(royalty) +
            toNumber(dividend) + toNumber(rental) + toNumber(independent_profession) +
            toNumber(contractor) + toNumber(other_income);

        connection = await pool.getConnection();
        
        // อัปเดตข้อมูลใน income
        const [result] = await connection.execute(
            `UPDATE income SET 
                salary = ?, freelance = ?, royalty = ?, dividend = ?, rental = ?, 
                independent_profession = ?, contractor = ?, other_income = ?, sum_income = ? 
            WHERE id = ? AND user_id = ?`,
            [
                toNumber(salary), toNumber(freelance), toNumber(royalty), toNumber(dividend),
                toNumber(rental), toNumber(independent_profession), toNumber(contractor),
                toNumber(other_income), sum_income, id, user_id
            ]
        );

        return NextResponse.json({ message: "Income data updated successfully", affectedRows: result.affectedRows }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });

    } finally {
        if (connection) {
            connection.release();
        }
    }
}
