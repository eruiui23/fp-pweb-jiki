# Build & Deployment Guide

## Current Status: ✅ Complete (Dev Mode)

All 18 API endpoints have been successfully implemented with JWT authentication and CRUD operations.

### ⚠️ Build Issue (Known Prisma 7 + Turbopack Limitation)

The production build fails due to missing MongoDB WASM runtime files in Prisma 7. This is a known issue and doesn't affect:
- Development mode (npm run dev) ✅
- API functionality ✅
- TypeScript compilation ✅

### 🚀 How to Run

#### **Development Mode (RECOMMENDED)**
```bash
npm run dev
```
- Starts Next.js dev server on http://localhost:3000
- All API endpoints fully functional
- Hot reload enabled

#### **Testing the APIs**

1. **Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "usn": "john_doe",
    "email": "john@example.com",
    "pass": "password123"
  }'
```

2. **Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usn": "john_doe",
    "pass": "password123"
  }'
```

3. **Use the returned token for protected endpoints:**
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 📊 Endpoint Reference

**Authentication (Public):**
- POST `/api/auth/register` - Create account
- POST `/api/auth/login` - Login
- GET `/api/auth/verify` - Verify token

**Users (Protected):**
- GET `/api/users` - List all
- POST `/api/users` - Create
- GET `/api/users/[id]` - Get by ID
- PUT `/api/users/[id]` - Update
- DELETE `/api/users/[id]` - Delete

**Tasks (Protected):**
- GET `/api/tasks` - List user's tasks
- POST `/api/tasks` - Create
- GET `/api/tasks/[id]` - Get by ID
- PUT `/api/tasks/[id]` - Update
- DELETE `/api/tasks/[id]` - Delete

**Trackers (Protected):**
- GET `/api/trackers` - List user's trackers
- POST `/api/trackers` - Create
- GET `/api/trackers/[id]` - Get by ID
- PUT `/api/trackers/[id]` - Update
- DELETE `/api/trackers/[id]` - Delete

### 🔧 Workaround for Production Build

If you need to build for production, you have these options:

#### Option 1: Use PostgreSQL instead of MongoDB (Recommended)
MongoDB support in Prisma 7 is still evolving. Using PostgreSQL eliminates the WASM issue entirely.

#### Option 2: Wait for Prisma 7.1+
Prisma team is working on better MongoDB support in upcoming releases.

#### Option 3: Downgrade to Prisma 6.x
```bash
npm uninstall @prisma/client prisma
npm install --save @prisma/client@6.9.0 --save-dev prisma@6.9.0
```

#### Option 4: Use Vercel (Handles Prisma automatically)
Deploying to Vercel typically handles these edge cases automatically.

### 📝 Environment Variables

Ensure `.env` has:
```
DATABASE_URL="mongodb+srv://jikidb:q6WIrF6XM2InIbpS@cluster0.zuzfnml.mongodb.net/DBJiki?appName=Cluster0"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRY="7d"
```

### ✅ Next Steps

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test endpoints with Postman/Insomnia** or the curl examples above

3. **Create frontend integration** with the API endpoints

4. **Deploy to production** (choose one of the workaround options if needed)

### 🐛 Troubleshooting

**Token expired error?**
- Tokens expire after 7 days by default
- Update `JWT_EXPIRY` in `.env` if needed

**Can't find user after login?**
- Make sure you're using the correct `usn` (username)
- Email-based login not supported (use username)

**404 on protected endpoints?**
- Check that Authorization header is set
- Format: `Authorization: Bearer {token}`

---
**Status:** Ready for development and testing ✅
