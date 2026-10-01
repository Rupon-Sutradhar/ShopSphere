# Stripe setup for ShopSphere

## What is Stripe?

Stripe is an online payment platform. It securely collects a customer's card
details and processes their payment. ShopSphere does **not** receive or store
raw card numbers; Stripe handles that sensitive data.

For development, Stripe provides **test mode**. Test mode uses fake money and
test cards, so you can build and verify checkout without charging anybody.

## How Stripe is used in this project

When a customer places an order, ShopSphere creates the order in MongoDB as
unpaid. On the order-details page, the frontend asks the backend to create a
Stripe **Payment Intent** for the order total. Stripe then displays its secure
payment form.

After the payment succeeds, Stripe sends a **webhook** (a server-to-server
notification) to this API endpoint:

```text
/api/payment/webhook
```

The backend verifies the webhook signature and marks the matching MongoDB order
as paid. The webhook is important: it is the trusted confirmation of payment,
instead of relying only on the browser.

```text
Customer → ShopSphere frontend → Stripe payment form
                         ↓
                  ShopSphere backend → Payment Intent
                         ↑
Stripe webhook → /api/payment/webhook → mark order paid in MongoDB
```

## Get a Stripe account and test keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register) and create
   an account.
2. Make sure **Test mode** is enabled in the Dashboard.
3. Open **Developers → API keys**.
4. Copy these two values:

   - **Publishable key**: starts with `pk_test_`. It is used by the frontend
     and is safe to include in the browser bundle.
   - **Secret key**: starts with `sk_test_`. It is used only by the backend.
     Keep it private; never commit it, paste it into frontend code, or share it.

## Add the keys locally

Edit `backend/.env` and add:

```env
STRIPE_SECRET_KEY=sk_test_replace_with_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_replace_after_webhook_setup
```

At the project root, copy `.env.docker.example` to `.env.docker` and set:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_replace_with_your_publishable_key
CLIENT_ORIGIN=http://localhost:8080
```

Do not add either local environment file to Git. They are already ignored.

## Configure the local webhook

Stripe cannot send events to `localhost` directly. For local development, use
the Stripe CLI, which forwards Stripe events to your machine.

1. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli).
2. Log in from a terminal:

   ```powershell
   stripe login
   ```

3. Start the backend on port 5000, then run:

   ```powershell
   stripe listen --forward-to localhost:5000/api/payment/webhook
   ```

4. The CLI prints a value starting with `whsec_`. Copy it into
   `backend/.env` as `STRIPE_WEBHOOK_SECRET`.
5. Restart the backend after saving `.env`.

If you use Docker, start the app with:

```powershell
docker compose --env-file .env.docker up --build
```

For Docker local testing, forward Stripe to:

```powershell
stripe listen --forward-to localhost:8080/api/payment/webhook
```

## Test a payment

1. Register or log in to ShopSphere.
2. Add a product to the cart and create an order.
3. On the payment form use Stripe's standard successful test card:

   ```text
   Card number: 4242 4242 4242 4242
   Expiry: any future date
   CVC: any 3 digits
   Postal code: any valid value
   ```

4. After payment, check that the order displays as paid and that Stripe CLI
   reports a successful webhook delivery.

## Production webhook

When your website has a public HTTPS domain, open **Developers → Webhooks** in
the Stripe Dashboard and create an endpoint:

```text
https://your-domain.example/api/payment/webhook
```

Subscribe to the event `payment_intent.succeeded`. Copy that endpoint's signing
secret (`whsec_...`) into your production host's `STRIPE_WEBHOOK_SECRET`
environment variable. Use live Stripe keys only when you are ready to accept
real payments.

## Which value goes where?

| Value | Starts with | Location | Secret? |
| --- | --- | --- | --- |
| Stripe publishable key | `pk_test_` / `pk_live_` | `.env.docker` as `VITE_STRIPE_PUBLISHABLE_KEY` | No |
| Stripe secret key | `sk_test_` / `sk_live_` | `backend/.env` as `STRIPE_SECRET_KEY` | Yes |
| Webhook signing secret | `whsec_` | `backend/.env` as `STRIPE_WEBHOOK_SECRET` | Yes |

Never use test keys in a live store or live keys in test mode.
