require('dotenv').config();
const mongoConnection = require('./db/mongoConnect');
const User = require('./src/models/User');

/**
 * Seed Script
 * Creates initial admin, instructor, and student accounts
 */
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Connect to database
        const db = await mongoConnection.connect();
        const userModel = new User(db);

        // Create admin user
        console.log('Creating admin user...');
        const admin = await userModel.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@drivingschool.com',
            username: 'admin',
            password: '12345',
            phone: '1234567890',
            dateOfBirth: '1990-01-01',
            address: '123 Admin St',
            city: 'Admin City',
            state: 'AC',
            zipCode: '12345',
            role: 'admin'
        });
        console.log('✅ Admin created:', admin.email);

        // Create instructor user
        console.log('Creating instructor user...');
        const instructor = await userModel.create({
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'instructor@drivingschool.com',
            username: 'instructor',
            password: '12345',
            phone: '0987654321',
            dateOfBirth: '1985-05-15',
            address: '456 Instructor Ave',
            city: 'Teacher Town',
            state: 'TT',
            zipCode: '54321',
            role: 'instructor'
        });
        console.log('✅ Instructor created:', instructor.email);

        // Create student user
        console.log('Creating student user...');
        const student = await userModel.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'student@drivingschool.com',
            username: 'student',
            password: '12345',
            phone: '5555555555',
            dateOfBirth: '2000-03-20',
            address: '789 Student Rd',
            city: 'Learning City',
            state: 'LC',
            zipCode: '99999',
            role: 'student'
        });
        console.log('✅ Student created:', student.email);

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📝 Test Credentials:');
        console.log('='.repeat(50));
        console.log('Admin:');
        console.log('  Username: admin');
        console.log('  Password: 12345');
        console.log('\nInstructor:');
        console.log('  Username: instructor');
        console.log('  Password: 12345');
        console.log('\nStudent:');
        console.log('  Username: student');
        console.log('  Password: 12345');
        console.log('='.repeat(50));

        process.exit(0);
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log('\n⚠️  Users already exist in database');
            console.log('Drop the users collection or use different credentials');
        } else {
            console.error('❌ Error seeding database:', error);
        }
        process.exit(1);
    }
}

seedDatabase();
