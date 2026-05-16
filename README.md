# 🚀 HireOrbit – Job Application Tracking System

HireOrbit is a full-stack web application designed to help users efficiently track job applications, manage interview rounds, and analyze resume-job compatibility.

---

## 📌 Features

* 🔐 **JWT Authentication** – Secure login and user-specific data isolation
* 📊 **Dashboard** – Real-time statistics for applications (Applied, Interview, Offer, Rejected)
* 📝 **Application Management** – Add, update, delete, and view job applications
* 🎯 **Interview Tracking** – Manage interview rounds with status updates
* ⚡ **Auto Status Update** – Application status updates based on interview outcomes
* 📄 **Resume Analyzer** – Match resume with job description and generate score

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Context API

### Backend

* Spring Boot
* Spring Security (JWT)
* REST APIs

### Database

* MySQL

---

## ⚙️ Architecture

* Layered Architecture:

  * Controller
  * Service
  * Repository

* Frontend:

  * Component-based structure
  * Centralized state using Context API

---

## 🔗 API Endpoints (Sample)

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/profile`

### Applications

* `GET /applications`
* `POST /applications`
* `PUT /applications/{id}`
* `DELETE /applications/{id}`

### Interviews

* `GET /interviews/{applicationId}`
* `POST /interviews/add/{applicationId}`
* `PUT /interviews/update/{id}`

---

## 📈 Key Highlights

* Real-time UI updates without page refresh
* Clean UI using Tailwind CSS
* Scalable backend design
* Derived business logic for automatic status updates

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/hireorbit.git
cd hireorbit
```

### 2. Backend Setup

```bash
cd backend
mvn spring-boot:run
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Environment Setup

Create an `application.properties` file:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hireorbit
spring.datasource.username=root
spring.datasource.password=your_password
```

---

## 🧠 Future Enhancements

* AI-based resume analysis
* Email notifications
* Admin dashboard
* Deployment (AWS / Docker)

---

## 👨‍💻 Author

Dnyaneshwar Algule

---

## ⭐ Contribution

Feel free to fork this project and improve it!
