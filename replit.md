# TL;DR AI - Intelligent Text Analysis Tool

## Overview

TL;DR AI is a full-stack web application that provides intelligent text analysis using Google's Gemini AI. Users can paste long articles, reports, or emails to receive AI-generated summaries, key points extraction, and interactive Q&A capabilities. The application features a modern dark-themed interface and real-time processing with loading indicators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom dark theme variables
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for HTTP server and API endpoints
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling
- **API Structure**: RESTful endpoints (`/api/analyze`, `/api/ask`) with JSON request/response

### AI Integration
- **AI Service**: Google Generative AI (@google/genai) with Gemini 2.5 Flash model
- **Text Analysis**: Structured JSON responses with schema validation for summaries and key points
- **Q&A System**: Context-aware question answering based on original text content
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Data Storage
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for database schema management
- **Session Storage**: PostgreSQL-based session storage with connect-pg-simple

### Development Environment
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **Hot Reload**: Vite HMR for fast development feedback
- **Type Safety**: Comprehensive TypeScript configuration with strict mode
- **Code Organization**: Monorepo structure with shared schemas and clear separation of concerns

## External Dependencies

### Third-Party Services
- **Google AI Platform**: Gemini API for text generation and analysis (requires GEMINI_API_KEY)
- **Neon Database**: Serverless PostgreSQL hosting (requires DATABASE_URL)

### Key Libraries
- **AI/ML**: @google/genai for Google Generative AI integration
- **Database**: @neondatabase/serverless, drizzle-orm, drizzle-zod
- **UI Framework**: React, @radix-ui components, class-variance-authority
- **State Management**: @tanstack/react-query for server state
- **Validation**: zod for runtime type checking and API validation
- **Styling**: tailwindcss, clsx for conditional styling
- **Development**: vite, tsx, esbuild for build tooling

### Environment Configuration
- **Required Environment Variables**:
  - `GEMINI_API_KEY`: Google AI API key for text analysis
  - `DATABASE_URL`: PostgreSQL connection string for data persistence
- **Development Features**: Replit-specific development tools and error overlays