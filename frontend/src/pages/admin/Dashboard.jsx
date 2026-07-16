import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../../styles/dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const getInitials = (name) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
};

const badgeClass = (post) => {
    if (post.status === "claimed") return "post-badge badge-claimed";
    if (post.type === "found") return "post-badge badge-found";
    return "post-badge badge-lost";
};

const badgeLabel = (post) => (post.status === "claimed" ? "claimed" : post.type);

const Dashboard = () => {
  const [stats, setStats] = useState({ lost: 0, found: 0, claimed: 0, users: 0 });
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("https://lostandfound-8afg.onrender.com/api/dashboard/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchRecentPosts = async () => {
        try {
            const res = await fetch("https://lostandfound-8afg.onrender.com/api/dashboard/recent-posts");
            const data = await res.json();
            setRecentPosts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    fetchStats();
    fetchRecentPosts();
  }, []);

  const pieData = {
    labels: ["Lost", "Found", "Claimed"],
    datasets: [{
      data: [stats.lost, stats.found, stats.claimed],
      backgroundColor: ["#E24B4A", "#378ADD", "#639922"],
      borderWidth: 2,
      borderColor: "transparent",
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (c) => ` ${c.label}: ${c.raw}`,
        },
      },
    },
  };

  const total = stats.lost + stats.found + stats.claimed;
  const legendItems = [
    { label: "Lost", color: "#E24B4A", value: stats.lost },
    { label: "Found", color: "#378ADD", value: stats.found },
    { label: "Claimed", color: "#639922", value: stats.claimed },
  ];

  return (
    <div className="dash">
      <div className="welcome">
        <h1>Welcome back, Admin 👋</h1>
        <p>Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="dash-cards">
        <div className="dash-card">
          <div className="card-label">Lost items</div>
          <div className="card-value">{stats.lost}</div>
          <div className="card-sub">Total reported</div>
        </div>
        <div className="dash-card">
          <div className="card-label">Found items</div>
          <div className="card-value">{stats.found}</div>
          <div className="card-sub">Total reported</div>
        </div>
        <div className="dash-card">
          <div className="card-label">Claimed items</div>
          <div className="card-value">{stats.claimed}</div>
          <div className="card-sub">Successfully returned</div>
        </div>
        <div className="dash-card">
          <div className="card-label">Total users</div>
          <div className="card-value">{stats.users}</div>
          <div className="card-sub">Registered accounts</div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="dash-bottom">
        {/* Recent Posts */}
        <div className="dash-panel">
          <div className="panel-title">Recent posts</div>
          {recentPosts.length === 0 ? (
            <p className="empty-state">No recent posts.</p>
          ) : (
            recentPosts.map((post) => (
              <div className="post-row" key={post._id}>
                <div className="post-info">
                  <div className="post-name">{post.reportedBy?.name || "Unknown"}</div>
                  <div className="post-desc">{post.itemName} — {post.location}</div>
                </div>
                <span className={badgeClass(post)}>{badgeLabel(post)}</span>
              </div>
            ))
          )}
        </div>

        {/* Pie Chart */}
        <div className="dash-panel">
          <div className="panel-title">Status overview</div>
          <div style={{ position: "relative", width: "100%", height: "200px" }}>
            <Doughnut data={pieData} options={pieOptions} />
          </div>
          <div className="dash-legend">
            {legendItems.map((item) => (
              <div className="legend-item" key={item.label}>
                <div className="legend-dot">
                  <span style={{ background: item.color }}></span>
                  {item.label}
                </div>
                <span className="legend-val">
                  {item.value}{" "}
                  <span className="legend-pct">
                    ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;