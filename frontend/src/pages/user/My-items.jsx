import { useState, useEffect } from "react";
import "../../styles-user/myitems.css";

const emptyEditForm = {
    itemName: "",
    description: "",
    category: "",
    location: "",
    date: "",
    image: null
};

const statusInfo = (item) => {
    if (item.status === "claimed") {
        return { label: "Claimed", className: "my-status-pill claimed" };
    }
    if (item.status === "approved" && item.claimStatus === "pending") {
        return { label: "Claim Requested", className: "my-status-pill claim-requested" };
    }
    if (item.status === "approved") {
        return { label: "Approved", className: "my-status-pill approved" };
    }
    if (item.status === "rejected") {
        return { label: "Rejected", className: "my-status-pill rejected" };
    }
    return { label: "Pending", className: "my-status-pill pending" };
};

const isEditable = (item) => item.status !== "claimed";

const MyItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all | lost | found

    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState(emptyEditForm);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [editErrors, setEditErrors] = useState({});

    const [deleteTarget, setDeleteTarget] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchMyItems = async () => {
        if (!user?._id) return;
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/item/myitems?reportedBy=${user._id}`
            );
            const data = await response.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyItems();
    }, []);

    const filteredItems = items.filter((item) => {
        if (filter === "lost") return item.type === "lost";
        if (filter === "found") return item.type === "found";
        return true;
    });

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const itemDate = (item) => (item.type === "found" ? item.dateFound : item.dateLost);

    const getClaimant = (item) => {
        if (item.claimedBy) return item.claimedBy;
        if (item.currentClaim?.claimant) return item.currentClaim.claimant;
        return null;
    };

    const hasClaimInfo = (item) => item.status === "claimed" || item.claimStatus === "pending";

    // ── Details ──
    const openDetails = (item) => {
        setSelectedItem(item);
        setIsDetailsOpen(true);
    };

    const closeDetails = () => {
        setIsDetailsOpen(false);
        setSelectedItem(null);
    };

    // ── Edit ──
    const openEdit = (item) => {
        if (!isEditable(item)) return;

        setEditForm({
            itemName: item.itemName || "",
            description: item.description || "",
            category: item.category || "",
            location: item.location || "",
            date: (item.type === "found" ? item.dateFound : item.dateLost)
                ? new Date(item.type === "found" ? item.dateFound : item.dateLost)
                      .toISOString()
                      .slice(0, 10)
                : "",
            image: null
        });
        setEditImagePreview(item.image ? `http://localhost:5000/${item.image}` : null);
        setEditErrors({});
        setSelectedItem(item);
        setIsDetailsOpen(false);
        setIsEditOpen(true);
    };

    const closeEdit = () => {
        setIsEditOpen(false);
        setEditForm(emptyEditForm);
        if (editImagePreview && editImagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(editImagePreview);
        }
        setEditImagePreview(null);
        setEditErrors({});
    };

    const handleEditChange = (field) => (e) => {
        setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
        setEditErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setEditForm((prev) => ({ ...prev, image: file }));
        if (editImagePreview && editImagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(editImagePreview);
        }
        setEditImagePreview(URL.createObjectURL(file));
    };

    const handleSaveEdit = async () => {
        if (!isEditable(selectedItem)) return;

        const newErrors = {};
        if (!editForm.itemName.trim()) newErrors.itemName = "Item name is required";
        if (!editForm.description.trim()) newErrors.description = "Description is required";
        if (!editForm.category.trim()) newErrors.category = "Category is required";
        if (!editForm.location.trim()) newErrors.location = "Location is required";
        if (!editForm.date) newErrors.date = "Date is required";

        setEditErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const body = new FormData();
            body.append("itemName", editForm.itemName);
            body.append("description", editForm.description);
            body.append("category", editForm.category);
            body.append("location", editForm.location);
            body.append(
                selectedItem.type === "found" ? "dateFound" : "dateLost",
                editForm.date
            );
            if (editForm.image) body.append("image", editForm.image);

            if (selectedItem.status === "approved") {
                body.append("status", "pending");
            }

            const response = await fetch(
                `http://localhost:5000/api/item/${selectedItem._id}`,
                {
                    method: "PATCH",
                    body
                }
            );

            if (response.ok) {
                await fetchMyItems();
                closeEdit();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ── Delete ──
    const confirmDelete = (item) => {
        setDeleteTarget(item);
        setIsDetailsOpen(false);
    };

    const cancelDelete = () => setDeleteTarget(null);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const response = await fetch(
                `http://localhost:5000/api/item/${deleteTarget._id}`,
                { method: "DELETE" }
            );
            if (response.ok) {
                
                setDeleteTarget(null);
                setSelectedItem(null);
                setIsDetailsOpen(false);
                setIsEditOpen(false);

                await fetchMyItems();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="my-items-page">
            <div className="my-items-header">
                <h1>My Items</h1>
                <p>Everything you've reported as lost or found.</p>
            </div>

            <div className="my-items-tabs">
                <button
                    className={`my-tab-btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                >
                    All Items
                </button>
                <button
                    className={`my-tab-btn ${filter === "lost" ? "active" : ""}`}
                    onClick={() => setFilter("lost")}
                >
                    Lost Items
                </button>
                <button
                    className={`my-tab-btn ${filter === "found" ? "active" : ""}`}
                    onClick={() => setFilter("found")}
                >
                    Found Items
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
                                <td colSpan={3} className="my-empty-cell">Loading your items…</td>
                            </tr>
                        ) : filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="my-empty-cell">
                                    You haven't reported any {filter === "all" ? "" : filter + " "}items yet.
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => {
                                const status = statusInfo(item);
                                return (
                                    <tr key={item._id}>
                                        <td>
                                            <div className="my-item-cell">
                                                {item.image ? (
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
                                                    <span className="my-item-name">{item.itemName}</span>
                                                    <div className="my-item-meta">
                                                        <span className={`my-type-pill ${item.type}`}>
                                                            {item.type === "found" ? "Found" : "Lost"}
                                                        </span>
                                                        <span className="my-item-location">{item.location}</span>
                                                    </div>
                                                    <span className="my-item-date">
                                                        Posted {formatDate(itemDate(item))}
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
                                                onClick={() => openDetails(item)}
                                                aria-label="View item options"
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
            {isDetailsOpen && selectedItem && (
                <div className="my-modal-overlay" onClick={closeDetails}>
                    <div className="my-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="my-modal-header">
                            <div>
                                <h2>{selectedItem.itemName}</h2>
                                <span className={statusInfo(selectedItem).className}>
                                    {statusInfo(selectedItem).label}
                                </span>
                            </div>
                            <button className="my-modal-close-btn" onClick={closeDetails}>×</button>
                        </div>

                        <div className="my-modal-body">
                            {selectedItem.image ? (
                                <img
                                    src={`http://localhost:5000/${selectedItem.image}`}
                                    alt={selectedItem.itemName}
                                    className="my-modal-image"
                                />
                            ) : (
                                <div className="my-modal-image my-modal-image-empty" />
                            )}

                            <div className="my-modal-fields">
                                <p className="my-modal-field">
                                    <span className="label">Type: </span>
                                    <span className="value">{selectedItem.type === "found" ? "Found" : "Lost"}</span>
                                </p>
                                <p className="my-modal-field">
                                    <span className="label">Category: </span>
                                    <span className="value">{selectedItem.category || "—"}</span>
                                </p>
                                <p className="my-modal-field">
                                    <span className="label">Location: </span>
                                    <span className="value">{selectedItem.location || "—"}</span>
                                </p>
                                <p className="my-modal-field">
                                    <span className="label">Date: </span>
                                    <span className="value">{formatDate(itemDate(selectedItem))}</span>
                                </p>
                                <p className="my-modal-field">
                                    <span className="label">Description: </span>
                                    <span className="value">{selectedItem.description || "—"}</span>
                                </p>

                                {selectedItem.status === "rejected" && (
                                    <div className="my-rejected-note">
                                        This post was rejected by an admin. You can edit and resubmit it for review.
                                    </div>
                                )}

                                {!isEditable(selectedItem) && (
                                    <div className="my-claimed-note">
                                        This item has been claimed and can no longer be edited.
                                    </div>
                                )}
                            </div>

                            {hasClaimInfo(selectedItem) && (
                                <div className="my-claimant-box">
                                    <h3>
                                        {selectedItem.status === "claimed"
                                            ? "Claimed by"
                                            : "Claim requested by"}
                                    </h3>
                                    {getClaimant(selectedItem) ? (
                                        <div className="my-claimant-fields">
                                            <p className="my-modal-field">
                                                <span className="label">Name: </span>
                                                <span className="value">
                                                    {getClaimant(selectedItem).name} {getClaimant(selectedItem).surname}
                                                </span>
                                            </p>
                                            <p className="my-modal-field">
                                                <span className="label">Username: </span>
                                                <span className="value">
                                                    {getClaimant(selectedItem).username || "—"}
                                                </span>
                                            </p>
                                            <p className="my-modal-field">
                                                <span className="label">Contact Number: </span>
                                                <span className="value">
                                                    {getClaimant(selectedItem).contactNumber || "—"}
                                                </span>
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="my-modal-field">
                                            <span className="value">Claimant details unavailable.</span>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="my-modal-footer">
                            {isEditable(selectedItem) && (
                                <>
                                    <button
                                        className="my-btn my-btn-delete"
                                        onClick={() => confirmDelete(selectedItem)}
                                    >
                                        Delete
                                    </button>

                                    <button
                                        className="my-btn my-btn-edit"
                                        onClick={() => openEdit(selectedItem)}
                                    >
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit modal */}
            {isEditOpen && selectedItem && isEditable(selectedItem) && (
                <div className="my-modal-overlay" onClick={closeEdit}>
                    <div className="my-modal-content my-edit-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="my-modal-header">
                            <h2>Edit {selectedItem.type === "found" ? "Found" : "Lost"} Item</h2>
                            <button className="my-modal-close-btn" onClick={closeEdit}>×</button>
                        </div>

                        {selectedItem.status === "approved" && (
                            <div className="my-edit-warning">
                                This item is already approved. Saving changes will send it back to
                                pending for admin review.
                            </div>
                        )}

                        <div className="my-edit-form">
                            <div className={`my-form-field ${editErrors.image ? "has-error" : ""}`}>
                                <label>Image</label>
                                {editImagePreview ? (
                                    <div className="my-image-preview-wrap">
                                        <img src={editImagePreview} alt="Preview" className="my-image-preview" />
                                    </div>
                                ) : (
                                    <label className="my-image-upload-box">
                                        <span>Click to upload an image</span>
                                        <input type="file" accept="image/*" onChange={handleEditImageChange} hidden />
                                    </label>
                                )}
                                {editImagePreview && (
                                    <label className="my-change-image-link">
                                        Change image
                                        <input type="file" accept="image/*" onChange={handleEditImageChange} hidden />
                                    </label>
                                )}
                            </div>

                            <div className={`my-form-field ${editErrors.itemName ? "has-error" : ""}`}>
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    value={editForm.itemName}
                                    onChange={handleEditChange("itemName")}
                                />
                                {editErrors.itemName && <span className="my-field-error">{editErrors.itemName}</span>}
                            </div>

                            <div className={`my-form-field ${editErrors.description ? "has-error" : ""}`}>
                                <label>Description</label>
                                <textarea
                                    rows={3}
                                    value={editForm.description}
                                    onChange={handleEditChange("description")}
                                />
                                {editErrors.description && <span className="my-field-error">{editErrors.description}</span>}
                            </div>

                            <div className="my-form-row">
                                <div className={`my-form-field ${editErrors.category ? "has-error" : ""}`}>
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        value={editForm.category}
                                        onChange={handleEditChange("category")}
                                    />
                                    {editErrors.category && <span className="my-field-error">{editErrors.category}</span>}
                                </div>

                                <div className={`my-form-field ${editErrors.date ? "has-error" : ""}`}>
                                    <label>Date {selectedItem.type === "found" ? "Found" : "Lost"}</label>
                                    <input
                                        type="date"
                                        value={editForm.date}
                                        onChange={handleEditChange("date")}
                                    />
                                    {editErrors.date && <span className="my-field-error">{editErrors.date}</span>}
                                </div>
                            </div>

                            <div className={`my-form-field ${editErrors.location ? "has-error" : ""}`}>
                                <label>Location</label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={handleEditChange("location")}
                                />
                                {editErrors.location && <span className="my-field-error">{editErrors.location}</span>}
                            </div>
                        </div>

                        <div className="my-modal-footer">
                            <button className="my-btn my-btn-cancel" onClick={closeEdit}>
                                Cancel
                            </button>
                            <button className="my-btn my-btn-save" onClick={handleSaveEdit}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            {deleteTarget && (
                <div className="my-modal-overlay" onClick={cancelDelete}>
                    <div className="my-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Delete this item?</h2>
                        <p>
                            Are you sure you want to delete <strong>{deleteTarget.itemName}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="my-confirm-actions">
                            <button className="my-btn my-btn-cancel" onClick={cancelDelete}>
                                Cancel
                            </button>
                            <button className="my-btn my-btn-delete" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyItems;