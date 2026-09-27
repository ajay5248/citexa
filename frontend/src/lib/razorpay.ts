import { getApiUrl } from "@/lib/site";
import type { Plan } from "@/lib/plans";

export interface Buyer {
  name: string;
  email: string;
  phone: string;
  website?: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_signature: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

async function readError(res: Response, fallback: string) {
  const data = await res.json().catch(() => null);
  const detail = data?.detail;
  if (Array.isArray(detail)) return String(detail[0]?.msg || fallback).replace(/^Value error, /, "");
  return typeof detail === "string" ? detail : fallback;
}

function loadCheckoutScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load the payment window. Check your connection and try again."));
    document.body.appendChild(script);
  });
}

export async function paymentsEnabled(): Promise<boolean> {
  try {
    const res = await fetch(`${getApiUrl()}/payments/config`);
    return res.ok && (await res.json()).enabled === true;
  } catch {
    return false;
  }
}

// Opens Razorpay Checkout for a plan. Resolves once the payment is verified by our backend,
// rejects with a readable message on failure, and resolves to null if the buyer closes the window.
export async function startCheckout(plan: Plan, buyer: Buyer): Promise<{ status: string } | null> {
  const body = Object.fromEntries(Object.entries({ plan_id: plan.id, ...buyer }).filter(([, value]) => value !== ""));
  const res = await fetch(`${getApiUrl()}/payments/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await readError(res, "Could not start the payment. Please try again."));
  const checkout = await res.json();

  await loadCheckoutScript();
  if (!window.Razorpay) throw new Error("Could not load the payment window. Please try again.");

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay!({
      key: checkout.key_id,
      name: "Citexa-AI",
      description: checkout.name,
      ...(checkout.order_id
        ? { order_id: checkout.order_id, amount: checkout.amount, currency: checkout.currency }
        : { subscription_id: checkout.subscription_id }),
      prefill: { name: buyer.name, email: buyer.email, contact: buyer.phone },
      notes: { website: buyer.website || "" },
      theme: { color: "#2b88ff" },
      handler: async (response: RazorpayResponse) => {
        try {
          const verify = await fetch(`${getApiUrl()}/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (!verify.ok) throw new Error(await readError(verify, "We couldn't confirm your payment. If you were charged, please contact us."));
          resolve(await verify.json());
        } catch (err) {
          reject(err);
        }
      },
      modal: { ondismiss: () => resolve(null) },
    });
    razorpay.on("payment.failed", (response) => {
      reject(new Error(response.error?.description || "The payment failed. No money was taken. Please try again."));
    });
    razorpay.open();
  });
}
