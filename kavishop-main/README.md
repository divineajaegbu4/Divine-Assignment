# Kavishop

Kavishop is a powerful, multi-vendor e-commerce platform backend built with [NestJS](https://nestjs.com/). It provides a robust, scalable architecture for handling products, categories, stores, carts, wishlists, orders, payments, reviews, and more.

## Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control (Admin, Merchant, Customer).
- **Multi-Vendor Support**: Merchants can create and manage their own stores.
- **Product Catalog**: Comprehensive product management with stock tracking and hierarchical categories.
- **Shopping Cart & Wishlist**: Persistent shopping cart and wishlist management.
- **Order Processing & Checkout**: Full checkout flow capturing snapshot of prices and handling stock deduction.
- **Simulated Payments**: Configurable payment gateway simulation transitioning pending orders to paid.
- **Reviews**: Customer product feedback system.
- **Media Uploads**: Local file upload system for avatars, logos, and product images.
- **Interactive API Documentation**: Fully automated Swagger UI for exploring and testing endpoints.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport-JWT
- **Validation**: class-validator, class-transformer
- **API Documentation**: @nestjs/swagger

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or via Docker)

## Installation

1. **Clone the repository and install dependencies:**

```bash
npm install
```

2. **Configure Environment Variables:**

Copy the example environment file and configure it with your local settings.

```bash
cp .env.example .env
```

Ensure your `.env` contains the proper database connection string:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=kavishop
JWT_SECRET=super-secret
JWT_EXPIRATION=1d
```

## Running the Application

Kavishop can be run in several modes:

```bash
# Development mode
npm run start

# Watch mode (recommended for active development)
npm run start:dev

# Production mode
npm run start:prod
```

Once running, the API is available at `http://localhost:3000`.

## Interactive API Documentation

Kavishop includes a fully interactive Swagger UI.

1. Start the application (`npm run start:dev`).
2. Navigate to [http://localhost:3000/api/docs](http://localhost:3000/api/docs) in your browser.
3. You can explore all available endpoints, their expected payloads, and test them directly. DTOs are automatically introspected and documented.

## Testing

The project is configured with Jest for both unit and end-to-end (e2e) testing.

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## Deployment

To deploy the application to a production environment:

1. **Build the application**:
   ```bash
   npm run build
   ```
2. **Set Production Environment Variables**: Ensure `NODE_ENV=production` and configure your production database credentials.
3. **Run the production build**:
   ```bash
   npm run start:prod
   ```

*Note: In a production environment, you should replace the local static file serving (MediaModule) with a cloud storage solution like AWS S3 or Google Cloud Storage, and integrate a real payment provider like Stripe.*

## License

This project is proprietary.
