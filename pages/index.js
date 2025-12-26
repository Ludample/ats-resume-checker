// pages/index.js
import { useState } from "react";

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
    .replace(/[^a-z0-9\s]/g, " ")
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
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 50).map(([word]) => word);
}

function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter(x => set2.has(x));
}

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
    const matchPercent = Math.round((matched.length / jobKeywords.length) * 100);
    const missing = jobKeywords.filter(k => !resumeKeywords.includes(k)).slice(0, 20);

    setResult({ matchPercent, missingKeywords: missing });
    setShowAlert(true);
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto;
          background-color: #0a2540;
          color: white;
        }
        header {
          background: #06203f;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        nav { display: flex; gap: 20px; align-items: center; }
        nav a { font-weight: 600; cursor: pointer; }
        .logo { font-size: 1.4rem; font-weight: 700; }

        .container { max-width: 960px; margin: auto; padding: 40px 20px; }

        textarea {
          width: 100%;
          min-height: 150px;
          margin-bottom: 20px;
          border-radius: 6px;
          padding: 12px;
          border: none;
        }

        .btn-primary {
          background: #4db5ff;
          color: #06203f;
          border: none;
          padding: 14px 28px;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
        }

        .alert {
          background: #08305e;
          padding: 20px;
          border-radius: 10px;
          margin-top: 30px;
        }

        footer {
          background: #041a30;
          text-align: center;
          padding: 20px;
          font-size: 0.9rem;
        }
      `}</style>

      <header>
        <div className="logo">ATS Resume Checker</div>

        <nav>
          <a href="#how-it-works">How It Works</a>
          <a href="#steps">Steps</a>
          <a href="#pricing">Pricing</a>

          <a
            href="/pricing"
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
        <h1>Check Your ATS Match</h1>

        <textarea
          placeholder="Paste your resume here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <textarea
          placeholder="Paste the job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />

        <button className="btn-primary" onClick={handleCheck}>
          Check ATS Match
        </button>

        {showAlert && result && (
          <div className="alert">
            <h3>ATS Match Score: {result.matchPercent}%</h3>
            <p>Missing keywords (top 20):</p>
            <ul>
              {result.missingKeywords.map((kw, i) => (
                <li key={i}>{kw}</li>
              ))}
            </ul>
          </div>
        )}

        <section id="pricing">
          <h2>Pricing</h2>
          <p><strong>Free:</strong> Basic ATS score + missing keywords</p>
          <p><strong>$5:</strong> One-time premium unlock</p>
          <p><strong>$12:</strong> Unlimited access for 7 days</p>
        </section>
      </main>

      <footer>
        © {new Date().getFullYear()} ATS Resume Checker
      </footer>
    </>
  );
}
