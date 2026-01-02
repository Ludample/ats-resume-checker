// pages/pricing.js
import Link from "next/link";

export default function Pricing() {
  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
          background-color: #0a2540;
          color: white;
        }
        .container {
          max-width: 720px;
          margin: 40px auto;
          padding: 24px;
          background: #06203f;
          border-radius: 10px;
        }
        h1, h2 {
          color: #4db5ff;
          text-align: center;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          padding: 8px 0;
          border-bottom: 1px solid #12416a;
        }
        .price {
          font-size: 2rem;
          color: #a0c8ff;
          text-align: center;
        }
        .btn-primary {
          display: block;
          width: 100%;
          margin-top: 16px;
          background: #4db5ff;
          color: #06203f;
          padding: 14px;
          border-radius: 6px;
          text-align: center;
          font-weight: 700;
          text-decoration: none;
        }
      `}</style>

      <main className="container">
        <h1>Choose Your Plan</h1>

        <section>
          <h2>Free</h2>
          <p className="price">$0</p>
          <ul>
            <li>Basic ATS match percentage</li>
            <li>Limited keyword feedback</li>
            <li>Good for quick testing</li>
          </ul>
        </section>

        <section>
          <h2>Basic – One-Time Optimization</h2>
          <p className="price">$5</p>
          <ul>
            <li>Complete ATS score</li>
            <li>Full missing keywords list</li>
            <li>One full resume analysis</li>
            <li>Best for a single job application</li>
          </ul>
        </section>

        <section>
          <h2>Premium – 7 Day Unlimited</h2>
          <p className="price">$12</p>
          <ul>
            <li>Unlimited resume checks</li>
            <li>Optimize for multiple job postings</li>
            <li>Priority processing</li>
            <li>No subscription, pay once</li>
          </ul>
        </section>

        <Link href="/">
          <a className="btn-primary">← Back to App</a>
        </Link>
      </main>
    </>
  );
}
