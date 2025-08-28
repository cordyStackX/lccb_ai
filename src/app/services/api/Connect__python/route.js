export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import config from "@/app/config/conf/setting.json";

export async function POST(req) {
    try {
        const formDataFile = await req.formData();
        const pdfFile = formDataFile.get("pdf");
        const address = formDataFile.get("address");

        if (!pdfFile || pdfFile.size === 0) {
            return NextResponse.json({ error: "No PDF file uploaded." }, { status: 400 });
        }

        if (!address) {
            return NextResponse.json({ error: "No wallet address provided." }, { status: 400 });
        }

        const apiUrl = config.Links.API__python__upload || "http://localhost:8000/upload";

        const formData = new FormData();
        formData.append("pdf", pdfFile);
        formData.append("address", address);

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
        console.error("Error in Connect__python route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    
}