import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import "../../styles-user/userdashboard.css";

const emptyForm = {
    itemName: "",
    description: "",
    category: "",
    location: "",
    dateFound: "",
    image: null,
    type: "found",
    status: "pending"
};

const ITEMS_PER_PAGE = 9;

const statusClass = (status) => {
    if (status === "approved") return "user-status-pill approved";
    if (status === "rejected") return "user-status-pill rejected";
    if (status === "claimed") return "user-status-pill claimed";
    return "user-status-pill pending";
};

const FoundItems = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemToClaim, setItemToClaim] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [ownershipDetails, setOwnershipDetails] = useState("");
    const [verificationError, setVerificationError] = useState("");
    const [myClaims, setMyClaims] = useState({});

    const [claimError, setClaimError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFormData((prev) => ({ ...prev, image: file }));
        setErrors((prev) => ({ ...prev, image: "" }));
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData(emptyForm);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setErrors({});
    };

    const closeDetails = () => setSelectedItem(null);

    const fetchItems = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/item?type=found&status=approved");
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyClaims = async () => {
        if (!user?._id) return;
        try {
            const response = await fetch(
                `http://localhost:5000/api/claim-request?claimedBy=${user._id}`
            );
            const data = await response.json();

            if (!Array.isArray(data)) {
                console.warn("Expected an array from /api/claim-request, got:", data);
                return;
            }

            const map = {};
            data.forEach((claim) => {
                // The item reference may come back under different names
                // depending on how the backend populates it. Try each in order.
                const rawItemRef = claim.itemId ?? claim.item ?? null;
                const itemId =
                    typeof rawItemRef === "object" ? rawItemRef?._id : rawItemRef;

                // Some backends may return every claim instead of filtering by
                // claimedBy - if so, skip claims that aren't the current user's.
                const rawUserRef = claim.claimedBy ?? claim.claimant ?? null;
                const claimUserId =
                    typeof rawUserRef === "object" ? rawUserRef?._id : rawUserRef;
                if (claimUserId && claimUserId !== user._id) return;

                if (!itemId) {
                    console.warn("Claim is missing a recognizable item reference:", claim);
                    return;
                }

                if (!map[itemId]) map[itemId] = claim;
            });

            setMyClaims(map);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchMyClaims();
    }, []);

    // Keep currentPage valid whenever the item list changes size
    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [items, currentPage]);

    const handleAddItem = async () => {
        const newErrors = {};
        if (!formData.itemName.trim()) newErrors.itemName = "Item name is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.category.trim()) newErrors.category = "Category is required";
        if (!formData.location.trim()) newErrors.location = "Location is required";
        if (!formData.dateFound) newErrors.dateFound = "Date is required";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const body = new FormData();
            body.append("itemName", formData.itemName);
            body.append("description", formData.description);
            body.append("category", formData.category);
            body.append("location", formData.location);
            body.append("dateFound", formData.dateFound);
            body.append("type", "found");
            body.append("status", "pending");
            body.append("reportedBy", user._id);
            if (formData.image) body.append("image", formData.image);

            const response = await fetch("http://localhost:5000/api/item", {
                method: "POST",
                body
            });

            if (response.ok) {
                await fetchItems();
                closeModal();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Returns the current claim (if any) the logged-in user has on this item
    const getExistingClaim = (item) => myClaims[item._id];

    // A user cannot open the claim flow again while a claim is pending/approved/claimed
    const hasActiveClaim = (item) => {
        const claim = getExistingClaim(item);
        return !!claim && ["pending", "approved", "claimed"].includes(claim.status);
    };

    // Entry point for the "Claim" button. Guards against opening the claim
    // flow twice for the same item while a previous request is still active.
    const startClaimFlow = (item) => {
        if (hasActiveClaim(item)) {
            setClaimError("You already claimed this item. Please wait for the admin to approve your request.");
            return;
        }
        setClaimError("");
        setItemToClaim(item);
    };

    const proceedToVerification = () => {
        setShowVerificationModal(true);
    };

    const closeClaimFlow = () => {
        setItemToClaim(null);
        setShowVerificationModal(false);
        setOwnershipDetails("");
        setVerificationError("");
        setClaimError("");
    };

    const handleSubmitVerification = async () => {
        if (!ownershipDetails.trim()) {
            setVerificationError(
                "Please describe at least one detail only the owner would know."
            );
            return;
        }

        if (!itemToClaim) return;

        // Safety net: if a claim somehow became active while this modal was
        // open (e.g. submitted from another tab), block the duplicate submit.
        if (hasActiveClaim(itemToClaim)) {
            setClaimError("You already claimed this item. Please wait for the admin to approve your request.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/claim-request",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        itemId: itemToClaim._id,
                        claimedBy: user._id,
                        ownershipDetails: ownershipDetails.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setClaimError(data.message);
                return;
            }

            // Optimistically mark this item as having a pending claim right away,
            // so the button updates instantly instead of waiting on the next
            // fetchMyClaims() round trip.
            const newClaim = data.claim || data;
            setMyClaims((prev) => ({
                ...prev,
                [itemToClaim._id]: newClaim
            }));

            // Re-sync with the backend in the background to stay accurate.
            fetchMyClaims();

            closeClaimFlow();

        } catch (error) {
            console.error(error);
            setClaimError("Something went wrong. Please try again.");
        }
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

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const reporterName = (reportedBy) => {
        if (!reportedBy) return "—";
        const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
        return `${cap(reportedBy.name)} ${cap(reportedBy.surname)}`.trim();
    };

    // reportedBy can come back as a populated object or a plain id string
    const isOwnItem = (item) => {
        if (!item?.reportedBy || !user?._id) return false;
        const reporterId =
            typeof item.reportedBy === "object" ? item.reportedBy._id : item.reportedBy;
        return reporterId === user._id;
    };

    // Renders the Claim / Claim Pending / Claimed button for a given item,
    // based on the current user's claim (if any) on that item.
    const renderClaimButton = (item, variant = "") => {
        if (isOwnItem(item)) {
            return (
                <button className={`claim-btn own-post-btn ${variant}`} disabled>
                    Your Post
                </button>
            );
        }

        const claim = getExistingClaim(item);

        if (claim?.status === "pending") {
            return (
                <button className={`claim-btn claim-pending-btn ${variant}`} disabled>
                    Claim Pending
                </button>
            );
        }

        if (claim?.status === "approved" || claim?.status === "claimed") {
            return (
                <button className={`claim-btn claimed-btn ${variant}`} disabled>
                    Claimed
                </button>
            );
        }

        // No claim yet, or a previous claim was rejected -> allow (re)claiming
        return (
            <button className={`claim-btn ${variant}`} onClick={() => startClaimFlow(item)}>
                Claim
            </button>
        );
    };

    const renderRejectedNote = (item) => {
        const claim = getExistingClaim(item);
        if (claim?.status !== "rejected") return null;
        return (
            <div className="claim-rejected-note">
                Your claim request for <strong>{item.itemName}</strong> has been rejected
                because the information you provided could not be verified. If you believe
                this is a mistake, you may submit another claim with more accurate details.
            </div>
        );
    };

    return (
        <div className="user-items-page">
            <div className="user-items-head">
                <div className="user-items-title">
                    <h3>Found Items</h3>
                    <span>Browse items that were found in our barangay</span>
                </div>

                <div>
                    <button className="report-btn" onClick={() => setIsModalOpen(true)}>
                        <FaPlus /> Report Found Item
                    </button>
                </div>
            </div>

            {claimError && !itemToClaim && (
                <div className="claim-error-banner">
                    {claimError}
                </div>
            )}

            {items.length === 0 ? (
                <div className="user-items-empty">No found items reported yet.</div>
            ) : (
                <div className="user-items-grid">
                    {paginatedItems.map((item) => (
                        <div className="user-item-card" key={item._id}>
                            <div
                                className="user-item-card-image-wrap"
                                onClick={() =>
                                    item.image &&
                                    setSelectedImage(`http://localhost:5000/${item.image}`)
                                }
                            >
                                {item.image ? (
                                    <img
                                        src={`http://localhost:5000/${item.image}`}
                                        alt={item.itemName}
                                        className="user-item-card-image"
                                    />
                                ) : (
                                    <div className="user-item-card-image user-item-card-image-empty">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <circle cx="9" cy="9" r="2" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="user-item-card-body">
                                <h4 className="user-item-card-title">{item.itemName}</h4>
                                <div className="user-item-card-meta">
                                    <span className="user-item-card-category">{item.category}</span>
                                    <span className="user-item-card-dot">•</span>
                                    <span>{formatDate(item.dateFound)}</span>
                                </div>
                                <div className="user-item-card-location">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {item.location}
                                </div>

                                {renderRejectedNote(item)}
                            </div>

                            <div className="user-item-card-footer">
                                <button
                                    className="view-details-btn"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    View Details
                                </button>
                                {renderClaimButton(item)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {items.length > 0 && (
                <div className="user-pagination-bar">
                    <span className="user-pagination-info">
                        Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, items.length)} of {items.length}
                    </span>

                    <div className="user-pagination-controls">
                        <button
                            className="user-pagination-btn"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        {getPageNumbers().map((page, idx) =>
                            page === "..." ? (
                                <span key={`ellipsis-${idx}`} className="user-pagination-ellipsis">…</span>
                            ) : (
                                <button
                                    key={page}
                                    className={`user-pagination-page ${page === currentPage ? "active" : ""}`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            className="user-pagination-btn"
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

            {/* Report Found Item modal */}
            {isModalOpen && (
                <div className="report-modal-overlay" onClick={closeModal}>
                    <div className="report-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="report-modal-header">
                            <h2>Report Found Item</h2>
                            <button className="report-modal-close" onClick={closeModal}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="report-modal-form">
                            <div className={`report-modal-field ${errors.image ? "has-error" : ""}`}>
                                <label>Image (Optional)</label>
                                {imagePreview ? (
                                    <div className="report-image-preview-wrap">
                                        <img src={imagePreview} alt="Preview" className="report-image-preview" />
                                        <button type="button" className="report-image-remove-btn" onClick={removeImage}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label className="report-image-upload-box">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <span>Click to upload an image</span>
                                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                                    </label>
                                )}
                                {errors.image && <span className="report-field-error">{errors.image}</span>}
                            </div>

                            <div className={`report-modal-field ${errors.itemName ? "has-error" : ""}`}>
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Black Backpack"
                                    value={formData.itemName}
                                    onChange={handleChange("itemName")}
                                />
                                {errors.itemName && <span className="report-field-error">{errors.itemName}</span>}
                            </div>

                            <div className={`report-modal-field ${errors.description ? "has-error" : ""}`}>
                                <label>Description</label>
                                <textarea
                                    placeholder="e.g. Has a small tear on the front pocket"
                                    value={formData.description}
                                    onChange={handleChange("description")}
                                    rows={3}
                                />
                                {errors.description && <span className="report-field-error">{errors.description}</span>}
                            </div>

                            <div className="report-modal-row">
                                <div className={`report-modal-field ${errors.category ? "has-error" : ""}`}>
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Electronics"
                                        value={formData.category}
                                        onChange={handleChange("category")}
                                    />
                                    {errors.category && <span className="report-field-error">{errors.category}</span>}
                                </div>

                                <div className={`report-modal-field ${errors.dateFound ? "has-error" : ""}`}>
                                    <label>Date Found</label>
                                    <input
                                        type="date"
                                        value={formData.dateFound}
                                        onChange={handleChange("dateFound")}
                                    />
                                    {errors.dateFound && <span className="report-field-error">{errors.dateFound}</span>}
                                </div>
                            </div>

                            <div className={`report-modal-field ${errors.location ? "has-error" : ""}`}>
                                <label>Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Library, 2nd Floor"
                                    value={formData.location}
                                    onChange={handleChange("location")}
                                />
                                {errors.location && <span className="report-field-error">{errors.location}</span>}
                            </div>
                        </div>

                        <div className="report-modal-actions">
                            <button className="report-modal-cancel-btn" onClick={closeModal}>
                                Cancel
                            </button>
                            <button className="report-modal-submit-btn" onClick={handleAddItem}>
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View details modal */}
            {selectedItem && (
                <div className="details-modal-overlay" onClick={closeDetails}>
                    <div className="details-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="details-modal-close" onClick={closeDetails}>
                            &times;
                        </button>

                        {selectedItem.image ? (
                            <img
                                src={`http://localhost:5000/${selectedItem.image}`}
                                alt={selectedItem.itemName}
                                className="details-modal-image"
                            />
                        ) : (
                            <div className="details-modal-image details-modal-image-empty" />
                        )}

                        <h2>{selectedItem.itemName}</h2>

                        <div className="details-grid">
                            <div className="details-field">
                                <span className="details-label">Category</span>
                                <span className="details-value">{selectedItem.category || "—"}</span>
                            </div>

                            <div className="details-field">
                                <span className="details-label">Reported By</span>
                                <span className="details-value">
                                    {reporterName(selectedItem.reportedBy)}
                                </span>
                            </div>

                            <div className="details-field">
                                <span className="details-label">Date Found</span>
                                <span className="details-value">{formatDate(selectedItem.dateFound)}</span>
                            </div>
                            <div className="details-field">
                                <span className="details-label">Location Found</span>
                                <span className="details-value">{selectedItem.location || "—"}</span>
                            </div>
                        </div>

                        {selectedItem.description && (
                            <div className="details-description">
                                <span className="details-label">Description</span>
                                <p>{selectedItem.description}</p>
                            </div>
                        )}

                        {renderRejectedNote(selectedItem)}

                        {renderClaimButton(selectedItem, "details-claim-btn")}
                    </div>
                </div>
            )}

            {/* Claim confirmation modal (step 1) */}
            {itemToClaim && !showVerificationModal && (
                <div className="claim-modal-overlay" onClick={closeClaimFlow}>
                    <div className="claim-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="claim-modal-icon">🤝</div>
                        <h2>Claim this item?</h2>
                        <p>
                            You're about to submit a claim request for{" "}
                            <strong>{itemToClaim.itemName}</strong>. Our staff will review your
                            request and get in touch with you.
                        </p>
                        <div className="claim-actions">
                            <button
                                className="claim-cancel-btn"
                                onClick={closeClaimFlow}
                            >
                                Cancel
                            </button>
                            <button className="claim-confirm-btn" onClick={proceedToVerification}>
                                Confirm Claim
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Ownership verification modal (step 2) */}
            {itemToClaim && showVerificationModal && (
                <div className="claim-modal-overlay" onClick={closeClaimFlow}>
                    <div className="claim-modal verification-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Ownership Verification</h2>
                        <p>Please describe details that only the owner would know.</p>

                        <div className="verification-examples">
                            <span className="verification-examples-label">Examples:</span>
                            <ul>
                                <li>Contents inside the wallet</li>
                                <li>Color of the ID holder</li>
                                <li>Missing zipper</li>
                                <li>Brand</li>
                            </ul>
                        </div>

                        <div className={`report-modal-field ${verificationError ? "has-error" : ""}`}>
                            <textarea
                                className="verification-textarea"
                                placeholder="Describe details only the owner would know..."
                                rows={5}
                                value={ownershipDetails}
                                onChange={(e) => {
                                    setOwnershipDetails(e.target.value);
                                    setVerificationError("");
                                }}
                            />
                            {verificationError && (
                                <span className="report-field-error">{verificationError}</span>
                            )}

                            {claimError && (
                                <span className="report-field-error">
                                    {claimError}
                                </span>
                            )}
                        </div>

                        <div className="claim-actions">
                            <button className="claim-cancel-btn" onClick={closeClaimFlow}>
                                Cancel
                            </button>
                            <button className="claim-confirm-btn" onClick={handleSubmitVerification}>
                                Submit Claim
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enlarged image preview */}
            {selectedImage && (
                <div className="user-image-modal" onClick={() => setSelectedImage(null)}>
                    <div className="user-image-viewer" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Preview" className="user-image-modal-content" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoundItems;