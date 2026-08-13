import { useState } from "react";

const API = "http://localhost:5000";

function ClaimItem({ item, onClose }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClaim = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!message.trim()) {
      alert("Please explain why this item belongs to you.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/claims`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            item: item._id,
            message: message,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Claim submitted successfully!");
        setMessage("");
        onClose();
      } else {
        alert(data.message || "Failed to submit claim.");
      }
    } catch (error) {
      console.error("Claim error:", error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="claim-overlay">

      <div className="claim-modal">

        <button
          className="close-btn"
          onClick={onClose}
        >
          ×
        </button>

        <h2>Claim Item</h2>

        <p className="claim-item-title">
          {item.title}
        </p>

        <p className="claim-help">
          Explain why you believe this item belongs to you.
        </p>

        <form onSubmit={handleClaim}>

          <textarea
            placeholder="Example: This wallet belongs to me. I can identify its contents."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button
            type="submit"
            className="primary-btn full-btn"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Claim"}
          </button>

        </form>

        <button
          className="back-btn"
          onClick={onClose}
        >
          Cancel
        </button>

      </div>

    </div>
  );
}

export default ClaimItem;