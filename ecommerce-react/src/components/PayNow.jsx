import React, { useState } from "react";

export default function MolliePaymentButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call your backend API to create a payment
      const response = await fetch("/api/create-mollie-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 10.0, // Example: 10 EUR payment
          currency: "EUR",
          description: "Test payment from React",
          redirectUrl: window.location.origin + "/thank-you",
          webhookUrl: window.location.origin + "/api/mollie-webhook"
        }),
      });

      if (!response.ok) {
        throw new Error("Payment creation failed");
      }

      const data = await response.json();

      // Mollie payment URL to redirect user
      const paymentUrl = data.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
