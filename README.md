# Simple Blog Application

This is a full-stack simple blog application built with a React frontend and a Node.js/Express/SQLite backend. It allows users to create, view, edit, and delete blog posts.

## Project Overview

The application consists of two main parts:

*   **Backend:** A Node.js server using Express.js to provide a RESTful API for managing blog posts. Data is stored in an SQLite database.
*   **Frontend:** A React application (built with Vite and TypeScript) that consumes the backend API to display posts and allow user interactions.

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (which includes npm, Node Package Manager). Version 18.x or higher is recommended.

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

Once both the backend and frontend servers are running:

1.  Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
2.  You should see the blog post list.
3.  You can create new posts, view individual posts, edit existing ones, or delete them.

---

*This README provides setup and execution instructions for the blog application.*

## Running with Docker and NGINX

This application can be built and run using Docker, which will serve the frontend with NGINX and run the backend Node.js server. NGINX will also proxy API requests to the backend.

### Prerequisites

- Docker installed on your machine.

### Building the Docker Image

1.  Clone the repository (if you haven't already).
2.  Navigate to the root directory of the project.
3.  Build the Docker image:

    ```bash
    docker build -t vite-nginx-app .
    ```
    (You can replace `vite-nginx-app` with your preferred image name.)

### Running the Docker Container

1.  Once the image is built, run the container:

    ```bash
    docker run -p 8080:80 vite-nginx-app
    ```
    (This maps port 8080 on your host machine to port 80 in the container, where NGINX is listening. You can change `8080` to any other available port on your host.)

2.  Open your browser and navigate to `http://localhost:8080` to see the application.
    The API backend will be accessible via NGINX at `http://localhost:8080/api/...`.

### Database

The application uses a SQLite database (`server/blog.db`). This database file is included in the Docker image. If you make changes to the database schema or want to start with a fresh database, you will need to rebuild the image. For persistent data that survives container restarts and image rebuilds without including the DB directly in the image, you would typically use Docker volumes to mount the database file from the host machine or use an external database service.
