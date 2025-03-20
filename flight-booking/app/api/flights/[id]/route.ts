import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`http://localhost:8081/flights/${params.id}`);
    if (!response.ok) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching flight:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight" },
      { status: 500 }
    );
  }
}
