// pages/api/yoco-webhook.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_SERVICE_ROLE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// IMPORTANT: disable body parsing (YOCO requires raw body)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const event = JSON.parse(body);

      // Only handle successful payments
      if (event.type !== "payment.succeeded") {
        return res.status(200).json({ received: true });
      }

      const payment = event.data;

      // YOU MUST send this when redirecting user to YOCO
      const userId = payment.metadata?.user_id;
      const plan = payment.metadata?.plan; // "basic" or "premium"

      if (!userId || !plan) {
        return res.status(400).json({ error: "Missing metadata" });
      }

      // 1️⃣ Save payment
      await supabase.from("payments").insert({
        user_id: userId,
        amount: payment.amount,
        plan: plan,
      });

      // 2️⃣ Handle subscription
      if (plan === "premium") {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await supabase.from("subscriptions").upsert({
          id: userId,
          active: true,
          expires_at: expiresAt.toISOString(),
        });
      }

      if (plan === "basic") {
        await supabase.from("subscriptions").upsert({
          id: userId,
          active: true,
          expires_at: null,
        });
      }

      return res.status(200).json({ success: true });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Webhook failed" });
  }
}
