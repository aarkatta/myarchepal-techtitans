# Security Audit Report - MyArchePal

**Date:** December 5, 2025
**Status:**  **NOT PRODUCTION READY** - Critical Issues Identified
**Auditor:** Claude Code Security Review

---

## Executive Summary

This security audit identified **critical vulnerabilities** that MUST be addressed before making this project open source or deploying to production. While many issues have been partially mitigated, several require architectural changes.

### Overall Risk Assessment
- **Critical Issues:** 2
- **High Issues:** 2
- **Medium Issues:** 3
- **Low Issues:** 2

---

## CRITICAL ISSUES (Must Fix Immediately)

### 1. API Keys Exposed in Client-Side Code
**Risk Level:** CRITICAL
**Status:**  REQUIRES ARCHITECTURAL CHANGE

**Issue:**
- Azure OpenAI API key is exposed in the browser via VITE_ environment variables
- Anyone can extract your API key from the production JavaScript bundle
- Estimated annual cost if key is stolen and abused: **$10,000+**

**Current Code Location:**
- `.env.local` (VITE_AZURE_OPENAI_API_KEY)
- `src/services/azure-openai.ts:18-19`

**Evidence:**
```typescript
private static config: AzureOpenAIConfig = {
  endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || '',
  apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY || '',  //  EXPOSED
  ...
};
```

**Impact:**
- API key theft and unauthorized usage
- Quota exhaustion
- Financial liability
- Reputational damage

**Required Fix:**
1. **Create Backend API** (Vercel Serverless Function example):
```typescript
// api/analyze-image.ts
import { AzureOpenAIService } from '../lib/azure-openai-server';

export default async function handler(req, res) {
  // Verify authentication
  const user = await verifyAuth(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  // Rate limiting
  const allowed = await checkRateLimit(user.id);
  if (!allowed) return res.status(429).json({ error: 'Rate limit exceeded' });

  // Call Azure OpenAI (server-side only)
  const result = await AzureOpenAIService.analyzeImage(req.body.imageData);
  res.json(result);
}
```

2. **Update Frontend:**
```typescript
// Instead of calling Azure directly:
// const result = await AzureOpenAIService.analyzeArtifactImage(file);

// Call your backend:
const result = await fetch('/api/analyze-image', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({ imageData })
});
```

3. **Remove VITE_ prefix** from sensitive keys
4. **Rotate current Azure OpenAI API key** (assume it's compromised)

**Verification:**
- [ ] Backend API created
- [ ] Frontend updated to call backend
- [ ] API key rotated
- [ ] Rate limiting implemented
- [ ] Authentication verified

---

### 2. Insecure Authentication System
**Risk Level:** CRITICAL
**Status:**  REQUIRES COMPLETE REPLACEMENT

**Issue:**
- Passwords stored in plain text in localStorage
- No password hashing (bcrypt, Argon2, etc.)
- Authentication state stored client-side only
- No session expiration

**Current Code Location:**
- `src/lib/auth.ts:172` (plain text password comparison)

**Evidence:**
```typescript
// Line 172 in src/lib/auth.ts
if (user.password !== password) {  //  PLAIN TEXT COMPARISON
  throw new Error('Invalid password');
}
```

**Impact:**
- Account takeover via XSS
- Password theft from localStorage
- No protection against brute force
- Violates data protection regulations (GDPR, CCPA)

**Required Fix:**
**DO NOT USE** the current authentication system. Replace with:

**Option 1: Firebase Authentication (Recommended)**
```typescript
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Sign up
await createUserWithEmailAndPassword(auth, email, password);

// Sign in
await signInWithEmailAndPassword(auth, email, password);
```

**Option 2: Custom Backend with Proper Security**
```typescript
// Backend (Node.js + bcrypt)
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Sign up
const hashedPassword = await bcrypt.hash(password, saltRounds);
// Store hashedPassword in database

// Sign in
const match = await bcrypt.compare(password, user.hashedPassword);
```

**Verification:**
- [ ] Firebase Auth implemented OR
- [ ] Custom backend with bcrypt/Argon2
- [ ] HTTP-only cookies for sessions
- [ ] CSRF protection added
- [ ] Rate limiting on auth endpoints
- [ ] Old auth system removed

---

##  HIGH SEVERITY ISSUES

### 3. Cross-Site Scripting (XSS) Vulnerabilities
**Risk Level:** HIGH
**Status:**  PARTIALLY FIXED (requires completion)

**Issue:**
- Multiple `innerHTML` usages with user-controlled data
- Potential for malicious script injection

**Files Fixed:**
-  `src/pages/Articles.tsx` (3 instances)
-  `src/pages/Artifacts.tsx` (1 instance)

**Files Still Requiring Fix:**
-  `src/pages/ArtifactDetails.tsx:289`
-  `src/pages/CheckoutMerchandise.tsx:346`
-  `src/components/RecentFinds.tsx:120`
-  `src/components/ActiveProject.tsx:148`
-  `src/pages/Explore.tsx:233,311,400`
-  `src/pages/GiftShop.tsx:209`
-  `src/pages/SiteDetails.tsx:240`
-  `src/pages/SiteLists.tsx:242`

**Solution Provided:**
Created `src/lib/sanitize.ts` with:
- `createEmojiElement()` - Safe emoji rendering
- `sanitizeEmoji()` - Input sanitization
- `getArtifactEmoji()` - Safe artifact icons

**Required Actions:**
1. Add import to remaining files:
```typescript
import { createEmojiElement, getArtifactEmoji } from '@/lib/sanitize';
```

2. Replace innerHTML:
```typescript
// BEFORE (unsafe):
parent.innerHTML = `<span class="text-2xl">${emoji}</span>`;

// AFTER (safe):
parent.appendChild(createEmojiElement(emoji, 'text-2xl'));
```

**Verification:**
- [ ] All files updated with safe rendering
- [ ] Test with malicious input: `<script>alert('XSS')</script>`
- [ ] Verify emoji fallbacks work

---

### 4. Outdated Dependencies with Known Vulnerabilities
**Risk Level:** HIGH
**Status:**  FIXED

**Issue:**
- esbuild (moderate) - Development server vulnerability
- glob (high) - Command injection
- js-yaml (moderate) - Prototype pollution
- vite (moderate) - Multiple security issues

**Action Taken:**
```bash
npm audit fix --force
```

**Result:**
```
found 0 vulnerabilities
```

**Verification:**
-  All known vulnerabilities patched
-  Vite updated to 7.2.6
- [ ] Monitor for new vulnerabilities: `npm audit` (weekly)

---

##  MEDIUM SEVERITY ISSUES

### 5. Missing Firestore Security Rules
**Risk Level:** MEDIUM
**Status:** NOT VERIFIED

**Issue:**
- Cannot verify if Firestore security rules are properly configured
- Risk of unauthorized data access

**Required Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Artifacts - only authenticated users can read
    match /Artifacts/{artifactId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                             request.auth.uid == resource.data.createdBy;
    }

    // Articles - public read, authenticated write
    match /Articles/{articleId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }

    // Chat messages - only room members
    match /Messages/{messageId} {
      allow read: if request.auth != null &&
                    isRoomMember(request.auth.uid, resource.data.roomId);
      allow create: if request.auth != null &&
                      isRoomMember(request.auth.uid, request.resource.data.roomId);
    }

    // Helper function
    function isRoomMember(uid, roomId) {
      return exists(/databases/$(database)/documents/RoomMemberships/$(roomId + '_' + uid));
    }

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Verification:**
- [ ] Access Firebase Console → Firestore → Rules
- [ ] Apply security rules
- [ ] Test unauthorized access is blocked
- [ ] Test authorized access works

---

### 6. No Input Validation
**Risk Level:** MEDIUM
**Status:**  NOT IMPLEMENTED

**Issue:**
- User inputs not validated before storage
- No server-side validation
- Client-side validation can be bypassed

**Examples of Missing Validation:**
- Artifact names (could be SQL injection if backend added)
- Email addresses
- URLs
- File uploads (size, type, content)

**Recommended Fix:**
Use Zod for validation:

```typescript
import { z } from 'zod';

const ArtifactSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['Coin', 'Ceramic', 'Weapon', 'Glass', 'Personal Ornament', 'Sculpture']),
  description: z.string().max(5000),
  location: z.string().max(200),
  // ... more fields
});

// Validate before saving
try {
  const validatedArtifact = ArtifactSchema.parse(artifactData);
  await ArtifactsService.createArtifact(validatedArtifact);
} catch (error) {
  // Handle validation errors
}
```

**Verification:**
- [ ] Add Zod schemas for all data models
- [ ] Validate on client before submission
- [ ] Add server-side validation (Firebase Functions)

---

### 7. Missing Security Headers
**Risk Level:** MEDIUM
**Status:**  NOT CONFIGURED

**Issue:**
- No Content Security Policy (CSP)
- No X-Frame-Options
- No X-Content-Type-Options

**Required Fix:**
Update `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
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
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com"
        }
      ]
    }
  ]
}
```

**Verification:**
- [ ] Deploy with new headers
- [ ] Test with https://securityheaders.com/
- [ ] Verify CSP doesn't break functionality

---

##  LOW SEVERITY ISSUES

### 8. Environment Variable Management
**Risk Level:** LOW
**Status:**  PARTIALLY FIXED

**Action Taken:**
-  Created `.env.example` with security warnings
-  Verified `.env.local` is in `.gitignore`
-  Verified `.env.local` not in git history

**Remaining Actions:**
- [ ] Remove actual credentials from `.env.local`
- [ ] Document environment setup in README
- [ ] Create separate `.env.production` template

---

### 9. Code Quality & Best Practices
**Risk Level:** LOW
**Status:**  RECOMMENDATIONS

**Recommendations:**
1. **Error Handling:** Add global error boundary
2. **Logging:** Implement structured logging (avoid exposing stack traces)
3. **Rate Limiting:** Add rate limiting to prevent abuse
4. **File Upload Security:** Validate file types and sizes

---

## Summary of Fixes Applied

###  Completed
1.  Fixed npm package vulnerabilities (glob, esbuild, vite, js-yaml)
2.  Created sanitization utilities (`src/lib/sanitize.ts`)
3.  Fixed XSS in Articles.tsx (3 instances)
4.  Fixed XSS in Artifacts.tsx (1 instance)
5.  Created `.env.example` with security warnings
6.  Created SECURITY.md documentation
7.  Verified .env.local is not in git

###  Requires Action
1.  Move Azure OpenAI API calls to backend (CRITICAL)
2.  Rotate Azure OpenAI API key (CRITICAL)
3. ️ Replace authentication system (CRITICAL)
4.  Fix remaining XSS vulnerabilities (8 files)
5.  Configure Firestore security rules
6.  Add input validation with Zod
7.  Configure security headers

---

## Pre-Launch Checklist

**DO NOT make this project public or deploy to production until ALL items are checked:**

### Critical (Must Fix)
- [ ] Azure OpenAI moved to backend API
- [ ] Azure OpenAI API key rotated
- [ ] Authentication system replaced with Firebase Auth or secure backend
- [ ] All XSS vulnerabilities fixed
- [ ] Firestore security rules configured and tested

### High Priority (Should Fix)
- [ ] Input validation implemented
- [ ] Security headers configured
- [ ] Rate limiting added
- [ ] CSRF protection implemented

### Testing
- [ ] Security testing completed
- [ ] Penetration testing performed
- [ ] All authentication flows tested
- [ ] XSS testing with malicious inputs
- [ ] API rate limiting tested

### Documentation
- [ ] Security documentation reviewed
- [ ] Environment setup documented
- [ ] Deployment guide updated
- [ ] Contributing guidelines include security section

---

## Estimated Timeline

- **Immediate (1-2 days):** Fix remaining XSS issues
- **Short-term (3-5 days):** Backend API for Azure OpenAI, rotate keys
- **Medium-term (1-2 weeks):** Replace authentication system, add validation
- **Before launch:** Complete all pre-launch checklist items

---

## Resources & References

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Content Security Policy Guide](https://content-security-policy.com/)
- [Zod Validation Library](https://zod.dev/)

---

## Contact

For questions about this security audit:
- Review SECURITY.md for vulnerability reporting
- See fix-remaining-xss.sh for XSS fix instructions
- Check .env.example for environment setup

---

**IMPORTANT:** This project contains CRITICAL security vulnerabilities. Do NOT:
-  Deploy to production as-is
-  Make repository public before fixes
-  Share API keys or credentials
-  Skip any CRITICAL fixes

**You have been warned. Proceed at your own risk.**
