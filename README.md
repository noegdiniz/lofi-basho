# Lofi Basho

Welcome to **Lofi Basho**, a minimalist haiku creation and sharing platform with a lo-fi vibe. This repository contains both the backend and frontend code for the project.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Backend](#backend)
  - [Setup](#setup)
  - [Running](#running)
- [Frontend](#frontend)
  - [Setup](#setup-1)
  - [Running](#running-1)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and registration
- Create, read, update, and delete haikus
- Like and unlike haikus
- Export haikus as images
- Responsive design with a lo-fi aesthetic

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite, Alembic
- **Frontend**: Next.js, React, Tailwind CSS, Axios

## Getting Started

To get a local copy up and running, follow these steps.

## Backend

### Setup

1. Navigate to the backend directory:

    ```sh
    cd lofi-basho-backend
    ```

2. Create and activate a virtual environment:

    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the dependencies:

    ```sh
    pip install -r requirements.txt
    ```

4. Run the database migrations:

    ```sh
    alembic upgrade head
    ```

### Running

1. Start the FastAPI server:

    ```sh
    uvicorn main:app --reload
    ```

2. The backend server will be running at [http://localhost:8000](http://localhost:8000).

## Frontend

### Setup

1. Navigate to the frontend directory:

    ```sh
    cd lofi-basho-frontend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

### Running

1. Start the Next.js development server:

    ```sh
    npm run dev
    ```

2. The frontend server will be running at [http://localhost:3000](http://localhost:3000).

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.