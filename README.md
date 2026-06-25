# Project Task Management System

> A production-ready RESTful API for managing projects and tasks, built with Node.js, TypeScript, Express.js, PostgreSQL, and TypeORM.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-supported-blue)

---

## Tech Stack

| Category         | Technology           |
| ---------------- | -------------------- |
| Runtime          | Node.js v18+         |
| Language         | TypeScript           |
| Framework        | Express.js           |
| Database         | PostgreSQL 15        |
| ORM              | TypeORM              |
| Authentication   | JWT + Refresh Tokens |
| Validation       | Zod                  |
| Password Hashing | bcrypt               |
| Containerization | Docker               |

---

## Use Case Diagram

```mermaid
graph TB

    Member(["👤 Member"])
    Admin(["👑 Admin"])

    subgraph SYSTEM ["📦 System Modules"]
        direction TB
        Auth["🔐 Authentication"]
        Projects["📁 Projects"]
        Tasks["✅ Tasks"]
    end

    Member --> Auth
    Member --> Projects
    Member --> Tasks

    Admin --> Auth
    Admin --> Projects
    Admin --> Tasks
    Admin --> ViewAll["📊 View All Projects & Tasks"]
```

---

## Architecture

```mermaid
flowchart TB

    Client["🌐 Client / HTTP Request"]

    subgraph API ["🚪 API Layer"]
        Routes["Routes\n(Define endpoints & middleware)"]
        Controllers["Controllers\n(Request handling & responses)"]
    end

    subgraph CORE ["🧠 Business Layer"]
        Services["Services\n(Business logic & rules)"]
    end

    subgraph DATA ["💾 Data Layer"]
        Repositories["Repositories\n(Database operations)"]
        Entities["Entities\n(DB schema representation)"]
    end

    DB[("🗄️ PostgreSQL")]

    Client --> Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> Entities
    Repositories --> DB
```

---

## Database Design (ERD)

```mermaid
erDiagram

    USERS {
        UUID id PK
        VARCHAR name
        VARCHAR email "UNIQUE"
        VARCHAR password
        ENUM role "admin | member"
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    PROJECTS {
        UUID id PK
        VARCHAR name
        TEXT description
        ENUM status "active | archived"
        UUID owner_id FK
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    TASKS {
        UUID id PK
        VARCHAR title
        TEXT description
        ENUM status "todo | in_progress | done"
        ENUM priority "low | medium | high"
        TIMESTAMP dueDate
        UUID project_id FK
        UUID assignee_id FK
        TIMESTAMP createdAt
        TIMESTAMP updatedAt
    }

    REFRESH_TOKENS {
        UUID id PK
        VARCHAR tokenHash "UNIQUE"
        UUID userId FK
        TIMESTAMP expiresAt
        BOOLEAN revoked
        VARCHAR ipAddress
        VARCHAR deviceInfo
        TIMESTAMP createdAt
    }

    USERS ||--o{ PROJECTS : "owns"
    PROJECTS ||--o{ TASKS : "contains"
    USERS ||--o{ TASKS : "assigned to"
    USERS ||--o{ REFRESH_TOKENS : "has"
```

---

## Project Structure

```
src/
├── config/
│   ├── database.ts          # TypeORM DataSource
│   └── env.ts               # Zod env validation
│
├── database/
│   └── seed.ts              # Faker seed data
│
├── modules/
│   ├── auth/
│   │   ├── exceptions
│   │   ├── refresh-token.entity.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.schema.ts
│   │   └── auth.routes.ts
│   │
│   ├── user/
│   │   └── user.entity.ts
│   │
│   ├── project/
│   │   ├── exceptions
│   │   ├── project.entity.ts
│   │   ├── project.repository.ts
│   │   ├── project.service.ts
│   │   ├── project.controller.ts
│   │   ├── project.schema.ts
│   │   └── project.routes.ts
│   │
│   └── task/
│   │   ├── exceptions
│       ├── task.entity.ts
│       ├── task.repository.ts
│       ├── task.service.ts
│       ├── task.controller.ts
│       ├── task.schema.ts
│       └── task.routes.ts
│
├── shared/
│   ├── middlewares/
│   │   ├── auth.middleware.ts      # JWT verify
│   │   ├── validate.middleware.ts  # Zod validation
│   │   └── error.middleware.ts     # Global error handler
│   ├── types/
│   │   └── express.d.ts            # Extend Request type
│   └── utils/
│       ├── jwt.utils.ts
│       ├── hash.utils.ts
│       └── ApiError.ts
│
├── app.ts
└── server.ts
```

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint    | Auth | Description                     |
| ------ | ----------- | ---- | ------------------------------- |
| POST   | `/register` | ❌   | Register a new user             |
| POST   | `/login`    | ❌   | Login and receive access token  |
| POST   | `/refresh`  | ❌   | Refresh access token via cookie |

### Projects — `/api/v1/projects`

| Method | Endpoint | Auth | Description                       |
| ------ | -------- | ---- | --------------------------------- |
| GET    | `/`      | ✅   | Get all projects for current user |
| POST   | `/`      | ✅   | Create a new project              |
| GET    | `/:id`   | ✅   | Get project by ID                 |
| PUT    | `/:id`   | ✅   | Update project (owner only)       |
| DELETE | `/:id`   | ✅   | Delete project (owner only)       |

### Tasks — `/api/v1/projects/:projectId/tasks`

| Method | Endpoint | Auth | Description                 |
| ------ | -------- | ---- | --------------------------- |
| GET    | `/`      | ✅   | Get all tasks for a project |
| POST   | `/`      | ✅   | Create a task (owner only)  |
| GET    | `/:id`   | ✅   | Get task by ID              |
| PUT    | `/:id`   | ✅   | Update task (owner only)    |
| DELETE | `/:id`   | ✅   | Delete task (owner only)    |

---

## Authentication

- **Access Token** — JWT, expires in 15 minutes, sent in response body
- **Refresh Token** — JWT, expires in 7 days, stored in HttpOnly cookie
- Refresh tokens are stored in the database and revoked on use (rotation)

---

## Roles & Permissions

| Action                   | Member | Admin |
| ------------------------ | ------ | ----- |
| Register / Login         | ✅     | ✅    |
| Manage own projects      | ✅     | ✅    |
| Manage own tasks         | ✅     | ✅    |
| View all users' projects | ❌     | ✅    |
| View all users' tasks    | ❌     | ✅    |

> Admin account is created via seed script — not through registration.

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=3000

POSTGRES_USER=project_user
POSTGRES_PASSWORD=project_pass_123
POSTGRES_DB=project_management_db
DATABASE_URL=postgresql://project_user:project_pass_123@localhost:5433/project_management_db

JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## How to Run Locally

### Prerequisites

- Node.js v18+
- Docker & Docker Compose

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Moaz-ashraf1/Project-Task-Management-System.git
cd Project-Task-Management-System

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 4. Start the database
docker compose up -d

# 5. (Optional) Seed the database
npm run seed

# 6. Start development server
npm run dev
```

Server runs at: `http://localhost:3000`

Swagger UI: `http://localhost:3000/api/v1/docs`

---

## Available Scripts

```bash
npm run dev               # Start development server with hot reload
npm run build             # Compile TypeScript to JavaScript
npm run start             # Run compiled JavaScript
npm run seed              # Seed database with fake data (100 users, 50 projects, 500 tasks)
npm run migration:run     # Run pending migrations
npm run migration:revert  # Revert last migration
```

---

## Docker

```bash
# Start database
docker compose up -d

# Stop containers
docker compose down

# Stop and remove volumes
docker compose down -v
```

> Note: The app runs locally via `npm run dev`. Only the database runs in Docker.

---

## Bonus Features

- ✅ TypeScript
- ✅ Repository Pattern
- ✅ Refresh Token Rotation
- ✅ Role-based Access Control (Admin / Member)
- ✅ Ownership Authorization
- ✅ Docker Compose
- ✅ Database Seed with Faker.js
- ✅ Global Error Handling
- ✅ Domain-driven Module Structure
- ✅ Nested Routes (`/projects/:projectId/tasks`)
- ✅ Swagger API Documentation
