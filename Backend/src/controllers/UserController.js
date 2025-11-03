class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getAll(req, res) {
    try {
      console.log("🔍 Fetching all users");
      const users = this.userService.getAllUsers();
      console.log("✅ Fetched all users successfully");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  getById(req, res) {
    try {
      const id = req.params.id;
      const user = this.userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      // Handle specific "not found" errors
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  create(req, res) {
    try {
      const newUser = this.userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = UserController;