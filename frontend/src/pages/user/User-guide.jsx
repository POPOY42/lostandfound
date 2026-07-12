import { useState } from "react";
import "../../styles-user/userGuide.css";

const steps = [
    {
        icon: "📢",
        title: "Report a lost or found item",
        text: "Go to Lost Items or Found Items and click the report button. Fill in the item name, description, category, location, and date - a photo helps others recognize it faster."
    },
    {
        icon: "🔍",
        title: "Browse what others posted",
        text: "Check the Lost Items and Found Items pages regularly. Use the item photo, description, and location to see if something matches what you're looking for."
    },
    {
        icon: "🤝",
        title: "Claim a found item",
        text: "Found something that looks like yours? Click Claim, then describe a detail only the real owner would know (like what's inside a bag). Staff will review it before approving."
    },
    {
        icon: "✅",
        title: "Get notified and pick it up",
        text: "Once your claim is approved, the item's status changes to Claimed. Coordinate with barangay staff to arrange pickup and confirm your identity."
    }
];

const tips = [
    {
        icon: "📸",
        title: "Add a clear photo",
        text: "Posts with a photo get matched and claimed much faster than posts without one."
    },
    {
        icon: "📍",
        title: "Be specific with location",
        text: "\"Near the covered court entrance\" is far more useful than just \"outside.\""
    },
    {
        icon: "🕒",
        title: "Post as soon as possible",
        text: "The sooner a lost or found item is posted, the higher the chance of it being reunited with its owner."
    },
    {
        icon: "🔒",
        title: "Keep proof details private",
        text: "When claiming an item, only share ownership details in the claim form - never in public comments."
    }
];

const faqs = [
    {
        question: "Why was my post rejected?",
        answer: "Admins review every post before it goes public. A post is usually rejected if the details are unclear, incomplete, or can't be verified. Check the rejection note on your item in My Items, then edit and resubmit it."
    },
    {
        question: "Can I edit an item after it's approved?",
        answer: "Yes. Editing an approved post sends it back to Pending so an admin can review the changes again before it's shown publicly."
    },
    {
        question: "What happens after I submit a claim?",
        answer: "Your claim goes to the admin as Pending. They'll compare your ownership details with the item and either approve or decline the claim. You can check the status anytime from the item's Claim status."
    },
    {
        question: "Can I claim my own found item post?",
        answer: "No. If you're the one who reported an item, you'll see \"Your Post\" instead of a Claim button, since you can't claim something you posted yourself."
    },
    {
        question: "How do I update my username, phone number, or password?",
        answer: "Go to My Profile. Each of those has its own card with a save action, so you can update one without touching the others."
    }
];

const UserGuide = () => {
    const [openFaq, setOpenFaq] = useState(0);

    const toggleFaq = (index) => {
        setOpenFaq((prev) => (prev === index ? -1 : index));
    };

    return (
        <div className="guide-page">
            {/* Hero */}
            <div className="guide-hero">
                <span className="guide-hero-badge">User Guide</span>
                <h1>Everything you need to know</h1>
                <p>
                    A quick walkthrough of how to report, browse, and claim lost or found
                    items in our barangay Lost &amp; Found system.
                </p>
            </div>

            {/* How it works */}
            <section className="guide-section">
                <div className="guide-section-head">
                    <h2>How it works</h2>
                    <p>Four simple steps from reporting to reuniting.</p>
                </div>

                <div className="guide-steps-grid">
                    {steps.map((step, index) => (
                        <div className="guide-step-card" key={step.title}>
                            <div className="guide-step-number">{index + 1}</div>
                            <div className="guide-step-icon">{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tips */}
            <section className="guide-section">
                <div className="guide-section-head">
                    <h2>Tips for a faster match</h2>
                    <p>Small details that make a big difference.</p>
                </div>

                <div className="guide-tips-grid">
                    {tips.map((tip) => (
                        <div className="guide-tip-card" key={tip.title}>
                            <div className="guide-tip-icon">{tip.icon}</div>
                            <div>
                                <h4>{tip.title}</h4>
                                <p>{tip.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Status legend */}
            <section className="guide-section">
                <div className="guide-section-head">
                    <h2>Understanding item status</h2>
                    <p>What each status label means for your posts and claims.</p>
                </div>

                <div className="guide-status-grid">
                    <div className="guide-status-row">
                        <span className="guide-status-pill pending">Pending</span>
                        <p>Waiting for an admin to review your post or claim.</p>
                    </div>
                    <div className="guide-status-row">
                        <span className="guide-status-pill approved">Approved</span>
                        <p>Your post is live and visible to everyone browsing the site.</p>
                    </div>
                    <div className="guide-status-row">
                        <span className="guide-status-pill rejected">Rejected</span>
                        <p>Needs changes before it can go public - edit and resubmit it.</p>
                    </div>
                    <div className="guide-status-row">
                        <span className="guide-status-pill claimed">Claimed</span>
                        <p>The item has been successfully returned to its owner.</p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="guide-section">
                <div className="guide-section-head">
                    <h2>Frequently asked questions</h2>
                    <p>Still unsure about something? Start here.</p>
                </div>

                <div className="guide-faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            className={`guide-faq-item ${openFaq === index ? "open" : ""}`}
                            key={faq.question}
                        >
                            <button
                                className="guide-faq-question"
                                onClick={() => toggleFaq(index)}
                            >
                                <span>{faq.question}</span>
                                <svg
                                    className="guide-faq-chevron"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                            {openFaq === index && (
                                <p className="guide-faq-answer">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact footer */}
            <section className="guide-footer-card">
                <h3>Still need help?</h3>
                <p>
                    If you can't find what you're looking for here, reach out to the
                    barangay office directly and they'll be happy to assist you.
                </p>
            </section>
        </div>
    );
};

export default UserGuide;