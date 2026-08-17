# MTG Store

A full-stack e-commerce web application for buying **Magic: The Gathering** cards, sealed products, and accessories.

The application provides a modern, responsive storefront where users can browse and search for Magic: The Gathering products, view detailed product information, manage a shopping cart, and complete purchases.

**Live application:** https://mtg-store.vercel.app/

**Source code:** https://github.com/ronyx-b/mtg-store-app

---

## Features

### 🛒 Online Store

* Browse Magic: The Gathering products
* Support for multiple product types:

  * Single cards
  * Sealed products
  * Accessories
* Product detail pages
* Product search and filtering
* Shopping cart
* Cart quantity management
* Product pricing and availability
* Responsive design for desktop, tablet, and mobile

### 🃏 Magic: The Gathering Card Search

The application integrates with the **Scryfall API** to provide Magic: The Gathering card information and search capabilities.

Card data can be searched using Scryfall's card database, while product information is managed through the application's backend services.

### 👤 User Features

* User authentication
* JWT-based authentication
* User account information
* Address management
* Order-related functionality
* Persistent client-side application state

### 🎨 User Interface

The application uses:

* Bootstrap 5
* React-Bootstrap
* Bootstrap Icons
* Custom MTG-inspired typography
* Responsive layouts
* Cloudinary for image management and optimization

---

## Technology Stack

### Frontend

| Technology                                            | Purpose                                 |
| ----------------------------------------------------- | --------------------------------------- |
| [Next.js](https://nextjs.org/)                        | React framework and application runtime |
| [React](https://react.dev/)                           | User interface                          |
| [Redux Toolkit](https://redux-toolkit.js.org/)        | Global application state                |
| [React Redux](https://react-redux.js.org/)            | Redux integration                       |
| [SWR](https://swr.vercel.app/)                        | Data fetching and caching               |
| [Axios](https://axios-http.com/)                      | HTTP requests                           |
| [Formik](https://formik.org/)                         | Form management                         |
| [Yup](https://github.com/jquense/yup)                 | Form validation                         |
| [Bootstrap](https://getbootstrap.com/)                | UI framework                            |
| [React-Bootstrap](https://react-bootstrap.github.io/) | Bootstrap components for React          |

### External Services

| Service                               | Purpose                                   |
| ------------------------------------- | ----------------------------------------- |
| [Scryfall](https://scryfall.com/)     | Magic: The Gathering card data and search |
| [Cloudinary](https://cloudinary.com/) | Image hosting and optimization            |
| Backend API                           | Product, user, cart, and application data |

### Runtime

* Node.js
* npm
* Next.js
* React

The current project uses Next.js `16.2.12` and React `19.2.6`.

---

## Architecture

The application follows a client-focused Next.js architecture.

```text
┌──────────────────────────────────────────────┐
│                  Web Browser                 │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │          Next.js / React UI            │  │
│  │                                        │  │
│  │  Pages ── Components ── Redux Store    │  │
│  │             │                          │  │
│  │             └── SWR / Axios            │  │
│  └────────────────────┬───────────────────┘  │
│                       │                      │
└───────────────────────┼──────────────────────┘
                        │
             ┌──────────┴──────────┐
             │                     │
             ▼                     ▼
      Application API        Scryfall API
             │                     │
             │                     │
             ▼                     ▼
      Store / User Data       MTG Card Data

             │
             ▼
        Cloudinary
       Product Images
```

### Project Structure

```text
mtg-store-app/
│
├── components/       # Reusable React UI components
│
├── pages/            # Next.js pages and routes
│
├── public/           # Static assets
│
├── services/         # API and application service modules
│
├── styles/           # Global and component styling
│
├── config.js         # Application configuration
├── types.js          # Shared application types
├── scryfall-api-types.js
│                    # Scryfall API type definitions
│
├── next.config.mjs   # Next.js configuration
├── jsconfig.json     # JavaScript project configuration
├── package.json      # Dependencies and npm scripts
└── package-lock.json # Locked dependency versions
```

The repository currently uses the **Next.js Pages Router**, with application routes located under `pages/`.

---

## Prerequisites

Before running the application locally, install:

* **Node.js** — preferably the current LTS release
* **npm**
* Access to the application's backend API
* A Scryfall API endpoint/configuration
* Cloudinary configuration if image functionality is required

---

## Installation

Clone the repository:

```bash
git clone https://github.com/ronyx-b/mtg-store-app.git
cd mtg-store-app
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

The application reads its runtime configuration from environment variables.

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SERVER_URL=<backend-api-url>
NEXT_PUBLIC_SCRYFALL_API_URL=<scryfall-api-url>
NEXT_PUBLIC_USD_CAD=<usd-to-cad-exchange-rate>
```

The application maps these variables through `config.js`:

```javascript
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
export const CARD_SEARCH_API_BASE_URL =
  process.env.NEXT_PUBLIC_SCRYFALL_API_URL;
export const USD_CAD = process.env.NEXT_PUBLIC_USD_CAD;
```

Do **not** commit `.env.local` or any file containing secrets or private credentials.

---

## Running Locally

Start the development server:

```bash
npm run dev
```

The application runs on:

```text
http://localhost:3300
```

The development script explicitly configures Next.js to use port `3300`.

---

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Next.js development server on port `3300`.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Production Server

```bash
npm run start
```

Starts the production Next.js server on port `3300`.

### Lint

```bash
npm run lint
```

Runs the project's linting configuration.

These scripts are defined in the project's `package.json`.

---

## Product Types

The application currently defines three primary product categories:

```javascript
{
  SINGLE: "single",
  SEALED: "sealed",
  ACCESSORY: "accessory"
}
```

This allows the storefront to distinguish between individual Magic cards, sealed Magic products, and non-card accessories.

---

## State Management

Global application state is managed using **Redux Toolkit** and **React Redux**.

Redux is used for application state that needs to be shared across multiple components and pages, while SWR is used for server-side data fetching and caching.

This separation allows the application to distinguish between:

```text
Client/Application State
        │
        └── Redux Toolkit

Remote/Server Data
        │
        └── SWR + Axios
```

---

## Data Sources

### Scryfall

[Scryfall](https://scryfall.com/) provides the application's Magic: The Gathering card data and search functionality.

The application uses a configurable Scryfall API base URL rather than hard-coding the endpoint directly into components.

### Backend API

Store-specific information is retrieved through a separate backend API.

The backend URL is configured through:

```text
NEXT_PUBLIC_SERVER_URL
```

This keeps the frontend independent of the backend deployment environment.

### Cloudinary

[Cloudinary](https://cloudinary.com/) is used for image-related functionality.

The project includes both the Cloudinary URL generation library and Next Cloudinary integration.

---

## Deployment

The application can be deployed as a standard Next.js application.

The project is currently deployed on Vercel:

**https://mtg-store.vercel.app/**

For a Vercel deployment:

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables.
3. Deploy the application.
4. Verify that the frontend can reach the configured backend API.
5. Verify Scryfall and Cloudinary functionality.

The repository is configured with a standard Next.js production build using:

```bash
npm run build
```

followed by:

```bash
npm run start
```

---

## Configuration

Application configuration is centralized in `config.js`.

```javascript
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL;

export const CARD_SEARCH_API_BASE_URL =
  process.env.NEXT_PUBLIC_SCRYFALL_API_URL;

export const USD_CAD =
  process.env.NEXT_PUBLIC_USD_CAD;
```

This allows the same frontend build configuration to be adapted to different environments without changing application source code.

---

## Development Guidelines

When contributing to the project:

1. Create a feature branch from `main`.
2. Keep reusable UI logic inside `components/`.
3. Keep API and external-service interactions inside `services/`.
4. Keep page-level routing and composition inside `pages/`.
5. Avoid placing API calls directly inside reusable presentation components when a service abstraction is appropriate.
6. Keep environment-specific configuration in environment variables.
7. Do not commit credentials, API keys, tokens, or other secrets.
8. Run linting before opening a pull request.

---

## Security

The frontend application should never contain secrets that must remain private.

In particular, values exposed through variables beginning with:

```text
NEXT_PUBLIC_
```

are intended to be available to browser-side code and **must not contain secrets**.

Private credentials should remain on the backend/server side.

---

## License

This project is provided for personal and educational purposes.

Magic: The Gathering, its card names, artwork, and associated intellectual property are owned by **Wizards of the Coast LLC** and/or their respective owners.

This project is an independent application and is not affiliated with or endorsed by Wizards of the Coast.

---

## Disclaimer

**Magic: The Gathering** is a trademark of Wizards of the Coast LLC.

Card information and imagery may be provided through third-party services such as Scryfall. This application is an independent project and is not affiliated with, sponsored by, or endorsed by Wizards of the Coast.

---

## Author

**Rony Boscan**

GitHub: https://github.com/ronyx-b

Project: https://github.com/ronyx-b/mtg-store-app

Live application: https://mtg-store.vercel.app/
