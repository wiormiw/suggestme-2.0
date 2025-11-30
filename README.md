# SuggestMe 2.0 - Setup Guide

## Features Implemented

✅ JWT Authentication with Cookie support
✅ User Registration & Login
✅ Role-based Authorization (Admin/User)
✅ User Management (CRUD)
✅ Food Management (CRUD) - Admin only
✅ Food Suggestion by Mood
✅ Superadmin Seeder

## Setup Instructions

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

### 3. Push Database Schema

```bash
bun run db:push
```

### 4. Seed Superadmin

```bash
bun run seed:admin
```

Default credentials:

- Email: `admin@suggestme.com`
- Password: `Admin123!`

### 5. Start Development Server

```bash
bun run dev
```

## API Endpoints

### Authentication (`/v1/auth`)

- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/login` - Login user
- `POST /v1/auth/logout` - Logout user

### Users (`/v1/users`) - Admin only

- `GET /v1/users` - Get all users (Admin)
- `GET /v1/users/me` - Get current user profile
- `PATCH /v1/users/:id` - Update user (Admin)
- `DELETE /v1/users/:id` - Delete user (Admin)

### Foods (`/v1/foods`)

- `POST /v1/foods` - Create food (Admin only)
- `GET /v1/foods` - Get all foods
- `GET /v1/foods/:id` - Get food by ID
- `GET /v1/foods/suggest/:mood` - Get random food by mood
- `PATCH /v1/foods/:id` - Update food (Admin only)
- `DELETE /v1/foods/:id` - Delete food (Admin only)

## Authentication

The API supports two authentication methods:

1. **Cookie-based** (httpOnly cookie named `access_token`)
2. **Bearer Token** (Authorization header)

## Example Requests

### Register

```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"testuser","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@suggestme.com","password":"Admin123!"}'
```

### Add Food (Admin only)

```bash
curl -X POST http://localhost:3000/v1/foods \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Pizza","mood":"happy"}'
```

### Get Food Suggestion

```bash
curl http://localhost:3000/v1/foods/suggest/happy
```

## Moods Available

- `happy`
- `stressed`
- `tired`
- `celebratory`

## Roles

- `user` - Default role, can view foods and get suggestions
- `admin` - Can manage users and foods
