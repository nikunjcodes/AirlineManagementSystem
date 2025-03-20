import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sort = searchParams.get("sort") || "asc"

  try {
    // In a real app, this would fetch from your backend service
    // const response = await fetch(`http://localhost:8081/Flights?sort=${sort}`)
    // const data = await response.json()

    // Mock data for demonstration
    const flights = [
      {
        id: 1,
        from: "New York",
        to: "London",
        departureTime: "2023-06-15T08:00:00",
        arrivalTime: "2023-06-15T20:00:00",
        price: 450,
        airline: "Global Airways",
      },
      {
        id: 2,
        from: "Los Angeles",
        to: "Tokyo",
        departureTime: "2023-06-20T10:30:00",
        arrivalTime: "2023-06-21T14:30:00",
        price: 780,
        airline: "Pacific Flights",
      },
      {
        id: 3,
        from: "Chicago",
        to: "Paris",
        departureTime: "2023-06-18T14:15:00",
        arrivalTime: "2023-06-19T05:45:00",
        price: 520,
        airline: "Euro Connect",
      },
    ]

    // Sort flights based on price
    const sortedFlights = [...flights].sort((a, b) => {
      return sort === "asc" ? a.price - b.price : b.price - a.price
    })

    return NextResponse.json(sortedFlights)
  } catch (error) {
    console.error("Error fetching flights:", error)
    return NextResponse.json({ error: "Failed to fetch flights" }, { status: 500 })
  }
}

