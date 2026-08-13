const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  searchItems,
} = require("../controllers/itemController");

const { protect } = require("../middleware/authMiddleware");

// ==========================================
// CREATE ITEM
// POST /api/items
// ==========================================
router.post(
  "/",
  protect,
  upload.single("image"),
  createItem
);

// ==========================================
// GET ALL ITEMS
// GET /api/items
// ==========================================
router.get("/", getItems);

// ==========================================
// SEARCH & FILTER ITEMS
// GET /api/items/search
// ==========================================
router.get("/search", searchItems);

// ==========================================
// GET SINGLE ITEM
// GET /api/items/:id
// ==========================================
router.get("/:id", getItemById);

// ==========================================
// UPDATE ITEM
// PUT /api/items/:id
// ==========================================
router.put(
  "/:id",
  protect,
  updateItem
);

// ==========================================
// DELETE ITEM
// DELETE /api/items/:id
// ==========================================
router.delete(
  "/:id",
  protect,
  deleteItem
);

module.exports = router;