const Claim = require("../models/Claim");
const Item = require("../models/Item");

// =========================
// Create Claim
// =========================
const createClaim = async (req, res) => {
  try {
    const claim = await Claim.create({
      item: req.body.item,
      message: req.body.message,
      claimant: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Claim submitted successfully",
      claim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// Get My Claims
// =========================
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      claimant: req.user._id,
    })
      .populate("item")
      .populate("claimant", "name email");

    res.json({
      success: true,
      claims,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// Get All Claims - Admin
// =========================
const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("item")
      .populate("claimant", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      claims,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================
// Update Claim Status - Admin
// =========================
const updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected",
      });
    }

    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    claim.status = status;

    await claim.save();

    // If claim is approved, mark the item as claimed
    if (status === "approved") {
      await Item.findByIdAndUpdate(
        claim.item,
        {
          status: "claimed",
        }
      );
    }

    res.json({
      success: true,
      message: `Claim ${status} successfully`,
      claim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createClaim,
  getMyClaims,
  getAllClaims,
  updateClaimStatus,
};