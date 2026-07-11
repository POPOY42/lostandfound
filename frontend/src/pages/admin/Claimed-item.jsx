import { useState, useEffect } from "react";
import "../../styles/found-claim.css";

const ITEMS_PER_PAGE = 8;

const ClaimedItems = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchClaimedItems = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/item/claimed");
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchClaimedItems();
    }, []);

    // Keep currentPage valid whenever the item list changes size
    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [items, currentPage]);

    const openDetails = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
        <div className="claimed-page">
            <div className="claimed-header">
                <h1>Claimed Items</h1>
                <p>All items that have been claimed will appear here.</p>
            </div>

            <div className="claimed-table-wrap">
                <table className="claimed-table">
                    <thead>
                        <tr>
                            <th>Picture</th>
                            <th>Claimed By</th>
                            <th>Reported By</th>
                            <th>Claimed Date</th>
                            <th style={{ textAlign: "right" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedItems.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    {item.image ? (
                                        <img
                                            src={`http://localhost:5000/${item.image}`}
                                            alt={item.itemName}
                                            className="item-thumb"
                                        />
                                    ) : (
                                        <div className="item-thumb item-thumb-empty">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <circle cx="9" cy="9" r="2" />
                                                <path d="M21 15l-5-5L5 21" />
                                            </svg>
                                        </div>
                                    )}
                                </td>
                                <td className="claimed-by">
                                    {item.claimedBy
                                        ? `${item.claimedBy.name} ${item.claimedBy.surname}`
                                        : "—"}
                                </td>
                                <td className="reported-by">
                                    {item.reportedBy
                                        ? `${item.reportedBy.name} ${item.reportedBy.surname}`
                                        : "—"}
                                </td>
                                <td className="claimed-date">
                                    {formatDate(item.claimedDate || item.updatedAt)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button className="view-details-btn" onClick={() => openDetails(item)}>
                                        View details
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {items.length === 0 && (
                            <tr>
                                <td colSpan={5} className="empty-cell">
                                    No claimed items yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {items.length > 0 && (
                    <div className="claimed-pagination-bar">
                        <span className="claimed-pagination-info">
                            Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, items.length)} of {items.length}
                        </span>

                        <div className="claimed-pagination-controls">
                            <button
                                className="claimed-pagination-btn"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>

                            {getPageNumbers().map((page, idx) =>
                                page === "..." ? (
                                    <span key={`ellipsis-${idx}`} className="claimed-pagination-ellipsis">…</span>
                                ) : (
                                    <button
                                        key={page}
                                        className={`claimed-pagination-page ${page === currentPage ? "active" : ""}`}
                                        onClick={() => goToPage(page)}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            <button
                                className="claimed-pagination-btn"
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

            {isModalOpen && selectedItem && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Claimed Item Details</h2>
                            <button className="modal-close-btn" onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-section">
                                <h3>Item</h3>
                                <p className="modal-field">
                                    <span className="label">Name: </span>
                                    <span className="value">{selectedItem.itemName || "—"}</span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Category: </span>
                                    <span className="value">{selectedItem.category || "—"}</span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Location: </span>
                                    <span className="value">{selectedItem.location || "—"}</span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Description: </span>
                                    <span className="value">{selectedItem.description || "—"}</span>
                                </p>
                                {selectedItem.image && (
                                    <img
                                        src={`http://localhost:5000/${selectedItem.image}`}
                                        alt={selectedItem.itemName}
                                        className="modal-item-image"
                                    />
                                )}
                            </div>

                            <div className="modal-section">
                                <h3>Reported By</h3>
                                <p className="modal-field">
                                    <span className="label">Name: </span>
                                    <span className="value">
                                        {selectedItem.reportedBy
                                            ? `${selectedItem.reportedBy.name} ${selectedItem.reportedBy.surname}`
                                            : "—"}
                                    </span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Username: </span>
                                    <span className="value">{selectedItem.reportedBy?.username || "—"}</span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Contact Number: </span>
                                    <span className="value">{selectedItem.reportedBy?.contactNumber || "—"}</span>
                                </p>
                            </div>

                            <div className="modal-section modal-section-full">
                                <h3>Claimed By</h3>
                                <p className="modal-field">
                                    <span className="label">Name: </span>
                                    <span className="value">
                                        {selectedItem.claimedBy
                                            ? `${selectedItem.claimedBy.name} ${selectedItem.claimedBy.surname}`
                                            : "—"}
                                    </span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Username: </span>
                                    <span className="value">{selectedItem.claimedBy?.username || "—"}</span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Contact Number: </span>
                                    <span className="value">{selectedItem.claimedBy?.contactNumber || "—"}</span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Claimed Date: </span>
                                    <span className="value">
                                        {formatDate(selectedItem.claimedDate || selectedItem.updatedAt)}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClaimedItems;