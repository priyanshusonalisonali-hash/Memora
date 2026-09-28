# LumiWish ✨ — Personalized Digital Birthday Surprise Platform

**LumiWish** is a full-stack, mobile-first web platform that turns birthday greetings into cinematic, interactive digital surprise experiences. Senders walk through a 5-step guided wizard, preview the interactive experience for free, and unlock a private shareable recipient link (`/b/:slug`) through a paywall powered by Razorpay.

---

## 🌟 Key Features

- **5-Step Guided Wizard**:
  - **The Star**: Recipient name, sender name, milestone turning age, and optional midnight unlock schedule.
  - **The Cake**: Choice of 3 artisanal cakes (*Midnight Chocolate*, *Strawberry Blush*, *Vanilla Gold*) influencing the candle-blowing scene.
  - **The Balloons**: Up to 5 personalized "reasons you're loved" with character counters and 12+ tap-to-fill suggestion chips.
  - **The Memories**: Up to 5 photo uploads, captions, drag-and-drop / file picker, and thumbnail previews processed via Sharp (EXIF stripped, auto-compressed to WebP).
  - **The Letter**: Heartfelt letter with starter templates and character counter.
  - **Interactive Crafting Screen**: Dynamic checklist ticking off the custom surprise ingredients before opening preview mode.

- **7-Scene Interactive Experience (`<Experience mode="preview|live" />`)**:
  1. **Heart & Bow**: Drag-and-release arrow physics with dynamic trajectory line, touch & pointer events, and keyboard support.
  2. **Birthday Bloom**: Organic canvas particle tree growing and blooming heart-shaped foliage with drifting hearts.
  3. **The Cake (Dark Starry Sky)**: Realistic candle flame, dual-action blow detection (Microphone blow detection via Web Audio API + Graceful tap fallback), cake-slice animation, and celebration chime.
  4. **Pop the Balloons**: Floating balloons with sound effects and mini-confetti bursts revealing personal message cards.
  5. **Memory Lane**: Glowing fairy lights with swinging polaroid cards and captions.
  6. **The Letter**: Vintage textured card with typewriter handwriting animation in *Caveat* font (tap to instant-reveal).
  7. **Finale**: Continuous celebratory confetti showers with personalized congratulations.
     - **Preview Mode**: Prompts "Send it to [Name]" launching the Paywall.
     - **Live Mode**: Replay surprise + "Make one for someone you love" button.

- **Paywall & Checkout**:
  - Configurable server-enforced pricing: ₹199 (crossed out from ₹499, 60% OFF).
  - Persisted 10-minute offer countdown timer in localStorage.
  - Testimonials carousel and trust badges.
  - Razorpay payment provider with test mode sandbox fallback.
  - Success screen with shareable link (`/b/:slug`), one-tap Copy Link, WhatsApp direct share with pre-filled message, and live QR code.

- **Recipient Experience (`/b/:slug`)**:
  - Auto-autoplay compliant "Tap to open your surprise" entrance.
  - Midnight countdown lock teaser when scheduled for their birthday.
  - 90-day automatic link expiry.

- **Platform & Security**:
  - Input sanitization and XSS protection.
  - Rate limiting on drafts, uploads, and checkout.
  - Helmet and CORS security headers.
  - Daily cron job to purge expired surprises and photos.
  - Admin analytics dashboard (`/admin`) tracking revenue, order logs, and funnel drop-off metrics.

---

## 🛠 Tech Stack

- **Monorepo**: Root scripts, npm workspaces (`/client`, `/server`).
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, canvas-confetti, Web Audio & Howler.js, Zustand, React Router v6.
- **Backend**: Node.js, Express, TypeScript, MongoDB & Mongoose (with automated in-memory MongoDB fallback for frictionless zero-config local run), Multer, Sharp, nanoid, node-cron, pino logger, Helmet, CORS.
- **Providers**: `StorageProvider` (Local Disk / Cloudinary), `PaymentProvider` (Razorpay / Mock Test Sandbox).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 22+
- npm 9+

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 2. Environment Variables Configuration

#### Server (`server/.env`):
Create `server/.env` (or copy from `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database (Leave empty to use automatic in-memory MongoDB in dev)
MONGODB_URI=

# Storage Provider: 'local' | 'cloudinary'
STORAGE_PROVIDER=local
UPLOAD_DIR=uploads

# Cloudinary (Optional if STORAGE_PROVIDER=cloudinary)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Payments: Razorpay Test Mode
# (If left empty, server uses built-in MockPaymentProvider for testing)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Pricing in INR paise (₹199 = 19900 paise, ₹499 = 49900 paise)
EXPERIENCE_PRICE_INR=19900
ORIGINAL_PRICE_INR=49900

# Admin Access
ADMIN_TOKEN=lumiwish_super_secret_admin_token_2026
```

#### Client (`client/.env`):
Create `client/.env` (or copy from `client/.env.example`):
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=
```

---

## 🏃 Running the Application

### Start Both Client & Server Concurrently
```bash
npm run dev
```
- Client running at: [http://localhost:5173](http://localhost:5173)
- Server running at: [http://localhost:5000](http://localhost:5000)

### Run Unit Tests
```bash
npm test
```

### Run Seed Script (Sample Demo Data)
To seed 1 sample draft and 1 live published surprise (`/b/demo-aanya-24`):
```bash
npm run seed
```

---

## 🎨 How to Add a New Occasion Config (e.g. Anniversary)

The experience is driven by an extensible occasion configuration system located at:
- `server/src/occasions/index.ts`

To add or complete an occasion (such as Anniversary):

1. **Define the Occasion in `OCCASIONS`**:
```typescript
anniversary: {
  id: 'anniversary',
  title: 'Anniversary Surprise',
  tagline: 'Celebrate your journey, your moments, and your forever love',
  theme: {
    primaryGradient: 'from-pink-500 via-rose-500 to-purple-500',
    bgStyle: 'bg-peach-50',
    accentColor: '#F43F5E',
  },
  steps: [
    { id: 'couple', name: 'The Couple', description: 'The two hearts celebrating today', required: true },
    { id: 'moments', name: 'The Moments', description: 'Cherished milestones along the way', required: true },
    { id: 'promises', name: 'The Promises', description: 'Vows and whispers for the future', required: true },
    { id: 'photos', name: 'The Photos', description: 'Captured memories together', required: false },
    { id: 'letter', name: 'The Letter', description: 'Your romantic anniversary note', required: true },
  ],
  scenes: [
    { id: 'spark', name: 'The Spark' },
    { id: 'timeline', name: 'Our Journey' },
    { id: 'promises', name: 'Floating Promises' },
    { id: 'gallery', name: 'Love Gallery' },
    { id: 'letter', name: 'The Letter' },
    { id: 'toast', name: 'Forever Toast' },
  ],
}
```

2. **Render the Wizard Route**:
Direct users to `/create/anniversary` or supply the `occasion: 'anniversary'` parameter in the draft schema. The wizard will dynamically load the steps and theme according to the config.

---

## 🛡 Security & Best Practices

- All user text is sanitized to neutralize XSS vulnerabilities.
- Prices are strictly determined on the server; client requests can never tamper with order amounts.
- Photos are re-encoded to WebP format, resized to a maximum of 1600x1600, and stripped of EXIF metadata before being stored.
- Webhook signature validation provides idempotent handling of payments if a user closes their browser prematurely.
