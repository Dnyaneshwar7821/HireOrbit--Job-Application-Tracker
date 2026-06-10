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
CORS_ALLOWED_ORIGIN_PATTERNS=
GEMINI_API_KEY=optional-gemini-api-key-for-ai-resume-analysis
GEMINI_TIMEOUT_SECONDS=20
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
- Database: TiDB Cloud Starter

### Vercel Environment Variables

Set this in the Vercel project settings:

```properties
VITE_API_URL=https://hireorbit-job-application-tracker-1.onrender.com
```

Then redeploy the Vercel frontend.

### Render Environment Variables

Set these in the Render backend service settings:

```properties
SPRING_DATASOURCE_URL=jdbc:mysql://TIDB_HOST:4000/hireorbit?sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=TIDB_USERNAME
SPRING_DATASOURCE_PASSWORD=TIDB_PASSWORD
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
DB_MAX_POOL_SIZE=5
JWT_SECRET=replace-with-a-long-production-secret
CORS_ALLOWED_ORIGINS=https://hire-orbit-job-application-tracker.vercel.app
CORS_ALLOWED_ORIGIN_PATTERNS=https://*.vercel.app
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TIMEOUT_SECONDS=20
```

TiDB Cloud provides a MySQL-compatible host, port, username, password, and database name.
Create a database named `hireorbit`, then use the TiDB connection values in Render.

Example TiDB JDBC URL:

```properties
SPRING_DATASOURCE_URL=jdbc:mysql://gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/hireorbit?sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3&serverTimezone=UTC
```

If resume analysis history needs manual schema creation, run this file in the TiDB Cloud SQL editor:

```text
hireorbit/src/main/resources/db/resume_analysis_tidb.sql
```

For local + production CORS together:

```properties
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://hire-orbit-job-application-tracker.vercel.app
```

To allow Vercel preview deployments, set:

```properties
CORS_ALLOWED_ORIGIN_PATTERNS=https://*.vercel.app
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
