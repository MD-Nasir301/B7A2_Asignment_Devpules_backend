# DevPulse – Internal Tech Issue & Feature Tracker

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## Live URL

- **Backend Deployment:** https://devpules-zeta.vercel.app/

---

## Features

- **User Authentication:** Secure registration and login using JWT tokens and encrypted passwords (bcryptjs).
- **Role-Based Access Control (RBAC):** Strict permissions separating `contributor` and `maintainer` roles.
- **Issue Management:** Complete CRUD operations for handling system bugs and feature requests.
- **Advanced Query Pipeline:** Supports dynamic sorting (`newest`, `oldest`) and filtering (`type`, `status`)
- **Defensive API Guards:** Contributors can only update their own issues while they are still `open`. Maintainers have full administrative controls, including deletion.

---

## Tech Stack

- **Runtime:** Node.js (v24.x or higher)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Security:** JSON Web Tokens (JWT), bcryptjs

---

## Database Schema Summary

### 1. `users` Table

| Field      | Type             | Description                                            |
| :--------- | :--------------- | :----------------------------------------------------- |
| id         | Serial (PK)      | Auto-incrementing unique identifier                    |
| name       | VARCHAR          | Full display name                                      |
| email      | VARCHAR (Unique) | Valid login address                                    |
| password   | VARCHAR          | Encrypted password string                              |
| role       | VARCHAR          | `contributor` or `maintainer` (Default: `contributor`) |
| created_at | Timestamp        | Automatically generated                                |
| updated_at | Timestamp        | Automatically refreshed                                |

### 2. `issues` Table

| Field       | Type         | Description                                         |
| :---------- | :----------- | :-------------------------------------------------- |
| id          | Serial (PK)  | Auto-incrementing unique identifier                 |
| title       | VARCHAR(150) | Short descriptive headline                          |
| description | TEXT         | Detailed explanation (Min 20 chars)                 |
| type        | VARCHAR      | `bug` or `feature_request`                          |
| status      | VARCHAR      | `open`, `in_progress`, `resolved` (Default: `open`) |
| reporter_id | INTEGER      | References the user who submitted the issue         |
| created_at  | Timestamp    | Automatically generated                             |
| updated_at  | Timestamp    | Automatically refreshed                             |

---

## API Endpoints List

### Authentication Module

- `POST /api/auth/signup` - Register a new user account (Public)
- `POST /api/auth/login` - Authenticate user and receive JWT token (Public)

### Issues Module

- `POST /api/issues` - Create a new bug or feature request (Authenticated)
- `GET /api/issues` - Retrieve all issues with optional filtering/sorting (Public)
- `GET /api/issues/:id` - Retrieve full details of a specific issue (Public)
- `PATCH /api/issues/:id` - Update issue title, description, or type (Conditional Access)
- `DELETE /api/issues/:id` - Permanently remove an issue (Maintainer Only)

---

## Local Setup Steps

Follow these steps to run the project locally:

1. **Clone the repository:**
   ```bash
   git clone : https://github.com/MD-Nasir301/B7A2_Asignment_Devpules_backend.git
   cd devpulse
   ```
