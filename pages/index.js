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
   ATS helpers
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
   YOCO LINKS (REAL)
========================= */
const YOCO_BASIC_LINK = "https://pay.yoco.com/r/7lOlyX";
const YOCO_PREMIUM_LINK = "https://pay.yoco.com/r/melxn0";

/* =========================
   Page
========================= */
export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);

  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);

  /* =========================
     Auth
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
     Subscription
  ========================= */
  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoadingSub(false);
      return;
    }

    const fetchSub = async () => {
      setLoadingSub(true);
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("id", user.id)
        .single();

      setSubscription(data || null);
      setLoadingSub(false);
    };

    fetchSub();
  }, [user]);

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
    if (!resume || !jobDesc) {
      alert("Paste both resume and job description");
      return;
    }

    const resumeKeywords = extractKeywords(resume);
    const jobKeywords = extractKeywords(jobDesc);

    const matched = intersection(jobKeywords, resumeKeywords);
    const percent = Math.round(
      (matched.length / jobKeywords.length) * 100
    );

    const missing = jobKeywords
      .filter(k => !resumeKeywords.includes(k))
      .slice(0, 20);

    setResult({ percent, missing });
  }

  /* =========================
     Payment redirect
  ========================= */
  const goPay = (plan) => {
    if (!user) {
      alert("Please log in first");
      return;
    }

    const base =
      plan === "basic" ? YOCO_BASIC_LINK : YOCO_PREMIUM_LINK;

    window.location.href = `${base}?user_id=${user.id}&plan=${plan}`;
  };

  /* =========================
     UI
  ========================= */
  return (
    <>
      <header className="header">
        <div className="logo">ATS Resume Checker</div>

        <nav className={navOpen ? "open" : ""}>
          <a href="#how">How It Works</a>
          <a href="#pricing">Pricing</a>
          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <a href="/login">Login</a>
          )}
        </nav>

        <button className="menu" onClick={() => setNavOpen(!navOpen)}>
          ☰
        </button>
      </header>

      <section className="hero">
        <h1>Beat ATS. Get More Interviews.</h1>
        <p>Check how well your resume matches any job description.</p>
        <a href="#pricing" className="btn-primary">
          Upgrade Now
        </a>
      </section>

      <main className="container">
        <label>Paste Resume</label>
        <textarea value={resume} onChange={e => setResume(e.target.value)} />

        <label>Paste Job Description</label>
        <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} />

        <button
          className="btn-primary"
          onClick={handleCheck}
          disabled={user && !isSubscriptionActive()}
        >
          Check ATS Match
        </button>

        {result && (
          <section className="alert">
            <h3>ATS Score: {result.percent}%</h3>
            <ul>
              {result.missing.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <section id="how" className="section">
        <h2>How It Works</h2>
        <div className="cards">
          <div className="card">Paste your resume</div>
          <div className="card">Paste job description</div>
          <div className="card">Get ATS score + missing keywords</div>
        </div>
      </section>

      <section id="pricing" className="section dark">
        <h2>Pricing</h2>

        <div className="pricing">
          <div className="price-card">
            <h3>Basic</h3>
            <p className="price">R99</p>
            <p>One-time resume check</p>
            <button className="btn-primary full" onClick={() => goPay("basic")}>
              Buy Basic
            </button>
          </div>

          <div className="price-card featured">
            <h3>Premium</h3>
            <p className="price">R199</p>
            <p>7-day unlimited access</p>
            <button className="btn-primary full" onClick={() => goPay("premium")}>
              Buy Premium
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} ATS Resume Checker
      </footer>
    </>
  );
}
