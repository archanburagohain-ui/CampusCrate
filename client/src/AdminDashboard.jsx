import { useEffect, useState } from "react";

const API = "http://localhost:5000";

function AdminDashboard({ setPage }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // =========================
  // Get All Claims
  // =========================
  const fetchClaims = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/claims/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setClaims(data.claims);
      } else {
        alert(data.message || "Unable to load claims");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // =========================
  // Approve / Reject
  // =========================
  const updateClaim = async (claimId, status) => {
    try {
      const response = await fetch(
        `${API}/api/claims/${claimId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(
          status === "approved"
            ? "Claim approved successfully!"
            : "Claim rejected successfully!"
        );

        fetchClaims();
      } else {
        alert(data.message || "Failed to update claim");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    }
  };

  return (
    <main className="admin-page">

      {/* Header */}

      <div className="admin-header">

        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Manage lost and found item claims.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setPage("home")}
        >
          ← Back to Home
        </button>

      </div>


      {/* Loading */}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading claims...</p>
        </div>
      )}


      {/* Empty */}

      {!loading && claims.length === 0 && (
        <div className="empty admin-empty">

          <div className="empty-icon">
            📋
          </div>

          <h3>
            No claims found
          </h3>

          <p>
            There are currently no item claims.
          </p>

        </div>
      )}


      {/* Claims */}

      {!loading && claims.length > 0 && (

        <div className="claims-list">

          {claims.map((claim) => (

            <div
              className="claim-card"
              key={claim._id}
            >

              <div className="claim-card-header">

                <div>
                  <h2>
                    {claim.item?.title || "Item"}
                  </h2>

                  <span
                    className={`claim-status ${claim.status}`}
                  >
                    {claim.status}
                  </span>
                </div>

              </div>


              <div className="claim-details">

                <p>
                  <strong>Claimant:</strong>{" "}
                  {claim.claimant?.name ||
                    "Unknown"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {claim.claimant?.email ||
                    "Unknown"}
                </p>

                <p>
                  <strong>Category:</strong>{" "}
                  {claim.item?.category ||
                    "Unknown"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {claim.item?.location ||
                    "Unknown"}
                </p>

                <p>
                  <strong>Message:</strong>{" "}
                  {claim.message}
                </p>

              </div>


              {/* Actions */}

              {claim.status === "pending" && (

                <div className="claim-actions">

                  <button
                    className="approve-btn"
                    onClick={() =>
                      updateClaim(
                        claim._id,
                        "approved"
                      )
                    }
                  >
                    ✓ Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() =>
                      updateClaim(
                        claim._id,
                        "rejected"
                      )
                    }
                  >
                    ✕ Reject
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </main>
  );
}

export default AdminDashboard;