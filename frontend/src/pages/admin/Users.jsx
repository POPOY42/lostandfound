import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import "../../styles/users.css";

const USERS_PER_PAGE = 8;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://lostandfound-8afg.onrender.com/api/users");
        const data = await res.json();

        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filtered = users.filter((user) =>
    `${user.name} ${user.surname}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / USERS_PER_PAGE));

  // Keep currentPage valid whenever the filtered list shrinks
  // (e.g. typing a search that narrows results below the current page)
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filtered.slice(indexOfFirstUser, indexOfLastUser);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Builds a compact page list like: 1 2 3 ... 8  or  1 ... 4 5 6 ... 12
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const range = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    let prev = 0;
    for (const i of range) {
      if (prev && i - prev > 1) pages.push("...");
      pages.push(i);
      prev = i;
    }
    return pages;
  };

  return (
    <div className="users-wrapper">
      <div className="users-header">
        <h1>Users</h1>
        <small>Manage and view all registered users</small>
      </div>

      <div className="users-toolbar">
        <div className="search-box">
          <CiSearch />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="users-table-wrap">
        {loading ? (
          <p className="table-state">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="table-state">No users found.</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Date Joined</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                        <div className="name-cell">
                            <div className="user-info">
                                <span>
                                    {user.name.charAt(0).toUpperCase() + user.name.slice(1)}{" "}
                                    {user.surname.charAt(0).toUpperCase() + user.surname.slice(1)}
                                </span>
                            </div>
                        </div>
                    </td>

                    <td>
                      <span className="student-id">
                        {user.contactNumber}
                      </span>
                    </td>

                    <td className="date-cell">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="users-pagination-bar">
              <span className="users-pagination-info">
                Showing {indexOfFirstUser + 1}–{Math.min(indexOfLastUser, filtered.length)} of {filtered.length}
              </span>

              <div className="users-pagination-controls">
                <button
                  className="users-pagination-btn"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="users-pagination-ellipsis">…</span>
                  ) : (
                    <button
                      key={page}
                      className={`users-pagination-page ${page === currentPage ? "active" : ""}`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="users-pagination-btn"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;