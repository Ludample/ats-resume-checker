import { useState } from "react";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  // Dummy function for scoring, replace with your real logic
  function performScoring() {
    // For demo, hardcoding values; replace with actual scoring results
    const score = 75;
    const missingKeywords = ["leadership", "budgeting", "compliance"];
    setScoreData({ score, missingKeywords });
    setModalOpen(true);
  }

  return (
    <>
      <style>{`
        /* Reset and basics */
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          background-color: #0a2540;
          color: white;
        }
        a {
          color: #4db5ff;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }

        /* Container */
        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 20px 60px;
        }

        /* Header */
        header {
          background-color: #06203f;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px;
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .logo {
          font-weight: 700;
          font-size: 1.5rem;
          color: white;
          user-select: none;
        }
        nav {
          display: flex;
          gap: 24px;
          align-items: center;
        }
        nav a {
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
        }
        .nav-toggle {
          display: none;
          cursor: pointer;
          flex-direction: column;
          gap: 5px;
        }
        .nav-toggle span {
          width: 25px;
          height: 3px;
          background: white;
          border-radius: 2px;
        }

        /* Mobile nav */
        @media (max-width: 600px) {
          nav {
            display: none;
            position: absolute;
            top: 60px;
            right: 20px;
            background: #06203f;
            flex-direction: column;
            padding: 15px;
            border-radius: 6px;
            width: 150px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          }
          nav.open {
            display: flex;
          }
          .nav-toggle {
            display: flex;
          }
        }

        /* Hero */
        .hero {
          padding: 80px 0 40px;
          text-align: center;
        }
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 16px;
          color: #4db5ff;
        }
        .hero p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto 32px;
          line-height: 1.5;
          color: #e0e7ff;
        }
        .btn-primary {
          background-color: #4db5ff;
          border: none;
          padding: 14px 32px;
          border-radius: 6px;
          color: #06203f;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          user-select: none;
        }
        .btn-primary:hover {
          background-color: #3a9ded;
        }

        /* Sections */
        section {
          margin-bottom: 64px;
        }
        h2 {
          font-size: 2rem;
          color: #4db5ff;
          margin-bottom: 24px;
          text-align: center;
        }
        .steps {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .step {
          background: #08305e;
          border-radius: 8px;
          padding: 20px;
          max-width: 280px;
          flex: 1 1 250px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          text-align: center;
        }
        .step h3 {
          margin-top: 0;
          color: #a8c4ff;
        }
        .step p {
          font-size: 1rem;
          line-height: 1.4;
          color: #cbd5ff;
        }

        /* Stats */
        .stats {
          background: #06203f;
          padding: 40px 20px;
          border-radius: 10px;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          box-shadow: 0 2px 12px rgba(0,0,0,0.5);
        }
        .stats p {
          font-size: 1.25rem;
          margin: 0;
          font-weight: 600;
          color: #a0c8ff;
        }

        /* Footer */
        footer {
          background: #041a30;
          text-align: center;
          padding: 20px;
          color: #7a8ca3;
          font-size: 0.9rem;
          user-select: none;
        }

        /* Modal styles */
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: #06203f;
          padding: 24px;
          border-radius: 8px;
          max-width: 400px;
          color: #e0e7ff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.6);
          text-align: center;
          user-select: none;
        }
        .modal h3 {
          margin-top: 0;
          color: #4db5ff;
        }
        .modal p {
          margin-bottom: 16px;
        }
        .modal ul {
          text-align: left;
          margin-bottom: 20px;
          padding-left: 20px;
        }
        .btn-close, .btn-upgrade {
          cursor: pointer;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 1rem;
          margin: 0 8px;
          user-select: none;
        }
        .btn-close {
          background: #355080;
          color: white;
        }
        .btn-close:hover {
          background: #2a3c6f;
        }
        .btn-upgrade {
          background: #4db5ff;
          color: #06203f;
        }
        .btn-upgrade:hover {
          background: #3a9ded;
        }
      `}</style>

      <header>
        <div className="logo">ATS Resume Checker</div>

        <div
          className="nav-toggle"
          onClick={() => setNavOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={navOpen ? "open" : ""}>
          <a href="#how-it-works" onClick={() => setNavOpen(false)}>
            How It Works
          </a>
          <a href="#steps" onClick={() => setNavOpen(false)}>
            Steps
          </a>
          <a href="#pricing" onClick={() => setNavOpen(false)}>
            Pricing
          </a>
        </nav>
      </header>

      <main className="container">
        <section className="hero" id="hero">
          <h1>ATS Resume Checker</h1>
          <p>
            Quickly find out if your resume passes Applicant Tracking Systems
            (ATS) used by employers. Fix missing keywords and boost your chances
            to get hired.
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              document
                .getElementById("steps")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Get Started
          </button>
        </section>

        <section id="how-it-works">
          <h2>How It Works</h2>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "#cbd5ff" }}>
            Paste your resume and the job description you want to apply for. Our
            tool analyzes the keywords and gives you a match score along with
            suggestions to improve your resume and increase your chances of
            passing the ATS filters.
          </p>
        </section>

        <section id="steps">
          <h2>Simple Steps to Get Started</h2>
          <div className="steps">
            <div className="step">
              <h3>1. Paste Your Resume</h3>
              <p>Copy and paste your current resume text into the tool.</p>
            </div>
            <div className="step">
              <h3>2. Paste Job Description</h3>
              <p>Copy and paste the job description for your target role.</p>
            </div>
            <div className="step">
              <h3>3. Get Your Score & Suggestions</h3>
              <p>See your ATS match score and get clear keyword fixes.</p>
            </div>
            <div className="step">
              <h3>4. Pay & Unlock</h3>
              <p>Pay a small fee to unlock full, detailed resume improvements.</p>
            </div>
          </div>
        </section>

        <section id="stats" className="stats">
          <p>
            <strong>
              We’ve helped over 4,200 job seekers improve their resumes and land
              interviews!
            </strong>
          </p>
        </section>

        <section id="pricing">
          <h2>Pricing</h2>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "#cbd5ff" }}>
            Free basic ATS score and missing keywords. Unlock the full resume
            optimization for only <strong>$5</strong>. Unlimited access for 7
            days for <strong>$12</strong>.
          </p>
        </section>

        {/* Form section */}
        <section id="form-section" style={{ marginTop: "40px" }}>
          <h2>Try It Now</h2>
          <textarea
            id="resume-input"
            placeholder="Paste your resume here"
            style={{ width: "100%", height: "120px", marginBottom: "10px", padding: "8px", borderRadius: "6px", border: "none", fontSize: "1rem" }}
          />
          <textarea
            id="jobdesc-input"
            placeholder="Paste the job description here"
            style={{ width: "100%", height: "120px", marginBottom: "10px", padding: "8px", borderRadius: "6px", border: "none", fontSize: "1rem" }}
          />
          <button className="btn-primary" onClick={performScoring}>
            Check Resume
          </button>
        </section>
      </main>

      <footer>
        &copy; {new Date().getFullYear()} ATS Resume Checker. All rights reserved.
      </footer>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <h3 id="modal-title">ATS Match Score: {scoreData.score}%</h3>
            <p>Missing Keywords:</p>
            {scoreData.missingKeywords.length ? (
              <ul>
                {scoreData.missingKeywords.map((kw, i) => (
                  <li key={i}>{kw}</li>
                ))}
              </ul>
            ) : (
              <p>None! Great job!</p>
            )}
            <p>
              Want to learn more about your resume’s quality?{" "}
              <button
                className="btn-upgrade"
                onClick={() => {
                  setModalOpen(false);
                  document.getElementById("pricing").scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Upgrade Now
              </button>
            </p>
            <button
              className="btn-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
