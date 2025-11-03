// Models live under src/models
const User = require('../src/models/User');

// This is a mock database for the example.
// In a real app, this would be in a Repository and talk to a DB.
const mockUsers = [
  new User(1, 'Alice', 'alice@example.com'),
  new User(2, 'Bob', 'bob@example.com'),
];

class UserService {
  getAllUsers() {
    // Business logic (e.g., filtering, mapping) would go here.
    return mockUsers;
  }

  getUserById(id) {
    const user = mockUsers.find((u) => u.id === parseInt(id));
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  createUser(userData) {
    const newUser = new User(
      mockUsers.length + 1,
      userData.name,
      userData.email
    );
    mockUsers.push(newUser);
    return newUser;
  }
}

module.exports = UserService;