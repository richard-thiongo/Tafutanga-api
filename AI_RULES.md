# AI Agent Coding Guidelines - Tafutanga API

## 1. Code Quality & Cleanliness
- **Pure Functions**: Favor pure functions for business logic to ensure testability and predictability.
- **Naming**: Use descriptive, domain-specific names (e.g., `getPropertyByUuid` instead of `getData`).
- **DRY & KISS**: Keep it simple. Don't over-engineer solutions for problems we don't have yet.
- **Error Handling**: Always use `try-catch` blocks in asynchronous operations and handle errors gracefully without exposing stack traces.

## 2. High-Traffic & Performance
- **Non-blocking logic**: Avoid heavy synchronous operations on the main thread.
- **Connection Pooling**: Use the established `pg` pool for all database interactions.
- **Indexing**: Ensure all foreign keys and frequently searched columns are indexed in PostgreSQL.
- **Pagination**: Never return large datasets without pagination.
- **Caching**: Consider where caching (e.g., memory or Redis) could prevent redundant DB hits for static data.

## 3. Documentation & Comments
- **Concise Comments**: Use short, punchy comments that explain *why* something is done, not *what* (the code should show what).
- **JSDoc**: Use JSDoc for complex function signatures to help with intellisense.
- **Example**: `// Validates listing ownership before update`

## 4. Simple Domain Driven Design (DDD)
Organize the code into logical modules within `src/modules/`:
- **Interfaces (Controllers)**: Handle HTTP requests/responses and input validation.
- **Application (Services)**: Orchestrate business logic and use cases.
- **Infrastructure (Repositories)**: Handle data persistence and external integrations.

### Structure Example:
```
src/
  ├── config/         # App configuration
  ├── middleware/     # Global middlewares (auth, error handler)
  ├── modules/        # Domain modules
  │   └── properties/ # Example domain
  │       ├── properties.controller.js
  │       ├── properties.service.js
  │       ├── properties.repository.js
  │       └── properties.routes.js
  └── utils/          # Shared helpers
```

## 5. Security
- **Input Validation**: Use libraries like `joi` or `zod` for all request data.
- **SQL Injection**: Always use parameterized queries (provided by `pg`).
- **Middleware**: Keep `helmet` and `cors` active and strictly configured.
- **UUIDs**: Use `UUID` for all primary keys and foreign keys instead of integers.
