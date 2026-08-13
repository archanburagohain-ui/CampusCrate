const express = require("express");

const router = express.Router();

const {
  createClaim,
  getMyClaims,
  getAllClaims,
  updateClaimStatus,
} = require("../controllers/claimController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// Student: Submit claim
router.post(
  "/",
  protect,
  createClaim
);


// Student: View own claims
router.get(
  "/my",
  protect,
  getMyClaims
);


// Admin: View all claims
router.get(
  "/all",
  protect,
  adminOnly,
  getAllClaims
);


// Admin: Approve / Reject claim
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateClaimStatus
);


module.exports = router;