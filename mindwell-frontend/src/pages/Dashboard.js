import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [newEntry, setNewEntry] = useState("");
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [darkMode, setDarkMode] = useState(false);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔐 Token Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // 📥 Fetch Journals
  const fetchJournals = async (currentPage = page) => {
    try {
      setLoading(true);
      const res = await API.get(
        `/journals?page=${currentPage}&limit=${limit}`
      );
      setJournals(res.data.data || []);
      setPage(currentPage);
    } catch (err) {
      console.error(err);
      setError("Failed to load journals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals(page);
  }, [page]);

  // ➕ Add / Update
  const addJournal = async () => {
    if (!newEntry.trim()) return;

    try {
      if (editingId) {
        await API.put(`/journals/${editingId}`, {
          content: newEntry,
        });
        setEditingId(null);
      } else {
        await API.post("/journals", {
          content: newEntry,
        });
      }

      setNewEntry("");
      fetchJournals();
    } catch (err) {
      console.error(err);
      setError("Operation failed");
    }
  };

  // 🗑 Delete
  const deleteJournal = async (id) => {
    try {
      await API.delete(`/journals/${id}`);
      setJournals((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  // 🔍 Search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchJournals();
      return;
    }

    try {
      const res = await API.get(
        `/journals/search?keyword=${searchTerm}`
      );
      setJournals(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Search failed");
    }
  };

  // ✏ Start Edit
  const startEdit = (journal) => {
    setNewEntry(journal.content);
    setEditingId(journal.id);
  };

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: darkMode ? "#1e1e1e" : "#f4f4f4",
        color: darkMode ? "white" : "black",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>MindWell Dashboard</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{ padding: "8px 12px" }}
          >
            🌙 Dark
          </button>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "8px 12px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* TOP BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <button
          style={{
            backgroundColor: "purple",
            color: "white",
            padding: "10px 15px",
            border: "none",
          }}
        >
          Open Breathing Assistant 🧘
        </button>

        <button
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
          }}
        >
          Analytics 📊
        </button>
      </div>

      {/* SEARCH */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search journals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />
        <button
          onClick={handleSearch}
          style={{ marginLeft: "10px", padding: "8px 12px" }}
        >
          Search
        </button>
      </div>

      {/* TEXTAREA */}
      <textarea
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        placeholder="Write your journal..."
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <button
        onClick={addJournal}
        style={{ padding: "8px 15px" }}
      >
        {editingId ? "Update Journal" : "Add Journal"}
      </button>

      <hr style={{ margin: "20px 0" }} />

      <h2>My Journals</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {journals.map((journal) => (
        <div
          key={journal.id}
          style={{
            backgroundColor: darkMode ? "#333" : "white",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        >
          <p>{journal.content}</p>
          <small>
            {new Date(journal.createdAt).toLocaleString()}
          </small>

          <br />

          <button
            onClick={() => deleteJournal(journal.id)}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "5px 10px",
              border: "none",
              marginTop: "8px",
            }}
          >
            Delete
          </button>

          <button
            onClick={() => startEdit(journal)}
            style={{
              backgroundColor: "orange",
              color: "white",
              padding: "5px 10px",
              border: "none",
              marginTop: "8px",
              marginLeft: "5px",
            }}
          >
            Edit ✏
          </button>
        </div>
      ))}

      {/* PAGINATION */}
      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => fetchJournals(page - 1)}
          style={{ marginRight: "10px" }}
        >
          ⬅ Previous
        </button>

        <span>Page {page}</span>

        <button
          disabled={journals.length < limit}
          onClick={() => fetchJournals(page + 1)}
          style={{ marginLeft: "10px" }}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
