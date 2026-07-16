import "../../styles/settings.css";

const techStack = [
    { name: "React", icon: "⚛️" },
    { name: "Node.js", icon: "🟢" },
    { name: "Express", icon: "🚂" },
    { name: "MongoDB", icon: "🍃" },
    { name: "Chart.js", icon: "📊" },
    { name: "CSS3", icon: "🎨" }
];

const highlights = [
    {
        icon: "📋",
        title: "Lost & Found Reporting",
        text: "Residents can report lost or found items with photos, descriptions, and locations."
    },
    {
        icon: "✅",
        title: "Admin Review System",
        text: "Every post and claim goes through an approval workflow before going public."
    },
    {
        icon: "🤝",
        title: "Ownership Verification",
        text: "A claim flow that asks for proof of ownership before an item changes hands."
    },
    {
        icon: "📊",
        title: "Real-time Dashboard",
        text: "Admins get an at-a-glance view of lost, found, and claimed item statistics."
    }
];

const Developers = ({ onClose }) => {
    return (
        <div className="dev-modal-overlay" onClick={onClose}>
            <div className="dev-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="dev-modal-header">
                    <div>
                        <h2>Meet the Developer</h2>
                        <p>The people and technology behind this system.</p>
                    </div>
                    <button className="dev-modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="dev-modal-body">
                    {/* Developer profile */}
                    <section className="dev-profile-card">
                        <div className="dev-avatar">FC</div>

                        <div className="dev-profile-info">
                            <h3>Fraulein S. Cabanayan</h3>
                            <span className="dev-role-badge">Full Stack Developer</span>
                            <p className="dev-bio">
                                Designed and developed this Lost &amp; Found system end to
                                end - from the database and API to every page in the admin
                                and resident-facing dashboards.
                            </p>
                        </div>
                    </section>

                    {/* Tech stack */}
                    <section className="dev-section">
                        <div className="dev-section-head">
                            <h4>Built with</h4>
                        </div>

                        <div className="dev-tech-grid">
                            {techStack.map((tech) => (
                                <div className="dev-tech-chip" key={tech.name}>
                                    <span className="dev-tech-icon">{tech.icon}</span>
                                    {tech.name}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Project highlights */}
                    <section className="dev-section">
                        <div className="dev-section-head">
                            <h4>About this project</h4>
                        </div>

                        <div className="dev-highlights-grid">
                            {highlights.map((item) => (
                                <div className="dev-highlight-card" key={item.title}>
                                    <div className="dev-highlight-icon">{item.icon}</div>
                                    <h5>{item.title}</h5>
                                    <p>{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Developers;