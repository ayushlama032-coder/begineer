# Backend Concepts Guide (Project Walkthrough)

## 1) What is Backend Development?
Backend handles:
- Business logic (rules)
- Data storage/retrieval
- Authentication/authorization
- API contracts for frontend/mobile clients

You can think of backend as "the brain + memory" of an application.

---

## 2) Project Architecture Used Here

We use a layered pattern:

1. **Routes**: URL + HTTP method mapping
2. **Controllers**: HTTP-level handling (`req`, `res`)
3. **Services**: Business rules and workflows
4. **Repositories**: Data access and persistence details

Why this matters:
- Easier to read and maintain
- Easier to test
- Easier to swap tools (e.g. file DB -> PostgreSQL)

Alternative options:
- MVC-only style (simpler, but can become messy as project grows)
- Clean Architecture / Hexagonal (more scalable but more complex)

---

## 3) Authentication (Signed Token)

Flow:
1. User logs in with email/password.
2. Backend verifies credentials.
3. Backend returns signed token.
4. Client sends token in `Authorization` header.
5. Backend verifies token before protected routes.

Why signed token?
- Stateless
- Common pattern across frontend/mobile/microservices

Other options:
- Server sessions + cookies
- OAuth (Google/GitHub login)

When to use:
- Token-based auth is great for API-based apps.
- Session cookies are good for traditional server-rendered apps.

---

## 4) Validation

We use validation functions to validate incoming JSON (same idea as Zod/Joi in bigger apps).

Why validation is critical:
- Prevent bad/unsafe data
- Return clear errors early
- Protect business logic from malformed requests

Pattern:
- Validate in middleware before controller logic.

Other options:
- Joi
- Yup
- class-validator

---

## 5) Error Handling

Pattern used:
- Throw errors from services with status codes.
- Global error middleware converts all errors into consistent JSON response.

Benefits:
- Consistent API behavior
- Cleaner controllers (no repeated response formatting)

---

## 6) Password Security

Never store plain passwords.

We use Node's built-in `crypto.scrypt` hashing:
- At register: hash password
- At login: compare entered password with hash

Why:
- If database leaks, attackers do not get plain passwords.

---

## 7) Data Layer (Repository Pattern)

Even with a small file database, we use repositories.

Why:
- Good habit for scaling
- Business logic remains independent from storage technology

Today: file JSON
Tomorrow: PostgreSQL/MongoDB with minimal service changes

---

## 8) HTTP Basics in This Project

Methods used:
- `GET` -> read
- `POST` -> create
- `PATCH` -> partial update
- `DELETE` -> remove

Status codes used:
- `200` success
- `201` created
- `204` deleted with no body
- `400` validation error
- `401` unauthorized
- `404` not found
- `409` conflict (email exists)

---

## 9) Patterns That Repeat in 90% of Backends

1. Request enters route
2. Middleware checks auth/validation
3. Controller calls service
4. Service calls repository
5. Response returned

If you master this flow, you can adapt to most backend frameworks/languages.

---

## 10) How to Extend This Project (Practice)

Try these in order:
1. Add `GET /api/tasks/:taskId`
2. Add filtering `GET /api/tasks?status=done`
3. Add pagination (`page`, `limit`)
4. Move from file DB to PostgreSQL
5. Add refresh tokens
6. Add role-based access (`admin`, `user`)

---

## 11) Is this concept used the same way everywhere?

Short answer: **Mostly yes, but implementation details differ.**

- Node/Express, NestJS, Django, Spring Boot all have similar high-level flow.
- Syntax and tooling differ, but patterns remain.

Example:
- Middleware concept in Express ~= Interceptors/Guards in NestJS ~= Filters/Middleware in other frameworks.

Focus on transferable patterns, not just syntax.

---

## 12) Final Advice for a Beginner

- Build small but complete features.
- Write comments now (good for learning), later write cleaner self-explanatory code.
- Keep practicing CRUD + auth until it feels natural.
- Learn one database deeply (PostgreSQL recommended).
- Read production code after building your own mini-projects.

You are on the right track. 🚀
