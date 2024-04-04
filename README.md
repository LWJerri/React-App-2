# Task Manager V2

React ToDO Kanban PoC for Radency.

## Installation

1. Clone this repository - `git clone https://github.com/LWJerri/React-App-2.git`.

## Run Locally

### Without Docker

1. Install dependencies - `pnpm i -r` (or use your prefer package manager).
2. Rename `.env.example` to `.env` & fill all environments in `apps/backend`/`apps/frontend` folders.
3. Run `pnpm -r build`.
4. Run `pnpm backend:start` to start backend.
5. Run `pnpm frontend:preview` to run frontend in preview mode.

### With Docker

1. Run `docker-compose up --build -d`.

## License

This code has **MIT** license. See the `LICENSE` file for getting more information.
