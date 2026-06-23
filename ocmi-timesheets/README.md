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

6. Generate the Prisma client:
   npx prisma generate

7. Start the API (runs on http://localhost:3000):
   npx nx serve api

8. Start the web client in other terminal and cd ocmi-timesheets (runs on http://localhost:4200):
   npx nx dev web

