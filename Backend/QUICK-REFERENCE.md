# 🚀 Quick Reference Guide

## Start the Server

```powershell
cd Backend
npm run dev
```

Server will be available at: **http://localhost:3000**

## Test Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | 12345 |
| Instructor | instructor | 12345 |
| Student | student | 12345 |

## Key API Endpoints

### Authentication (Public)
```
POST /api/users/register   - Register new user
POST /api/users/login      - Login
```

### Users (Protected)
```
GET  /api/users            - Get all users (Admin only)
GET  /api/users/:id        - Get user by ID
PUT  /api/users/:id        - Update user
```

### Lessons
```
POST /api/lessons                           - Create lesson
GET  /api/lessons/instructor/:id/upcoming   - Instructor's upcoming lessons
GET  /api/lessons/student/:id/upcoming      - Student's upcoming lessons
```

### Schedules
```
POST /api/schedules                    - Create schedule
GET  /api/schedules/instructor/:id     - Get instructor schedule
```

### Progress
```
POST /api/progress                    - Create progress record
GET  /api/progress/student/:id        - Get student progress
GET  /api/progress/student/:id/summary - Progress summary
```

### Payments
```
POST /api/payments                    - Create payment
GET  /api/payments/student/:id        - Student payments
GET  /api/payments/student/:id/summary - Payment summary
```

### Feedback
```
POST /api/feedback                    - Submit feedback
GET  /api/feedback/instructor/:id     - Instructor feedback
GET  /api/feedback/instructor/:id/rating - Instructor rating
```

### Notifications
```
GET /api/notifications/user/:id           - User notifications
GET /api/notifications/user/:id/unread-count - Unread count
PUT /api/notifications/:id/read           - Mark as read
```

### Courses
```
GET  /api/courses     - Get all courses (Public)
POST /api/courses     - Create course (Admin)
```

## Authentication Header

All protected endpoints require:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Example Login Request

```javascript
const response = await fetch('http://localhost:3000/api/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: '12345'
  })
});

const data = await response.json();
const token = data.data.token;
```

## Example Authenticated Request

```javascript
const response = await fetch('http://localhost:3000/api/users', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
```

## Project Structure

```
Backend/
├── src/
│   ├── models/          # Database models (8 files)
│   ├── controllers/     # Request handlers (8 files)
│   ├── middleware/      # Auth & validation
│   ├── config/          # Configuration
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── services/            # Business logic (8 files)
├── routes/              # API routes (8 files)
├── db/                  # Database connection
├── .env                 # Environment variables
├── seed.js              # Seed test data
└── package.json
```

## Environment Variables (.env)

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://dsms:dsms@dsms.tsjqnfe.mongodb.net/?appName=DSMS
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

## Common Commands

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Seed database
node seed.js
```

## Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message"
}
```

## User Roles & Permissions

| Role | Create Lessons | View All Users | Manage Courses |
|------|---------------|----------------|----------------|
| Admin | ✅ | ✅ | ✅ |
| Instructor | ✅ | ❌ | ❌ |
| Student | ❌ | ❌ | ❌ |

## Useful Tips

1. **Test with Postman**: Import `DSMS-API-Collection.postman_collection.json`
2. **Check Server Status**: Visit `http://localhost:3000/health`
3. **View Logs**: Server logs are displayed in the console
4. **Database**: MongoDB Atlas is already connected
5. **CORS**: Currently allows all origins (configure for production)

## Frontend Integration Example

```javascript
// In your React components
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Make API call
const response = await fetch(`http://localhost:3000/api/lessons/student/${user._id}/upcoming`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
const upcomingLessons = data.data;
```

## Need Help?

- **Full Documentation**: `Backend/README.md`
- **Setup Guide**: `Backend/SETUP-GUIDE.md`
- **Code Comments**: All files have detailed comments

---

🎉 **Everything is ready! Start building your frontend integration!**
