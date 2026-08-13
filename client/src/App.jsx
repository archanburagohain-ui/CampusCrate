import { useEffect, useState } from "react";
import "./App.css";

import PostItem from "./PostItem";
import ClaimItem from "./ClaimItem";
import AdminDashboard from "./AdminDashboard";

const API = "http://localhost:5000";

function App() {
  const [page, setPage] = useState("home");

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [search, setSearch] = useState("");

  // ==========================================
  // Load Items
  // ==========================================
  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API}/api/items`);

      const data = await response.json();

      if (data.success) {
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Load items when home opens
  // ==========================================
  useEffect(() => {
    if (page === "home") {
      fetchItems();
    }
  }, [page]);

  // ==========================================
  // Login Success
  // ==========================================
  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    setPage("home");
  };

  // ==========================================
  // Logout
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setPage("home");
  };

  // ==========================================
  // Search Items
  // ==========================================
  const filteredItems = items.filter((item) => {
    const text = search.toLowerCase();

    return (
      item.title?.toLowerCase().includes(text) ||
      item.description?.toLowerCase().includes(text) ||
      item.category?.toLowerCase().includes(text) ||
      item.location?.toLowerCase().includes(text)
    );
  });

  // ==========================================
  // HOME PAGE
  // ==========================================
  const Home = () => {
    return (
      <main className="home-page">

        {/* Hero */}

        <section className="hero">

          <div className="hero-content">

            <span className="hero-badge">
              🎓 College Lost & Found
            </span>

            <h1>
              Find What You Lost.
              <br />
              <span>Return What You Found.</span>
            </h1>

            <p>
              CampusCrate makes it easy for students
              to report, search and claim lost items
              around campus.
            </p>

            <div className="hero-buttons">

              {user ? (
                <button
                  className="primary-btn"
                  onClick={() => setPage("post")}
                >
                  + Post an Item
                </button>
              ) : (
                <button
                  className="primary-btn"
                  onClick={() => setPage("login")}
                >
                  Get Started
                </button>
              )}

              <button
                className="secondary-btn"
                onClick={() =>
                  document
                    .getElementById("items")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Browse Items
              </button>

            </div>

          </div>

        </section>


        {/* Items */}

        <section
          className="items-section"
          id="items"
        >

          <div className="section-header">

            <div>
              <h2>Lost & Found Items</h2>

              <p>
                Browse items reported by students.
              </p>
            </div>

            {user && (
              <button
                className="primary-btn small"
                onClick={() => setPage("post")}
              >
                + Post Item
              </button>
            )}

          </div>


          {/* Search */}

          <div className="search-box">

            <span>🔍</span>

            <input
              type="text"
              placeholder="Search by title, category or location..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* Loading */}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>

              <p>
                Loading items...
              </p>
            </div>
          )}


          {/* Empty */}

          {!loading &&
            filteredItems.length === 0 && (
              <div className="empty">

                <div className="empty-icon">
                  📦
                </div>

                <h3>
                  No items found
                </h3>

                <p>
                  Try another search or post a
                  new lost/found item.
                </p>

              </div>
            )}


          {/* Item Cards */}

          {!loading &&
            filteredItems.length > 0 && (
              <div className="items-grid">

                {filteredItems.map((item) => (

                  <div
                    className="item-card"
                    key={item._id}
                  >

                    {/* Image */}

                    <div className="item-image">

                      {item.image ? (
                        <img
                          src={`${API}${item.image}`}
                          alt={item.title}
                        />
                      ) : (
                        <div className="no-image">
                          📦
                        </div>
                      )}

                      <span
                        className={`type-badge ${item.type}`}
                      >
                        {item.type}
                      </span>

                    </div>


                    {/* Content */}

                    <div className="item-content">

                      <h3>
                        {item.title}
                      </h3>

                      <p className="description">
                        {item.description}
                      </p>

                      <div className="item-info">

                        <span>
                          📍 {item.location}
                        </span>

                        <span>
                          🏷️ {item.category}
                        </span>

                      </div>


                      <div className="item-footer">

                        <span
                          className={`status ${item.status}`}
                        >
                          {item.status}
                        </span>

                        {user &&
                          item.status === "open" && (
                            <button
                              className="claim-btn"
                              onClick={() => {
                                setSelectedItem(
                                  item
                                );
                                setPage("claim");
                              }}
                            >
                              Claim
                            </button>
                          )}

                      </div>

                    </div>

                  </div>

                ))}

              </div>
            )}

        </section>

      </main>
    );
  };


  // ==========================================
  // LOGIN PAGE
  // ==========================================
  const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submit = async (e) => {
      e.preventDefault();

      setError("");

      try {
        const response = await fetch(
          `${API}/api/auth/login`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        const data = await response.json();

        if (!data.success) {
          setError(data.message);
          return;
        }

        handleLogin(data);

      } catch (error) {
        setError(
          "Unable to connect to server."
        );
      }
    };

    return (
      <main className="auth-page">

        <div className="auth-card">

          <div className="auth-icon">
            🎓
          </div>

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to your CampusCrate account
          </p>


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          <form onSubmit={submit}>

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />


            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />


            <button
              className="primary-btn full"
              type="submit"
            >
              Login
            </button>

          </form>


          <p className="auth-switch">
            Don't have an account?{" "}

            <button
              onClick={() =>
                setPage("register")
              }
            >
              Register
            </button>
          </p>


          <button
            className="back-link"
            onClick={() => setPage("home")}
          >
            ← Back to Home
          </button>

        </div>

      </main>
    );
  };


  // ==========================================
  // REGISTER PAGE
  // ==========================================
  const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submit = async (e) => {
      e.preventDefault();

      setError("");

      try {
        const response = await fetch(
          `${API}/api/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );

        const data = await response.json();

        if (!data.success) {
          setError(data.message);
          return;
        }

        handleLogin(data);

      } catch (error) {
        setError(
          "Unable to connect to server."
        );
      }
    };

    return (
      <main className="auth-page">

        <div className="auth-card">

          <div className="auth-icon">
            📦
          </div>

          <h1>
            Create Account
          </h1>

          <p>
            Join your CampusCrate community
          </p>


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          <form onSubmit={submit}>

            <label>
              Name
            </label>

            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />


            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />


            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              minLength="6"
              required
            />


            <button
              className="primary-btn full"
              type="submit"
            >
              Create Account
            </button>

          </form>


          <p className="auth-switch">
            Already have an account?{" "}

            <button
              onClick={() =>
                setPage("login")
              }
            >
              Login
            </button>
          </p>


          <button
            className="back-link"
            onClick={() => setPage("home")}
          >
            ← Back to Home
          </button>

        </div>

      </main>
    );
  };


  // ==========================================
  // NAVBAR
  // ==========================================
  return (
    <div className="app">

      <header className="navbar">

        <div
          className="logo"
          onClick={() => setPage("home")}
        >
          <div className="logo-icon">
            📦
          </div>

          <div>
            <strong>
              CampusCrate
            </strong>

            <small>
              Lost & Found
            </small>
          </div>
        </div>


        <nav>

          <button
            className={
              page === "home"
                ? "nav-active"
                : ""
            }
            onClick={() => setPage("home")}
          >
            Home
          </button>


          {user && (
            <button
              className={
                page === "post"
                  ? "nav-active"
                  : ""
              }
              onClick={() => setPage("post")}
            >
              Post Item
            </button>
          )}


          {user?.role === "admin" && (
            <button
              className={
                page === "admin"
                  ? "nav-active admin-nav"
                  : "admin-nav"
              }
              onClick={() => setPage("admin")}
            >
              Admin
            </button>
          )}


          {user ? (
            <div className="user-area">

              <span className="user-name">
                Hi, {user.name}
              </span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          ) : (
            <button
              className="login-nav"
              onClick={() => setPage("login")}
            >
              Login
            </button>
          )}

        </nav>

      </header>


      {/* ==============================
          PAGE CONTENT
      ============================== */}

      {page === "home" && <Home />}


      {page === "login" && <Login />}


      {page === "register" && (
        <Register />
      )}


      {page === "post" && user && (
        <PostItem
          setPage={setPage}
        />
      )}


      {page === "claim" &&
        user &&
        selectedItem && (
          <ClaimItem
            item={selectedItem}
            setPage={setPage}
          />
        )}


      {page === "admin" &&
        user?.role === "admin" && (
          <AdminDashboard
            setPage={setPage}
          />
        )}


      {/* Unauthorized Admin */}

      {page === "admin" &&
        user?.role !== "admin" && (
          <main className="auth-page">

            <div className="auth-card">

              <div className="auth-icon">
                🔒
              </div>

              <h1>
                Access Denied
              </h1>

              <p>
                You need administrator
                privileges to access this page.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  setPage("home")
                }
              >
                Back to Home
              </button>

            </div>

          </main>
        )}

    </div>
  );
}

export default App;