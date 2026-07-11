import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import "../../styles-user/myclaimed.css";

const ITEMS_PER_PAGE = 8;

const ClaimedItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all"); 
    const [dateFilter, setDateFilter] = useState("all"); 
    const [currentPage, setCurrentPage] = useState(1);

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchClaimedItems = async () => {
        if (!user?._id) return;
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/claim-request/myclaimed?claimant=${user._id}`
            );
            const data = await response.json();
            console.log(data)
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaimedItems();
    }, []);

    const claimedDate = (item) => item.claimedDate || item.updatedAt;
    const itemDate = (item) => (item.type === "found" ? item.dateFound : item.dateLost);

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const matchesDateFilter = (item) => {
        const claimed = claimedDate(item);
        if (!claimed) return dateFilter === "all";

        const claimedAt = new Date(claimed);
        const now = new Date();

        if (dateFilter === "recent") {
            const sevenDaysAgo = new Date(now);
            sevenDaysAgo.setDate(now.getDate() - 7);
            return claimedAt >= sevenDaysAgo;
        }

        if (dateFilter === "month") {
            return (
                claimedAt.getMonth() === now.getMonth() &&
                claimedAt.getFullYear() === now.getFullYear()
            );
        }

        if (dateFilter === "year") {
            return claimedAt.getFullYear() === now.getFullYear();
        }

        return true; // "all"
    };

    const filteredItems = items
        .filter((item) => (typeFilter === "all" ? true : item.type === typeFilter))
        .filter(matchesDateFilter)
        .filter((item) =>
            item.itemName?.toLowerCase().includes(search.toLowerCase())
        );

    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [filteredItems.length, currentPage]);

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

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
        <div className="myclaimed-page">
            <div className="myclaimed-header">
                <h1>Claimed Items</h1>
                <p>Items you've successfully claimed will appear here.</p>
            </div>

            <div className="myclaimed-toolbar">
                <div className="myclaimed-tabs">
                    <button
                        className={`myclaimed-tab-btn ${typeFilter === "all" ? "active" : ""}`}
                        onClick={() => {
                            setTypeFilter("all");
                            setCurrentPage(1);
                        }}
                    >
                        All Items
                    </button>
                    <button
                        className={`myclaimed-tab-btn ${typeFilter === "lost" ? "active" : ""}`}
                        onClick={() => {
                            setTypeFilter("lost");
                            setCurrentPage(1);
                        }}
                    >
                        Lost Items
                    </button>
                    <button
                        className={`myclaimed-tab-btn ${typeFilter === "found" ? "active" : ""}`}
                        onClick={() => {
                            setTypeFilter("found");
                            setCurrentPage(1);
                        }}
                    >
                        Found Items
                    </button>
                </div>

                <div className="myclaimed-search-box">
                    <CiSearch />
                    <input
                        type="text"
                        placeholder="Search claimed items..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="myclaimed-date-filters">
                <button
                    className={`myclaimed-date-btn ${dateFilter === "all" ? "active" : ""}`}
                    onClick={() => {
                        setDateFilter("all");
                        setCurrentPage(1);
                    }}
                >
                    All
                </button>
                <button
                    className={`myclaimed-date-btn ${dateFilter === "recent" ? "active" : ""}`}
                    onClick={() => {
                        setDateFilter("recent");
                        setCurrentPage(1);
                    }}
                >
                    Recently Claimed
                </button>
                <button
                    className={`myclaimed-date-btn ${dateFilter === "month" ? "active" : ""}`}
                    onClick={() => {
                        setDateFilter("month");
                        setCurrentPage(1);
                    }}
                >
                    This Month
                </button>
                <button
                    className={`myclaimed-date-btn ${dateFilter === "year" ? "active" : ""}`}
                    onClick={() => {
                        setDateFilter("year");
                        setCurrentPage(1);
                    }}
                >
                    This Year
                </button>
            </div>

            <div className="myclaimed-table-wrap">
                <table className="myclaimed-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Claimed Date</th>
                            <th style={{ textAlign: "center" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="myclaimed-empty-cell">Loading your claimed items…</td>
                            </tr>
                        ) : paginatedItems.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="myclaimed-empty-cell">
                                    No claimed items found.
                                </td>
                            </tr>
                        ) : (
                            paginatedItems.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <div className="myclaimed-item-cell">
                                            {item.image ? (
                                                <img
                                                    src={`http://localhost:5000/${item.image}`}
                                                    alt={item.itemName}
                                                    className="myclaimed-item-thumb"
                                                />
                                            ) : (
                                                <div className="myclaimed-item-thumb myclaimed-item-thumb-empty">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                                        <circle cx="9" cy="9" r="2" />
                                                        <path d="M21 15l-5-5L5 21" />
                                                    </svg>
                                                </div>
                                            )}

                                            <div className="myclaimed-item-info">
                                                <span className="myclaimed-item-name">{item.itemName}</span>
                                                <div className="myclaimed-item-meta">
                                                    <span className={`myclaimed-type-pill ${item.type}`}>
                                                        {item.type === "found" ? "Found" : "Lost"}
                                                    </span>
                                                    <span className="myclaimed-item-location">{item.location}</span>
                                                </div>
                                                <span className="myclaimed-item-date">
                                                    {item.type === "found" ? "Found" : "Lost"} on {formatDate(itemDate(item))}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="myclaimed-date-cell">
                                        {formatDate(claimedDate(item))}
                                    </td>

                                    <td style={{ textAlign: "center" }}>
                                        <div className="myclaimed-status-badge">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                <polyline points="22 4 12 14.01 9 11.01" />
                                            </svg>
                                            <div className="myclaimed-status-text">
                                                <span className="myclaimed-status-title">Claimed</span>
                                                <span className="myclaimed-status-subtitle">Successfully returned</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {filteredItems.length > 0 && (
                    <div className="myclaimed-pagination-bar">
                        <span className="myclaimed-pagination-info">
                            Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length}
                        </span>

                        <div className="myclaimed-pagination-controls">
                            <button
                                className="myclaimed-pagination-btn"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>

                            {getPageNumbers().map((page, idx) =>
                                page === "..." ? (
                                    <span key={`ellipsis-${idx}`} className="myclaimed-pagination-ellipsis">…</span>
                                ) : (
                                    <button
                                        key={page}
                                        className={`myclaimed-pagination-page ${page === currentPage ? "active" : ""}`}
                                        onClick={() => goToPage(page)}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            <button
                                className="myclaimed-pagination-btn"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClaimedItems;