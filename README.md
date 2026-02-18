# Node.js Backend Learning Project (Learn by Building)

Welcome! This repo is designed for a **complete beginner** to learn backend development by building a real project.

## Project You Will Build
A **Task Manager API** with:
- User registration/login
- Token-based authentication (JWT-style signed token)
- Create/read/update/delete tasks
- Validation, error handling, and architecture patterns used in real projects

## Why this project is great for learning
It includes patterns that repeat in almost every backend codebase:
- Layered architecture (routes -> controllers -> services -> repositories)
- Validation middleware
- Authentication middleware
- Centralized config
- Shared error handling

## Quick Start

```bash
npm install
npm run dev
```

Server starts on `http://localhost:3000`.

## API Endpoints

### Health
- `GET /health`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks (requires `Authorization: Bearer <token>`)
- `POST /api/tasks`
- `GET /api/tasks`
- `PATCH /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

## Suggested Learning Path
1. Read `docs/PROJECT_WALKTHROUGH.md` fully.
2. Run API manually with Postman/Insomnia.
3. Open each layer in this order:
   - routes
   - controllers
   - services
   - repositories
4. Add one new feature yourself (for example, "search tasks by status").
5. Re-run tests.

## Generate the PDF notes

```bash
python docs/generate_pdf.py
```

This creates `docs/backend-concepts-guide.pdf`.
