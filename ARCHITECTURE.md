# Project Architecture

## Frontend Architecture

The frontend of VerseFountain is a modern single-page application (SPA) designed for a responsive and interactive user experience.

**Key Technologies:**

*   **React:** A JavaScript library for building user interfaces. Components are the core building blocks.
*   **TypeScript:** Adds static typing to JavaScript, improving code quality and maintainability.
*   **TailwindCSS:** A utility-first CSS framework for rapid UI development.
*   **shadcn/ui:** A collection of re-usable UI components built using Radix UI and Tailwind CSS.

**Directory Structure (`client/src/`):**

*   **`components/`**: Contains reusable UI components, often categorized by feature (e.g., `academics/`, `books/`, `chat/`, `events/`, `poetry/`).
    *   **`shared/`**: Components used across multiple features (e.g., `Footer.tsx`, `Navbar.tsx`, `Sidebar.tsx`).
    *   **`ui/`**: Low-level UI elements, likely from or customized for shadcn/ui (e.g., `Button.tsx`, `Card.tsx`, `Dialog.tsx`, `Input.tsx`).
*   **`contexts/`**: Manages global state using React's Context API. Examples include:
    *   `ChatContext.tsx`: Likely manages state related to chat functionality.
    *   `PaymentContext.tsx`: Likely manages state related to payment processing.
*   **`hooks/`**: Custom React Hooks to encapsulate reusable logic and stateful behavior. Examples:
    *   `use-auth.tsx`: Handles authentication state and logic.
    *   `use-mobile.tsx`: Detects if the application is being viewed on a mobile device.
    *   `use-toast.ts`: Provides a way to display toast notifications.
*   **`lib/`**: Utility functions, configurations, and core client-side logic.
    *   `netlifyConfig.ts`: Configurations specific to Netlify deployment.
    *   `protected-route.tsx`: Implements route protection for authenticated users.
    *   `queryClient.ts`: Configuration for TanStack Query.
    *   `utils.ts`: General utility functions.
*   **`pages/`**: Top-level components representing different pages or views of the application (e.g., `home-page.tsx`, `books-page.tsx`, `profile-page.tsx`).
*   **`main.tsx`**: The entry point for the React application. It renders the root `App` component.
*   **`App.tsx`**: The main application component, likely responsible for setting up routing and global layout.
*   **`index.css`**: Global styles and TailwindCSS imports.

**State Management:**

*   **TanStack Query (React Query):** Used for managing server state, including fetching, caching, synchronizing, and updating remote data. This helps in simplifying data fetching logic and providing a better user experience with features like background updates and stale-while-revalidate.

## Backend Architecture

The backend is built using Node.js and Express.js, providing a RESTful API for the frontend client and handling business logic, database interactions, and real-time communication.

**Key Technologies:**

*   **Node.js:** A JavaScript runtime environment for executing server-side code.
*   **Express.js:** A minimal and flexible Node.js web application framework used to build the API.
*   **TypeScript:** Ensures type safety and better code organization for the backend services.
*   **PostgreSQL:** A powerful open-source relational database.
*   **Drizzle ORM:** A TypeScript ORM used for database schema definition, migrations, and querying.

**Key Files and Modules (`server/` directory):**

*   **`index.ts`**: The main entry point for the standalone server. It initializes the Express application, sets up middleware, registers routes, and starts the HTTP server. It also handles Vite integration for development.
*   **`routes.ts`**: Defines the API endpoints. It maps HTTP request paths to specific handler functions that implement the business logic for various features (e.g., books, events, user authentication).
*   **`db.ts`**: Configures and exports the Drizzle ORM instance, connecting to the PostgreSQL database. It uses connection details from environment variables.
*   **`DatabaseStorage.ts`**: Implements a custom session store using the database via Drizzle, and potentially other database-centric storage utilities.
*   **`auth.ts`**: Handles user authentication logic. This typically includes strategies for user login (e.g., username/password), session management (using `express-session`), and password hashing. It likely integrates with Passport.js.
*   **`socketService.ts`**: Manages WebSocket connections for real-time features like chat. It handles establishing connections, message broadcasting, and room management.
*   **`storage.ts`**: Provides abstractions for file storage, potentially for user uploads like book covers. It might interface with local file systems or cloud storage services.
*   **`seed.ts`**: Contains logic to populate the database with initial data during development or first-time setup.
*   **`vite.ts`**: Contains logic for integrating Vite during development for serving the client application.

**Database (`migrations/` and `drizzle.config.ts`):**

*   **`drizzle.config.ts`**: Configuration file for Drizzle ORM, specifying schema location, output directory for migrations, and database driver details.
*   **`migrations/`**: Contains SQL migration files generated by Drizzle Kit. These files track changes to the database schema over time, allowing for version control and systematic updates.

**Error Handling:**

*   The backend includes centralized error handling middleware (seen in `server/index.ts` and `netlify/functions/api.ts`) to catch and process errors, returning standardized JSON error responses.

## Shared Code (`shared/`)

To maintain consistency and reduce code duplication between the frontend and backend, a `shared/` directory is used.

*   **`schema.ts`**: This is a crucial file containing Drizzle ORM schema definitions. By defining the database tables, columns, and relations here, both the backend (for database operations) and potentially the frontend (for type safety when dealing with API responses or data structures) can import and use these definitions. This ensures that data structures are consistent across the application stack.
    *   This may also include shared utility functions or types that are relevant to both client and server logic.

## Deployment Architecture (`netlify/`)

The project is designed for deployment on Netlify, leveraging its serverless platform for the backend and static hosting for the frontend.

**Key Components:**

*   **`netlify/functions/`**: This directory contains serverless functions that form the backend API when deployed on Netlify.
    *   **`api.ts`**: This is the main serverless function that bundles the Express.js application (similar to `server/index.ts` but adapted for a serverless environment). It handles API requests, authentication, and database interactions. It uses `serverless-http` to wrap the Express app.
    *   **`websocket.ts`**: This function likely attempts to provide WebSocket functionality. However, standard Netlify Functions have limitations with persistent WebSocket connections. The application is designed to fall back to HTTP polling if WebSockets are not fully supported in the deployment environment (as noted in `README.md` and `NETLIFY_DEPLOYMENT.md`).
*   **`netlify.toml`**: This is the Netlify configuration file. It specifies build commands, the publish directory (for static frontend assets, usually `dist/` or `client/dist/`), redirect rules (important for SPAs), and plugin configurations.
*   **`NETLIFY_DEPLOYMENT.md`**: This file provides detailed, step-by-step instructions for deploying the application to Netlify. It covers prerequisites, database setup, environment variable configuration, and troubleshooting.

**Deployment Model:**

*   **Frontend**: The React client application (`client/`) is built into static assets (HTML, CSS, JavaScript) and deployed to Netlify's global Content Delivery Network (CDN).
*   **Backend**:
    *   **Primary (Netlify)**: The API is deployed as serverless functions (defined in `netlify/functions/`). Each function invocation handles a single incoming request. This is a scalable and cost-effective approach for many applications.
    *   **Alternative (Standalone Server)**: The `server/index.ts` provides a traditional Node.js/Express server setup. This can be used for local development, or if deploying to a platform that supports long-running Node.js applications (e.g., a VPS, Heroku, AWS EC2).
*   **Database**: A cloud-hosted PostgreSQL database (like Neon, as recommended in the documentation) is used, accessible by both the Netlify functions and the local development server.

**Build Process:**

*   The `package.json` likely contains an `npm run build` script that:
    1.  Builds the frontend application (e.g., using Vite or Create React App).
    2.  Transpiles the backend TypeScript code (both in `server/` and `netlify/functions/`) into JavaScript.
    3.  Prepares the output for Netlify, typically placing client assets in a `dist` or `build` folder and ensuring serverless functions are correctly packaged.

For comprehensive deployment instructions, refer to the [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) file.

## Architecture Diagram (Text-Based)

This diagram provides a high-level overview of the main components and their interactions:

```
+---------------------+      +-----------------------+      +---------------------+
|   User (Browser)    |<---->|  Frontend (React SPA) |----->| Static Asset Hosting|
|                     |      | (client/)             |      | (Netlify CDN)       |
+---------------------+      +-----------------------+      +---------------------+
                                    |        ^
                                    |        | (HTTP/S API Calls)
                                    |        |
                                    V        |
+-----------------------------------------------------------------------------------+
|                                  Backend Logic                                    |
|-----------------------------------------------------------------------------------|
| +-----------------------+  +-----------------------+  +-------------------------+ |
| |   API (Netlify Func)  |  | API (Standalone Server)|  | WebSocket Service       | |
| | (netlify/functions/api.ts)|  | (server/index.ts)     |  | (server/socketService.ts| |
| |        OR             |  | (Primarily for Dev)   |  |  netlify/functions/ws.ts)| |
| +-----------------------+  +-----------------------+  +-------------------------+ |
|         |                              |                     |  ^                |
|         | (Database Queries)           | (Database Queries)  |  | (Real-time    |
|         V                              V                     V  |  Messages)   |
| +-----------------------------------------------------------------------------------+
| |                            Database (PostgreSQL)                                |
| | (e.g., Neon Cloud DB)                                                           |
| +-----------------------------------------------------------------------------------+
```

**Key Interactions:**

1.  **User & Frontend**: The user interacts with the React Single Page Application (SPA) running in their browser. The frontend assets are served from Netlify's CDN.
2.  **Frontend & Backend API**:
    *   The frontend makes HTTP/S API calls (e.g., for data fetching, actions) to the backend.
    *   In a Netlify deployment, these calls go to the serverless functions defined in `netlify/functions/api.ts`.
    *   During local development (or if deployed as a standalone server), these calls go to the Express server defined in `server/index.ts`.
3.  **Backend & Database**: The backend logic (whether in Netlify functions or the standalone server) interacts with the PostgreSQL database for data persistence and retrieval using Drizzle ORM.
4.  **Frontend & WebSocket Service**:
    *   For real-time features (like chat), the frontend establishes a WebSocket connection.
    *   This connection is handled by `server/socketService.ts` (in local dev/standalone server) or potentially `netlify/functions/websocket.ts` (with limitations on Netlify, possibly falling back to polling).
