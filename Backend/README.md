# Driving School Management System - Backend

A comprehensive object-oriented backend system for managing a driving school, built with Node.js, Express, and MongoDB.

## 🏗️ Architecture

This backend follows **Object-Oriented Programming (OOP)** principles with a clean layered architecture:

- **Models**: Data schemas and database operations
- **Services**: Business logic layer
- **Controllers**: Request/response handling
- **Routes**: API endpoint definitions
- **Middleware**: Authentication, validation, and error handling

## 📋 Features

- ✅ User Management (Admin, Instructor, Student)
- ✅ Authentication & Authorization (JWT)
- ✅ Lesson Management & Scheduling
- ✅ Instructor Schedule Management
- ✅ Student Progress Tracking
- ✅ Payment Management
- ✅ Feedback & Ratings System
- ✅ Notification System
- ✅ Course Management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Password Hashing**: bcryptjs

## 📦 Installation

1. **Install Dependencies**
   ```powershell
   cd Backend
   npm install
   ```

2. **Configure Environment Variables**
   
   Update `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://dsms:dsms@dsms.tsjqnfe.mongodb.net/?appName=DSMS
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   ```

3. **Start the Server**
   
   Development mode (with auto-restart):
   ```powershell
   npm run dev
   ```
   
   Production mode:
   ```powershell
   npm start
   ```

## 🌐 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /health
```

### 👤 User Routes (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/` | Get all users | Admin |
| GET | `/role/:role` | Get users by role | Auth |
| GET | `/:id` | Get user by ID | Auth |
| PUT | `/:id` | Update user | Owner/Admin |
| POST | `/:id/change-password` | Change password | Owner/Admin |
| DELETE | `/:id` | Delete user | Admin |

### 📚 Lesson Routes (`/api/lessons`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create lesson | Instructor/Admin |
| GET | `/` | Get all lessons | Auth |
| GET | `/instructor/:id/upcoming` | Instructor's upcoming lessons | Auth |
| GET | `/student/:id/upcoming` | Student's upcoming lessons | Auth |
| GET | `/:id` | Get lesson by ID | Auth |
| PUT | `/:id` | Update lesson | Instructor/Admin |
| POST | `/:id/complete` | Mark lesson complete | Instructor |
| DELETE | `/:id` | Delete lesson | Instructor/Admin |

### 📅 Schedule Routes (`/api/schedules`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create schedule slot | Instructor/Admin |
| GET | `/instructor/:id` | Get instructor schedule | Auth |
| POST | `/instructor/:id/copy-week` | Copy previous week | Instructor/Admin |
| GET | `/:id` | Get schedule by ID | Auth |
| PUT | `/:id` | Update schedule | Instructor/Admin |
| DELETE | `/:id` | Delete schedule | Instructor/Admin |

### 📊 Progress Routes (`/api/progress`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create progress record | Instructor/Admin |
| GET | `/student/:id` | Get student progress | Auth |
| GET | `/student/:id/summary` | Get progress summary | Auth |
| GET | `/:id` | Get progress by ID | Auth |
| PUT | `/:id` | Update progress | Instructor/Admin |
| DELETE | `/:id` | Delete progress | Admin |

### 💳 Payment Routes (`/api/payments`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create payment | Admin |
| GET | `/` | Get all payments | Admin |
| GET | `/student/:id` | Get student payments | Auth |
| GET | `/student/:id/summary` | Get payment summary | Auth |
| GET | `/:id` | Get payment by ID | Auth |
| PUT | `/:id` | Update payment | Admin |
| POST | `/:id/process` | Process payment | Auth |
| DELETE | `/:id` | Delete payment | Admin |

### ⭐ Feedback Routes (`/api/feedback`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create feedback | Student |
| GET | `/` | Get all feedback | Admin |
| GET | `/instructor/:id` | Get instructor feedback | Auth |
| GET | `/instructor/:id/rating` | Get instructor rating | Auth |
| GET | `/student/:id` | Get student feedback | Auth |
| GET | `/:id` | Get feedback by ID | Auth |
| PUT | `/:id` | Update feedback | Auth |
| DELETE | `/:id` | Delete feedback | Admin |

### 🔔 Notification Routes (`/api/notifications`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create notification | Admin |
| GET | `/user/:id` | Get user notifications | Auth |
| GET | `/user/:id/unread-count` | Get unread count | Auth |
| PUT | `/:id/read` | Mark as read | Auth |
| PUT | `/user/:id/read-all` | Mark all as read | Auth |
| DELETE | `/:id` | Delete notification | Auth |
| DELETE | `/user/:id` | Delete all user notifications | Auth |

### 📖 Course Routes (`/api/courses`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create course | Admin |
| GET | `/` | Get all courses | Public |
| GET | `/:id` | Get course by ID | Public |
| PUT | `/:id` | Update course | Admin |
| DELETE | `/:id` | Delete course | Admin |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Login Response
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

## 👥 User Roles

- **Admin**: Full access to all endpoints
- **Instructor**: Manage lessons, schedules, and student progress
- **Student**: View own data, book lessons, provide feedback

## 📝 Example Requests

### Register a Student
```bash
POST http://localhost:3000/api/users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "phone": "1234567890",
  "dateOfBirth": "2000-01-01",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "role": "student"
}
```

### Login
```bash
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

### Create a Lesson
```bash
POST http://localhost:3000/api/lessons
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "instructorId": "6507f1...",
  "studentId": "6507f2...",
  "date": "2025-11-15",
  "time": "10:00 AM",
  "duration": 60,
  "type": "practical"
}
```

## 🗂️ Project Structure

```
Backend/
├── db/
│   └── mongoConnect.js          # Database connection
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
│   │   └── config.js            # Configuration management
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
│   │   ├── authMiddleware.js    # JWT authentication
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
│   ├── app.js                   # Express app initialization
│   └── server.js                # Server entry point
├── .env                         # Environment variables
├── .gitignore
└── package.json
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control
- Input validation with express-validator
- Protected routes with middleware
- MongoDB injection prevention

## 🧪 Testing with Frontend

Once the server is running, your React frontend can connect to:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

Update your frontend login component to use the real API instead of hardcoded credentials.

## 📄 License

MIT

## 👨‍💻 Developer

Developed for the Driving School Management System project.
