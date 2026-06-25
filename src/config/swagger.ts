import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project & Task Management API",
      version: "1.0.0",
      description:
        "A production-ready RESTful API for managing projects and tasks, built with Node.js, TypeScript, Express.js, PostgreSQL, and TypeORM.",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // ─── Auth ───
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", minLength: 3, example: "Moaz Ashraf" },
            email: { type: "string", format: "email", example: "moaz@example.com" },
            password: { type: "string", minLength: 8, example: "password123" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "moaz@example.com" },
            password: { type: "string", minLength: 8, example: "password123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: {
              type: "object",
              properties: {
                accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
              },
            },
          },
        },
        UserResponse: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "Moaz Ashraf" },
            email: { type: "string", example: "moaz@example.com" },
            role: { type: "string", enum: ["admin", "member"], example: "member" },
          },
        },
        // ─── Project ───
        ProjectStatus: {
          type: "string",
          enum: ["active", "archived"],
        },
        CreateProjectRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 3, example: "My Awesome Project" },
            description: { type: "string", example: "Project description here" },
            status: { $ref: "#/components/schemas/ProjectStatus" },
          },
        },
        UpdateProjectRequest: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 3, example: "Updated Project Name" },
            description: { type: "string", example: "Updated description" },
            status: { $ref: "#/components/schemas/ProjectStatus" },
          },
        },
        Project: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", example: "My Awesome Project" },
            description: { type: "string", example: "Project description" },
            status: { $ref: "#/components/schemas/ProjectStatus" },
            owner_id: { type: "string", format: "uuid" },
            owner: { $ref: "#/components/schemas/UserResponse" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // ─── Task ───
        TaskStatus: {
          type: "string",
          enum: ["todo", "in_progress", "done"],
        },
        TaskPriority: {
          type: "string",
          enum: ["low", "medium", "high"],
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", minLength: 3, example: "Fix login bug" },
            description: { type: "string", example: "Task description here" },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/TaskPriority" },
            dueDate: { type: "string", format: "date-time", example: "2025-12-31T00:00:00.000Z" },
            assignee_id: { type: "string", format: "uuid", nullable: true },
          },
        },
        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 2, example: "Updated task title" },
            description: { type: "string", example: "Updated description" },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/TaskPriority" },
            dueDate: { type: "string", format: "date-time", nullable: true },
            assignee_id: { type: "string", format: "uuid", nullable: true },
          },
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", example: "Fix login bug" },
            description: { type: "string", example: "Task description" },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/TaskPriority" },
            dueDate: { type: "string", format: "date-time", nullable: true },
            project_id: { type: "string", format: "uuid" },
            assignee_id: { type: "string", format: "uuid", nullable: true },
            assignee: { $ref: "#/components/schemas/UserResponse" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        // ─── Errors ───
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Something went wrong" },
          },
        },
        // الـ validation error بيرجع message فقط زي الكود
        ValidationErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Name must be at least 3 characters" },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: "Unauthorized — missing or invalid access token",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { message: "Unauthorized" },
            },
          },
        },
        Forbidden: {
          description: "Forbidden — you don't have permission",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { message: "Forbidden" },
            },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: { message: "Not found" },
            },
          },
        },
        ValidationError: {
          description: "Validation error — returns the first failing field message",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
            },
          },
        },
      },
    },
    paths: {
      // ─── AUTH ───
      "/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "User registered successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/UserResponse" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "409": {
              description: "Email already exists",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  example: { message: "Email already exists" },
                },
              },
            },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login and receive access token",
          description:
            "Returns a JWT access token in the response body and sets a refresh token in an HttpOnly cookie.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Login successful",
              headers: {
                "Set-Cookie": {
                  description: "HttpOnly cookie containing the refresh token",
                  schema: {
                    type: "string",
                    example: "refreshToken=eyJ...; HttpOnly; Secure; SameSite=None",
                  },
                },
              },
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthResponse" },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "401": {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  example: { message: "Invalid credentials" },
                },
              },
            },
          },
        },
      },
      "/auth/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Refresh access token",
          description:
            "Uses the refresh token from the HttpOnly cookie to issue a new access token. Implements token rotation — the old refresh token is revoked.",
          responses: {
            "200": {
              description: "Token refreshed successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AuthResponse" },
                },
              },
            },
            "401": {
              description: "Invalid or expired refresh token",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                  example: { message: "Invalid refresh token" },
                },
              },
            },
          },
        },
      },
      // ─── PROJECTS ───
      "/projects": {
        get: {
          tags: ["Projects"],
          summary: "Get all projects",
          description:
            "Returns all projects for the authenticated user. Admins can see all projects from all users.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "List of projects",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      data: {
                        type: "object",
                        properties: {
                          projects: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Project" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
          },
        },
        post: {
          tags: ["Projects"],
          summary: "Create a new project",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateProjectRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Project created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      data: {
                        type: "object",
                        properties: {
                          project: { $ref: "#/components/schemas/Project" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "401": { $ref: "#/components/responses/Unauthorized" },
          },
        },
      },
      "/projects/{id}": {
        get: {
          tags: ["Projects"],
          summary: "Get project by ID",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project UUID",
            },
          ],
          responses: {
            "200": {
              description: "Project details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      data: {
                        type: "object",
                        properties: {
                          project: { $ref: "#/components/schemas/Project" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        put: {
          tags: ["Projects"],
          summary: "Update project",
          description: "Only the project owner can update it.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project UUID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateProjectRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Project updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      data: {
                        type: "object",
                        properties: {
                          project: { $ref: "#/components/schemas/Project" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        delete: {
          tags: ["Projects"],
          summary: "Delete project",
          description:
            "Only the project owner can delete it. All tasks under the project will be deleted (CASCADE).",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project UUID",
            },
          ],
          responses: {
            "200": {
              description: "Project deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      message: { type: "string", example: "Project deleted successfully" },
                    },
                  },
                },
              },
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
      },
      // ─── TASKS ───
      "/projects/{projectId}/tasks": {
        get: {
          tags: ["Tasks"],
          summary: "Get all tasks for a project",
          description:
            "Returns all tasks for a specific project. Supports filtering by status and priority. Admins can view tasks for any project. Members can only view tasks for their own projects.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project UUID",
            },
            {
              name: "status",
              in: "query",
              required: false,
              schema: { $ref: "#/components/schemas/TaskStatus" },
              description: "Filter by task status",
            },
            {
              name: "priority",
              in: "query",
              required: false,
              schema: { $ref: "#/components/schemas/TaskPriority" },
              description: "Filter by task priority",
            },
          ],
          responses: {
            "200": {
              description: "List of tasks",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      data: {
                        type: "object",
                        properties: {
                          tasks: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Task" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        post: {
          tags: ["Tasks"],
          summary: "Create a task",
          description: "Creates a new task under a project. Only the project owner can create tasks.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project UUID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateTaskRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Task created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      data: {
                        type: "object",
                        properties: {
                          task: { $ref: "#/components/schemas/Task" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
      },
      "/projects/{projectId}/tasks/{id}": {
        get: {
          tags: ["Tasks"],
          summary: "Get task by ID",
          description: "Any authenticated user can retrieve a task by ID if they know the projectId and taskId.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project UUID",
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Task UUID",
            },
          ],
          responses: {
            "200": {
              description: "Task details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      data: {
                        type: "object",
                        properties: {
                          task: { $ref: "#/components/schemas/Task" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        put: {
          tags: ["Tasks"],
          summary: "Update task",
          description: "Update task details including status. Only the project owner can update tasks.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project UUID",
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Task UUID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateTaskRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Task updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      data: {
                        type: "object",
                        properties: {
                          task: { $ref: "#/components/schemas/Task" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
        delete: {
          tags: ["Tasks"],
          summary: "Delete task",
          description: "Only the project owner can delete tasks.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Project UUID",
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "Task UUID",
            },
          ],
          responses: {
            "200": {
              description: "Task deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      message: { type: "string", example: "Task deleted successfully" },
                    },
                  },
                },
              },
            },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "403": { $ref: "#/components/responses/Forbidden" },
            "404": { $ref: "#/components/responses/NotFound" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);