// pages/index.js
import { useState, useEffect } from "react";

const STOPWORDS = new Set([
  "i","me","my","myself","we","our","ours","ourselves","you","your","yours",
  "yourself","yourselves","he","him","his","himself","she","her","hers","herself",
  "it","its","itself","they","them","their","theirs","themselves","what","which",
  "who","whom","this","that","these","those","am","is","are","was","were","be",
  "been","being","have","has","had","having","do","does","did","doing","a","an",
  "the","and","but","if","or","because","as","until","while","of","at","by","for",
  "with","about","against","between","into","through","during","before","after",
  "above","below","to","from","up","down","in","out","on","off","over","under",
  "again","further","then","once","here","there","when","where","why","how","all",
  "any","both","each","few","more","most","other","some","such","no","nor","not",
  "only","own","same","so","than","too","very","s","t","can","will","just","don",
  "should","now"
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // Remove punctuation
    .split(/\s+/)
    .filter(Boolean)
    .filter(word => !STOPWORDS.has(word));
}

function getKeywordCounts(words) {
  const counts = {};
  words.forEach(w => {
    counts[w] = (counts[w] || 0) + 1;
  });
  return counts;
}

function extractKeywords(text) {
  const words = tokenize(text);
  const counts = getKeywordCounts(words);
  // Sort by frequency desc
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  // Return top 50 keywords max (to keep manageable)
  return sorted.slice(0, 50).map(([word]) => word);
}

function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter(x => set2.has(x));
}

// Simulate user state for gating features
// For now, hardcode values here; in real app this comes from auth + backend/payment
const getUserStatus = () => {
  // Example user states to test:
  // return { tier: "free" }; // free user
  // return { tier: "basic", paidAt: Date.now() - 1000 * 60 * 60 * 24 * 2 }; // $5 user (paid 2 days ago)
  // return { tier: "premium", paidAt: Date.now() - 1000 * 60 * 60 * 24 * 3 }; // $12 user, paid 3 days ago
  // return { tier: "premium", paidAt: Date.now() - 1000 * 60 * 60 * 24 * 8 }; // expired $12 user (paid 8 days ago)

  // For demo, start as free user:
  return { tier: "free" };
};

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const [userStatus, setUserStatus] = useState(getUserStatus());

  // Check if premium access is still valid (7 days for premium)
  const isPremiumActive = () => {
    if (userStatus.tier !== "premium" || !userStatus.paidAt) return false;
    const paidAt = userStatus.paidAt;
    const now = Date.now();
    return now - paidAt < 1000 * 60 * 60 * 24 * 7; // 7 days in ms
  };

  // Whether user can use unlimited checks (premium)
  const canUseUnlimited = () => {
    if (userStatus.tier === "premium") return isPremiumActive();
    return false;
  };

  // Whether user has paid basic $5 plan
  const hasBasicAccess = () => userStatus.tier === "basic";

  // Handle ATS check
  function handleCheck() {
    if (!resume.trim() || !jobDesc.trim()) {
      alert("Please paste both your resume and the job description.");
      return;
    }

    // Free users get basic ATS only
    // Basic ($5) and Premium ($12) get same basic ATS + future optimizations
    const resumeKeywords = extractKeywords(resume);
    const jobKeywords = extractKeywords(jobDesc);

    const matched = intersection(jobKeywords, resumeKeywords);
    const matchPercent = Math.round((matched.length / jobKeywords.length) * 100);

    // Missing keywords (jobKeywords not in resumeKeywords)
    const missing = jobKeywords.filter(k => !resumeKeywords.includes(k));

    // Limit missing to 20 max
    const missingLimited = missing.slice(0, 20);

    // Build result object
    setResult({
      matchPercent,
      missingKeywords: missingLimited,
    });
    setShowAlert(true);
  }

  // For demo/testing: Function to simulate payment (change user tier)
  function simulatePayment(tier) {
    const now = Date.now();
    if (tier === "free") {
      setUserStatus({ tier: "free" });
    } else if (tier === "basic") {
      setUserStatus({ tier: "basic", paidAt: now });
    } else if (tier === "premium") {
      setUserStatus({ tier: "premium", paidAt: now });
    }
    setShowAlert(false);
    setResult(null);
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
          padding: 40px 0 20px;
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

        /* Form */
        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
        }
        textarea {
          width: 100%;
          min-height: 150px;
          margin-bottom: 24px;
          border-radius: 6px;
          border: none;
          padding: 12px;
          font-size: 1rem;
          font-family: monospace, monospace;
          resize: vertical;
        }

        /* Alert style */
        .alert {
          background-color: #08305e;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.5);
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        .alert h3 {
          margin-top: 0;
          color: #4db5ff;
        }
        .alert ul {
          list-style-type: disc;
          padding-left: 20px;
          color: #cbd5ff;
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 10px;
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
          <a href="#how-it-works" onClick={() => setNavOpen(false)}>How It Works</a>
          <a href="#steps" onClick={() => setNavOpen(false)}>Steps</a>
          <a href="#pricing" onClick={() => setNavOpen(false)}>Pricing</a>
          <a
            href="#pricing"
            onClick={() => setNavOpen(false)}
            style={{
              background: "#4db5ff",
              color: "#06203f",
              padding: "8px 14px",
              borderRadius: "6px",
              fontWeight: "700",
              textDecoration: "none"
            }}
          >
            Upgrade Now
          </a>
        </nav>
      </header>

      <main className="container">
        <section className="hero" id="hero">
          <h1>ATS Resume Checker</h1>
          <p>
            Quickly find out if your resume passes Applicant Tracking Systems (ATS)
            used by employers. Fix missing keywords and boost your chances to get
            hired.
          </p>
        </section>

        <section id="form-section">
          <label htmlFor="resume">Paste Your Resume</label>
          <textarea
            id="resume"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume text here..."
          />

          <label htmlFor="jobDesc">Paste Job Description</label>
          <textarea
            id="jobDesc"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the job description here..."
          />

          <button className="btn-primary" onClick={handleCheck}>
            Check ATS Match
          </button>
        </section>

        {showAlert && result && (
          <section className="alert" aria-live="polite" role="alert">
            <h3>ATS Match Score: {result.matchPercent}%</h3>
            {result.missingKeywords.length > 0 ? (
              <>
                <p>Missing keywords you should add (max 20):</p>
                <ul>
                  {result.missingKeywords.map((kw, i) => (
                    <li key={i}>{kw}</li>
                  ))}
                </ul>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setShowAlert(false);
                  }}
                >
                  Close
                </button>
              </>
            ) : (
              <p>Great! Your resume matches all important keywords.</p>
            )}
          </section>
        )}

        <section id="how-it-works">
          <h2>How It Works</h2>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "#cbd5ff" }}>
            Paste your resume and the job description you want to apply for. Our
            system analyzes keywords and gives you a match score along with a list
            of missing keywords to improve your resume.
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
              <h3>3. Check Your Score</h3>
              <p>
                Click "Check ATS Match" to see your keyword match percentage and
                missing keywords.
              </p>
            </div>
            <div className="step">
              <h3>4. Upgrade for More</h3>
              <p>
                Upgrade to unlock advanced resume optimization features and
                suggestions.
              </p>
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
          <h2>Pricing Plans</h2>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "#cbd5ff" }}>
            <strong>Free Access</strong>
            <br />
            Get a basic ATS keyword match score and list of missing keywords — free
            and unlimited. This lets you try the core service with no cost or signup.
          </p>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "#cbd5ff" }}>
            <strong>Basic Optimization - $5 (One-Time)</strong>
            <br />
            ATS keyword match score
            <br />
            List of missing keywords
            <br />
            5 AI-generated resume bullet suggestions (planned for future)
            <br />
            Instant access after payment — no signup needed
          </p>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "#cbd5ff" }}>
            <strong>7-Day Unlimited Access - $12</strong>
            <br />
            Unlimited resume checks and optimizations
            <br />
            Priority processing speed
            <br />
            Email receipt and friendly support
            <br />
            No subscription — pay once and use for 7 days
          </p>
        </section>

        {/* Premium gating demo buttons */}
        <section style={{ maxWidth: 600, margin: "0 auto", marginBottom: 60, color: "#cbd5ff" }}>
          <h2>User Status (Demo)</h2>
          <p>
            Current Tier:{" "}
            <strong style={{ color: "#4db5ff" }}>{userStatus.tier.toUpperCase()}</strong>
            {userStatus.paidAt && userStatus.tier !== "free" && (
              <>
                {" "}
                (Paid on {new Date(userStatus.paidAt).toLocaleDateString()})
              </>
            )}
          </p>
          <p>
            {userStatus.tier === "premium" && !isPremiumActive() && (
              <em style={{ color: "#f77" }}>
                Your 7-day premium access has expired. Please upgrade again.
              </em>
            )}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => simulatePayment("free")}>
              Set Free User
            </button>
            <button className="btn-primary" onClick={() => simulatePayment("basic")}>
              Simulate $5 Basic Payment
            </button>
            <button className="btn-primary" onClick={() => simulatePayment("premium")}>
              Simulate $12 Premium Payment
            </button>
          </div>
        </section>

        {/* Show premium feature placeholder UI */}
        {result && (hasBasicAccess() || canUseUnlimited()) && (
          <section
            className="alert"
            aria-live="polite"
            role="alert"
            style={{ maxWidth: 700, margin: "20px auto" }}
          >
            <h3>Premium Feature</h3>
            <p>
              {hasBasicAccess()
                ? "You have access to the Basic Optimization features (including future AI suggestions)."
                : canUseUnlimited()
                ? "You have Unlimited Access for 7 days. Enjoy all premium features!"
                : ""}
            </p>
          </section>
        )}
      </main>

      <footer>
        &copy; {new Date().getFullYear()} ATS Resume Checker. All rights reserved.
      </footer>
    </>
  );
}
