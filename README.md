# Georgia Tech C4G - Renewvia Project

## Spring 2026
Team Members: 
- Cody Kesler
- Harry Li
- Haden Sangree
- Emily Thomas
- Mlen-Too Wesley

---

## Project Description & Architecture

### Overview

This repository represents a comprehensive mini-grid optimization platform designed to assist renewable energy planners in minimizing the cost of rural electrification projects. The system employs a distributed architecture consisting of two primary components that work in concert to deliver optimal network topology solutions. By separating concerns between the user-facing interface and computationally intensive algorithms, this architecture enables independent scaling, maintenance, and deployment of each component.

- **Frontend Component:** A Next.js 16 full-stack web application leveraging the App Router and React 19 for real-time user interaction. The frontend provides spatial visualization through Google Maps integration, facilitates file import/export workflows, manages user authentication, and delivers responsive controls optimized for both desktop and mobile platforms.
- **Optimization Backend:** A FastAPI-based Python microservice in the `backend/` directory that houses the core solver algorithms capable of computing optimal mini-grid topologies subject to geographical, electrical, and cost constraints. Results are returned via RESTful endpoints in standardized JSON format.

### Frontend Technology Stack

The frontend employs a modern JavaScript ecosystem carefully selected for its ability to deliver responsive, maintainable code at scale:

- **Framework:** Next.js 16 with App Router—enables both server-side rendering and client-side interactivity where appropriate
- **Language:** TypeScript—provides compile-time type safety and improves code maintainability
- **Styling:** Tailwind CSS—utility-first CSS framework enabling rapid responsive design across form factors
- **UI Components:** Shadcn/RadixUI—accessibility-first component primitives with built-in keyboard navigation and ARIA support
- **Authentication:** NextAuth (Auth.js)—handles Google OAuth 2.0 flows and session management
- **Data Persistence:** Prisma ORM with PostgreSQL—provides type-safe database access with automatic schema migrations
- **Spatial Visualization:** Google Maps JavaScript API with advanced marker support
- **Real-time Notifications:** Web Push API with VAPID key authentication and service worker integration
- **Performance Analytics:** Vercel Analytics and Speed Insights for production monitoring

### Backend Technology Stack

The solver backend prioritizes computational efficiency and maintainability through deliberate technology selection:

- **Framework:** FastAPI—high-performance async web framework for Python with automatic OpenAPI documentation
- **Language:** Python 3.13+—enables rapid algorithm prototyping with access to established scientific computing libraries
- **Core Libraries:** Pydantic (type validation), NetworkX (graph algorithms), NumPy (numerical computing), Scikit-learn (spatial indexing), Shapely (geometric operations)
- **CORS Policy:** Cross-Origin Resource Sharing enabled for development and production frontend URLs to facilitate secure frontend-backend communication

### Data Flow & User Stories

**User Authentication Flow:**

When a user initiates a session, the following sequence transpires: The user navigates to the application's main interface (`src/app/page.tsx`) and selects the Google sign-in option. NextAuth intercepts this authentication request at the route handler (`src/app/api/auth/[...nextauth]/route.ts`), which delegates OAuth credential exchange to the core authentication configuration (`src/lib/auth.ts`). Upon successful authentication, the session state is persisted via a secure HTTP-only cookie and made available to all child React components through the `SessionProvider` wrapper in `src/app/layout.tsx`.

**Mini-Grid Optimization Workflow:**

The core optimization process follows a structured multi-step workflow: First, the user imports a dataset via CSV or KML file upload, or alternatively creates demand points interactively through drag-and-drop interactions on the map interface. These input points are represented as `MiniGridNode` objects and stored in React component state. The user then configures optimization parameters including solver algorithm selection, cost coefficients (pole cost per unit, wire cost per meter by voltage level), and physical constraints (maximum pole-to-pole distances, pole-to-terminal distances). When the user initiates the optimization computation, the frontend marshals all relevant data into a structured JSON payload and transmits it via HTTP POST to the backend solver service (`NEXT_PUBLIC_BACKEND_URL/solve`, which defaults to `http://localhost:8000`). The backend solver processes this request through the selected algorithm (one of several Steiner tree variants available in `backend/mini_grid_solver/src/solvers/`) and returns the optimized topology consisting of refined node positions, suggested pole placements, and comprehensive cost estimates. These results are subsequently rendered on the map as visual polylines and markers, and the complete optimization state is persisted in local memory for user review and modification.

**Persistent Data Storage:**

Authenticated users retain the ability to persist their optimization results to permanent storage for future retrieval and analysis. When a user elects to save a run, the frontend transmits a POST request to the `/api/minigrids` API endpoint. This endpoint, implemented as a Next.js API route with authentication middleware, validates the user's session and then delegates the database write operation to Prisma ORM. The resulting `MiniGridRun` record stores the node and edge topology as JSON documents, providing inherent flexibility for future schema evolution without necessitating database migrations for backward compatibility.

**Notification & Communication Mechanisms:**

The system implements multi-channel communication strategies to keep stakeholders informed of important events. Push notification subscriptions are collected during user onboarding and persisted on the user's profile via the `/api/notifications/subscribe` endpoint. Administrative users may subsequently broadcast notifications to subscribed users through the `/api/notifications/send` endpoint, which utilizes the Web Push protocol with VAPID key authentication for secure delivery. For transactional communications requiring email delivery, the system integrates with the Resend email service through the `/api/send` endpoint, enabling administrators to dispatch templated messages to users with reliable delivery guarantees.

---

## Getting Started

### Prerequisites & Development Environment Setup

Effective full-stack development requires contemporary tooling across multiple technology domains. The following prerequisite software must be installed and verified before proceeding with local development:

**Version Control & Language Runtimes:**
- [Git](https://docs.github.com/en/get-started/getting-started-with-git/set-up-git) for distributed version control and collaboration
- [Node.js](https://nodejs.org/en/download) v24+ as the JavaScript runtime for frontend and build tools
- [pnpm](https://pnpm.io/installation) v10+ as the package manager for Node.js dependencies (significantly faster and more efficient than npm or yarn)
- [Python](https://www.python.org/) 3.13+ for backend solver development and package management

**Containerization & Service Orchestration:**
- [Docker](https://www.docker.com/get-started/) Desktop or Docker Engine for running containerized services (PostgreSQL development database, optional containerized backend)

To verify your installation, execute `node --version`, `pnpm --version`, `python --version`, and `docker --version` in your terminal. All should return version numbers without errors.

### Installation & Project Initialization

Follow these sequential steps to establish a fully functional local development environment:

1. **Clone the Repository:**
   ```bash
   git clone git@github.gatech.edu:cs-6150-computing-for-good/template.git
   # or use HTTPS if SSH keys are not configured:
   git clone https://github.gatech.edu/cs-6150-computing-for-good/template.git
   cd template
   ```

2. **Obtain the Environment Secrets:**
   The `.env` file contains sensitive credentials necessary for authentication and external service integrations. This file must be obtained from course staff via Microsoft Teams or a teaching assistant. Never commit this file to version control, even in private repositories, as it contains secrets with financial and security implications.

3. **Install Node.js Dependencies:**
   pnpm efficiently manages the monorepo structure containing both frontend and backend dependencies. Invoke pnpm with the `--recursive` flag to install across all workspaces:
   ```bash
   pnpm install
   ```

4. **Initialize Services & Database:**
   The provided initialization script orchestrates multiple setup steps in correct sequence, including Docker container startup and database schema application:
   ```bash
   pnpm run init
   ```
   This command performs the following operations (executed only during first-time setup):
   - Starts PostgreSQL database container via docker-compose
   - Waits for database TCP port to become available
   - Executes Prisma schema migrations to the development database
   - Seeds the database with test user accounts and initial configuration data

5. **Start the Frontend Development Server:**
   The Next.js development server includes hot-module reloading, automatically reflecting code changes in the browser without full page reloads:
   ```bash
   pnpm run dev
   ```
   Once started, open [http://localhost:3000](http://localhost:3000) in your web browser. You should see the optimizer application with a sign-in prompt.

6. **Start the Backend Solver Service (in a separate terminal):**
   The solver backend operates independently and must be running for optimization requests to succeed. Two deployment options are supported:
   
   **Option A — Docker Containerized Backend (Recommended):**
   ```bash
   docker compose --profile local up -d
   ```
   This starts the FastAPI backend in a container at `http://localhost:8000`
   
   **Option B — Local Python Development:**
   ```bash
   cd backend
   pip install -e .
   uvicorn server:app --reload --host 0.0.0.0 --port 8000
   ```
   The `--reload` flag enables auto-restart on file changes; the service will be accessible at `http://localhost:8000`

7. **Authenticate with a Test Account:**
   Sign in using one of the pre-seeded test user accounts. Credentials are available from course staff or documented in the initialization script output.

8. **Verify Full-Stack Connectivity (Optional):**
   Open the browser's Developer Tools (F12) and navigate to the Network tab. Upload a sample CSV dataset and initiate an optimization run. You should observe HTTP requests reaching both the Next.js API routes (`/api/minigrids`) and the backend solver service (`/solve`), with JSON responses returning successfully. Successful completion indicates all systems are properly configured and communicating.

---

## Authentication & Authorization

### Google OAuth Flow

The system employs Google OAuth 2.0 as its single authentication mechanism, eliminating the need to manage passwords within the application and delegating identity verification to an established third-party provider. This design choice reduces security surface area by avoiding password storage and associated breach risks. The OAuth configuration is centralized in `src/lib/auth.ts`, where client credentials (`AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`) are securely stored through environment variables and never exposed to client-side code. When a user initiates the authentication flow, the code at `src/app/api/auth/[...nextauth]/route.ts` intercepts the request, exchanges the OAuth authorization code for a credential token with Google's servers, and establishes a user record in the database upon first login.

### Session Management

Session persistence is implemented through NextAuth (Auth.js), which maintains HTTP-only, secure cookies containing encrypted session identifiers. These cookies are automatically transmitted with every HTTP request from the browser, allowing protected API routes to verify user identity without requiring manual token management from the client. The session callback includes support for administrative impersonation via an optional `impersonated-user` cookie, enabling admins to troubleshoot user-specific issues by temporarily adopting their session context without requiring knowledge of external credentials.

### Authorization & Role-Based Access Control

The system implements a two-tier authorization model defined in `prisma/schema/user-role.prisma`. The `ADMIN` role grants permissions to manage users, dispatch emails through the Resend service, export data to CSV format, and impersonate other users for troubleshooting purposes. The `STAFF` role grants access only to the optimizer tool itself. These role assignments are enforced through middleware on protected endpoints, ensuring that unauthorized requests are rejected before reaching business logic. Admin-only endpoints include `/api/users` for user account management, `/api/export-csv` for bulk data retrieval in spreadsheet format, `/api/send` for transactional email delivery, and `/api/impersonate` for toggling active user impersonation.

---

## Backend Solver Service

### Design & Purpose

The backend solver service represents a critical component of the mini-grid optimization platform, isolated from the frontend through a separate FastAPI process to enable independent scaling of computationally intensive optimization algorithms. This separation of concerns provides several architectural benefits: it allows the Python backend to leverage specialized scientific libraries (NetworkX, Scikit-learn, Shapely) without requiring these dependencies in the Node.js frontend environment, it enables horizontal scaling of solver instances without scaling the web application, and it provides clear separation between user interface concerns and algorithmic optimization concerns. The solver service communicates exclusively through JSON-formatted REST API requests and responses, allowing it to be deployed independently on different infrastructure if necessary.

### Endpoint Specifications

| Endpoint | Method | Description | Use Case |
|----------|--------|-------------|----------|
| `/solve` | POST | Execute full network optimization with selected algorithm | Primary optimization request from user-initiated runs |
| `/local_optimization` | POST | Run refinement optimization on pole placements | Fine-tuning results after initial solve |
| `/solvers` | GET | Retrieve list of available solver algorithms with parameter schemas | Frontend solver selection dropdown population |

### Solver Algorithm Implementations

Located in `backend/mini_grid_solver/src/solvers/`, the system provides four distinct optimization strategies with varying computational complexity and solution quality tradeoffs:

- **SimpleMSTSolver** — Implements a baseline minimum spanning tree approach as reference point, useful for benchmarking and cases where computational resources are extremely constrained
- **SteinerizedMSTSolver** — Extends the MST approach by inserting intermediate Steiner points (synthetic pole positions) to reduce wire length, representing the next optimization level
- **GreedyIterSteinerSolver** — Employs iterative candidate pole optimization, exploring multiple pole placement positions and selecting those that minimize total cost, providing higher solution quality at moderate computational expense
- **DiskBasedSteinerSolver** — The most sophisticated approach, leveraging spatial partitioning and disk-based search strategies to identify near-optimal network topologies while remaining computationally tractable for realistic problem instances

### Request & Response Protocols

#### Request Format

The solver accepts requests conforming to the following schema structure:

```json
{
  "solver": "DiskBasedSteinerSolver",
  "params": {},
  "nodes": [{"index": 0, "name": "Source", "lat": ..., "lng": ..., "type": "source"}, ...],
  "edges": [],
  "voltageLevel": "low",
  "lengthConstraints": {...},
  "costs": {
    "poleCost": 1000,
    "lowVoltageCostPerMeter": 10,
    "highVoltageCostPerMeter": 0
  },
  "debug": 0,
  "usePoles": false
}
```

### Response Format

```json
{
  "status": "success",
  "nodes": [...],
  "edges": [...],
  "totalLowVoltageMeters": 150.5,
  "totalHighVoltageMeters": 0,
  "lowWireCostEstimate": 1505,
  "highWireCostEstimate": 0,
  "totalWireCostEstimate": 1505,
  "numPolesUsed": 5,
  "poleCostEstimate": 5000,
  "totalCostEstimate": 6505,
  "debug": {}
}
```

---

## Database & Prisma

### Schema Architecture

The system employs PostgreSQL as its persistent data store, accessed through Prisma ORM for type-safe database operations. Prisma's schema-driven approach provides several developer productivity benefits: automatic TypeScript type generation from the database schema, compile-time validation of database queries, and automatic migration file generation for schema changes. The schema is organized across multiple modular files in `prisma/schema/` for maintainability:

- **user.prisma** — Core user profiles with authentication metadata and role associations
- **account.prisma** — OAuth account linking records connecting users to external identity providers
- **session.prisma** — NextAuth session state, storing authentication tokens and expiration metadata
- **user-role.prisma** — Role definitions (`ADMIN`, `STAFF`) and user-to-role associations
- **mini-grid-result.prisma** — Saved optimization runs with network topology and cost estimates stored as JSON documents
- **verification-token.prisma** — Optional email verification tokens (for future enhancement)
- **config.prisma** — System configuration stored at application-level

### Common Prisma Operations

```bash
# Apply pending migrations to the database
# Use this after pulling schema changes from version control
pnpm exec prisma migrate dev

# Generate updated TypeScript types from schema
# Automatically runs after migrations but can be triggered manually
pnpm exec prisma generate

# Populate database with initial data
# Executes seed script defined in prisma/seed.ts
pnpm exec prisma db seed

# Open interactive Prisma Studio for data exploration and modification
# Launches web interface at http://localhost:5555
pnpm exec prisma studio
```

### Database Backup & Recovery Procedures

Creating a backup is essential before major upgrades or migrations. Use the PostgreSQL `pg_dumpall` utility through Docker:

```bash
# Create backup file from running PostgreSQL container
docker exec -t <container_name> pg_dumpall -c -U postgres > backup.sql
```

Restoring from a backup file requires piping the SQL commands back to the PostgreSQL container:

```bash
# Restore database from backup file
cat backup.sql | docker exec -i <container_name> psql -U postgres
```

These commands assume the database is running in a Docker container. For local PostgreSQL installations, use `pg_dumpall` and `psql` directly without the `docker exec` wrapper.

---

## Environment Variables

The application's external service integrations, authentication credentials, and runtime configuration are securely managed through environment variables, which should never be committed to version control. Create a `.env.local` file in the project root with all required values below. This file is automatically ignored by Git.

```bash
# Database Configuration
# PostgreSQL connection string including credentials and database name
# Format: postgresql://username:password@host:port/database_name?schema=public
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>?schema=public

# NextAuth Configuration
# AUTH_SECRET: Random string for encrypting JWT tokens and session cookies
# Generate with: openssl rand -base64 32
AUTH_SECRET=your_nextauth_secret_generated_here

# Google OAuth Credentials
# Obtain from Google Cloud Console -> APIs & Services -> Credentials
AUTH_GOOGLE_ID=your_google_oauth_client_id
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret

# NextAuth Session Configuration
# NEXTAUTH_URL: The application's public URL (http://localhost:3000 for local development)
AUTH_TRUST_HOST=true
NEXTAUTH_URL=http://localhost:3000

# Google Maps API
# NEXT_PUBLIC_* variables are exposed to client-side code
# Obtain from Google Cloud Console -> Maps API -> Credentials
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Backend Solver Service
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key_if_needed

# PWA Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_vapid_key
VAPID_PRIVATE_KEY=your_private_vapid_key
```

Generate VAPID keys here: https://vapidkeys.com/

---

## Deployment

### Infrastructure Architecture Decision Framework

The application's architecture enables flexible deployment strategies tailored to operational requirements and budget constraints. By separating the frontend (Next.js), backend (FastAPI), and database (PostgreSQL) concerns into independently deployable components, the system supports heterogeneous infrastructure choices where each component runs on the platform best suited for its computational demands.

**Database Hosting:** PostgreSQL should be provisioned through managed database services rather than self-hosted instances, as managed services eliminate operational overhead associated with backup management, patching, minor version upgrades, and availability maintenance. Supabase and Neon both provide free-tier PostgreSQL instances suitable for development and small deployments, with straightforward connection string configuration directly into the `DATABASE_URL` environment variable. Moving to production-scale usage, both services offer pay-as-you-go pricing that scales predictably with database size and query volume.

**Frontend Hosting:** Vercel represents the recommended deployment platform for the Next.js frontend given its native integration with Next.js framework features (server-side rendering, incremental static regeneration, edge functions) and streamlined deployment workflow directly from GitHub. The platform automatically provisions and deploys new preview environments for each pull request, enabling stakeholders to review UI changes in production-like environments before merging code. Production deployments occur automatically when code is merged to the main branch, with rollback capabilities for problematic releases.

**Backend Solver Hosting:** The FastAPI backend can be deployed to Vercel's serverless functions for small-scale deployments, or to more traditional container orchestration platforms (Render, Heroku, AWS ECS, Google Cloud Run) for production deployments with more consistent performance characteristics. The decision depends on expected optimization request frequency and acceptable cold-start latency. GitHub Actions (`.github/workflows/backend_deploy.yml`) automates backend deployment to Vercel whenever backend source files change on the main branch.

### Local Development with Docker Compose

Docker Compose profiles enable hardware-efficient local development where only necessary services are started:

```bash
# Local development mode: All services (frontend, backend, PostgreSQL)
docker compose --profile local up -d

# Production-like mode: Frontend and database only (external backend deployment)
docker compose --profile production up -d

# Stop all running services
docker compose down
```

---

## Manual Setup (After Cloning Template)

1. Replace `template` with your project name throughout the codebase
2. Configure OAuth settings in [Google Cloud Platform](https://console.cloud.google.com/apis/credentials)
3. Set up deployment secrets in GitHub Actions
4. Configure Nginx and SSL if deploying to C4G server

---

## Manual Setup (After Cloning Template)

1. Copy `.env` from course staff or Microsoft Teams and place in project root
2. Run `pnpm run init` to set up everything (Docker startup, database, seed data)
3. Follow the Getting Started section above for development workflow

### Documentation

For implementation details, architecture rationale, and troubleshooting guides, see the [Backend README](backend/README.md).

---

## Technologies Used

### Frontend Technology Stack

The frontend employs Next.js 16 with the App Router architecture, representing a deliberate choice for its combination of server-side rendering capabilities and incremental static regeneration support. This dual-execution model enables both performance optimization through pre-rendering static content and real-time dynamic behavior for interactive features like the map visualization. TypeScript provides static type checking throughout the codebase, preventing an entire class of runtime errors related to type mismatches and enabling refactoring with confidence. Tailwind CSS offers a utility-first approach to styling that integrates naturally with React's component structure, enabling rapid prototyping while maintaining consistency through design tokens. Prisma ORM provides type-safe database access through a query builder whose types are automatically generated from the database schema, making invalid queries impossible to construct. NextAuth abstracts away authentication complexity, handling OAuth flows, session management, and credential security according to industry best practices.

### Development Tools

Code quality and maintainability are enabled through complementary development tools. Prettier enforces consistent code formatting automatically, eliminating stylistic debates from code review. ESLint statically analyzes code for common error patterns and adherence to best practices before runtime. Husky and Lint-Staged run quality checks at commit time, preventing malformed code from entering version control.

### Backend Technology Stack

The FastAPI framework was selected for its combination of developer ergonomics and production-grade performance. FastAPI provides automatic OpenAPI/Swagger documentation generation, validation through Pydantic models, and native async/await support enabling efficient handling of multiple concurrent requests. NetworkX provides comprehensive graph algorithms essential for network topology optimization, leveraging decades of academic research and optimization. NumPy offers numerical operations on arrays and matrices, enabling efficient computation of distances and cost calculations across large networks. Scikit-learn provides machine learning utilities for clustering and spatial analysis components. Shapely handles geometric operations including polygon intersection and distance calculations critical for validating pole placements.

### Infrastructure & Operations

Docker enables repeatable deployment environments across development, staging, and production contexts, eliminating "works on my machine" problems. PostgreSQL provides ACID transaction guarantees critical for financial calculations and data consistency in optimization runs. GitHub Actions automates deployment and testing workflows. Nginx serves as a reverse proxy protecting backend services and enabling load balancing when needed.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
├─────────────────────────────────────────────────────────────────┤
│  Google Maps API     │    Next.js Frontend (React 19)          │
│  - Markers           │    - Map visualization                  │
│  - Polylines         │    - Solver controls                    │
│                      │    - File upload/export                 │
└────────┬─────────────┴────────────────┬──────────────────────────┘
         │                             │
         │                    ┌────────▼─────────┐
         │                    │  NextAuth (OAuth)│
         │                    │  Google Sign-in  │
         │                    └────────┬─────────┘
         │                             │
    ┌────▼─────────────────────────────▼─────────────────────┐
    │         Next.js Backend (Node.js + TypeScript)         │
    ├──────────────────────────────────────────────────────────┤
    │  API Routes:                                            │
    │  - /api/minigrids (save/load optimization runs)        │
    │  - /api/users (admin user management)                  │
    │  - /api/notifications (push notifications)             │
    │  - /api/send (email via Resend)                        │
    │  - /api/impersonate (admin impersonation)              │
    └──────────────┬───────────────────┬─────────────────────┘
                   │                   │
        ┌──────────▼─────┐    ┌────────▼──────────┐
        │  PostgreSQL    │    │  FastAPI Backend  │
        │  Database      │    │  (Python Solver)  │
        │  (Prisma ORM)  │    │                   │
        │                │    │  Endpoints:       │
        │ - Users        │    │  - /solve         │
        │ - Sessions     │    │  - /local_opt     │
        │ - MiniGridRuns │    │  - /solvers       │
        └────────────────┘    │                   │
                              │  Solver Algos:   │
                              │  - MST            │
                              │  - Steiner        │
                              │  - Greedy Iter    │
                              │  - Disk-based     │
                              └────────────────────┘
```

---

## Known Liabilities & Mitigation Strategies

The following table documents known limitations and potential solutions for future enhancement:

| Issue | Description | Mitigation Approach | Priority |
|-------|-------------|-------------------|----------|
| **Limited backend deployment automation** | Backend deployment requires manual GitHub Actions configuration; frontend deployment more streamlined via Vercel | Implement comprehensive GitHub Actions workflow for frontend and backend unified deployment; consider Infrastructure-as-Code (Terraform/CloudFormation) for reproducible deployments | Medium |
| **No environment variable template** | New developers lack visibility into all required environment variables and their purposes | Create and commit `.env.example` file with all keys and explanatory comments; update onboarding documentation to reference this template | High |
| **Admin features lack automated test coverage** | User impersonation, CSV export, and email delivery workflows validated manually only | Add end-to-end tests using Playwright or Cypress covering admin workflows; implement automated testing in CI/CD pipeline | Medium |
| **Service worker cache staleness** | Service workers may cache outdated assets, preventing users from receiving latest UI updates without manual cache clearing | Implement intelligent cache invalidation strategies with version numbers; add toast notification prompting users to refresh; consider Cache-Control headers for versioned assets | Low |
| **Mobile control button positioning** | On small portrait screens, floating action buttons may occupy valuable map real estate | Implemented 2x2 grid layout with reduced padding on mobile; future enhancement could use collapsible menu or bottom sheet drawer pattern | Low |
| **Backend CORS configuration hardcoded** | Current CORS origins in `backend/server.py` require code changes for deployment to new hosting providers | Extract CORS configuration to environment variables (`CORS_ORIGINS`); document required configuration updates in deployment guide | Medium |
| **Manual database backup procedures** | No automated backup pipeline exists; partner dependent on manual backup execution | Implement scheduled backups via cloud provider native services (Supabase/Neon both offer automated hourly/daily backups); configure retention policies to balance storage and recovery window | High |

### Strategic Recommendations

**Security Enhancements:** Implement rate limiting on public API endpoints to prevent abuse; consider API key authentication for external solver client access beyond the web UI

**Performance Optimization:** Add Redis caching layer for frequently executed solver runs with identical parameters; implement request deduplication to prevent redundant computations

**Operational Visibility:** Integrate centralized error tracking (Sentry, LogRocket) for production issue diagnosis; expand Vercel Analytics integration; implement distributed tracing for request flows across frontend-backend

**Code Quality:** Expand automated test suite to target critical paths (solver integration tests, authentication flows, export functionality); implement load testing for backend solver under expected usage patterns

**Disaster Recovery:** Document and automate disaster recovery procedures; implement database backup verification to confirm restore procedures work correctly

---

## Deliverable Screenshots (Chrome DevTools)

### Lighthouse Metrics

> **Note:** Screenshot placeholder. To generate:
> 1. Open the application in Chrome
> 2. Press F12 to open DevTools
> 3. Navigate to "Lighthouse" tab
> 4. Select device type (Mobile or Desktop)
> 5. Click "Analyze page load"

**Report:** [Lighthouse desktop analysis](https://pagespeed.web.dev/analysis/https-mini-grid-optimization-tool-vercel-app/zqxmprrsgq?form_factor=desktop)

<img src="public/screenshots/Lighthouse.png" alt="Lighthouse report screenshot" style="height:200px; object-fit:contain;" />

**Expected Metrics:**
- Performance: 70-85 (limited by Google Maps API)
- Accessibility: 80-90 (Shadcn/Radix UI provides ARIA support)
- Best Practices: 85-95 (Next.js and modern tooling)
- SEO: 80-90 (PWA-enabled, proper metadata)

### Form Factor Analysis

#### Mobile — Portrait (iOS / Android)

| Map View | Controls View |
| --- | --- |
| <img src="public/screenshots/MobilePortraitMap.png" alt="Mobile portrait map" style="height:200px; object-fit:contain;" /> | <img src="public/screenshots/MobilePortraitControls.png" alt="Mobile portrait controls" style="height:200px; object-fit:contain;" /> |

> Screenshot showing:
> - Map fills full viewport with controlled buttons in 2x2 grid at bottom
> - Sidebar accessible via hamburger menu
> - Touch-friendly control buttons
> - Footer with User Manual and Give Feedback links visible above controls

#### Mobile — Landscape (iOS / Android)

| Wider map view | Full controls panel |
| --- | --- |
| ![Mobile landscape map](public/screenshots/MobileLandscapeMap.png) | ![Mobile landscape controls](public/screenshots/MobileLandscapeWithControlPanel.png) |

> Screenshot showing:
> - Wider viewport with responsive layout
> - Map still dominates screen
> - Sidebar accessible, buttons repositioned for landscape
> - All controls remain accessible without scrolling

#### Desktop

<img src="public/screenshots/DesktopScreenshot.png" alt="Desktop screenshot" style="height:200px; object-fit:contain;" />

> Screenshot showing:
> - Full sidebar with sections (Define Markers, Costs & Solver, Export, Saved Grids)
> - Large interactive map filling right pane
> - Control buttons positioned horizontally in top-right
> - All UI elements clearly visible without overflow

### UX Considerations

**Mobile-First Responsive Design:**
- Tailwind CSS breakpoints handle layout transitions at sm (640px), md (768px), lg (1024px)
- Button sizes and text scale dynamically to prevent viewport overflow
- Touch targets meet 44px minimum (iOS) and 48dp (Android) standards

**Accessibility:**
- Shadcn UI components built on Radix UI primitives provide ARIA roles and keyboard navigation
- Color contrast meets WCAG AA standards (verified via Lighthouse)
- Form inputs have associated labels and error messages

**Performance:**
- Google Maps loads asynchronously via Next.js Script component with `afterInteractive` strategy
- Images optimized via Next.js Image component (not heavily used in this app)
- Service worker caches static assets and API responses for offline functionality

**Progressive Web App (PWA):**
- Service worker at `public/sw.js` enables offline access and app-like installation
- Web manifest at `src/app/manifest.ts` provides app metadata and icons
- Push notifications implemented via VAPID keys for real-time updates

---

## Partner Statement

**Date Completed:** [TO BE COMPLETED]

### OPTION A: Partner Understands & Will Use Deliverable

> _[Partner Organization Contact Name] and [Organization Name] understand the basics of the developer documentation and are prepared to use this deliverable in their operational infrastructure. They have reviewed the documentation and confirm they can support the technical requirements outlined._
>
> Signed: ___________________________
> 
> Title: ___________________________
>
> Date: ___________________________

### OPTION B: Partner Will Not Use Deliverable at This Time

**Status:** [SELECT A OR B]

> _[Organization Name] will not use the deliverable at this time._
>
> **Reasons cited:**
> - [Reason 1]
> - [Reason 2]
> - [Reason 3]
>
> **What we could have done differently:**
> - [Alternative approach 1]
> - [Alternative approach 2]
> - [Alternative approach 3]
>
> Signed: ___________________________
>
> Title: ___________________________
>
> Date: ___________________________

---

## Installation Walkthrough Statement

**Status:** [TO BE COMPLETED - Pending partner technical staff availability]

> An installation walkthrough was conducted on **[DATE]** with **[Partner Staff Member Name]** ([Title]) from **Renewvia Energy**.
>
> **Process:** The partner's staff member independently followed the installation steps in the "Getting Started" section of this README, guided verbally by the development team. The development team did not perform any steps on the partner's behalf; all commands were executed by the partner's representative.
>
> **Outcomes:**
> - [Describe any issues encountered and resolutions]
> - [Confirm successful deployment and access]
> - [Document any customizations required for partner environment]
>
> **Attendees:**
> - Partner: _____________________________ (Signature)
> - C4G Team: _____________________________ (C4G Representative)
>
> **Date:** ___________________________

---

If you want to contribute to this template for future projects please work with the teaching staff. We welcome any technologies that could benefit the partners and speed to delivery for features.
