import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescText, setJobDescText] = useState("");
  const router = useRouter();

  // Basic placeholder submit handler (you can add matching logic later)
  const handleCheck = (e) => {
    e.preventDefault();
    if (!resumeText.trim() || !jobDescText.trim()) {
      alert("Please paste both your resume and the job description.");
      return;
    }
    // For now just alert; replace with your logic later
    alert("Resume and Job Description received. Matching logic coming soon!");
  };

  return (
    <>
      <style>{`
        /* (same styles as before, omitted here for brevity but include them in your code) */
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
        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 20px 60px;
        }
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
        footer {
          background: #041a30;
          text-align: center;
          padding: 20px;
          color: #7a8ca3;
          font-size: 0.9rem;
          user-select: none;
        }

        /* Form styles */
        form {
          max-width: 700px;
          margin: 0 auto 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        textarea {
          width: 100%;
          height: 150px;
          padding: 12px;
          border-radius: 6px;
          border: none;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
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
              document.getElementById("steps").scrollIntoView({ behavior: "smooth" });
            }}
          >
            Get Started
          </button>
        </section>

        {/* Form section */}
        <section id="form-section">
          <form onSubmit={handleCheck}>
            <label htmlFor="resume">Paste Your Resume:</label>
            <textarea
              id="resume"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              required
            />
            <label htmlFor="jobdesc">Paste Job Description:</label>
            <textarea
              id="jobdesc"
              value={jobDescText}
              onChange={(e) => setJobDescText(e.target.value)}
              placeholder="Paste the job description here..."
              required
            />
            <button className="btn-primary" type="submit">
              Check ATS Match
            </button>
          </form>
        </section>

        <section id="how-it-works">
          <h2>How It Works</h2>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "#cbd5ff" }}>
            Paste your resume and the job description you want to apply for. Our system
            analyzes keywords and gives you a match score along with
            suggestions to improve your resume and increase your chances of passing
            ATS filters.
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
              <p>Pay a small fee to unlock full resume improvements.</p>
            </div>
          </div>
        </section>

        <section id="stats" className="stats">
          <p>
            <strong>We’ve helped over 4,200 job seekers improve their resumes and
            land interviews!</strong>
          </p>
        </section>

        <section id="pricing">
          <h2>Pricing</h2>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "#cbd5ff" }}>
            Free basic ATS score and missing keywords.<br/>
            Unlock the full resume optimization for only <strong>$5</strong>.<br/>
            Unlimited access for 7 days for <strong>$12</strong>.
          </p>
        </section>

        <section style={{ textAlign: "center" }}>
          <button
            className="btn-primary"
            onClick={() => router.push("/pricing")}
            style={{ marginTop: 20 }}
          >
            Upgrade Now
          </button>
        </section>
      </main>

      <footer>
        &copy; {new Date().getFullYear()} ATS Resume Checker. All rights reserved.
      </footer>
    </>
  );
}
