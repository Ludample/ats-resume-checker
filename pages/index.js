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
   ATS helpers (unchanged)
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
    .filter(w => !STOPWORDS.has(w));
}

function extractKeywords(text) {
  const counts = {};
  tokenize(text).forEach(w => {
    counts[w] = (counts[w] || 0) + 1;
  });
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
   Page
========================= */
export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  // auth + subscription
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  /* =========================
     Auth listener
  ========================= */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* =========================
     Fetch subscription
  ========================= */
  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoadingSub(false);
      return;
    }

    const fetchSubscription = async () => {
      setLoadingSub(true);

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) setSubscription(data);
      else setSubscription(null);

      setLoadingSub(false);
    };

    fetchSubscription();
  }, [user]);

  /* =========================
     Helpers
  ========================= */
  const isSubscriptionActive = () => {
    if (!subscription) return false;
    if (!subscription.active) return false;
    if (!subscription.expires_at) return false;
    return new Date(subscription.expires_at) > new Date();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /* =========================
     ATS check
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

  /* =========================
     UI
  ========================= */
  return (
    <>
      <header>
        <div className="logo">ATS Resume Checker</div>

        <div className="nav-toggle" onClick={() => setNavOpen(!navOpen)}>
          <span></span><span></span><span></span>
        </div>

        <nav className={navOpen ? "open" : ""}>
          <a href="#pricing">Pricing</a>
          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <a href="/login">Login</a>
          )}
        </nav>
      </header>

      <main className="container">
        <h1>ATS Resume Checker</h1>

        <label>Paste Your Resume</label>
        <textarea value={resume} onChange={e => setResume(e.target.value)} />

        <label>Paste Job Description</label>
        <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} />

        <button
          className="btn-primary"
          onClick={handleCheck}
          disabled={user && !isSubscriptionActive()}
          style={{
            opacity: user && !isSubscriptionActive() ? 0.5 : 1,
            cursor: user && !isSubscriptionActive() ? "not-allowed" : "pointer"
          }}
        >
          Check ATS Match
        </button>

        {user && !loadingSub && !isSubscriptionActive() && (
          <p style={{ color: "#f77", marginTop: 12 }}>
            Your access has expired. Please upgrade.
          </p>
        )}

        {user && subscription && (
          <p style={{ color: "#4db5ff", marginTop: 10 }}>
            Access valid until{" "}
            {new Date(subscription.expires_at).toLocaleDateString()}
          </p>
        )}

        {showAlert && result && (
          <section className="alert">
            <h3>ATS Match Score: {result.matchPercent}%</h3>
            {result.missingKeywords.length > 0 && (
              <ul>
                {result.missingKeywords.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      <footer>
        &copy; {new Date().getFullYear()} ATS Resume Checker
      </footer>
    </>
  );
}
