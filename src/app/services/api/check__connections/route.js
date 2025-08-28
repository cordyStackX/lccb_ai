import { NextResponse } from "next/server";

export async function GET() {
    try { 
        const response = await fetch("http://localhost:8000/check_connections");
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching connections:", error);
        return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 });
    }
    
}
