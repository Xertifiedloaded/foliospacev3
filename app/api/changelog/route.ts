import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "CHANGELOG.json");

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load changelog" }, { status: 500 });
  }
}
