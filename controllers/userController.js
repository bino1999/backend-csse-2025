// controllers/userController.js (Example Controller)
import User from '../models/userModel.js';

const userController = {
  getProfile: async (req, res) => {
    try {
      // req.user.userId is available from the JWT payload
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  getAllUsers: async (req, res) => {
    // Authorization is already handled by middleware
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  updateEmployeeData: async (req, res) => {
    // Authorization to update is already handled by middleware
    // You might add an additional check here to ensure an employee can only update their own record, 
    // unless the requester is an 'admin'.
    const { role, userId } = req.user;
    const targetId = req.params.id;

    if (role === 'employee' && userId.toString() !== targetId) {
      return res.status(403).json({ message: 'You can only update your own employee data.' });
    }

    // Actual update logic...
    res.json({ message: `Updated user ${targetId}` });
  }
};

export default userController;