// API Configuration
export const API_BASE_URL = 'http://localhost:3000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  USERS_BY_ROLE: (role) => `/users/role/${role}`,
  INSTRUCTOR_STUDENTS: (id) => `/users/instructor/${id}/students`,
  CHANGE_PASSWORD: (id) => `/users/${id}/change-password`,
  ENROLL_COURSE: (id) => `/users/${id}/enroll`,
  GET_ENROLLED_COURSES: (id) => `/users/${id}/enrolled-courses`,
  UNENROLL_COURSE: (id) => `/users/${id}/unenroll`,
  
  // Lessons
  LESSONS: '/lessons',
  LESSON_BY_ID: (id) => `/lessons/${id}`,
  INSTRUCTOR_LESSONS: (id) => `/lessons/instructor/${id}`,
  UPCOMING_LESSONS_INSTRUCTOR: (id) => `/lessons/instructor/${id}/upcoming`,
  UPCOMING_LESSONS_STUDENT: (id) => `/lessons/student/${id}/upcoming`,
  COMPLETE_LESSON: (id) => `/lessons/${id}/complete`,
  
  // Schedules
  SCHEDULES: '/schedules',
  SCHEDULE_BY_ID: (id) => `/schedules/${id}`,
  INSTRUCTOR_SCHEDULE: (id) => `/schedules/instructor/${id}`,
  COPY_SCHEDULE: (id) => `/schedules/instructor/${id}/copy-week`,
  
  // Progress
  PROGRESS: '/progress',
  PROGRESS_BY_ID: (id) => `/progress/${id}`,
  STUDENT_PROGRESS: (id) => `/progress/student/${id}`,
  STUDENT_PROGRESS_SUMMARY: (id) => `/progress/student/${id}/summary`,
  
  // Payments
  PAYMENTS: '/payments',
  PAYMENT_BY_ID: (id) => `/payments/${id}`,
  STUDENT_PAYMENTS: (id) => `/payments/student/${id}`,
  STUDENT_PAYMENT_SUMMARY: (id) => `/payments/student/${id}/summary`,
  PROCESS_PAYMENT: (id) => `/payments/${id}/process`,
  
  // Feedback
  FEEDBACK: '/feedback',
  FEEDBACK_BY_ID: (id) => `/feedback/${id}`,
  INSTRUCTOR_FEEDBACK: (id) => `/feedback/instructor/${id}`,
  INSTRUCTOR_RATING: (id) => `/feedback/instructor/${id}/rating`,
  STUDENT_FEEDBACK: (id) => `/feedback/student/${id}`,
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_BY_ID: (id) => `/notifications/${id}`,
  USER_NOTIFICATIONS: (id) => `/notifications/user/${id}`,
  UNREAD_COUNT: (id) => `/notifications/user/${id}/unread-count`,
  MARK_AS_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_READ: (id) => `/notifications/user/${id}/read-all`,
  
  // Courses
  COURSES: '/courses',
  COURSE_BY_ID: (id) => `/courses/${id}`,
};

export default API_BASE_URL;
