# Client Management System - Complete API Documentation

## 🚀 Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication
All endpoints except `/auth/login` and `/auth/register` require authentication.

**Include JWT token in request header:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 📚 API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
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

---

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
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

---

### Client Endpoints

#### GET /clients
Get all clients with **fuzzy search** and filters.

**Query Parameters:**
- `query` (string) - Fuzzy search query (searches name, email, phone)
- `status` (string) - Filter by status: Active, Inactive, Suspended
- `fitnessLevel` (string) - Filter by fitness level: Beginner, Intermediate, Advanced
- `goals` (array) - Filter by goals
- `sortBy` (string) - Sort field: name, createdAt, activityScore
- `sortOrder` (string) - asc or desc
- `page` (number) - Page number (default: 1)
- `limit` (number) - Results per page (default: 20)

**Example:**
```
GET /clients?query=jhon&status=Active&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "...",
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1234567890",
      "age": 28,
      "gender": "Male",
      "goals": ["Weight Loss", "Muscle Gain"],
      "fitnessLevel": "Beginner",
      "status": "Active",
      "activityScore": 85,
      "isInactive": false,
      "bmi": 24.5,
      "daysInactive": 2
    }
  ]
}
```

---

#### POST /clients
Create a new client.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1987654321",
  "age": 25,
  "gender": "Female",
  "goals": ["Weight Loss", "Endurance"],
  "fitnessLevel": "Beginner",
  "height": 165,
  "weight": 60
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": { /* client object */ }
}
```

---

#### GET /clients/:id
Get single client by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Smith",
    "email": "john@example.com",
    "activityScore": 85,
    "bmi": 24.5,
    "assignedTrainer": {
      "_id": "...",
      "name": "Trainer Name",
      "email": "trainer@example.com"
    }
  }
}
```

---

#### PUT /clients/:id
Update client information.

**Request Body:** (same as POST /clients)

**Response (200):**
```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": { /* updated client */ }
}
```

---

#### DELETE /clients/:id
Delete client (soft delete - marks as inactive).

**Response (200):**
```json
{
  "success": true,
  "message": "Client deleted successfully (marked as inactive)",
  "data": { /* client object */ }
}
```

---

#### GET /clients/inactive
Get all inactive clients (last activity > 7 days).

**Algorithm Used:** Activity detection algorithm

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "name": "Inactive Client",
      "daysInactive": 15,
      "activityScore": 20,
      "lastActivity": "2026-01-15T..."
    }
  ]
}
```

---

#### GET /clients/:id/recommendations
Get workout recommendations for a specific client.

**Algorithm Used:** K-Nearest Neighbors + Content-Based Filtering (Hybrid)

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "title": "Beginner Full Body Workout",
      "difficulty": "Beginner",
      "category": "Strength",
      "recommendationScore": 85,
      "recommendationReasons": {
        "levelMatch": true,
        "goalsMatch": true,
        "popularity": 150,
        "rating": 4.5
      }
    }
  ],
  "client": {
    "name": "John Smith",
    "fitnessLevel": "Beginner",
    "goals": ["Muscle Gain"]
  }
}
```

---

#### GET /clients/:id/similar
Find clients similar to the specified client.

**Algorithm Used:** K-Nearest Neighbors (KNN) with similarity scoring

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "name": "Similar Client",
      "age": 27,
      "fitnessLevel": "Beginner",
      "goals": ["Muscle Gain"],
      "similarityScore": 92,
      "matchPercentage": 92
    }
  ]
}
```

---

### Workout Endpoints

#### GET /workouts
Get all workouts with fuzzy search and filters.

**Query Parameters:**
- `query` (string) - Fuzzy search query
- `difficulty` (string) - Beginner, Intermediate, Advanced
- `category` (string) - Cardio, Strength, Flexibility, HIIT, Yoga, CrossFit, Sports
- `sortBy` (string) - popularity, rating, createdAt
- `page`, `limit` - Pagination

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 30,
  "data": [
    {
      "_id": "...",
      "title": "Full Body Strength Training",
      "description": "Complete workout for beginners",
      "difficulty": "Beginner",
      "duration": 45,
      "category": "Strength",
      "exercises": [
        {
          "name": "Push-ups",
          "sets": 3,
          "reps": "10-12",
          "restTime": 60,
          "notes": "Keep core tight"
        }
      ],
      "popularity": 150,
      "averageRating": 4.5,
      "totalExercises": 6
    }
  ]
}
```

---

#### POST /workouts
Create a new workout.

**Request Body:**
```json
{
  "title": "Morning Cardio Blast",
  "description": "High-intensity cardio workout",
  "difficulty": "Intermediate",
  "duration": 30,
  "category": "HIIT",
  "targetMuscles": ["Cardio", "Legs"],
  "exercises": [
    {
      "name": "Burpees",
      "sets": 4,
      "reps": "15",
      "restTime": 45,
      "notes": "Explosive movement"
    }
  ],
  "equipment": ["None"],
  "tags": ["cardio", "fat-burning"]
}
```

---

#### GET /workouts/recommend/:clientId
Recommend workouts for a specific client.

**Algorithm Used:** Content-Based Filtering

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [ /* workout recommendations */ ],
  "clientInfo": {
    "name": "Client Name",
    "fitnessLevel": "Beginner",
    "goals": ["Weight Loss"]
  }
}
```

---

#### POST /workouts/:id/rate
Rate a workout (1-5 stars).

**Request Body:**
```json
{
  "rating": 5
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Rating added successfully",
  "data": {
    "averageRating": 4.5,
    "totalRatings": 42
  }
}
```

---

### Payment Endpoints

#### GET /payments
Get all payments with filters.

**Query Parameters:**
- `status` - Pending, Paid, Overdue, Cancelled, Refunded
- `clientId` - Filter by client ID
- `startDate`, `endDate` - Date range filter
- `page`, `limit` - Pagination

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "client": {
        "name": "Client Name",
        "email": "client@example.com"
      },
      "amount": 100,
      "finalAmount": 90,
      "discount": 10,
      "status": "Paid",
      "dueDate": "2026-02-15T...",
      "paidDate": "2026-02-10T...",
      "invoiceNumber": "INV-202602-1234",
      "subscriptionType": "Monthly"
    }
  ]
}
```

---

#### POST /payments
Create a new payment record.

**Request Body:**
```json
{
  "client": "client_id_here",
  "amount": 100,
  "paymentMethod": "Credit Card",
  "subscriptionType": "Monthly",
  "dueDate": "2026-03-01",
  "discount": 10
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": { /* payment object with auto-generated invoice number */ }
}
```

---

#### GET /payments/overdue
Get all overdue payments (Priority Queue Algorithm).

**Algorithm Used:** Priority Queue - sorted by days overdue (descending)

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "client": { "name": "Client Name" },
      "amount": 100,
      "daysOverdue": 15,
      "priority": 0,
      "status": "Overdue"
    }
  ]
}
```

---

#### GET /payments/due-soon
Get payments due within N days.

**Query Parameters:**
- `days` (number) - Days ahead to check (default: 7)

**Response (200):**
```json
{
  "success": true,
  "count": 8,
  "data": [ /* payments due soon */ ]
}
```

---

#### GET /payments/analytics
Get payment analytics with revenue trends and forecasting.

**Algorithm Used:** Linear Regression, Moving Average, Trend Analysis

**Query Parameters:**
- `startDate`, `endDate` - Date range (default: last 90 days)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 15000,
    "totalPayments": 50,
    "averagePayment": 300,
    "totalDiscount": 500,
    "trend": "increasing",
    "trendSlope": 2.5,
    "growthRate": 15.5,
    "movingAverage": [280, 290, 295, 300],
    "forecast": [310, 320, 325, 330, 335, 340, 345],
    "standardDeviation": 45.2,
    "pending": {
      "count": 10,
      "amount": 2000
    },
    "overdue": {
      "count": 3,
      "amount": 450
    },
    "period": {
      "start": "2025-11-01",
      "end": "2026-02-01"
    }
  }
}
```

---

### Note Endpoints

#### GET /notes
Get all notes with filters.

**Query Parameters:**
- `clientId` - Filter by client
- `priority` - Low, Medium, High, Urgent
- `category` - General, Progress, Medical, Diet, Workout, Payment, Other
- `tags` - Array of tags
- `page`, `limit` - Pagination

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "title": "Progress Update",
      "content": "Client showed great improvement...",
      "client": { "name": "Client Name" },
      "createdBy": { "name": "Trainer Name" },
      "priority": "High",
      "category": "Progress",
      "tags": ["improvement", "strength"],
      "isPinned": false,
      "isCompleted": false,
      "daysSinceCreated": 5
    }
  ]
}
```

---

#### POST /notes
Create a new note.

**Request Body:**
```json
{
  "title": "Dietary Restrictions",
  "content": "Client is lactose intolerant. Avoid dairy in meal plans.",
  "client": "client_id_here",
  "priority": "High",
  "category": "Medical",
  "tags": ["diet", "allergy"],
  "isPinned": true
}
```

---

#### GET /notes/tags
Get all unique tags.

**Response (200):**
```json
{
  "success": true,  "count": 15,
  "data": ["diet", "progress", "injury", "goal", "motivation", ...]
}
```

---

#### PATCH /notes/:id/complete
Mark a note as completed.

**Response (200):**
```json
{
  "success": true,
  "message": "Note marked as completed",
  "data": { /* note object */ }
}
```

---

### Analytics Endpoints

#### GET /analytics/dashboard
Get comprehensive dashboard statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "clients": {
      "total": 150,
      "active": 120,
      "inactive": 30,
      "newThisMonth": 15,
      "growthRate": 12
    },
    "revenue": {
      "total": 45000,
      "thisMonth": 5000,
      "growthRate": 8
    },
    "payments": {
      "overdue": 5,
      "pending": 20
    },
    "topWorkouts": [ /* top 5 popular workouts */ ],
    "recentActivity": [ /* last 10 activity logs */ ]
  }
}
```

---

#### GET /analytics/clients/activity
Get client activity distribution.

**Algorithm Used:** Activity Scoring Algorithm with Percentile Ranking

**Response (200):**
```json
{
  "success": true,
  "data": {
    "distributions": {
      "veryActive": 30,
      "active": 50,
      "moderate": 40,
      "low": 20,
      "inactive": 10
    },
    "percentages": {
      "veryActive": 20,
      "active": 33,
      "moderate": 27,
      "low": 13,
      "inactive": 7
    },
    "averageScore": 65,
    "medianScore": 68,
    "p90Score": 85,
    "p10Score": 30
  }
}
```

---

#### GET /analytics/revenue/trends
Get revenue trends with forecasting.

**Algorithm Used:** Linear Regression, Moving Average (SMA/EMA)

**Query Parameters:**
- `days` (number) - Days to analyze (default: 90)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 45000,
    "averagePayment": 300,
    "trend": "increasing",
    "trendSlope": 3.2,
    "growthRate": 15,
    "movingAverage": [280, 285, 290, 295, 300, ...],
    "forecast": [310, 320, 330, 340, 350, 360, 370],
    "standardDeviation": 42
  }
}
```

---

#### GET /analytics/workouts
Get workout statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 85,
    "byDifficulty": [
      { "_id": "Beginner", "count": 35 },
      { "_id": "Intermediate", "count": 30 },
      { "_id": "Advanced", "count": 20 }
    ],
    "byCategory": [
      { "_id": "Strength", "count": 40 },
      { "_id": "Cardio", "count": 25 },
      { "_id": "HIIT", "count": 20 }
    ],
    "topRated": [ /* top 10 rated workouts */ ],
    "mostPopular": [ /* top 10 popular workouts */ ]
  }
}
```

---

#### GET /analytics/logs
Get activity logs.

**Query Parameters:**
- `action` - Filter by action type
- `level` - INFO, WARNING, ERROR, SUCCESS
- `startDate`, `endDate` - Date range
- `limit` - Max results (default: 50)

**Response (200):**
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "action": "CREATE_CLIENT",
      "description": "Created new client: John Doe",
      "user": { "name": "Trainer Name" },
      "level": "SUCCESS",
      "ipAddress": "192.168.1.1",
      "timeAgo": "5 minutes ago",
      "createdAt": "2026-02-03T..."
    }
  ]
}
```

---

#### GET /analytics/system
Get system statistics.

**Query Parameters:**
- `days` (number) - Days to analyze (default: 7)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2026-01-27",
      "end": "2026-02-03",
      "days": 7
    },
    "statistics": {
      "actionStats": [
        { "_id": "LOGIN", "count": 250 },
        { "_id": "CREATE_CLIENT", "count": 45 }
      ],
      "levelStats": [
        { "_id": "INFO", "count": 300 },
        { "_id": "SUCCESS", "count": 200 },
        { "_id": "WARNING", "count": 50 },
        { "_id": "ERROR", "count": 5 }
      ]
    },
    "recentErrors": [ /* last 10 error logs */ ]
  }
}
```

---

## 🔒 Rate Limiting

The API implements token bucket algorithm for rate limiting:

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| **Auth endpoints** | 5 requests | 15 minutes |
| **Search endpoints** | 50 requests | 15 minutes |
| **Create/Update** | 30 requests | 15 minutes |
| **General API** | 100 requests | 15 minutes |
| **Export/Heavy** | 3 requests | 1 hour |

**Rate limit headers:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1675435200
```

---

## 🧮 Algorithms Implemented

### 1. **Fuzzy Search** (Levenshtein Distance)
- Client search with typo tolerance
- Example: "Jhon" finds "John"

### 2. **K-Nearest Neighbors (KNN)**
- Find similar clients based on age, fitness level, goals
- Workout recommendations using collaborative filtering

### 3. **Content-Based Filtering**
- Recommend workouts matching client's fitness level and goals

### 4. **Activity Scoring Algorithm**
- Weighted calculation: Last Activity (35%), Workouts (30%), Payments (25%), Engagement (10%)

### 5. **Priority Queue**
- Sort overdue payments by urgency
- Payment reminders ordered by priority

### 6. **Linear Regression**
- Revenue forecasting
- Trend prediction

### 7. **Moving Average (SMA/EMA)**
- Revenue trend smoothing
- 7-day and 30-day moving averages

### 8. **Statistical Analysis**
- Standard deviation
- Percentile ranking
- Growth rate calculation

---

## ✅ Validation Rules

### Password Strength
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Email
- Valid email format (RFC 5322)

### Phone
- International format supported
- Regex validation

---

## 🐛 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email",
      "value": "invalid-email"
    }
  ]
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (Rate Limit)
- `500` - Server Error

---

## 📊 Activity Logging

All major actions are automatically logged to the database:
- User login/logout
- CRUD operations on clients, workouts, payments, notes
- System errors
- Export operations

Logs include:
- User information
- IP address
- User agent
- Timestamp
- Action description

Logs auto-delete after 90 days (TTL index).

---

## 🎯 Best Practices

1. **Always include JWT token** in protected routes
2. **Handle rate limiting** - implement retry logic with exponential backoff
3. **Paginate large queries** - use `page` and `limit` parameters
4. **Use fuzzy search** for better UX - allows typo tolerance
5. **Monitor activity logs** for security
6. **Cache frequently accessed data** on client side

---

## 🚀 Quick Start Example

```javascript
// 1. Register
const registerRes = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
  })
});

const { token } = await registerRes.json();

// 2. Get clients with fuzzy search
const clientsRes = await fetch('http://localhost:5000/api/clients?query=jhon', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const clients = await clientsRes.json();

// 3. Get workout recommendations
const recommendationsRes = await fetch(
  `http://localhost:5000/api/clients/${clientId}/recommendations`,
  {  headers: { 'Authorization': `Bearer ${token}` }
  }
);

const recommendations = await recommendationsRes.json();
```

---

**Backend fully functional with advanced algorithms! 🎉**
