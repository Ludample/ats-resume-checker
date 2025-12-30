import { createClient } from "@supabase/supabase-js";

/**
 * Supabase admin client (SERVICE ROLE — server only)
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * YOCO webhook handler
 */
export default async function handler(req, res) {
  // YOCO sends POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body;

    /**
     * Expected event type from YOCO
     * We only care about successful payments
     */
    if (event?.event !== "payment.succeeded") {
      return res.status(200).json({ received: true });
    }

    const payment = event.data;

    /**
     * IMPORTANT
     * We rely on metadata.reference that YOU set in the payment link
     * This should be the user's Supabase auth user id
     */
    const userId = payment?.metadata?.user_id;

    if (!userId) {
      console.error("Missing user_id in payment metadata");
      return res.status(400).json({ error: "Missing user_id" });
    }

    const amount = payment.amount / 100; // YOCO sends cents
    const plan =
      amount === 99
        ? "basic"
        : amount === 199
        ? "premium"
        : "unknown";

    /**
     * 1️⃣ Insert payment record
     */
    const { error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: userId,
        amount,
        plan,
      });

    if (paymentError) {
      console.error(paymentError);
      throw paymentError;
    }

    /**
     * 2️⃣ Handle subscription logic
     * Premium = 7 days
     * Basic = no expiry
     */
    if (plan === "premium") {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error: subError } = await supabase
        .from("subscriptions")
        .upsert({
          id: userId, // same as profiles.id
          active: true,
          expires_at: expiresAt.toISOString(),
        });

      if (subError) {
        console.error(subError);
        throw subError;
      }
    }

    if (plan === "basic") {
      const { error: subError } = await supabase
        .from("subscriptions")
        .upsert({
          id: userId,
          active: true,
          expires_at: null,
        });

      if (subError) {
        console.error(subError);
        throw subError;
      }
    }

    /**
     * 3️⃣ Respond to YOCO (MUST be 2xx within 15s)
     */
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("YOCO webhook error:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
