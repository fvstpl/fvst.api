# fvst.api

## Project Description

fvst.api is a backend application built using the NestJS framework. The application handles user management, shop management, and authorization using JWT.

## Requirements

- Node.js
- MySQL
- Redis
- Prisma

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/fvstpl/fvst.api.git
    cd fvst.api
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Configure the `.env` file:
    ```sh
    cp .env.example .env
    ```

4. Update the `.env` file with appropriate values for your database and Redis.

5. Run Prisma migrations:
    ```sh
    npx prisma migrate dev
    ```

## Running the Application

1. Start the application:
    ```sh
    npm run start
    ```

2. The application will be available at `http://localhost:3000`.

## Project Structure

- `src/`
  - `app.module.ts` - main application module
  - `auth/` - authentication module
  - `guards/` - route guards
  - `prisma/` - Prisma configuration
  - `redis/` - Redis configuration
  - `shop/` - shop management module
  - `users/` - user management module

## Testing

1. Run tests:
    ```sh
    npm run test
    ```

## Contribution

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/feature-name`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push your changes to the branch (`git push origin feature/feature-name`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License.
