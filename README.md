# VerseFountain

A comprehensive digital library platform that celebrates cultural diversity through interactive reading experiences and community engagement.

## Features

- Cultural collections of books, poems, and academic resources
- Discussion forums for literary topics
- Event listings for cultural activities
- Reading progress tracking
- User ratings and comments
- Real-time chat

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (default) or MySQL (optional)
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js with session-based auth

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL database (or MySQL if preferred)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` file
4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Options

#### PostgreSQL (Default)

The application uses PostgreSQL by default. Environment variables are:

```
DATABASE_URL=${DATABASE_URL}
PGHOST=${PGHOST}
PGDATABASE=${PGDATABASE}
PGUSER=${PGUSER}
PGPASSWORD=${PGPASSWORD}
PGPORT=${PGPORT}
```

#### MySQL (Optional)

To use MySQL instead, follow the instructions in `MYSQL_SETUP.md`.

## Development

- **Schema**: Defined in `shared/schema.ts`
- **Storage**: Database operations in `server/storage.ts`
- **API Routes**: Defined in `server/routes.ts`
- **Authentication**: Handled in `server/auth.ts`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.