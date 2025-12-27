// pages/api/yoco/create-payment.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, currency = "ZAR" } = req.body;

  if (!amount || typeof amount !== "number") {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    const response = await fetch("https://online.yoco.com/v1/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(process.env.YOCO_SECRET_KEY + ":").toString("base64"),
      },
      body: JSON.stringify({
        amountInCents: amount * 100, // convert to cents
        currency,
        // You can add description, metadata, etc. here
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(500).json({ error: "Yoco API error", details: errorData });
    }

    const data = await response.json();

    // Return charge ID and other info to frontend
    res.status(200).json({ chargeId: data.id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
