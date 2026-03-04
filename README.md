# 💰 Smart Flow Finance

An AI-powered expense tracking application built with Next.js, TypeScript, and Google Gemini AI.

## ✨ Features

- 🔐 Google OAuth Authentication
- 💳 Transaction Management (Create, Read, Delete)
- 🤖 AI-Powered Category Suggestions (Google Gemini)
- 💡 AI Financial Advisor
- 📊 Real-time Dashboard
- 🎨 Responsive Design (Mobile & Desktop)

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Next.js Server Actions, API Routes
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** Auth.js (NextAuth)
- **AI:** Google Gemini API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Cloud account (for OAuth & Gemini API)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd smart-flow-finance-v2
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file with:
```
DATABASE_URL="your-supabase-url"
AUTH_SECRET="your-auth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_GEMINI_API_KEY="your-gemini-api-key"
```

4. Set up database
```bash
npx prisma db push
```

5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

This app is deployed on Vercel: [https://smart-flow-finance.vercel.app/]

## 📝 License

MIT

## 👨‍💻 Author

[Your Name]