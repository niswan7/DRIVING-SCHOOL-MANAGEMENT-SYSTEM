# 🎓 Driving School Management System - Complete Setup Guide

## ✅ What Has Been Created

I've built a **complete, production-ready, object-oriented backend** for your Driving School Management System with the following features:

### 🏗️ Architecture & Design

✅ **Object-Oriented Programming (OOP)** - Full OOP implementation with classes for:
- Models (8 models)
- Services (8 services)  
- Controllers (8 controllers)
- Middleware (Authentication & Validation)

✅ **Layered Architecture**:
- **Models Layer**: Database operations and schemas
- **Services Layer**: Business logic
- **Controllers Layer**: HTTP request/response handling
- **Routes Layer**: API endpoint definitions

### 📦 Features Implemented

#### 1. **User Management**
- User registration with validation
- Login with JWT authentication
- Role-based access control (Admin, Instructor, Student)
- Password hashing with bcryptjs
- User CRUD operations

#### 2. **Lesson Management**
- Create, read, update, delete lessons
- Assign lessons to students and instructors
- Track lesson status (scheduled, in-progress, completed, cancelled)
- View upcoming lessons for instructors and students

#### 3. **Schedule Management**
- Instructor availability management
- Day-wise schedule slots
- Overlap detection to prevent double booking
- Copy previous week's schedule

#### 4. **Progress Tracking**
- Record student progress after each lesson
- Track skills (steering, braking, parking, signaling, awareness)
- Overall rating system
- Progress summary and analytics

#### 5. **Payment Management**
- Create and track payments
- Payment history
- Payment status tracking
- Student payment summary

#### 6. **Feedback System**
- Students can rate instructors
- Comment-based feedback
- Rating statistics and averages
- Anonymous feedback option

#### 7. **Notification System**
- Automated notifications for various events
- Unread notification tracking
- Mark as read functionality
- User-specific notifications

#### 8. **Course Management**
- Create and manage driving courses
- Course enrollment
- Course types (beginner, intermediate, advanced)

### 🛠️ Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database (already connected)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

### 📁 Complete File Structure

```
Backend/
├── db/
│   └── mongoConnect.js          # MongoDB connection manager
├── routes/
│   ├── userRoutes.js
│   ├── lessonRoutes.js
│   ├── scheduleRoutes.js
│   ├── progressRoutes.js
│   ├── paymentRoutes.js
│   ├── feedbackRoutes.js
│   ├── notificationRoutes.js
│   └── courseRoutes.js
├── services/
│   ├── UserService.js
│   ├── LessonService.js
│   ├── ScheduleService.js
│   ├── ProgressService.js
│   ├── PaymentService.js
│   ├── FeedbackService.js
│   ├── NotificationService.js
│   └── CourseService.js
├── src/
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   ├── UserController.js
│   │   ├── LessonController.js
│   │   ├── ScheduleController.js
│   │   ├── ProgressController.js
│   │   ├── PaymentController.js
│   │   ├── FeedbackController.js
│   │   ├── NotificationController.js
│   │   └── CourseController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Lesson.js
│   │   ├── Schedule.js
│   │   ├── Progress.js
│   │   ├── Payment.js
│   │   ├── Feedback.js
│   │   ├── Notification.js
│   │   └── Course.js
│   ├── app.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── seed.js                      # Database seeding script
├── README.md                    # Comprehensive documentation
└── DSMS-API-Collection.postman_collection.json
```

## 🚀 Server Status

✅ **Backend Server is Running!**
- 📡 Port: 3000
- 🌐 API Base URL: http://localhost:3000/api
- ✅ MongoDB Connected: Yes
- 🔐 Authentication: JWT enabled

## 🔑 Test Credentials

The database has been seeded with test accounts:

### Admin Account
```
Username: admin
Password: 12345
Email: admin@drivingschool.com
```

### Instructor Account
```
Username: instructor
Password: 12345
Email: instructor@drivingschool.com
```

### Student Account
```
Username: student
Password: 12345
Email: student@drivingschool.com
```

## 🌐 API Endpoints Summary

**Total Endpoints**: 50+ REST API endpoints

### Public Endpoints (No Auth Required)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/courses` - View all courses
- `GET /health` - Health check

### Protected Endpoints (Auth Required)
All other endpoints require JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Key Endpoints by Module

**Users**: 8 endpoints
**Lessons**: 8 endpoints  
**Schedules**: 6 endpoints
**Progress**: 6 endpoints
**Payments**: 8 endpoints
**Feedback**: 8 endpoints
**Notifications**: 7 endpoints
**Courses**: 5 endpoints

## 🔗 How to Connect Frontend

### 1. Update Frontend API Base URL

In your React frontend, create an API configuration file:

```javascript
// Frontend/src/config/api.js
export const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  
  // Lessons
  LESSONS: '/lessons',
  UPCOMING_LESSONS_INSTRUCTOR: (id) => `/lessons/instructor/${id}/upcoming`,
  UPCOMING_LESSONS_STUDENT: (id) => `/lessons/student/${id}/upcoming`,
  
  // Schedules
  SCHEDULES: '/schedules',
  INSTRUCTOR_SCHEDULE: (id) => `/schedules/instructor/${id}`,
  
  // Progress
  PROGRESS: '/progress',
  STUDENT_PROGRESS: (id) => `/progress/student/${id}`,
  
  // Payments
  PAYMENTS: '/payments',
  STUDENT_PAYMENTS: (id) => `/payments/student/${id}`,
  
  // Feedback
  FEEDBACK: '/feedback',
  INSTRUCTOR_FEEDBACK: (id) => `/feedback/instructor/${id}`,
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  USER_NOTIFICATIONS: (id) => `/notifications/user/${id}`,
  
  // Courses
  COURSES: '/courses'
};
```

### 2. Update Login Component

Replace the hardcoded login logic in `Frontend/src/Login/login.jsx`:

```javascript
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const handleLogin = async (event) => {
  event.preventDefault();
  
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    const data = await response.json();

    if (data.success) {
      // Store token and user info
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      // Redirect based on role
      if (data.data.user.role === 'admin') {
        navigate('/admin');
      } else if (data.data.user.role === 'instructor') {
        navigate('/instructor');
      } else if (data.data.user.role === 'student') {
        navigate('/student');
      }
    } else {
      alert(data.message || 'Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login');
  }
};
```

### 3. Create API Helper

Create a reusable API helper for authenticated requests:

```javascript
// Frontend/src/utils/apiHelper.js
import { API_BASE_URL } from '../config/api';

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};
```

## 📝 Example Frontend Integration

### Fetch Student Dashboard Data

```javascript
// Frontend/src/Student/Student.jsx
import { useEffect, useState } from 'react';
import { apiRequest } from '../utils/apiHelper';

function StudentDashboard() {
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [progress, setProgress] = useState(null);
  const [payments, setPayments] = useState([]);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Fetch upcoming lessons
    apiRequest(`/lessons/student/${user._id}/upcoming`)
      .then(data => setUpcomingLessons(data.data))
      .catch(console.error);
    
    // Fetch progress summary
    apiRequest(`/progress/student/${user._id}/summary`)
      .then(data => setProgress(data.data))
      .catch(console.error);
    
    // Fetch payment summary
    apiRequest(`/payments/student/${user._id}/summary`)
      .then(data => setPayments(data.data))
      .catch(console.error);
  }, []);
  
  // Use the data in your component...
}
```

## 🧪 Testing the API

### Using Postman

1. Import the collection: `DSMS-API-Collection.postman_collection.json`
2. Test the login endpoint
3. Copy the token from the response
4. Set the `token` variable in Postman
5. Test other authenticated endpoints

### Using curl

```bash
# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"12345"}'

# Get all users (requires token)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔐 Security Features

✅ Password hashing with bcrypt (salt rounds: 10)
✅ JWT token authentication
✅ Role-based access control
✅ Input validation on all endpoints
✅ Protected routes with middleware
✅ MongoDB injection prevention
✅ Error handling and sanitization

## 📊 Database Collections

The following MongoDB collections are created automatically:
- `users` - User accounts
- `lessons` - Driving lessons
- `schedules` - Instructor schedules
- `progress` - Student progress records
- `payments` - Payment transactions
- `feedback` - Instructor ratings
- `notifications` - User notifications
- `courses` - Driving courses

## 🎯 Next Steps

### For Development
1. Update your frontend to connect to the backend
2. Test all endpoints with your UI
3. Customize validation rules as needed
4. Add more business logic if required

### For Production
1. Change JWT_SECRET in .env to a strong secret
2. Update MONGODB_URI to production database
3. Set NODE_ENV=production
4. Add rate limiting
5. Add HTTPS/SSL
6. Set up proper logging
7. Configure CORS for your frontend domain

## 📚 Additional Resources

- **Full API Documentation**: See `Backend/README.md`
- **Postman Collection**: Import `DSMS-API-Collection.postman_collection.json`
- **Seed Database**: Run `node seed.js` to recreate test users

## 🆘 Troubleshooting

### Backend won't start
```bash
cd Backend
npm install
npm run dev
```

### Database connection error
- Check if MongoDB Atlas IP whitelist includes your IP
- Verify connection string in .env

### Authentication errors
- Ensure you're sending the token in the Authorization header
- Format: `Authorization: Bearer YOUR_TOKEN`

## ✨ Summary

You now have a **fully functional, production-ready backend** with:
- ✅ 8 Models (OOP classes)
- ✅ 8 Services (Business logic)
- ✅ 8 Controllers (Request handlers)
- ✅ 50+ API Endpoints
- ✅ JWT Authentication
- ✅ Role-based Authorization
- ✅ Input Validation
- ✅ MongoDB Integration
- ✅ Comprehensive Documentation

**The backend is running and ready to be integrated with your React frontend!** 🚀

---

**Need help?** Check the README.md or review the code comments for detailed explanations.
