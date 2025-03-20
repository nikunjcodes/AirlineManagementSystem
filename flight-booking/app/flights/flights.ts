import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export interface Flight {
  id: number;
  flightNumber: string;
  airlineName: string;
  departureCity: string;
  arrivalCity: string;
  price: number;
  capacity: number;
  availableSeats: number;
}

export interface Schedule {
  id: number;
  flight: Flight;
  departureTime: string;
  arrivalTime: string;
  flightStatus: "ON_TIME" | "DELAYED" | "SCHEDULED" | "CANCELLED";
}

export const flightService = {
  getAllFlights: async (sort?: string): Promise<Flight[]> => {
    const response = await axios.get(
      `${API_URL}/flights${sort ? `?sort=${sort}` : ""}`
    );
    return response.data;
  },

  getFlightById: async (id: string): Promise<Flight> => {
    const response = await axios.get(`${API_URL}/flights/${id}`);
    return response.data;
  },

  getFlightSchedules: async (
    flightId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Schedule[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await axios.get(
      `${API_URL}/flights/${flightId}/schedules?${params.toString()}`
    );
    return response.data;
  },
};

// Helper function to calculate duration between two dates
export const calculateDuration = (
  departureTime: string,
  arrivalTime: string
): string => {
  const start = new Date(departureTime);
  const end = new Date(arrivalTime);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};
