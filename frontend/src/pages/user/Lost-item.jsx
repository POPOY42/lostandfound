import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import "../../styles-user/userdashboard.css";

const emptyForm = {
    itemName: "",
    description: "",
    category: "",
    location: "",
    dateLost: "",
    image: null,
    type: "lost",
    status: "pending"
};

const ITEMS_PER_PAGE = 9;

const statusClass = (status) => {
    if (status === "approved") return "user-status-pill approved";
    if (status === "rejected") return "user-status-pill rejected";
    if (status === "claimed") return "user-status-pill claimed";
    return "user-status-pill pending";
};

const LostItems = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

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
            const response = await fetch("http://localhost:5000/api/item?type=lost&status=approved");
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchItems();
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
        if (!formData.dateLost) newErrors.dateLost = "Date is required";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const body = new FormData();
            body.append("itemName", formData.itemName);
            body.append("description", formData.description);
            body.append("category", formData.category);
            body.append("location", formData.location);
            body.append("dateLost", formData.dateLost);
            body.append("type", "lost");
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

    return (
        <div className="user-items-page">
            <div className="user-items-head">
                <div className="user-items-title">
                    <h3>Lost Items</h3>
                    <span>Browse items that were reported in our barangay</span>
                </div>

                <div>
                    <button className="report-btn" onClick={() => setIsModalOpen(true)}>
                        <FaPlus /> Report Lost Item
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="user-items-empty">No lost items reported yet.</div>
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
                                    <span>{formatDate(item.dateLost)}</span>
                                </div>
                                <div className="user-item-card-location">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    {item.location}
                                </div>
                            </div>

                            <div className="user-item-card-footer">
                                <button
                                    className="view-details-btn"
                                    onClick={() => setSelectedItem(item)}
                                >
                                    View Details
                                </button>
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

            {/* Report Lost Item modal */}
            {isModalOpen && (
                <div className="report-modal-overlay" onClick={closeModal}>
                    <div className="report-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="report-modal-header">
                            <h2>Report Lost Item</h2>
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

                                <div className={`report-modal-field ${errors.dateLost ? "has-error" : ""}`}>
                                    <label>Date Lost</label>
                                    <input
                                        type="date"
                                        value={formData.dateLost}
                                        onChange={handleChange("dateLost")}
                                    />
                                    {errors.dateLost && <span className="report-field-error">{errors.dateLost}</span>}
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
                                <span className="details-label">Date Lost</span>
                                <span className="details-value">{formatDate(selectedItem.dateLost)}</span>
                            </div>
                            <div className="details-field">
                                <span className="details-label">Location Lost</span>
                                <span className="details-value">{selectedItem.location || "—"}</span>
                            </div>
                        </div>

                        {selectedItem.description && (
                            <div className="details-description">
                                <span className="details-label">Description</span>
                                <p>{selectedItem.description}</p>
                            </div>
                        )}
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

export default LostItems;