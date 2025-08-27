import { NextResponse } from "next/server";
import config from "@/app/config/conf/setting.json";

export async function POST(req) {
  try {

    const { questions, address } = await req.json();

    if (!questions || !address) {
      return NextResponse.json({ error: "Missing questions or address." }, { status: 400 });
    }

    const apiUrl = config.Links.API__python__ask || 'http://localhost:8000/ask';
    
    const pyRes = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions, address }),
    });

    const data = await pyRes.json();
    if (!pyRes.ok) {
      return NextResponse.json({ error: data.detail || "Ask failed" }, { status: pyRes.status });
    }
    return NextResponse.json(data, { status: pyRes.status });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Proxy error" }, { status: 500 });
  }
}