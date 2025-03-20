import axios from "axios";

export interface TicketCreationRequest {
  scheduleId: number;
  flightId: number;
  passengerName: string;
  price: number;
}

export interface Ticket {
  id: number;
  userId: number;
  flightId: number;
  scheduleId: number;
  passengerName: string;
  seatNumber: string | null;
  price: number;
  status: string;
  bookingTime: string;
  lastUpdated: string;
  flight?: any;
  schedule?: any;
  user?: any;
}

class TicketService {
  private baseUrl = "http://localhost:8082" + "/tickets";

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }
    return {
      Authorization: `Bearer ${token.replace("Bearer ", "")}`, // Ensure proper token format
    };
  }

  async createTicket(ticketData: TicketCreationRequest): Promise<Ticket> {
    try {
      const response = await axios.post(this.baseUrl, ticketData, {
        headers: this.getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error("Please log in to book tickets");
      }
      throw error;
    }
  }

  async getMyTickets(): Promise<Ticket[]> {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${this.baseUrl}/my-tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async getTicketById(id: string): Promise<Ticket> {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  }

  async cancelTicket(id: string): Promise<void> {
    const token = localStorage.getItem("token");
    await axios.delete(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const ticketService = new TicketService();
