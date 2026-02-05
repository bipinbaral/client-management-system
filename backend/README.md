# Client Management System - Backend API

Professional backend authentication system using Node.js, Express, MongoDB, JWT, and bcrypt.

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   └── User.js            # User schema
├── controllers/
│   └── authController.js  # Login & Register logic
├── routes/
│   └── authRoutes.js      # API routes
├── middleware/
│   └── authMiddleware.js  # JWT verification
├── server.js              # Main entry point
├── .env.example           # Environment variables template
├── .gitignore
└── package.json
```

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend folder (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# For local MongoDB
MONGO_URI=mongodb://localhost:27017/client-management

# OR for MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/client-management

JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected: ...
🚀 Server is running on port 5000
📍 API endpoint: http://localhost:5000/api/auth
```

## 🔐 API Endpoints

### Base URL
```
http://localhost:5000/api/auth
```

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## 🧪 Testing with Postman / Thunder Client

### Step 1: Register a Test User

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/auth/register`
3. **Headers:** `Content-Type: application/json`
4. **Body (raw JSON):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}
```
5. **Send** and verify you get a `token` in response

### Step 2: Test Login

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/auth/login`
3. **Headers:** `Content-Type: application/json`
4. **Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "test123"
}
```
5. **Send** and verify you get a `token` in response

### Step 3: Test Error Cases

**Wrong Password:**
```json
{
  "email": "test@example.com",
  "password": "wrongpassword"
}
```
Should return `401 - Invalid credentials`

**Missing Fields:**
```json
{
  "email": "test@example.com"
}
```
Should return `400 - Please provide email and password`

**Non-existent User:**
```json
{
  "email": "notexist@example.com",
  "password": "test123"
}
```
Should return `401 - Invalid credentials`

## 🔒 Using the JWT Token (for protected routes)

When making requests to protected routes (future endpoints), include the token:

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The `authMiddleware.js` will automatically verify the token and attach user info to `req.user`.

## 📝 Notes

- **Passwords** are hashed using bcrypt with 10 salt rounds
- **JWT tokens** expire after 7 days
- **CORS** is enabled for all origins (configure for production)
- Frontend can connect without any CORS issues
- MongoDB password field is excluded from queries by default for security

## 🎯 Next Steps

1. ✅ Backend is ready and independent
2. Connect your frontend to these endpoints
3. Store JWT token in localStorage/cookies in frontend
4. Add protected routes (e.g., get user profile, update user, etc.)
5. Consider adding refresh tokens for better security

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running (local) or your Atlas connection string is correct
- Check firewall/network access for Atlas

**Port already in use:**
- Change the PORT in `.env` file

**JWT errors:**
- Make sure JWT_SECRET is set in `.env`
- Don't share your JWT_SECRET publicly
