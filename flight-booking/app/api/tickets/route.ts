import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  try {
    const headersList = await headers();
    const token = headersList.get("authorization");

    const response = await fetch("http://localhost:8082/tickets/my-tickets", {
      headers: {
        Authorization: token || "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tickets");
    }

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get("authorization");
    const body = await request.json();

    const response = await fetch("http://localhost:8082/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token || "",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to create ticket");
    }

    const data = await response.json();
    return NextResponse.json(data.data, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
