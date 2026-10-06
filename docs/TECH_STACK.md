# Rahat Link: Tech Stack & Production Guidelines

This document outlines the strict technical stack, developer tooling, and production guardrails required for the Rahat Link platform. All contributions must adhere to these standards.

## 1. Core Technology Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Mapping Engine:** Mapbox GL JS (Optimized for vector tiles/low bandwidth)
* **Backend:** Node.js, Express.js
* **Real-time Engine:** Socket.io (with Redis adapter for horizontal scaling)
* **Database:** MongoDB (Mongoose) utilizing native GeoJSON and `2dsphere` indexes
* **External APIs:** Twilio (SMS Webhook for offline user bridge)

---

## 2. Developer Operations (DevOps & DX)

To prevent "it works on my machine" bugs and maintain code quality, the local environment enforces the following:

* **Containerization:** All local databases (MongoDB, Redis) are run via `docker-compose.yml`. Node/Express is run locally for hot-reloading but containerized for production.
* **Monorepo Management:** Frontend and Backend are managed within a single repository using NPM Workspaces to share types and validation schemas.
* **Pre-commit Hooks:** `Husky` and `lint-staged` are configured to intercept `git commit` commands. Code will only commit if it passes `ESLint` checks and is formatted by `Prettier`.

---

## 3. API Security & Data Integrity

The backend never trusts client data. The following security layers are mandatory:

* **Payload Validation:** All incoming requests (`req.body`, `req.query`) must be parsed and validated using **Zod** before hitting controllers.
* **Rate Limiting:** `express-rate-limit` (backed by Redis) is applied to all public endpoints (especially SOS creation) to prevent DDoS attacks and spam.
* **Authentication:** JWT-based auth utilizing short-lived Access Tokens (15 min) and HTTP-only, secure, long-lived Refresh Tokens (7 days).
* **Security Headers:** `Helmet.js` is applied globally to prevent XSS and clickjacking.

---

## 4. Observability & Error Handling

* **Structured Logging:** `console.log` is banned in production code. Use **Pino** or **Winston** to generate JSON-formatted logs with severity levels (INFO, WARN, ERROR).
* **Centralized Error Catching:** All Express routes wrap async functions in a centralized error-handling middleware. The app must never crash from an unhandled promise rejection.
* **Error Tracking:** (Future implementation) **Sentry** will monitor both frontend rendering crashes and backend exceptions in real-time.

---

## 5. Deployment & CI/CD Pipeline

* **Continuous Integration:** GitHub Actions will automatically run ESLint, Zod schema checks, and unit tests on every Pull Request to the `main` branch.
* **Reverse Proxy:** Node.js will sit behind an **Nginx** reverse proxy to handle SSL termination (HTTPS) and serve static assets.
* **Process Management:** In a non-Kubernetes environment, the Node server will run via **PM2** to utilize all CPU cores and automatically restart on failure.