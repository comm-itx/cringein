# Overview

CringeIn is a satirical web application that analyzes LinkedIn posts for "cringe level" - a humorous metric based on common corporate social media patterns. The app allows users to paste LinkedIn posts, receive a cringe score (0-100%), view detected cringe patterns, and get a "decringed" version of their post. Built as a single-page application with a focus on entertainment and social commentary around professional networking culture.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state, React Context for theme and app settings
- **Design System**: Custom design tokens with support for light/dark themes, LinkedIn-inspired color palette (navy blue primary, red-orange for high cringe, green for low cringe)

## Backend Architecture
- **Server**: Express.js with TypeScript
- **Development Setup**: Hot module replacement via Vite integration
- **API Structure**: RESTful endpoints with `/api` prefix
- **Error Handling**: Centralized error middleware with structured error responses
- **Request Logging**: Custom logging middleware for API requests with performance tracking

## Data Storage
- **Database**: PostgreSQL configured via Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Local Storage**: Browser localStorage for user preferences (theme, sound settings) and analysis history
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

## Core Application Logic
- **Cringe Analysis Engine**: Client-side pattern matching system with configurable rules for detecting LinkedIn clichés
- **Pattern Detection**: Regex-based rules for common phrases ("Agree? Thoughts?", "I'm humbled to announce", etc.)
- **Scoring Algorithm**: Point-based system with weighted scores for different cringe patterns
- **Text Processing**: Character limits (3000 chars), line break analysis, emoji counting
- **Decringe Feature**: Text transformation system to rewrite posts in less corporate language

## User Interface Features
- **Responsive Design**: Mobile-first approach with max-width constraints
- **Animations**: Progress bar animations, confetti effects for high scores, smooth transitions
- **Accessibility**: Proper ARIA labels, keyboard navigation, focus management
- **Theme System**: Light/dark mode with CSS custom properties
- **Typography**: Inter font for UI, Georgia for post content display

## Client-Side Functionality
- **Pure Frontend Logic**: No backend API calls required for core cringe analysis
- **Local Data Persistence**: Settings and history stored in browser localStorage
- **Real-time Analysis**: Instant feedback as users type or paste content
- **Social Sharing**: Pre-populated Twitter sharing with results
- **Hall of Cringe**: Preset examples demonstrating maximum cringe scenarios

# External Dependencies

## UI and Design
- **Radix UI**: Comprehensive set of accessible UI primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants
- **Embla Carousel**: Touch-friendly carousel component

## Development Tools
- **TypeScript**: Static type checking across frontend and backend
- **Vite**: Fast build tool with HMR and optimized production builds
- **ESBuild**: Fast JavaScript bundler for server-side code
- **Drizzle Kit**: Database migration and schema management tool

## Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database queries and schema management
- **Drizzle Zod**: Schema validation integration

## Form and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Hookform Resolvers**: Validation resolver integrations
- **Zod**: Runtime type validation and schema parsing

## State Management
- **TanStack React Query**: Server state management and caching
- **React Context**: Global theme and settings management

## Utilities
- **Date-fns**: Date manipulation and formatting
- **clsx/cn**: Conditional CSS class name utilities
- **cmdk**: Command palette component