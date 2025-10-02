const User = require('../models/User');
const Role = require('../models/Role');
const { validationResult } = require('express-validator');

// Create a new user
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { username, password, email, fullName, avatarUrl, role } = req.body;
    
    // Check if role exists
    const roleExists = await Role.findOne({ _id: role, isDelete: false });
    if (!roleExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const user = new User({
      username,
      password,
      email,
      fullName: fullName || "",
      avatarUrl: avatarUrl || "",
      role
    });

    await user.save();
    
    // Populate role information
    await user.populate('role');
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all users with search functionality
const getAllUsers = async (req, res) => {
  try {
    const { username, fullName, page = 1, limit = 10 } = req.query;
    
    // Build search query
    let query = { isDelete: false };
    
    if (username || fullName) {
      query.$or = [];
      if (username) {
        query.$or.push({ username: { $regex: username, $options: 'i' } });
      }
      if (fullName) {
        query.$or.push({ fullName: { $regex: fullName, $options: 'i' } });
      }
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const users = await User.find(query)
      .populate('role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findOne({ _id: id, isDelete: false }).populate('role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get user by username
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username, isDelete: false }).populate('role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { username, email, fullName, avatarUrl, status, role, loginCount } = req.body;
    
    // Check if role exists if provided
    if (role) {
      const roleExists = await Role.findOne({ _id: role, isDelete: false });
      if (!roleExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
      }
    }
    
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (fullName !== undefined) updateData.fullName = fullName;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (status !== undefined) updateData.status = status;
    if (role !== undefined) updateData.role = role;
    if (loginCount !== undefined) updateData.loginCount = loginCount;
    
    const user = await User.findOneAndUpdate(
      { _id: id, isDelete: false },
      updateData,
      { new: true, runValidators: true }
    ).populate('role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Soft delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findOneAndUpdate(
      { _id: id, isDelete: false },
      { isDelete: true },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Verify user (activate user if email and username are correct)
const verifyUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, username } = req.body;
    
    const user = await User.findOne({ 
      email, 
      username, 
      isDelete: false 
    }).populate('role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with the provided email and username'
      });
    }
    
    // Update status to true
    user.status = true;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User verified and activated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  verifyUser
};