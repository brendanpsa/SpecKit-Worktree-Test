# Password Reset Specification

**Jira Issue:** [FIRE-35](https://projectsense.atlassian.net/browse/FIRE-35)

## User Story
As a user, I want to reset my forgotten password so that I can regain access to my account.

## Endpoints

### POST /api/auth/forgot-password
Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

### POST /api/auth/reset-password
Reset password using token from email.

**Request:**
```json
{
  "token": "reset-token-string",
  "newPassword": "newSecurePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

## Security
- Reset tokens expire after 24 hours
- One-time use tokens (invalidated after use)
- Minimum password length: 6 characters
- Tokens are cryptographically secure

## Implementation
- In-memory token storage (for testing)
- Real implementation would send actual emails
- Token validation on reset

**Jira:** FIRE-35
