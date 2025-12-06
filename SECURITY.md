# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it by emailing the maintainers. **Do not** create a public GitHub issue.

## Security Measures Implemented

### 1. XSS Prevention
- All user-generated content is sanitized before rendering
- `innerHTML` usage has been replaced with safer alternatives using `textContent` and DOM APIs
- Emoji inputs are validated to prevent malicious code injection
- URL validation prevents `javascript:` and `data:` URI attacks

### 2. Authentication Security
**⚠️ IMPORTANT**: The current authentication system (`src/lib/auth.ts`) uses localStorage and plain text passwords. This is **NOT PRODUCTION-READY**.

**For production, you MUST**:
- Implement server-side authentication with proper password hashing (bcrypt, Argon2)
- Use HTTP-only cookies for session management
- Implement proper CSRF protection
- Add rate limiting for login attempts
- Use Firebase Authentication instead of custom localStorage auth

### 3. API Key Security
**⚠️ CRITICAL**: API keys with `VITE_` prefix are bundled into client-side code and **exposed in the browser**.

**Current Exposure:**
- Azure OpenAI API key is visible in production build
- Anyone can extract and use your API key

**Required Actions Before Going Live:**
1. **Move API calls to a backend server** - Never call Azure OpenAI from the client
2. **Create a serverless function** (Vercel, Netlify, AWS Lambda) to proxy API calls
3. **Remove VITE_ prefix** from sensitive keys
4. **Use environment-specific keys** (separate dev/prod keys)
5. **Implement rate limiting** on your backend

**Example Serverless Function (Vercel):**
```typescript
// api/analyze-image.ts
import { AzureOpenAIService } from '../src/services/azure-openai';

export default async function handler(req, res) {
  // Validate authentication
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Rate limiting logic here

  // Call Azure OpenAI with server-side key
  const result = await AzureOpenAIService.analyzeImage(req.body.image);
  res.json(result);
}
```

### 4. Firebase Security
**⚠️ IMPORTANT**: Firebase client keys are public (this is normal), BUT you MUST configure Firestore Security Rules.

**Required Firestore Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /Artifacts/{artifactId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                             request.auth.uid == resource.data.createdBy;
    }

    match /Articles/{articleId} {
      allow read: if true; // Public read
      allow write: if request.auth != null; // Authenticated write
    }

    // Add rules for other collections
    match /{document=**} {
      allow read, write: if false; // Deny by default
    }
  }
}
```

### 5. Input Validation
All user inputs should be validated:
- Client-side validation for UX
- **Server-side validation is REQUIRED** (currently missing)
- Use Zod schemas for type-safe validation
- Sanitize all text inputs

### 6. Dependency Security
- Regular `npm audit` checks are required
- All dependencies are kept up to date
- No known high/critical vulnerabilities in current dependencies

### 7. Content Security Policy
Add these headers to your `vercel.json` or server configuration:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

## Environment Variables

### ⚠️ NEVER commit these files:
- `.env`
- `.env.local`
- `.env.production`

### Current Status:
✅ `.env.local` is in `.gitignore`
✅ No API keys found in git history
⚠️ API keys are exposed in client bundle (VITE_ prefix)

### Action Required:
1. Rotate all API keys that have VITE_ prefix
2. Move API calls to backend
3. Use server-side environment variables only

## Pre-Launch Security Checklist

Before making this project open source or deploying to production:

- [ ] Move API keys to backend/serverless functions
- [ ] Implement proper server-side authentication
- [ ] Add Firestore security rules
- [ ] Add server-side input validation
- [ ] Add rate limiting
- [ ] Add CSRF protection
- [ ] Configure security headers
- [ ] Run security audit: `npm audit`
- [ ] Test all authentication flows
- [ ] Review all user inputs for XSS vulnerabilities
- [ ] Implement proper error handling (don't expose stack traces)
- [ ] Add logging and monitoring
- [ ] Set up alerts for suspicious activity

## Additional Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Web Security Basics](https://web.dev/secure/)

## Version History

- **v1.0** (2025-12-05): Initial security hardening
  - Fixed XSS vulnerabilities
  - Updated dependencies
  - Added sanitization utilities
  - Documented security issues
