const User = require("../models/User");
const Item = require("../models/Item");

// ==========================================
// GET ALL USERS
// ==========================================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// BLOCK USER
// ==========================================
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from blocking themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot block yourself",
      });
    }

    user.blocked = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        blocked: user.blocked,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UNBLOCK USER
// ==========================================
const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.blocked = false;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        blocked: user.blocked,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL ITEMS - ADMIN
// ==========================================
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE ANY ITEM - ADMIN
// ==========================================
const deleteAnyItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item deleted successfully by admin",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// EXPORT ALL CONTROLLERS
// ==========================================
module.exports = {
  getAllUsers,
  blockUser,
  unblockUser,
  getAllItems,
  deleteAnyItem,
};