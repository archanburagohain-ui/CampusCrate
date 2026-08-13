import { useState } from "react";

const API = "https://campuscrate-backend-426h.onrender.com";

function PostItem({ setPage }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("lost");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      setPage("login");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("location", location);
      formData.append("date", date);

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        `${API}/api/items`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Item posted successfully!");

        setTitle("");
        setDescription("");
        setCategory("");
        setType("lost");
        setLocation("");
        setDate("");
        setImage(null);

        setPage("home");
      } else {
        alert(data.message || "Failed to post item.");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">

      <div className="form-card post-card">

        <h2>Post Lost / Found Item</h2>

        <p className="form-subtitle">
          Help your campus community find lost belongings.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Item Title</label>

          <input
            type="text"
            placeholder="e.g. Black Wallet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description</label>

          <textarea
            placeholder="Describe the item..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Category</label>

          <input
            type="text"
            placeholder="e.g. Wallet, Phone, ID Card"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <label>Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <label>Location</label>

          <input
            type="text"
            placeholder="e.g. CIT Library"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>Image (Optional)</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button
            type="submit"
            className="primary-btn full-btn"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Item"}
          </button>

        </form>

        <button
          className="back-btn"
          onClick={() => setPage("home")}
        >
          ← Back to Home
        </button>

      </div>

    </main>
  );
}

export default PostItem;