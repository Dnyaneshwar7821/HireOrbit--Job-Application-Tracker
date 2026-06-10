# HireOrbit - Job Application Tracking System

HireOrbit is a full-stack web application for tracking job applications, managing interview rounds, viewing dashboard stats, and comparing a resume against a job description.

## Features

- JWT authentication with user-specific data isolation
- Dashboard statistics for total, applied, interview, rejected, and offer statuses
- Job application create, read, update, and delete flows
- Interview round tracking with automatic application status updates
- Resume/job-description match analysis

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- Context API

Backend:
- Spring Boot
- Spring Security with JWT
- Spring Data JPA
- MySQL

## Project Structure

```text
.
├── hireorbit/             # Spring Boot backend
├── hireorbit-frontend/    # React/Vite frontend
└── README.md
```

## Backend Setup

From the backend folder:

```bash
cd hireorbit
./mvnw spring-boot:run
```

On Windows:

```powershell
cd hireorbit
.\mvnw.cmd spring-boot:run
```

Required environment variables:

```properties
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/hireorbit
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=replace-with-a-long-production-secret
CORS_ALLOWED_ORIGINS=http://localhost:5173
GEMINI_API_KEY=optional-gemini-api-key-for-ai-resume-analysis
```

If `JWT_SECRET` is not set, the app uses a development-only fallback from `application.properties`.

## Frontend Setup

From the frontend folder:

```bash
cd hireorbit-frontend
npm install
npm run dev
```

Recommended frontend environment:

```properties
VITE_API_URL=http://localhost:8080
```

## Deployment Setup

Recommended production setup:

- Frontend: Vercel
- Backend: Render
- Database: Railway MySQL

### Vercel Environment Variables

Set this in the Vercel project settings:

```properties
VITE_API_URL=https://hireorbit-job-application-tracker-1.onrender.com
```

Then redeploy the Vercel frontend.

### Render Environment Variables

Set these in the Render backend service settings:

```properties
SPRING_DATASOURCE_URL=jdbc:mysql://RAILWAY_HOST:RAILWAY_PORT/RAILWAY_DATABASE
SPRING_DATASOURCE_USERNAME=RAILWAY_USERNAME
SPRING_DATASOURCE_PASSWORD=RAILWAY_PASSWORD
JWT_SECRET=replace-with-a-long-production-secret
CORS_ALLOWED_ORIGINS=https://hire-orbit-job-application-tracker.vercel.app
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
```

Railway usually provides values named like:

```properties
MYSQLHOST
MYSQLPORT
MYSQLDATABASE
MYSQLUSER
MYSQLPASSWORD
```

Use those values to build the final Render `SPRING_DATASOURCE_URL`, for example:

```properties
SPRING_DATASOURCE_URL=jdbc:mysql://containers-us-west-xxx.railway.app:12345/railway
```

For local + production CORS together:

```properties
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://hire-orbit-job-application-tracker.vercel.app
```

Render start command:

```bash
java -jar target/hireorbit-0.0.1-SNAPSHOT.jar
```

## Useful Commands

Backend tests:

```bash
cd hireorbit
./mvnw test
```

Frontend build:

```bash
cd hireorbit-frontend
npm run build
```

Frontend lint:

```bash
cd hireorbit-frontend
npm run lint
```

## API Endpoints

Authentication:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

Applications:
- `POST /applications/apply-job`
- `GET /applications/get-all-jobs`
- `PUT /applications/update-job/{id}`
- `DELETE /applications/delete-job/{id}`

Interviews:
- `POST /interviews/add-interview/{applicationId}`
- `GET /interviews/get-interviews/{applicationId}`
- `PUT /interviews/update-interview/{id}`

Dashboard:
- `GET /dashboard/stats`

Resume analysis:
- `POST /analysis/resume-match`

## Author

Dnyaneshwar Algule
