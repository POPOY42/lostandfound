import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaMagnifyingGlass,
    FaBoxOpen,
    FaHandHoldingHeart,
    FaArrowRight,
    FaArrowLeft,
    FaLocationDot
} from "react-icons/fa6";
import "../../styles-user/home.css";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const Home = () => {

    const navigate = useNavigate()

    const [lostCount, setLostCount] = useState(0);
    const [foundCount, setFoundCount] = useState(0);
    const [claimedCount, setClaimedCount] = useState(0);

    const [recentFound, setRecentFound] = useState([]); // preview (4-5 items)
    const [allFound, setAllFound] = useState([]); // full list for "View all"
    const [selectedImage, setSelectedImage] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const displayName = cap(user?.name) || "there";

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const fetchCounts = async () => {
        try {
            const [lostRes, foundRes, claimedRes] = await Promise.all([
                fetch("https://lostandfound-8afg.onrender.com/api/item?type=lost&status=approved"),
                fetch("https://lostandfound-8afg.onrender.com/api/item?type=found&status=approved"),
                fetch("https://lostandfound-8afg.onrender.com/api/item?status=claimed")
            ]);
            const [lostData, foundData, claimedData] = await Promise.all([
                lostRes.json(),
                foundRes.json(),
                claimedRes.json()
            ]);
            setLostCount(Array.isArray(lostData) ? lostData.length : 0);
            setFoundCount(Array.isArray(foundData) ? foundData.length : 0);
            setClaimedCount(Array.isArray(claimedData) ? claimedData.length : 0);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFoundItems = async () => {
        try {
            const response = await fetch(
                "https://lostandfound-8afg.onrender.com/api/item?type=found&status=approved"
            );
            const data = await response.json();
            const sorted = Array.isArray(data)
                ? [...data].sort(
                      (a, b) => new Date(b.dateLost || b.createdAt) - new Date(a.dateLost || a.createdAt)
                  )
                : [];
            setAllFound(sorted);
            setRecentFound(sorted.slice(0, 5));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCounts();
        fetchFoundItems();
    }, []);

    const stats = [
        {
            key: "lost",
            icon: <FaMagnifyingGlass />,
            label: "Lost Items",
            description: "Items reported lost",
            count: lostCount
        },
        {
            key: "found",
            icon: <FaBoxOpen />,
            label: "Found Items",
            description: "Items found by others",
            count: foundCount
        },
        {
            key: "claimed",
            icon: <FaHandHoldingHeart />,
            label: "Claimed Items",
            description: "Successfully claimed by others",
            count: claimedCount
        }
    ];

    return (
        <div className="user-items-page">
            <div className="home-greeting">
                <h2>Hi, {displayName}</h2>
                <p className="home-greeting-sub">Let's help each other in our community</p>
            </div>

            <div className="home-stats-grid">
                {stats.map((stat) => (
                    <div className="home-stat-card" key={stat.key}>
                        <div className="home-stat-icon">{stat.icon}</div>
                        <div className="home-stat-body">
                            <h3>{stat.label}</h3>
                            <p>{stat.description}</p>
                        </div>
                        <div className="home-stat-count">{stat.count}</div>
                    </div>
                ))}
            </div>

            <>
                <div className="home-section-header">
                    <h3>Recently Found</h3>

                    <button
                        className="home-view-all-btn"
                        onClick={() => navigate("/userDashboard/user-found-items")}
                    >
                        View all <FaArrowRight />
                    </button>
                </div>

                {recentFound.length === 0 ? (
                    <div className="user-items-empty">
                        No found items reported yet.
                    </div>
                ) : (
                    <div className="user-items-grid">
                        {recentFound.map((item) => (
                            <div className="user-item-card" key={item._id}>
                                <div
                                    className="user-item-card-image-wrap"
                                    onClick={() =>
                                        item.image &&
                                        setSelectedImage(`https://lostandfound-8afg.onrender.com/${item.image}`)
                                    }
                                >
                                    {item.image ? (
                                        <img
                                            src={`https://lostandfound-8afg.onrender.com/${item.image}`}
                                            alt={item.itemName}
                                            className="user-item-card-image"
                                        />
                                    ) : (
                                        <div className="user-item-card-image user-item-card-image-empty">
                                            <FaBoxOpen size={28} />
                                        </div>
                                    )}
                                </div>

                                <div className="user-item-card-body">
                                    <h4 className="user-item-card-title">{item.itemName}</h4>

                                    <div className="user-item-card-meta">
                                        <span className="user-item-card-category">
                                            {item.category}
                                        </span>

                                        <span className="user-item-card-dot">•</span>

                                        <span>{formatDate(item.dateLost)}</span>
                                    </div>

                                    <div className="user-item-card-location">
                                        <FaLocationDot size={13} />
                                        {item.location}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>

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

export default Home;