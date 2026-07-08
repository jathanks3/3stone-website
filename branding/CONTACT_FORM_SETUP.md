# Contact Form Setup — Web3Forms

The contact form currently falls back to a `mailto:` link, which is
unreliable (many visitors have no default email client configured, so
submitting can silently do nothing). To make it actually deliver
submissions to your inbox, connect it to **Web3Forms** — a free
form-delivery service. No backend, no database, no account dashboard
required.

## Step 1: Get a free access key

1. Go to https://web3forms.com
2. Enter the email address you want submissions delivered to:
   ```
   jathans02@gmail.com
   ```
3. Click **Create Access Key**.
4. Web3Forms emails you an access key (a string like
   `a1b2c3d4-e5f6-7890-abcd-ef1234567890`). No password or account
   signup is required — the key itself is what identifies your form.

## Step 2: Paste the key into the site

Open [src/config/brand.ts](../src/config/brand.ts) and find this line:

```ts
contactFormAccessKey: null as string | null,
```

Replace `null` with your key in quotes:

```ts
contactFormAccessKey: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
```

That's it — nothing else needs to change. The contact page
(`src/pages/contact.astro`) already has the Web3Forms wiring built in:
it only activates once this key is set, so the site works exactly as
before until you do this step.

## What happens after this is set

- The form submits via a background request (no page reload) directly to
  Web3Forms, which emails the submission to `jathans02@gmail.com`.
- Visitors see an inline "Thanks — your message is in" confirmation on
  the page itself.
- If the request fails for any reason (network issue, service outage),
  the visitor sees an inline error message with your email address as a
  fallback.
- A hidden honeypot field is included to filter out basic spam bots.

## Note on the access key not being a secret

Unlike a Stripe secret key, a Web3Forms access key is meant to be public
— it's embedded directly in the page's HTML/JavaScript so the browser can
submit to it, the same way a Google Analytics ID or a Formspree form ID
would be. It's safe to commit to the repository. The worst a bad actor
could do with it is send spam submissions to your inbox — the honeypot
field and Web3Forms' own spam filtering handle that.

## Free tier limits

Web3Forms' free tier allows up to 250 submissions per month, which is far
more than a launch-stage consulting site needs. If you ever outgrow it,
their paid tier or an equivalent service (Formspree, Getform) can be
swapped in by changing the `action` URL in `contact.astro` and the field
names to match — the rest of the page doesn't need to change.
