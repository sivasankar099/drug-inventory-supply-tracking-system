# Drug Inventory Tracking System

A full-stack web application developed for managing and tracking drug inventory efficiently. The system helps monitor medicine stock, maintain inventory records, and streamline pharmaceutical stock management operations.

---

## Features

- Add new medicines to inventory
- Update medicine details
- Delete medicines from inventory
- View complete inventory records
- Search and filter medicines
- REST API integration
- Responsive frontend interface
- Database connectivity with MySQL

---

## Tech Stack

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- Java
- Spring Boot
- REST APIs

### Database
- MySQL

### Tools
- Postman
- Maven
- Git & GitHub

---

## Project Structure

```bash
tracking-system/
│
├── backend/
│   └── drug-inventory/
│
├── frontend/
│   └── drug-inventory-frontend/
│
├── README.md
└── .gitignore
```

---

## Backend Setup

### 1. Navigate to Backend Folder

```bash
cd backend/drug-inventory
```

### 2. Configure Database

Open:

```bash
src/main/resources/application.properties
```

Update MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Run Backend Application

```bash
mvn spring-boot:run
```

Backend will start on:

```bash
http://localhost:8080
```

---

## Frontend Setup

### 1. Navigate to Frontend Folder

```bash
cd frontend/drug-inventory-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Frontend Application

```bash
npm start
```

Frontend will start on:

```bash
http://localhost:3000
```

---

## API Testing

Use Postman to test REST API endpoints.

Example operations:
- GET medicines
- POST new medicine
- PUT update medicine
- DELETE medicine

---

## Database

The project uses MySQL database for storing medicine inventory records.

Main database operations include:
- Insert records
- Update records
- Delete records
- Fetch inventory details

---

## Future Enhancements

- User authentication using JWT
- Role-based access control
- Inventory analytics dashboard
- Low stock alerts
- Medicine expiry tracking
- Cloud deployment

---

## Learning Outcomes

Through this project, I gained practical experience in:

- Full-stack web development
- REST API development using Spring Boot
- React.js frontend integration
- MySQL database management
- CRUD operations
- Backend and frontend connectivity
- Git and GitHub version control

---

## Author

S.Sivasankar

Aspiring Software Engineer passionate about full-stack web development and backend engineering.

---

## License

This project is developed for educational and learning purposes.