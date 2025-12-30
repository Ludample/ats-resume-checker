// pages/payment-success.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PaymentSuccess() {
  const router = useRouter();
  const { user_id, plan } = router.query;

  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user_id || !plan) return;

    const processPayment = async () => {
      // 1️⃣ Confirm logged-in user
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user || user.id !== user_id) {
        setError("Authentication mismatch. Please log in again.");
        setStatus("error");
        return;
      }

      // 2️⃣ Save payment
      const amount =
        plan === "basic" ? 99 :
        plan === "premium" ? 199 :
        null;

      if (!amount) {
        setError("Invalid payment plan.");
        setStatus("error");
        return;
      }

      await supabase.from("payments").insert({
        user_id: user.id,
        amount,
        plan,
      });

      // 3️⃣ Activate subscription
      if (plan === "premium") {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await supabase.from("subscriptions").upsert({
          id: user.id,
          active: true,
          expires_at: expiresAt.toISOString(),
        });
      }

      if (plan === "basic") {
        await supabase.from("subscriptions").upsert({
          id: user.id,
          active: true,
          expires_at: null,
        });
      }

      setStatus("success");
    };

    processPayment();
  }, [user_id, plan]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a2540",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      textAlign: "center"
    }}>
      {status === "processing" && (
        <div>
          <h1>Processing Payment...</h1>
          <p>Please wait a moment.</p>
        </div>
      )}

      {status === "success" && (
        <div>
          <h1>🎉 Payment Successful!</h1>
          <p>Your features are now unlocked.</p>
          <button
            onClick={() => router.push("/")}
            style={{
              marginTop: 20,
              padding: "12px 24px",
              background: "#4db5ff",
              border: "none",
              borderRadius: 6,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Go Back to App
          </button>
        </div>
      )}

      {status === "error" && (
        <div>
          <h1>❌ Payment Error</h1>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
