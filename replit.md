# Loan Support RAG - Professional Fintech Interface

## Overview

This is a React-based financial application that provides AI-powered loan support services through a Retrieval-Augmented Generation (RAG) system. The application features document ingestion capabilities, intelligent chat functionality, and loan eligibility calculations. It's built with a modern full-stack architecture using React with TypeScript for the frontend and Express.js with Node.js for the backend, all styled with Tailwind CSS and shadcn/ui components for a professional fintech appearance.

The system is designed to help financial institutions process loan documents, answer queries about loan policies, and calculate loan eligibility based on financial parameters. It integrates with AI services for document processing and provides a clean, responsive interface for loan officers and financial professionals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent, professional styling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management and React hooks for local state
- **Form Handling**: React Hook Form with Zod validation schemas
- **Styling**: Professional fintech theme with Inter font family and CSS custom properties for theming

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **API Design**: RESTful API with `/api/v1` prefix following OpenAPI standards
- **Development Server**: Hot reload with Vite integration for seamless development experience
- **Error Handling**: Centralized error handling middleware with structured error responses

### Database & ORM
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon Database serverless driver for PostgreSQL connections
- **Storage Strategy**: In-memory storage implementation with interface for future database integration

### Authentication & Security
- **Token-based Authentication**: Bearer token system stored in localStorage
- **API Security**: Authorization headers with configurable token management
- **Settings Management**: Client-side configuration for API base URL and authentication tokens

### API Endpoints & Features
- **Document Ingestion**: POST `/api/v1/ingest` - Processes documents from specified paths with configurable chunking
- **AI Chat Interface**: POST `/api/v1/chat/ask` - RAG-powered question answering with configurable result limits
- **Loan Eligibility**: POST `/api/v1/eligibility/calculate` - Financial calculations for loan eligibility assessment
- **Health Monitoring**: GET `/api/v1/health` - System health check endpoint
- **API Documentation**: Swagger/OpenAPI documentation at `/api/v1/docs`

### External Dependencies

- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Database**: PostgreSQL with Neon Database serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Build Tools**: Vite for fast development builds and hot module replacement
- **Validation**: Zod for runtime type validation and schema definition
- **HTTP Client**: Native fetch API with custom error handling and authentication
- **Development Tools**: Replit-specific plugins for enhanced development experience
- **Styling**: PostCSS with Autoprefixer for CSS processing