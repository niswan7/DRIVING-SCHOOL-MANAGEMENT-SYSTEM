# Quick Start Guide - Testing Your Application

## 🚀 Both Servers Are Running!

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173 

## 📝 Step-by-Step Testing Guide

### Test 1: Login as Admin (1 minute)

1. Open browser: `http://localhost:5173`
2. Click the "Login" button
3. Enter:
   - Username: `admin`
   - Password: `12345`
4. Click "Log In Securely"
5. ✅ You should be redirected to Admin Dashboard

---

### Test 2: Create a New User (2 minutes)

1. On Admin Dashboard, click **"Manage Users"** card
2. You'll see 3 existing users (admin, instructor, student)
3. Click **"Create User"** button (top right)
4. Fill in the modal form:
   ```
   First Name: Sarah
   Last Name: Johnson
   Username: sarah
   Email: sarah@example.com
   Password: password123
   Phone: 5551234567
   Role: Student
   Date of Birth: 2000-01-15
   Street Address: 123 Main St
   City: New York
   State: NY
   Zip Code: 10001
   ```
5. Click **"Create User"**
6. ✅ Sarah should appear in the users table!

---

### Test 3: Edit a User (1 minute)

1. In the users table, find Sarah Johnson
2. Click the **"Edit"** button next to her name
3. Change her phone number to: `5559876543`
4. Click **"Update User"**
5. ✅ Phone number should update in the table!

---

### Test 4: Search Users (30 seconds)

1. In the search box, type: `sarah`
2. ✅ Table filters to show only Sarah
3. Clear search to see all users again

---

### Test 5: Create a Course (2 minutes)

1. Click **"Back to Dashboard"** button
2. Click **"Manage Courses"** card
3. Click **"Create Course"** button
4. Fill in:
   ```
   Course Name: Advanced Highway Driving
   Description: Master highway merging, lane changes, and high-speed driving techniques
   Duration: 15
   Price: 450
   Type: Practical
   ```
5. Click **"Create Course"**
6. ✅ Course appears in the table with a green "practical" badge!

---

### Test 6: Register a New Student (3 minutes)

1. Click **"Logout"** button (top right)
2. On home page, click **"Sign Up"**
3. Fill the registration form:
   ```
   First Name: Michael
   Last Name: Smith
   Email: michael@example.com
   Phone: 5552223333
   Date of Birth: 1995-06-20
   Address: 456 Oak Avenue
   City: Los Angeles
   State: CA
   Zip Code: 90001
   Username: michael
   Password: mypass123
   Confirm Password: mypass123
   ```
4. Click **"Create Account"**
5. ✅ See success message: "Registration successful!"
6. You'll be redirected to login page

---

### Test 7: Login as New Student (1 minute)

1. On login page, enter:
   - Username: `michael`
   - Password: `mypass123`
2. Click **"Log In Securely"**
3. ✅ You should be redirected to Student Dashboard

---

### Test 8: Verify New User in Database (1 minute)

1. Logout and login again as admin:
   - Username: `admin`
   - Password: `12345`
2. Go to **"Manage Users"**
3. ✅ You should see Michael Smith in the users list!

---

### Test 9: Delete a User (1 minute)

1. In Manage Users, find a test user you created
2. Click the **"Delete"** button
3. Confirm the deletion
4. ✅ User disappears from the table!

---

### Test 10: View Payments (30 seconds)

1. Go back to Admin Dashboard
2. Click **"Manage Payments"** card
3. ✅ View the payments table (may be empty initially)
4. This shows all payment records from the database

---

## 🎯 Features Now Working

### ✅ Authentication
- [x] Login with username/password
- [x] JWT token storage
- [x] Role-based redirection
- [x] Logout functionality
- [x] Error messages for invalid credentials

### ✅ User Management (Admin)
- [x] View all users from database
- [x] Create new users (any role)
- [x] Edit existing users
- [x] Delete users
- [x] Search/filter users
- [x] Real-time updates

### ✅ Course Management (Admin)
- [x] View all courses
- [x] Create new courses
- [x] Edit course details
- [x] Delete courses
- [x] Course type badges

### ✅ Payment Management (Admin)
- [x] View all payments
- [x] Payment status tracking
- [x] Student name display

### ✅ Registration
- [x] Create new student accounts
- [x] Form validation
- [x] Address information
- [x] Automatic login redirection

---

## 🔍 Verify in MongoDB

Want to see the data in your database?

### Option 1: MongoDB Compass
1. Open MongoDB Compass
2. Connect to: `mongodb+srv://dsms:dsms@dsms.tsjqnfe.mongodb.net/`
3. View collections: users, courses, payments, etc.
4. See all the data you just created!

### Option 2: MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Login with your credentials
3. Browse Collections
4. See real-time data

---

## 🐛 Troubleshooting

### Login not working?
- Check Backend terminal - should show "✅ Successfully connected to MongoDB"
- Check Frontend terminal - should be running without errors
- Try clearing browser cache and localStorage

### User creation fails?
- Check browser console (F12) for errors
- Verify all required fields are filled
- Make sure username/email are unique

### Changes not appearing?
- Refresh the page
- Check if servers are still running
- Look at browser console for API errors

---

## 🎨 UI Features

### Modal Windows
- Click outside modal to close
- Press X button to close
- Form validation before submission
- Loading states during API calls

### Table Features
- Sortable columns
- Search functionality
- Role/Status color badges
- Action buttons for each row

### Forms
- Required field markers (*)
- Input validation
- Error messages
- Disabled fields where appropriate

---

## 📊 Test Data Created

After running all tests, you'll have:
- ✅ 4 users (admin, instructor, student, Sarah, Michael)
- ✅ 1+ courses
- ✅ Real MongoDB records
- ✅ JWT authentication working
- ✅ Full CRUD operations functional

---

## 🎉 Success Checklist

- [ ] Logged in as admin
- [ ] Created a new user
- [ ] Edited a user
- [ ] Searched for users
- [ ] Created a course
- [ ] Registered as new student
- [ ] Logged in as new student
- [ ] Verified data in database
- [ ] Deleted a test user
- [ ] Viewed payments

**If all checked, your system is fully functional!** ✨

---

## Next: Test Instructor & Student Features

After testing admin features, you can integrate:
1. Instructor lesson management
2. Student progress tracking
3. Payment processing
4. Feedback system
5. Notifications

Everything is ready - the backend APIs are all working! 🚀
