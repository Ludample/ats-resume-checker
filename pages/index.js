// pages/index.js
import { useState } from "react";

/* ---------- Keyword Logic ---------- */

const STOPWORDS = new Set([
  "i","me","my","we","our","you","your","he","she","they","them","it","this","that",
  "is","are","was","were","be","been","being","have","has","had","do","does","did",
  "a","an","the","and","but","if","or","because","as","of","at","by","for","with",
  "about","into","through","during","before","after","to","from","in","out","on",
  "off","over","under","again","then","once","here","there","when","where","why",
  "how","all","any","both","each","few","more","most","other","some","such","no",
  "nor","not","only","own","same","so","than","too","very","can","will","just"
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter(w => !STOPWORDS.has(w) && w.length > 2);
}

function extractTopKeywords(text, limit = 40) {
  const words = tokenize(text);
  const freq = {};
  words.forEach(w => (freq[w] = (freq[w] || 0) + 1));
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

/* ---------- Component ---------- */

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);

  function handleCheck() {
    if (!resume || !jobDesc) {
      alert("Please paste both your resume and the job description.");
      return;
    }

    const resumeKW = extractTopKeywords(resume);
    const jobKW = extractTopKeywords(jobDesc);

    const matched = jobKW.filter(k => resumeKW.includes(k));
    const missing = jobKW.filter(k => !resumeKW.includes(k)).slice(0, 20);

    const score = Math.round((matched.length / jobKW.length) * 100);

    setResult({
      score,
      missing
    });
  }

  return (
    <>
      {/* ---------- STYLES (RESTORED) ---------- */}
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
          background: #0a2540;
          color: #ffffff;
        }
        a { color: #4db5ff; text-decoration: none; }

        header {
          background: #06203f;
          padding: 18px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .logo {
          font-size: 1.4rem;
          font-weight: 800;
        }

        nav {
          display: flex;
          gap: 22px;
          align-items: center;
        }

        nav a {
          font-weight: 600;
        }

        .upgrade-btn {
          background: #4db5ff;
          color: #06203f;
          padding: 8px 14px;
          border-radius: 6px;
          font-weight: 700;
        }

        .container {
          max-width: 960px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .hero {
          text-align: center;
          margin-bottom: 50px;
        }

        .hero h1 {
          font-size: 3rem;
          color: #4db5ff;
        }

        textarea {
          width: 100%;
          min-height: 150px;
          padding: 12px;
          border-radius: 6px;
          border: none;
          margin-bottom: 20px;
          font-family: monospace;
        }

        label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }

        .btn-primary {
          background: #4db5ff;
          color: #06203f;
          border: none;
          padding: 14px 28px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
        }

        .alert {
          background: #08305e;
          padding: 24px;
          border-radius: 10px;
          margin-top: 30px;
        }

        .alert ul {
          padding-left: 20px;
          max-height: 220px;
          overflow-y: auto;
        }

        section {
          margin-bottom: 70px;
        }

        h2 {
          text-align: center;
          color: #4db5ff;
          margin-bottom: 24px;
        }

        .steps {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .step {
          background: #08305e;
          padding: 20px;
          border-radius: 8px;
          max-width: 260px;
          text-align: center;
        }

        footer {
          background: #041a30;
          text-align: center;
          padding: 20px;
          color: #7a8ca3;
        }
      `}</style>

      {/* ---------- HEADER ---------- */}
      <header>
        <div className="logo">ATS Resume Checker</div>

        <nav>
          <a href="#how-it-works">How It Works</a>
          <a href="#steps">Steps</a>
          <a href="#pricing">Pricing</a>
          <a href="/pricing" className="upgrade-btn">Upgrade Now</a>
        </nav>
      </header>

      {/* ---------- MAIN ---------- */}
      <main className="container">
        <section className="hero">
          <h1>ATS Resume Checker</h1>
          <p>Instantly see how well your resume matches any job description.</p>
        </section>

        <section>
          <label>Paste Your Resume</label>
          <textarea value={resume} onChange={e => setResume(e.target.value)} />

          <label>Paste Job Description</label>
          <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} />

          <button className="btn-primary" onClick={handleCheck}>
            Check ATS Match
          </button>
        </section>

        {result && (
          <div className="alert">
            <h3>ATS Match Score: {result.score}%</h3>
            <p>Missing keywords to consider adding:</p>
            <ul>
              {result.missing.map((k, i) => <li key={i}>{k}</li>)}
            </ul>
          </div>
        )}

        <section id="how-it-works">
          <h2>How It Works</h2>
          <p style={{ textAlign: "center" }}>
            We extract meaningful keywords from the job description and compare
            them against your resume to calculate an ATS-style match score.
          </p>
        </section>

        <section id="steps">
          <h2>Steps</h2>
          <div className="steps">
            <div className="step">Paste Resume</div>
            <div className="step">Paste Job Description</div>
            <div className="step">Get Match Score</div>
            <div className="step">Optimize & Upgrade</div>
          </div>
        </section>

        <section id="pricing">
          <h2>Pricing</h2>
          <p><strong>Free</strong>: Basic ATS score + missing keywords</p>
          <p><strong>$5</strong>: One-time optimization (advanced features coming)</p>
          <p><strong>$12</strong>: 7-day unlimited access</p>
        </section>
      </main>

      <footer>
        © {new Date().getFullYear()} ATS Resume Checker
      </footer>
    </>
  );
}
