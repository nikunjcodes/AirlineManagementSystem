import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // In a real app, this would fetch from your backend service
    // const response = await fetch(`http://localhost:8082/tickets/${params.id}`)
    // const data = await response.json()

    // Mock data for demonstration
    const tickets = [
      {
        id: 1,
        flightId: 1,
        from: "New York",
        to: "London",
        departureTime: "2023-06-15T08:00:00",
        arrivalTime: "2023-06-15T20:00:00",
        airline: "Global Airways",
        status: "upcoming",
        passengerName: "John Doe",
        bookingReference: "GA12345",
      },
      {
        id: 2,
        flightId: 2,
        from: "Los Angeles",
        to: "Tokyo",
        departureTime: "2023-05-20T10:30:00",
        arrivalTime: "2023-05-21T14:30:00",
        airline: "Pacific Flights",
        status: "completed",
        passengerName: "John Doe",
        bookingReference: "PF67890",
      },
    ]

    const ticket = tickets.find((t) => t.id === Number.parseInt(params.id))

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error fetching ticket:", error)
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // In a real app, this would delete from your backend service
    // const response = await fetch(`http://localhost:8082/tickets/${params.id}`, {
    //   method: 'DELETE',
    // })

    // Mock successful response
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting ticket:", error)
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 })
  }
}

