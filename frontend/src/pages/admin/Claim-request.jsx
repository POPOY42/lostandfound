import { useState, useEffect } from "react";
import "../../styles/request.css";
const statusClass = (status) => {
    if (status === "approved") return "status-badge status-approved";
    if (status === "rejected") return "status-badge status-rejected";
    return "status-badge status-pending";
};

const ClaimRequest = () => {
    const [claims, setClaims] = useState([]);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const fetchClaims = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/claim-request");
            const data = await response.json();
            setClaims(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const openDetails = (claim) => {
        setSelectedClaim(claim);
        setIsModalOpen(true);
        setShowRejectInput(false);
        setRejectionReason("");
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedClaim(null);
        setShowRejectInput(false);
        setRejectionReason("");
    };

    const handleApprove = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/claim-request/${id}/approve`, {
                method: "PATCH"
            });
            await fetchClaims();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (id) => {
        if (!showRejectInput) {
            setShowRejectInput(true);
            return;
        }

        if (!rejectionReason.trim()) return;

        try {
            await fetch(`http://localhost:5000/api/claim-request/${id}/reject`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rejectionReason })
            });
            await fetchClaims();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    return (
        <div className="claim-page">
            <div className="claim-header">
                <h1>Claim Requests</h1>
                <p>All pending claim requests will appear here.</p>
            </div>

            <div className="claim-table-wrap">
                <table className="claim-table">
                    <thead>
                        <tr>
                            <th>Picture</th>
                            <th>Item</th>
                            <th>Claimant</th>
                            <th>Submitted</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map((claim) => (
                            <tr key={claim._id}>
                                <td>
                                    {claim.item?.image ? (
                                        <img
                                            src={`http://localhost:5000/${claim.item.image}`}
                                            alt={claim.item?.itemName || "Item"}
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
                                <td className="item-name">
                                    {claim.item?.itemName || "Untitled item"}
                                </td>
                                <td className="claimant-name">
                                    {claim.claimant
                                        ? `${claim.claimant.name} ${claim.claimant.surname}`
                                        : "Unknown user"}
                                </td>
                                <td className="submitted-date">{formatDate(claim.createdAt)}</td>
                                <td>
                                    <span className={statusClass(claim.status)}>
                                        {claim.status}
                                    </span>
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    <button className="view-details-btn" onClick={() => openDetails(claim)}>
                                        View details
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {claims.length === 0 && (
                            <tr>
                                <td colSpan={6} className="empty-cell">
                                    No claim requests to show right now.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedClaim && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2>Claim request details</h2>
                                <span className={statusClass(selectedClaim.status)}>
                                    {selectedClaim.status}
                                </span>
                            </div>
                            <button className="modal-close-btn" onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-section">
                                <h3>Item</h3>
                                <p className="modal-field">
                                    <span className="label">Name: </span>
                                    <span className="value">
                                        {selectedClaim.item?.itemName || "—"}
                                    </span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Category: </span>
                                    <span className="value">{selectedClaim.item?.category || "—"}</span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Location: </span>
                                    <span className="value">{selectedClaim.item?.location || "—"}</span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Description: </span>
                                    <span className="value">{selectedClaim.item?.description || "—"}</span>
                                </p>
                                {selectedClaim.item?.image && (
                                    <img
                                        src={`http://localhost:5000/${selectedClaim.item.image}`}
                                        alt={selectedClaim.item.itemName}
                                        className="modal-item-image"
                                    />
                                )}
                            </div>

                            <div className="modal-section">
                                <h3>Claimant</h3>
                                <p className="modal-field">
                                    <span className="label">Name: </span>
                                    <span className="value">
                                        {selectedClaim.claimant
                                            ? `${selectedClaim.claimant.name} ${selectedClaim.claimant.surname}`
                                            : "—"}
                                    </span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Username: </span>
                                    <span className="value">{selectedClaim.claimant?.username || "—"}</span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Contact Number: </span>
                                    <span className="value">{selectedClaim.claimant?.contactNumber || "—"}</span>
                                </p>
                                <p className="modal-field">
                                    <span className="label">Submitted: </span>
                                    <span className="value">{formatDate(selectedClaim.createdAt)}</span>
                                </p>
                            </div>

                            <div className="modal-section modal-section-full">
                                <h3>Proof of ownership</h3>
                                <p className="proof-box">{selectedClaim.proof || "No proof provided."}</p>
                            </div>

                            {selectedClaim.status === "rejected" && selectedClaim.rejectionReason && (
                                <div className="modal-section modal-section-full">
                                    <h3 className="rejection-label">Rejection reason</h3>
                                    <p className="rejection-box">{selectedClaim.rejectionReason}</p>
                                </div>
                            )}

                            {showRejectInput && selectedClaim.status === "pending" && (
                                <div className="modal-section modal-section-full">
                                    <h3>Reason for declining</h3>
                                    <textarea
                                        className="reject-textarea"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={3}
                                        placeholder="Explain why this claim is being declined…"
                                    />
                                </div>
                            )}
                        </div>

                        {selectedClaim.status === "pending" && (
                            <div className="modal-footer">
                                <button
                                    className="btn btn-decline"
                                    onClick={() => handleReject(selectedClaim._id)}
                                >
                                    {showRejectInput ? "Confirm decline" : "Decline claim"}
                                </button>
                                <button
                                    className="btn btn-approve"
                                    onClick={() => handleApprove(selectedClaim._id)}
                                >
                                    Approve claim
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClaimRequest;