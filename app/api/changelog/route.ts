import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "CHANGELOG.json");

  try {
    const file = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(file);
    const sorted = {
      changes: data.changes.sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    };

    return NextResponse.json(sorted);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load changelog" },
      { status: 500 }
    );
  }
}
