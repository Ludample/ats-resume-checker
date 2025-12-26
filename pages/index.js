// pages/index.js
import { useState } from "react";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);

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

        /* Pricing */
        #pricing {
          max-width: 600px;
          margin: 0 auto 64px;
          color: #cbd5ff;
        }
        #pricing h2 {
          color: #4db5ff;
          margin-bottom: 24px;
          text-align: center;
        }
        #pricing div {
          background: #08305e;
          border-radius: 10px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        #pricing h3 {
          color: #a8c4ff;
          margin-top: 0;
        }
        #pricing ul {
          margin-left: 20px;
          margin-bottom: 24px;
        }
        #pricing ul li {
          margin-bottom: 8px;
          font-size: 1rem;
          line-height: 1.4;
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
          <a href="#input-form" onClick={() => setNavOpen(false)}>
            Get Started
          </a>
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
                .getElementById("input-form")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Get Started
          </button>
        </section>

        <section id="input-form" style={{ maxWidth: 700, margin: "0 auto 64px" }}>
          <h2 style={{ color: "#4db5ff", textAlign: "center", marginBottom: 24 }}>
            Paste Your Resume & Job Description
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Form submitted! Next: implement resume analysis.");
              // Placeholder, will add real logic soon
            }}
          >
            <label htmlFor="resume" style={{ color: "#cbd5ff", fontWeight: "600" }}>
              Your Resume:
            </label>
            <textarea
              id="resume"
              name="resume"
              required
              rows={8}
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 24,
                borderRadius: 6,
                border: "1px solid #4db5ff",
                fontSize: "1rem",
                resize: "vertical",
                backgroundColor: "#06203f",
                color: "white",
              }}
              placeholder="Paste your resume text here..."
            ></textarea>

            <label
              htmlFor="jobDescription"
              style={{ color: "#cbd5ff", fontWeight: "600" }}
            >
              Job Description:
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              required
              rows={8}
              style={{
                width: "100%",
                padding: 12,
                marginBottom: 24,
                borderRadius: 6,
                border: "1px solid #4db5ff",
                fontSize: "1rem",
                resize: "vertical",
                backgroundColor: "#06203f",
                color: "white",
              }}
              placeholder="Paste the job description here..."
            ></textarea>

            <button
              type="submit"
              className="btn-primary"
              style={{ display: "block", margin: "0 auto" }}
            >
              Check Resume
            </button>
          </form>
        </section>

        <section id="how-it-works">
          <h2>How It Works</h2>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "#cbd5ff" }}>
            Paste your resume and the job description you want to apply for. Our AI
            analyzes the keywords and gives you a match score along with
            suggestions to improve your resume and increase your chances of passing
            the ATS filters.
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
              <p>Pay a small fee to unlock full, AI-generated resume improvements.</p>
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
          <div>
            <h3>Basic Optimization</h3>
            <p>For <strong>$5</strong> you get:</p>
            <ul>
              <li>ATS keyword match score</li>
              <li>List of missing keywords</li>
              <li>Instant access after payment — no signup needed</li>
            </ul>

            <h3>7-Day Unlimited Access</h3>
            <p>For <strong>$12</strong>, you get:</p>
            <ul>
              <li>Unlimited resume checks and optimizations</li>
              <li>Priority processing speed</li>
              <li>Email receipt and friendly support</li>
              <li>No subscription — pay once and use for 7 days</li>
            </ul>
          </div>
        </section>
      </main>

      <footer>
        &copy; {new Date().getFullYear()} ATS Resume Checker. All rights reserved.
      </footer>
    </>
  );
}
