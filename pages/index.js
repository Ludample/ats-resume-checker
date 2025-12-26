// pages/index.js
import { useState } from "react";

/* -------------------- KEYWORD LOGIC -------------------- */

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
  "only","own","same","so","than","too","very","can","will","just","should","now"
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter(w => !STOPWORDS.has(w));
}

function extractKeywords(text) {
  const words = tokenize(text);
  const counts = {};
  words.forEach(w => (counts[w] = (counts[w] || 0) + 1));
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);
}

function intersection(a, b) {
  const set = new Set(b);
  return a.filter(x => set.has(x));
}

/* -------------------- COMPONENT -------------------- */

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  function handleCheck() {
    if (!resume.trim() || !jobDesc.trim()) {
      alert("Please paste both your resume and the job description.");
      return;
    }

    const resumeKeywords = extractKeywords(resume);
    const jobKeywords = extractKeywords(jobDesc);

    const matched = intersection(jobKeywords, resumeKeywords);
    const missing = jobKeywords.filter(k => !resumeKeywords.includes(k));

    setResult({
      matchPercent: Math.round((matched.length / jobKeywords.length) * 100),
      missingKeywords: missing.slice(0, 20)
    });

    setShowAlert(true);
  }

  return (
    <>
      {/* -------------------- HEADER -------------------- */}
      <header>
        <div className="logo">ATS Resume Checker</div>

        <div className="nav-toggle" onClick={() => setNavOpen(!navOpen)}>
          <span />
          <span />
          <span />
        </div>

        <nav className={navOpen ? "open" : ""}>
          <a href="#how-it-works" onClick={() => setNavOpen(false)}>How It Works</a>
          <a href="#steps" onClick={() => setNavOpen(false)}>Steps</a>
          <a href="#pricing" onClick={() => setNavOpen(false)}>Pricing</a>

          {/* 🔥 UPGRADE BUTTON */}
          <a
            href="/pricing"
            onClick={() => setNavOpen(false)}
            style={{
              background: "#4db5ff",
              color: "#06203f",
              padding: "8px 14px",
              borderRadius: "6px",
              fontWeight: 700,
              textDecoration: "none"
            }}
          >
            Upgrade Now
          </a>
        </nav>
      </header>

      {/* -------------------- MAIN -------------------- */}
      <main className="container">
        {/* HERO */}
        <section className="hero">
          <h1>ATS Resume Checker</h1>
          <p>Instantly see how well your resume matches any job description.</p>
        </section>

        {/* FORM */}
        <section>
          <label>Paste Your Resume</label>
          <textarea value={resume} onChange={e => setResume(e.target.value)} />

          <label>Paste Job Description</label>
          <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} />

          <button className="btn-primary" onClick={handleCheck}>
            Check ATS Match
          </button>
        </section>

        {/* ALERT */}
        {showAlert && result && (
          <section className="alert">
            <h3>ATS Match Score: {result.matchPercent}%</h3>
            {result.missingKeywords.length > 0 && (
              <>
                <p>Missing keywords (max 20):</p>
                <ul>
                  {result.missingKeywords.map((k, i) => <li key={i}>{k}</li>)}
                </ul>
              </>
            )}
            <button className="btn-primary" onClick={() => setShowAlert(false)}>
              Close
            </button>
          </section>
        )}

        {/* HOW IT WORKS */}
        <section id="how-it-works">
          <h2>How It Works</h2>
          <p>
            We extract meaningful keywords from the job description and compare
            them against your resume to calculate an ATS-style match score.
          </p>
        </section>

        {/* STEPS */}
        <section id="steps">
          <h2>Steps</h2>
          <div className="steps">
            <div className="step">Paste Resume</div>
            <div className="step">Paste Job Description</div>
            <div className="step">Get Match Score</div>
            <div className="step">Optimize & Upgrade</div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing">
          <h2>Pricing</h2>
          <p><strong>Free:</strong> Basic ATS score + missing keywords</p>
          <p><strong>$5:</strong> One-time optimization</p>
          <p><strong>$12:</strong> 7-day unlimited access</p>
        </section>
      </main>

      <footer>
        © {new Date().getFullYear()} ATS Resume Checker
      </footer>
    </>
  );
}
