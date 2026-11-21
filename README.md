# AgroBazar - Client

Next.js (App Router) storefront and dashboards for AgroBazar: pure farm products plus seasonal pre-orders with an online advance.

- **Live site:** https://YOUR-CLIENT.vercel.app
- **Server repo:** https://github.com/YOUR-USER/agrobazar-server

## Admin credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@agrobazar.com | Admin@12345 |
| Customer | customer@agrobazar.com | Customer@12345 |

## Features
- Home with hero slider, categories, featured in-stock products, pre-order section, how it works, reviews, FAQ
- Shop and category pages with server-side search, filters, sorting and pagination
- Pay page with SSLCommerz (bKash, Nagad, Rocket, Upay, cards, net banking), manual Send Money (TrxID) and optional Stripe
- Product details with stock or quota state; cart persisted in localStorage; checkout with COD or Stripe; mixed carts split into two orders
- Pre-order page with quota progress bars; order tracking by order number + phone
- Customer dashboard: overview, orders (cancel, pay now, invoice PDF), pre-orders, payments, wishlist
- Admin dashboard: stats and monthly chart, product CRUD with ImgBB upload, orders, pre-order overview, users, transactions
- Bengali / English toggle in the navbar (saved in localStorage); product names and descriptions can carry optional Bengali text from the admin form
- Profile update with ImgBB photo; dark and light theme; floating WhatsApp / call buttons

## Environment variables (`.env.local`)
See `.env.example`: `API_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_IMGBB_KEY`, `NEXT_PUBLIC_WHATSAPP`.

All `/api/*` requests are proxied to the Express server through a Next.js rewrite, which keeps auth cookies first-party and avoids CORS errors.

## Run
```bash
npm install
cp .env.example .env.local
npm run dev
```

## npm packages
next, react, react-dom, better-auth, zustand, swr, sonner, lucide-react, recharts, tailwindcss, @tailwindcss/postcss, daisyui

## Optional features done
Server-side pagination, wishlist, dark/light theme toggle, invoice PDF (print to PDF).
