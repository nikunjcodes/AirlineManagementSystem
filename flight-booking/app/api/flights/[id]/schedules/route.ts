import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const dates = searchParams.get("dates")

  try {
    // In a real app, this would fetch from your backend service
    // const response = await fetch(`http://localhost:8081/Flights/${params.id}/schedules?dates=${dates}`)
    // const data = await response.json()

    // Mock data for demonstration
    const schedules = [
      {
        date: "2023-06-15",
        status: "On Time",
        departureTime: "08:00",
        arrivalTime: "20:00",
      },
      {
        date: "2023-06-16",
        status: "On Time",
        departureTime: "08:00",
        arrivalTime: "20:00",
      },
      {
        date: "2023-06-17",
        status: "Delayed",
        departureTime: "08:30",
        arrivalTime: "20:45",
      },
      {
        date: "2023-06-18",
        status: "On Time",
        departureTime: "08:00",
        arrivalTime: "20:00",
      },
      {
        date: "2023-06-19",
        status: "On Time",
        departureTime: "08:00",
        arrivalTime: "20:00",
      },
    ]

    return NextResponse.json(schedules)
  } catch (error) {
    console.error("Error fetching schedules:", error)
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 })
  }
}

