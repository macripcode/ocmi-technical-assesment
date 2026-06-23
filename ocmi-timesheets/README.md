Install and Execution Instructions

All project files are inside the ocmi-timesheets folder. Run all commands from there:

   cd ocmi-timesheets

1. Run the Docker daemon before executing the project.

2. Start the database:
   docker compose up -d

3. Install dependencies:
   npm install

4. Set up environment variables:
   cp .env.example .env

5. Apply database migrations:
   npx prisma migrate deploy

6. Start the API (runs on http://localhost:3000):
   npx nx serve api

7. Start the web client (runs on http://localhost:4200):
   npx nx dev web


Notes: 

Weaknesis that I found while i was developing the Assesment

 - Preserving Historical Payroll Accuracy: Currently, weekly summaries are calculated dynamically from time entries. In a production payroll system, I would persist a payroll snapshot at approval time, including the hourly rate used, regular/overtime hours, and total pay, to preserve historical accuracy if employee rates or overtime rules change later.