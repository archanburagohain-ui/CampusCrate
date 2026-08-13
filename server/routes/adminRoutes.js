const express = require("express");

const router = express.Router();

// Controllers
const {
  getAllUsers,
  blockUser,
  unblockUser,
  getAllItems,
  deleteAnyItem,
} = require("../controllers/adminController");

// Middleware
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// ==========================================
// USER MANAGEMENT
// ==========================================

// Get all users
// GET /api/admin/users
router.get(
  "/users",
  protect,
  admin,
  getAllUsers
);

// Block user
// PUT /api/admin/users/:id/block
router.put(
  "/users/:id/block",
  protect,
  admin,
  blockUser
);

// Unblock user
// PUT /api/admin/users/:id/unblock
router.put(
  "/users/:id/unblock",
  protect,
  admin,
  unblockUser
);

// ==========================================
// ITEM MANAGEMENT
// ==========================================

// Get all items
// GET /api/admin/items
router.get(
  "/items",
  protect,
  admin,
  getAllItems
);

// Delete any item
// DELETE /api/admin/items/:id
router.delete(
  "/items/:id",
  protect,
  admin,
  deleteAnyItem
);

module.exports = router;