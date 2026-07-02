import { useState, useEffect } from "react";
import "../../styles/found-claim.css";

const emptyForm = {
    itemName: "",
    description: "",
    category: "",
    location: "",
    dateFound: "",
    image: null,
    type: "found"
};

const ITEMS_PER_PAGE = 8;

const statusClass = (status) => {
    if (status === "approved") return "status-pill approved";
    if (status === "rejected") return "status-pill rejected";
    if (status === "claimed") return "status-pill claimed";
    return "status-pill pending";
};

const FoundItems = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

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

    const user = JSON.parse(localStorage.getItem("user"));

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

    const fetchItems = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/item?type=found");
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

    const handleApprove = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/item/${id}/approve`, {
                method: "PATCH"
            });
            fetchItems();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/item/${id}/reject`, {
                method: "PATCH"
            });
            fetchItems();
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
        <div className="lost-items-page">
            <div className="lost-item-header">
                <div>
                    <h1>Found Items</h1>
                    <small>Manage all found items reported by users</small>
                </div>

                <div>
                    <button className="add-item-btn" onClick={() => setIsModalOpen(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Found Item
                    </button>
                </div>
            </div>

            <div className="lost-items-table-wrap">
                <table className="lost-items-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Item</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Location</th>
                            <th>Date Found</th>
                            <th>Status</th>
                            <th>Action</th>
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
                                            onClick={() =>
                                                setSelectedImage(`http://localhost:5000/${item.image}`)
                                            }
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
                                <td className="item-name-cell">{item.itemName}</td>
                                <td className="item-desc-cell">{item.description}</td>
                                <td>{item.category}</td>
                                <td>{item.location}</td>
                                <td>
                                    {new Date(item.dateFound).toLocaleDateString("en-PH", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                </td>
                                <td>
                                    <span className={statusClass(item.status)}>
                                        {item.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="reject-btn"
                                            onClick={() => handleReject(item._id)}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            className="approve-btn"
                                            onClick={() => handleApprove(item._id)}
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {items.length === 0 && (
                            <tr>
                                <td colSpan={8} className="empty-row">
                                    No found items reported yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {items.length > 0 && (
                    <div className="pagination-bar">
                        <span className="pagination-info">
                            Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, items.length)} of {items.length}
                        </span>

                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>

                            {getPageNumbers().map((page, idx) =>
                                page === "..." ? (
                                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis">…</span>
                                ) : (
                                    <button
                                        key={page}
                                        className={`pagination-page ${page === currentPage ? "active" : ""}`}
                                        onClick={() => goToPage(page)}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            <button
                                className="pagination-btn"
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

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Found Item</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="modal-form">
                            <div className={`modal-field ${errors.image ? "has-error" : ""}`}>
                                <label>Image (Optional)</label>
                                {imagePreview ? (
                                    <div className="image-preview-wrap">
                                        <img src={imagePreview} alt="Preview" className="image-preview" />
                                        <button type="button" className="image-remove-btn" onClick={removeImage}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label className="image-upload-box">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <span>Click to upload an image</span>
                                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                                    </label>
                                )}
                                {errors.image && <span className="field-error">{errors.image}</span>}
                            </div>

                            <div className={`modal-field ${errors.itemName ? "has-error" : ""}`}>
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Brown Wallet"
                                    value={formData.itemName}
                                    onChange={handleChange("itemName")}
                                />
                                {errors.itemName && <span className="field-error">{errors.itemName}</span>}
                            </div>

                            <div className={`modal-field ${errors.description ? "has-error" : ""}`}>
                                <label>Description</label>
                                <textarea
                                    placeholder="e.g. Found near the entrance, has cards inside"
                                    value={formData.description}
                                    onChange={handleChange("description")}
                                    rows={3}
                                />
                                {errors.description && <span className="field-error">{errors.description}</span>}
                            </div>

                            <div className="modal-row">
                                <div className={`modal-field ${errors.category ? "has-error" : ""}`}>
                                    <label>Category</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Accessories"
                                        value={formData.category}
                                        onChange={handleChange("category")}
                                    />
                                    {errors.category && <span className="field-error">{errors.category}</span>}
                                </div>

                                <div className={`modal-field ${errors.dateFound ? "has-error" : ""}`}>
                                    <label>Date Found</label>
                                    <input
                                        type="date"
                                        value={formData.dateFound}
                                        onChange={handleChange("dateFound")}
                                    />
                                    {errors.dateFound && <span className="field-error">{errors.dateFound}</span>}
                                </div>
                            </div>

                            <div className={`modal-field ${errors.location ? "has-error" : ""}`}>
                                <label>Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Cafeteria, near exit"
                                    value={formData.location}
                                    onChange={handleChange("location")}
                                />
                                {errors.location && <span className="field-error">{errors.location}</span>}
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="modal-cancel-btn" onClick={closeModal}>
                                Cancel
                            </button>
                            <button className="modal-submit-btn" onClick={handleAddItem}>
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedImage && (
                <div
                    className="image-modal"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                    className="image-viewer"
                    onClick={(e) => e.stopPropagation()}
                    >
                    <img
                        src={selectedImage}
                        alt="Preview"
                        className="image-modal-content"
                    />
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoundItems;