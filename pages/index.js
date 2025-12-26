import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [jobDescText, setJobDescText] = useState("");
  const [result, setResult] = useState(null);
  const router = useRouter();

  // Simple stop words to ignore very common words
  const stopWords = new Set([
    "the", "and", "a", "an", "in", "on", "at", "for", "with", "to", "of", "by",
    "is", "it", "this", "that", "as", "are", "be", "from", "or", "but", "if",
    "then", "so", "such", "can", "will", "all", "you", "your", "our", "us",
  ]);

  const extractKeywords = (text) => {
    return text
      .toLowerCase()
      .match(/\b\w+\b/g) // extract words only
      .filter((word) => word.length > 2 && !stopWords.has(word)) // ignore short/common words
      .reduce((set, word) => set.add(word), new Set());
  };

  const handleCheck = (e) => {
    e.preventDefault();

    if (!resumeText.trim() || !jobDescText.trim()) {
      alert("Please paste both your resume and the job description.");
      return;
    }

    const jobKeywords = extractKeywords(jobDescText);
    const resumeKeywords = extractKeywords(resumeText);

    const matchedKeywords = [...jobKeywords].filter((kw) => resumeKeywords.has(kw));
    const missingKeywords = [...jobKeywords].filter((kw) => !resumeKeywords.has(kw));

    const score = Math.round((matchedKeywords.length / jobKeywords.size) * 100);

    setResult({
      score,
      missingKeywords,
    });
  };

  return (
    <>
      <style>{`
        /* Your existing styles here, unchanged for brevity */
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
        .result {
          max-width: 700px;
          margin: 0 auto 40px;
          background: #08305e;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          color: #a8c4ff;
        }
        .result h3 {
          margin-top: 0;
          color: #4db5ff;
        }
        .missing-keywords {
          margin-top: 10px;
          font-size: 0.9rem;
          color: #e0aaff;
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

          {/* Show results */}
          {result && (
            <div className="result" aria-live="polite">
              <h3>ATS Match Score: {result.score}%</h3>
              {result.missingKeywords.length > 0 ? (
                <>
                  <p>Missing keywords you should add:</p>
                  <ul className="missing-keywords">
                    {result.missingKeywords.map((kw, i) => (
                      <li key={i}>{kw}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Great job! Your resume covers all the important keywords.</p>
              )}
              <p style={{ marginTop: "20px" }}>
                Want to learn more about your resume’s quality?{" "}
                <button
                  className="btn-primary"
                  onClick={() => router.push("/pricing")}
                  style={{ fontSize: "1rem", padding: "8px 20px" }}
                >
                  Upgrade Now
                </button>
              </p>
            </div>
          )}
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
          <h2>Pricing Plans</h2>
          <div style={{ maxWidth: 600, margin: "0 auto", color: "#cbd5ff" }}>
            <h3>Free Access</h3>
            <p>
              Get a basic ATS keyword match score and list of missing keywords — free and unlimited.
              This lets you try the core service with no cost or signup.
            </p>

            <h3>Basic Optimization - $5 (One-Time)</h3>
            <p>
              ATS keyword match score<br />
              List of missing keywords<br />
              5 AI-generated resume bullet suggestions (planned for future)<br />
              Instant access after payment — no signup needed
            </p>

            <h3>7-Day Unlimited Access - $12</h3>
            <p>
              Unlimited resume checks and optimizations<br />
              Priority processing speed<br />
              Email receipt and friendly support<br />
              No subscription — pay once and use for 7 days
            </p>
          </div>
        </section>
      </main>

      <footer>
        &copy; {new Date().getFullYear()} ATS Resume Checker. All rights reserved.
      </footer>
    </>
  );
}
