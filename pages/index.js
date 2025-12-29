// pages/index.js
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

/* =========================
   Supabase client
========================= */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* =========================
   Keyword logic
========================= */
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

function extractKeywords(text) {
  const words = tokenize(text);
  const counts = {};
  words.forEach(w => (counts[w] = (counts[w] || 0) + 1));
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([w]) => w);
}

function intersection(a, b) {
  const setB = new Set(b);
  return a.filter(x => setB.has(x));
}

/* =========================
   Component
========================= */
export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  /* 🔑 AUTH STATE */
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /* =========================
     ATS Check
  ========================= */
  function handleCheck() {
    if (!resume.trim() || !jobDesc.trim()) {
      alert("Please paste both your resume and the job description.");
      return;
    }

    const resumeKeywords = extractKeywords(resume);
    const jobKeywords = extractKeywords(jobDesc);

    const matched = intersection(jobKeywords, resumeKeywords);
    const matchPercent = Math.round(
      (matched.length / jobKeywords.length) * 100
    );

    const missing = jobKeywords
      .filter(k => !resumeKeywords.includes(k))
      .slice(0, 20);

    setResult({ matchPercent, missingKeywords: missing });
    setShowAlert(true);
  }

  return (
    <>
      {/* =========================
          STYLES (unchanged)
      ========================= */}
      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
          background-color: #0a2540;
          color: white;
        }
        a { color: #4db5ff; text-decoration: none; }
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
        .btn-primary {
          background: #4db5ff;
          color: #06203f;
          padding: 10px 16px;
          border-radius: 6px;
          border: none;
          font-weight: 700;
          cursor: pointer;
        }
        textarea {
          width: 100%;
          min-height: 150px;
          padding: 12px;
          border-radius: 6px;
          border: none;
          margin-bottom: 20px;
        }
        .container { max-width: 960px; margin: 0 auto; padding: 20px; }
        .alert {
          background: #08305e;
          padding: 20px;
          border-radius: 10px;
          margin: 30px auto;
          max-width: 700px;
        }
      `}</style>

      {/* =========================
          HEADER
      ========================= */}
      <header>
        <div className="logo">ATS Resume Checker</div>

        <nav>
          <a href="#how-it-works">How It Works</a>
          <a href="#steps">Steps</a>
          <a href="#pricing">Pricing</a>
          <a href="/pricing" className="btn-primary">Upgrade Now</a>

          {user ? (
            <button onClick={handleLogout} className="btn-primary">
              Logout
            </button>
          ) : (
            <a href="/login" className="btn-primary">
              Login
            </a>
          )}
        </nav>
      </header>

      {/* =========================
          MAIN
      ========================= */}
      <main className="container">
        <h1>ATS Resume Checker</h1>

        <textarea
          placeholder="Paste your resume"
          value={resume}
          onChange={e => setResume(e.target.value)}
        />

        <textarea
          placeholder="Paste job description"
          value={jobDesc}
          onChange={e => setJobDesc(e.target.value)}
        />

        <button className="btn-primary" onClick={handleCheck}>
          Check ATS Match
        </button>

        {showAlert && result && (
          <div className="alert">
            <h3>ATS Match: {result.matchPercent}%</h3>
            <ul>
              {result.missingKeywords.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer style={{ textAlign: "center", padding: 20 }}>
        © {new Date().getFullYear()} ATS Resume Checker
      </footer>
    </>
  );
}
