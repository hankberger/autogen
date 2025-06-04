# Simple Blog Application

This is a full-stack simple blog application built with a React frontend and a Node.js/Express/SQLite backend. It allows users to create, view, edit, and delete blog posts.

## Project Overview

The application consists of two main parts:

*   **Backend:** A Node.js server using Express.js to provide a RESTful API for managing blog posts. Data is stored in an SQLite database.
*   **Frontend:** A React application (built with Vite and TypeScript) that consumes the backend API to display posts and allow user interactions.

## Prerequisites

For running the application with Docker Compose (recommended), you need:
*   [Docker](https://www.docker.com/get-started)
*   [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop).

For manual local development (without Docker), ensure you have:
*   [Node.js](https://nodejs.org/) (which includes npm, Node Package Manager). Version 18.x or higher is recommended.

## Running with Docker Compose (Recommended)

This application is configured to run with Docker Compose, which simplifies the setup and orchestration of the frontend and backend services.

### Building and Running the Application

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the root directory** of the project (where `docker-compose.yml` is located).
3.  **Build and start the services:**

    ```bash
    docker-compose up --build -d
    ```
    (The `-d` flag runs the containers in detached mode)
    This command will:
    - Build the Docker images for the frontend and backend services based on `frontend.Dockerfile` and `backend.Dockerfile`.
    - Start containers for both services.
    - The frontend will be served by Nginx on port 80.
    - The backend Node.js server will run on port 3000 (internally) and be accessible to the frontend via `http://backend:3000`.

4.  **Accessing the application:**
    - **Frontend:** Open your browser and navigate to `http://localhost` (or `http://localhost:80`).
    - **Backend API:** The frontend makes requests to `/api/...` which are proxied by Nginx to the backend service at `http://backend:3000`. For direct API testing from your host machine, the backend is also exposed at `http://localhost:3001`.

### Stopping the Application

To stop and remove the containers, networks, and volumes created by `docker-compose up`:

```bash
docker-compose down
```
To just stop the services without removing them:
```bash
docker-compose stop
```
To view logs:
```bash
docker-compose logs -f
```
Or for a specific service:
```bash
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Database Notes

The backend service uses an SQLite database (`server/blog.db`).
- When running with Docker Compose, the `server` directory (which contains the code and potentially `blog.db`) is used as the build context for the backend Docker image.
- If the `server/blog.db` file is present before building the image, it might be included in the image.
- For development, the database will be created inside the `backend` container if it doesn't exist when the server starts. Data will persist as long as the container's filesystem layer persists. For more robust data persistence across `docker-compose down` and `up` cycles without rebuilding, you would typically configure a Docker volume for `server/blog.db` in the `docker-compose.yml` file. This is not currently configured in this setup.

---

## Manual Local Development Setup

The following sections describe how to run the frontend and backend services manually for development purposes. For a combined setup, please refer to the "Running with Docker Compose" section above.

## Backend Setup

The backend server handles the blog post data and API.

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Database Setup:**
    The SQLite database file (`blog.db`) will be automatically created in the `server` directory when the backend server starts for the first time. The necessary `posts` table is also created automatically if it doesn't exist.

4.  **Start the backend server:**
    ```bash
    node server.js
    ```
    Alternatively, you can configure a `start` script in `server/package.json` (e.g., `"start": "node server.js"`) and then run:
    ```bash
    npm start
    ```
    The backend server will run on `http://localhost:3001`.

5.  **Run backend tests:**
    To execute the automated tests for the backend API:
    ```bash
    npm test
    ```
    (Ensure you are in the `server` directory.)

## Frontend Setup

The frontend provides the user interface for the blog.

1.  **Navigate to the project root directory:**
    If you are in the `server` directory, go back to the root:
    ```bash
    cd ..
    ```
    If you are already at the project root, you can skip this step.

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend development server will typically run on `http://localhost:5173` (Vite's default) and should open automatically in your browser. If not, open your browser and navigate to the specified URL.

## Using the Application

Once both the backend and frontend servers are running (either locally or via Docker Compose):

1.  Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173` for local dev, or `http://localhost` if using Docker Compose).
2.  You should see the blog post list.
3.  You can create new posts, view individual posts, edit existing ones, or delete them.

---

## Running with Docker Compose (Recommended)

This application is configured to run with Docker Compose, which simplifies the setup and orchestration of the frontend and backend services.

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/install/) installed (usually included with Docker Desktop).

### Building and Running the Application

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the root directory** of the project (where `docker-compose.yml` is located).
3.  **Build and start the services:**

    ```bash
    docker-compose up --build
    ```
    This command will:
    - Build the Docker images for the frontend and backend services based on `frontend.Dockerfile` and `backend.Dockerfile`.
    - Start containers for both services.
    - The frontend will be served by Nginx on port 80.
    - The backend Node.js server will run on port 3000 (internally) and be accessible to the frontend via `http://backend:3000`.

4.  **Accessing the application:**
    - **Frontend:** Open your browser and navigate to `http://localhost` (or `http://localhost:80`).
    - **Backend API:** The frontend makes requests to `/api/...` which are proxied by Nginx to the backend service at `http://backend:3000`. For direct API testing from your host machine, the backend is also exposed at `http://localhost:3001`.

### Stopping the Application

To stop and remove the containers, networks, and volumes created by `docker-compose up`:

```bash
docker-compose down
```

### Database Notes

The backend service uses an SQLite database (`server/blog.db`).
- When running with Docker Compose, the `server` directory (which contains the code and potentially `blog.db`) is used as the build context for the backend Docker image.
- If the `server/blog.db` file is present before building the image, it might be included in the image.
- For development, the database will be created inside the `backend` container if it doesn't exist when the server starts. Data will persist as long as the container's filesystem layer persists. For more robust data persistence across `docker-compose down` and `up` cycles without rebuilding, you would typically configure a Docker volume for `server/blog.db` in the `docker-compose.yml` file. This is not currently configured in this setup.

---

*This README provides setup and execution instructions for the blog application.*
