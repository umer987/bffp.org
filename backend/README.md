# Better Future for Pakistan Backend

This backend runs inside the existing Next.js app through `src/app/api/**/route.ts`.
The reusable backend logic lives in `backend/src`, and the Prisma database schema lives in `prisma/schema.prisma`.

## What Was Added

- Prisma models for Admin, Teacher, Course, Resource, Exam, MCQ, ExamAttempt, Certificate, Class, Section, Student, Attendance, Fee, and Receipt.
- JWT auth with HTTP-only cookie support and Bearer token support.
- Admin-only route protection for management APIs.
- Teacher route protection for teacher dashboard APIs.
- Zod validation for request bodies.
- Supabase Storage PDF upload helper.
- Service-based architecture so business logic is outside route files.

## First-Time Setup

1. Copy `.env.example` to `.env`.
2. Create a Supabase project and paste your database connection string into `DATABASE_URL`.
3. Set `JWT_SECRET` to a long random string.
4. Create a Supabase Storage bucket named `bffp-files`, or change `SUPABASE_STORAGE_BUCKET`.
5. Run:

```bash
npm run prisma:generate
npm run prisma:push
npm run db:seed
npm run dev
```

## How To Check APIs

Open a terminal in the project and run the dev server:

```bash
npm run dev
```

Then test login:

```bash
curl -X POST http://localhost:3000/api/auth/admin-login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@bffp.org\",\"password\":\"password123\"}"
```

The response includes a JWT token. For protected APIs, send it like this:

```bash
curl http://localhost:3000/api/admin/dashboard ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Debugging Guide For Beginners

- If `npm run dev` fails, read the first red error line. It usually names the missing env var or broken file.
- If an API returns `401`, you are not logged in or did not send the Bearer token.
- If an API returns `403`, your user role is not allowed for that route.
- If an API returns `422`, the JSON body is missing a field or has the wrong shape.
- If Prisma says it cannot connect, check `DATABASE_URL` in `.env` and confirm Supabase is active.
- Use Prisma Studio to inspect database rows visually:

```bash
npm run prisma:studio
```

## Main API Map

- `POST /api/auth/admin-login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/admin/dashboard`
- `GET /api/admin/analytics`
- `POST /api/teacher/login`
- `GET /api/teachers`
- `POST /api/teachers`
- `GET /api/teachers/:id`
- `PUT /api/teachers/:id`
- `DELETE /api/teachers/:id`
- `GET /api/courses`
- `POST /api/courses`
- `PUT /api/courses/:id`
- `DELETE /api/courses/:id`
- `POST /api/uploads/pdf`
- `POST /api/exams`
- `GET /api/exams/course/:id`
- `POST /api/exams/submit`
- `GET /api/exams/results`
- `GET /api/teacher/courses`
- `GET /api/teacher/exams`
- `POST /api/teacher/exam-submit`
- `GET /api/teacher/certificate`
- `POST /api/certificate/generate`
- `GET /api/certificate/:teacherId`
- `GET /api/classes`
- `POST /api/classes`
- `PUT /api/classes/:id`
- `DELETE /api/classes/:id`
- `GET /api/students`
- `POST /api/students`
- `GET /api/students/:id`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`
- `POST /api/attendance`
- `GET /api/attendance/class/:id`
- `GET /api/attendance/student/:id`
- `POST /api/fees/collect`
- `GET /api/fees/student/:id`
- `PUT /api/fees/status/:id`
