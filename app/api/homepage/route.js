import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

const dbConfig = {
    host: "localhost",
    user: "root",  
    password: "",  
    database: "tax_db",
};