const Item = require("../models/Item");

// ==========================================
// CREATE ITEM
// ==========================================
const createItem = async (req, res) => {
  try {
    const item = await Item.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      location: req.body.location,
      date: req.body.date,

      // Image is optional for now
      image: req.file ? `/uploads/${req.file.filename}` : "",

      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Item posted successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL ITEMS
// ==========================================
const getItems = async (req, res) => {
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
// GET SINGLE ITEM
// ==========================================
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("postedBy", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE ITEM
// ==========================================
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Only the owner can update the item
    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own items",
      });
    }

    // Update only provided fields
    if (req.body.title) {
      item.title = req.body.title;
    }

    if (req.body.description) {
      item.description = req.body.description;
    }

    if (req.body.category) {
      item.category = req.body.category;
    }

    if (req.body.type) {
      item.type = req.body.type;
    }

    if (req.body.location) {
      item.location = req.body.location;
    }

    if (req.body.date) {
      item.date = req.body.date;
    }

    if (req.body.status) {
      item.status = req.body.status;
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE ITEM
// ==========================================
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Only the owner can delete the item
    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own items",
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// SEARCH & FILTER ITEMS
// ==========================================
const searchItems = async (req, res) => {
  try {
    const {
      search,
      type,
      category,
      location,
      status,
    } = req.query;

    const filter = {};

    // Search title and description
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by type
    // lost / found
    if (type) {
      filter.type = type;
    }

    // Filter by category
    if (category) {
      filter.category = {
        $regex: category,
        $options: "i",
      };
    }

    // Filter by location
    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Filter by status
    // open / claimed / returned
    if (status) {
      filter.status = status;
    }

    const items = await Item.find(filter)
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
// EXPORT ALL FUNCTIONS
// ==========================================
module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  searchItems,
};