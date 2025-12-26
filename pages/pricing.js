// pages/pricing.js
import Link from "next/link";

export default function Pricing() {
  return (
    <>
      <style>{`
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
          max-width: 700px;
          margin: 40px auto;
          padding: 20px;
          background: #06203f;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.7);
        }
        h1, h2 {
          color: #4db5ff;
          text-align: center;
        }
        ul {
          list-style: none;
          padding-left: 0;
          margin-bottom: 40px;
        }
        li {
          padding: 8px 0;
          border-bottom: 1px solid #12416a;
          font-size: 1.1rem;
        }
        .price {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 0;
          color: #a0c8ff;
        }
        .btn-primary {
          display: block;
          width: 100%;
          background-color: #4db5ff;
          border: none;
          padding: 14px 0;
          border-radius: 6px;
          color: #06203f;
          font-weight: 700;
          font-size: 1.2rem;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          user-select: none;
          transition: background-color 0.3s ease;
        }
        .btn-primary:hover {
          background-color: #3a9ded;
        }
        .back-link {
          display: block;
          margin-top: 20px;
          text-align: center;
          font-size: 0.9rem;
          color: #7a8ca3;
          user-select: none;
        }
      `}</style>

      <main className="container">
        <h1>Pricing Plans</h1>

        <section>
          <h2>Free Access</h2>
          <p>
            Get a basic ATS keyword match score and list of missing keywords — free and unlimited.
            This lets you try the core service with no cost or signup.
          </p>
        </section>

        <section>
          <h2>Basic Optimization - $5 (One-Time)</h2>
          <p className="price">$5</p>
          <ul>
            <li>ATS keyword match score</li>
            <li>List of missing keywords</li>
            <li>5 AI-generated resume bullet suggestions (planned for future)</li>
            <li>Instant access after payment — no signup needed</li>
          </ul>
          <a href="#" className="btn-primary">Pay $5 Now</a>
        </section>

        <section>
          <h2>7-Day Unlimited Access - $12</h2>
          <p className="price">$12</p>
          <ul>
            <li>Unlimited resume checks and optimizations</li>
            <li>Priority processing speed</li>
            <li>Email receipt and friendly support</li>
            <li>No subscription — pay once and use for 7 days</li>
          </ul>
          <a href="#" className="btn-primary">Pay $12 Now</a>
        </section>

        <Link href="/">
          <a className="back-link">← Back to Home</a>
        </Link>
      </main>
    </>
  );
}
