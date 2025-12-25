# 20 August High School Voting Platform

## Overview

A student challenge voting platform for 20 August High School. The application allows students to submit entries, voters to register and cast votes for their favorite participants, and administrators to manage the competition. The platform features a premium award ceremony aesthetic with a gold and black color theme, inspired by The Webby Awards and Product Hunt.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter (lightweight React router)
- **State Management**: 
  - Zustand for local client state (voter/admin authentication)
  - TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful JSON API with routes for students, voters, votes, and admin operations
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Build Process**: Custom build script using esbuild for server bundling and Vite for client

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema**: Three main tables:
  - `students` - Challenge participants with name, description, photo, vote count
  - `voters` - Registered voters with email (unique), voting status
  - `votes` - Vote records linking voters to students
- **Migrations**: Drizzle Kit for schema management (`db:push` command)

### Authentication
- **Voter Auth**: Email-based identification (no password, just email lookup)
- **Admin Auth**: Simple username/password credentials defined in schema
- **Session State**: Client-side Zustand stores for both voter and admin state

### Key Design Decisions

1. **Shared Schema Pattern**: Database schema and Zod validation schemas are defined in `shared/schema.ts`, accessible to both frontend and backend via path aliases
2. **Storage Abstraction**: `IStorage` interface in server allows for potential storage implementation swaps
3. **Real-time Updates**: Leaderboard uses polling (refetchInterval) for live vote count updates
4. **Single Vote Constraint**: Voters can only vote once, enforced at the database level with `hasVoted` flag

## External Dependencies

### Database
- PostgreSQL database (required, connection via `DATABASE_URL` environment variable)
- Drizzle ORM for database operations
- connect-pg-simple for potential session storage

### UI Libraries
- Full shadcn/ui component set (Radix UI primitives)
- Lucide React for icons
- Embla Carousel for carousels
- Vaul for drawer components
- class-variance-authority for component variants

### Core Dependencies
- Express.js for HTTP server
- Zod for runtime validation
- date-fns for date formatting
- TanStack React Query for data fetching