# Authentication Feature Specification

## Overview
User authentication system with registration and login capabilities.

## Endpoints

### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "success": true,
  "userId": "string",
  "token": "string"
}
```

### POST /api/auth/login
Authenticate existing user.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "userId": "string",
  "token": "string"
}
```

## Security
- Passwords hashed with bcrypt
- JWT tokens for session management
- Email validation
- Password minimum 6 characters
