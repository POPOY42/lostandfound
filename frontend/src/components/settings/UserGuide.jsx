import "../../styles/settings.css";

const steps = {
  lost: [
    <>Go to the <strong>Create Post</strong> page.</>,
    <>Select <strong>Lost Item</strong>.</>,
    "Enter the item name.",
    "Provide a detailed description.",
    "Select the category.",
    "Specify the location where it was lost.",
    "Upload a clear image (optional if allowed).",
    <>Click <strong>Submit</strong>.</>,
  ],
  found: [
    <>Go to the <strong>Create Post</strong> page.</>,
    <>Select <strong>Found Item</strong>.</>,
    "Provide the item's information.",
    "Enter where the item was found.",
    "Upload a photo if available.",
    <>Click <strong>Submit</strong>.</>,
  ],
};

const statuses = [
  { label: "Pending", desc: "Waiting for administrator approval.", color: "amber" },
  { label: "Approved", desc: "Visible to all users.", color: "green" },
  { label: "Rejected", desc: "The post did not meet the requirements.", color: "red" },
  { label: "Claimed", desc: "The item has already been returned to its owner.", color: "purple" },
];

const guidelines = [
  "Provide accurate and truthful information.",
  "Upload clear and appropriate images.",
  "Do not post fake or misleading reports.",
  "Respect the privacy of other users.",
  "Follow the instructions of the administrator.",
];

const Section = ({ number, title, children }) => (
  <section className="ug-section">
    <div className="ug-section-header">
      <span className="ug-number">{number}</span>
      <h2>{title}</h2>
    </div>
    <div className="ug-section-body">{children}</div>
  </section>
);

const UserGuide = ({ onClose }) => {
  return (
    <div className="ug-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="ug-card">
        <div className="ug-header">
          <div>
            <span className="ug-eyebrow">Help Center</span>
            <h1 className="ug-title">User Guide</h1>
            <p className="ug-subtitle">
              Welcome to the Lost and Found System! This guide will help you
              use the system efficiently.
            </p>
          </div>
          {onClose && (
            <button className="ug-close" onClick={onClose}>×</button>
          )}
        </div>

        <div className="ug-body">
          <Section number="1" title="Register an Account">
            <p>
              If you are a new user, click the <strong>Register</strong> button
              and fill in your personal information. Once registered, you can
              log in to access the system.
            </p>
          </Section>

          <Section number="2" title="Log In">
            <p>Enter your Student ID and password to log in to your account.</p>
          </Section>

          <Section number="3" title="Report a Lost Item">
            <ol className="ug-steps">
              {steps.lost.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </Section>

          <Section number="4" title="Report a Found Item">
            <ol className="ug-steps">
              {steps.found.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </Section>

          <Section number="5" title="Browse Items">
            <p>
              Visit the <strong>Lost Items</strong> or{" "}
              <strong>Found Items</strong> page to search for items. Click on
              any post to view complete details.
            </p>
          </Section>

          <Section number="6" title="Claiming an Item">
            <p>
              If you found your item, contact the administrator or follow the
              claiming instructions provided in the post. Be prepared to
              provide proof of ownership.
            </p>
          </Section>

          <Section number="7" title="Post Status">
            <div className="ug-status-grid">
              {statuses.map((s) => (
                <div className="ug-status-item" key={s.label}>
                  <span className={`ug-status-dot ${s.color}`} />
                  <div>
                    <strong>{s.label}</strong>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section number="8" title="Guidelines">
            <ul className="ug-guidelines">
              {guidelines.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </Section>

          <div className="ug-help-banner">
            <strong>Need help?</strong>
            <p>If you encounter any issues while using the system, please contact the system administrator for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;