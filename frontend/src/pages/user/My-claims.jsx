

import { useState, useEffect } from "react";
import "../../styles-user/myclaimed.css";

const statusInfo = (status) => {
    if (status === "approved") return { label: "Approved", className: "my-status-pill approved" };
    if (status === "rejected") return { label: "Rejected", className: "my-status-pill rejected" };
    return { label: "Pending", className: "my-status-pill pending" };
};

const MyClaims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); 

    const [selectedClaim, setSelectedClaim] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const getItem = (claim) => claim.item ?? claim.itemId ?? null;
    const getProof = (claim) => claim.proof ?? claim.ownershipDetails ?? "";

    const fetchMyClaims = async () => {
        if (!user?._id) return;
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/claim-request/my?claimant=${user._id}`)
            const data = await response.json();
            setClaims(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyClaims();
    }, []);

    const filteredClaims = claims.filter((claim) => {
        if (filter === "all") return true;
        return claim.status === filter;
    });

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const itemDate = (item) => (item?.type === "found" ? item?.dateFound : item?.dateLost);

    const openDetails = (claim) => {
        setSelectedClaim(claim);
        setIsDetailsOpen(true);
    };

    const closeDetails = () => {
        setIsDetailsOpen(false);
        setSelectedClaim(null);
    };

    return (
        <div className="my-items-page">
            <div className="my-items-header">
                <h1>My Claims</h1>
                <p>Every claim you've submitted, and how it's going.</p>
            </div>

            <div className="my-items-tabs">
                <button
                    className={`my-tab-btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                >
                    All Claims
                </button>
                <button
                    className={`my-tab-btn ${filter === "pending" ? "active" : ""}`}
                    onClick={() => setFilter("pending")}
                >
                    Pending
                </button>
                <button
                    className={`my-tab-btn ${filter === "approved" ? "active" : ""}`}
                    onClick={() => setFilter("approved")}
                >
                    Approved
                </button>
                <button
                    className={`my-tab-btn ${filter === "rejected" ? "active" : ""}`}
                    onClick={() => setFilter("rejected")}
                >
                    Rejected
                </button>
            </div>

            <div className="my-items-table-wrap">
                <table className="my-items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="my-empty-cell">Loading your claims…</td>
                            </tr>
                        ) : filteredClaims.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="my-empty-cell">
                                    You haven't submitted any {filter === "all" ? "" : filter + " "}claims yet.
                                </td>
                            </tr>
                        ) : (
                            filteredClaims.map((claim) => {
                                const item = getItem(claim);
                                const status = statusInfo(claim.status);
                                return (
                                    <tr key={claim._id}>
                                        <td>
                                            <div className="my-item-cell">
                                                {item?.image ? (
                                                    <img
                                                        src={`http://localhost:5000/${item.image}`}
                                                        alt={item.itemName}
                                                        className="my-item-thumb"
                                                    />
                                                ) : (
                                                    <div className="my-item-thumb my-item-thumb-empty">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                                            <circle cx="9" cy="9" r="2" />
                                                            <path d="M21 15l-5-5L5 21" />
                                                        </svg>
                                                    </div>
                                                )}

                                                <div className="my-item-info">
                                                    <span className="my-item-name">
                                                        {item?.itemName || "Item no longer available"}
                                                    </span>
                                                    <div className="my-item-meta">
                                                        {item?.type && (
                                                            <span className={`my-type-pill ${item.type}`}>
                                                                {item.type === "found" ? "Found" : "Lost"}
                                                            </span>
                                                        )}
                                                        {item?.location && (
                                                            <span className="my-item-location">{item.location}</span>
                                                        )}
                                                    </div>
                                                    <span className="my-item-date">
                                                        Claimed on {formatDate(claim.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <span className={status.className}>{status.label}</span>
                                        </td>

                                        <td style={{ textAlign: "right" }}>
                                            <button
                                                className="my-dots-btn"
                                                onClick={() => openDetails(claim)}
                                                aria-label="View claim details"
                                            >
                                                ⋮
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Details modal */}
            {isDetailsOpen && selectedClaim && (
                <div className="my-modal-overlay" onClick={closeDetails}>
                    <div className="my-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="my-modal-header">
                            <div>
                                <h2>{getItem(selectedClaim)?.itemName || "Claim details"}</h2>
                                <span className={statusInfo(selectedClaim.status).className}>
                                    {statusInfo(selectedClaim.status).label}
                                </span>
                            </div>
                            <button className="my-modal-close-btn" onClick={closeDetails}>×</button>
                        </div>

                        <div className="my-modal-body">
                            {getItem(selectedClaim)?.image ? (
                                <img
                                    src={`http://localhost:5000/${getItem(selectedClaim).image}`}
                                    alt={getItem(selectedClaim).itemName}
                                    className="my-modal-image"
                                />
                            ) : (
                                <div className="my-modal-image my-modal-image-empty" />
                            )}

                            <div className="my-modal-fields">
                                <p className="my-modal-field">
                                    <span className="label">Item Type: </span>
                                    <span className="value">
                                        {getItem(selectedClaim)?.type === "found" ? "Found" : "Lost"}
                                    </span>
                                </p>
                                <p className="my-modal-field">
                                    <span className="label">Category: </span>
                                    <span className="value">{getItem(selectedClaim)?.category || "—"}</span>
                                </p>
                                <p className="my-modal-field">
                                    <span className="label">Location: </span>
                                    <span className="value">{getItem(selectedClaim)?.location || "—"}</span>
                                </p>
                                <p className="my-modal-field">
                                    <span className="label">Date {getItem(selectedClaim)?.type === "found" ? "Found" : "Lost"}: </span>
                                    <span className="value">{formatDate(itemDate(getItem(selectedClaim)))}</span>
                                </p>
                                <p className="my-modal-field">
                                    <span className="label">Claim Submitted: </span>
                                    <span className="value">{formatDate(selectedClaim.createdAt)}</span>
                                </p>
                            </div>

                            <div className="my-claimant-box">
                                <h3>Your ownership details</h3>
                                <p className="my-modal-field">
                                    <span className="value">{getProof(selectedClaim) || "No details provided."}</span>
                                </p>
                            </div>

                            {selectedClaim.status === "rejected" && (
                                <>
                                    <div className="my-rejection-reason-box">
                                        <h3>Reason for rejection</h3>
                                        <p>
                                            {selectedClaim.rejectionReason ||
                                                "No specific reason was provided by the admin."}
                                        </p>
                                    </div>

                                    <div className="my-contact-note">
                                        If you have a question about this decision, you can call or
                                        come to our barangay office - we're happy to help.
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyClaims;