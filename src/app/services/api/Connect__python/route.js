export const runtime = 'nodejs';
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const formDataFile = await req.formData();
        const pdfFile = formDataFile.get("pdf");

        if (!pdfFile || pdfFile.size === 0) {
            return NextResponse.json({ error: "No PDF file uploaded." }, { status: 400 });
        }

        const apiUrl = "http://localhost:8000/upload";

        const formData = new FormData();
        formData.append("pdf", pdfFile, pdfFile.name);

        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error || "Failed to process PDF." }, { status: 500 });
        }

        const result = await response.json();
        return NextResponse.json({ saved_to: result.saved_to }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    
}