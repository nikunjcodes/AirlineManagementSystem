# Airline Management System

A full-stack airline management system built with Spring Boot microservices and Next.js frontend. This system allows users to book flights, manage tickets, and administrators to manage flights and schedules.

## 🚀 Features

- User Authentication and Authorization
- Flight Management
- Schedule Management
- Ticket Booking System
- Admin Dashboard
- User Dashboard
- Responsive Modern UI

## 🛠️ Tech Stack

### Backend
- Java Spring Boot 3
- Spring Security
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- React Query

## 📋 Prerequisites

- Java 21
- Node.js 18+
- MySQL 8.0+
- Maven
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/nikunjcodes/AirlineManagementSystem.git
cd AirlineManagementSystem
```

2. Set up the database:
- Create a MySQL database named `airlinemanagement`
- Update the database credentials in each service's `application.properties` file

3. Build and run the backend services:
```bash
# Build all services
mvn clean install

# Run User Service
cd UserService
mvn spring-boot:run

# Run Flight Service
cd ../FlightService
mvn spring-boot:run

# Run Ticket Service
cd ../TicketService
mvn spring-boot:run
```

4. Set up the frontend:
```bash
cd flight-booking
npm install
npm run dev
```

## 🔐 API Endpoints

### Authentication Service
- `POST /api/auth/public/register` - Register a new user
- `POST /api/auth/public/login` - Login user

### User Service
- `GET /api/users/username/{username}` - Get user by username
- `GET /api/users/{id}` - Get user by ID

### Flight Service
- `GET /flights` - Get all flights (with optional sorting)
- `GET /flights/{id}` - Get flight by ID
- `POST /flights` - Create new flight (Admin only)
- `PUT /flights/{id}` - Update flight (Admin only)
- `DELETE /flights/{id}` - Delete flight (Admin only)

### Schedule Service
- `GET /flights/{flightId}/schedules` - Get schedules for a flight
- `GET /flights/schedules/{id}` - Get schedule by ID
- `POST /flights/schedules` - Create new schedule (Admin only)
- `PUT /flights/schedules/{id}` - Update schedule (Admin only)
- `DELETE /flights/schedules/{id}` - Delete schedule (Admin only)

### Ticket Service
- `POST /tickets` - Create new ticket
- `GET /tickets/{id}` - Get ticket by ID
- `DELETE /tickets/{id}` - Cancel ticket
- `GET /tickets/my-tickets` - Get user's tickets
- `GET /tickets/admin/all` - Get all tickets (Admin only)

## 🎨 Frontend Features

The frontend is built with Next.js and provides a modern, responsive interface with the following features:

- User Authentication (Login/Register)
- Flight Search and Booking
- Ticket Management
- Admin Dashboard
- User Profile Management
- Responsive Design for all devices

## 🔒 Security

- JWT-based authentication
- Role-based access control (USER/ADMIN)
- Secure password hashing
- Protected API endpoints

## 📝 Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_AUTH_URL=http://localhost:8081
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



## 👥 Authors

- Nikunj Jakhotiya