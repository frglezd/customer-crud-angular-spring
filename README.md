# Customer CRUD (Angular + Spring Boot + MySQL)

A small full-stack CRUD app for managing customers.

- **`front/fullstack`** — Angular 21 app (SSR via Express, `@angular/ssr`)
- **`crud-fullstack-angular`** — Spring Boot 4 REST API (Spring Data JPA)
- **MySQL** — `customer_management.customers` table

## Architecture

```
Browser ──► frontend (Angular SSR, :4200) ──► backend (Spring Boot, :8080) ──► mysql (:3307 on host, :3306 internally)
```

The frontend container renders pages server-side before sending them to the
browser. Server-side rendering runs inside the container and reaches the
backend over the Docker network (`http://backend:8080`), while the browser
reaches it via the published host port (`http://localhost:8080`). This is
handled automatically by `CustomerService` — no configuration needed.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose (bundled with Docker Desktop)
- Nothing else — Node, Java and Maven all run inside the containers.

## Quick start

```bash
docker compose up -d --build
```

This builds and starts all three services:

| Service  | URL                              | Notes                                   |
|----------|-----------------------------------|------------------------------------------|
| frontend | http://localhost:4200             | Angular app                              |
| backend  | http://localhost:8080/api/customers | REST API                               |
| mysql    | localhost:3307                    | Mapped to 3307 to avoid clashing with a local MySQL on the default 3306 |

Open http://localhost:4200 in a browser. The database schema is created
automatically (`ddl-auto=update`) and seeded with 4 sample customers on
first boot (see [Seed data](#seed-data)).

To follow logs:

```bash
docker compose logs -f
```

To stop:

```bash
docker compose down
```

To stop **and** wipe the database volume (reset to the seed data on next start):

```bash
docker compose down -v
```

## Seed data

`crud-fullstack-angular/src/main/resources/data.sql` seeds 4 sample customers
(John Doe, Jane Smith, Alice Johnson, Bob Williams) on first boot, keyed by
the unique `email` column so it's safe to re-run — it silently skips rows
that already exist rather than duplicating or erroring.

## Local development (without Docker)

Each service can still be run directly on the host, same as before:

- **Backend**: `cd crud-fullstack-angular && ./mvnw spring-boot:run` (needs a
  local MySQL with a `customer_management` database — see
  `src/main/resources/application.properties` for the expected
  user/password).
- **Frontend**: `cd front/fullstack && npm install && npm start` (serves at
  http://localhost:4200 and expects the backend at http://localhost:8080).

## Configuration

Environment variables set in `docker-compose.yml`:

| Variable                | Service  | Purpose                                              |
|--------------------------|----------|-------------------------------------------------------|
| `SPRING_DATASOURCE_URL`  | backend  | Overrides `application.properties` to point at the `mysql` container |
| `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | backend | DB credentials (demo defaults — change for anything beyond local use) |
| `API_URL_SERVER`         | frontend | Backend URL used only for server-side rendering (Docker-network address) |
| `PORT`                   | frontend | Port the Express/SSR server listens on inside the container |

## Notes

- The MySQL root password (`password`) and datasource credentials are
  hardcoded in `docker-compose.yml` and `application.properties` for local
  demo purposes. Don't reuse these for anything beyond local development —
  swap them for secrets/environment injection before deploying anywhere
  real.
- CORS on the backend (`crud-fullstack-angular/.../config/WebConfig.java`)
  only allows `http://localhost:4200`. Update it if you serve the frontend
  from a different origin.
