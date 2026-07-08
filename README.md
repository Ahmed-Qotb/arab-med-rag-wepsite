# Arab Med RAG — Website

An Arabic-first medical assistant chat application, built as the web frontend for a RAG-powered (Retrieval-Augmented Generation) medical chatbot.

🔗 **Live demo:** [arabic-medica-chatbot.vercel.app](https://arabic-medica-chatbot.vercel.app)

> ⚠️ **Note:** The RAG model backend is currently **offline**. Running it on a GPU is costly, so we're working on redeploying it on a free CPU-based instance instead — it will be a little slower, but the website itself will work once it's back up. Also, the MongoDB database may go idle if it hasn't received requests in a while, which can cause a slower first response or a temporary error. If you run into any issues, feel free to reach out to me directly.

## About

This repository (`grad-app`) is a Next.js chat application that provides authentication and a chat interface for interacting with an Arabic medical RAG assistant. Users sign up / sign in, then chat with the assistant, with conversation state persisted to MongoDB.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4, [Radix UI](https://www.radix-ui.com) primitives, `class-variance-authority`
- **Auth:** [better-auth](https://www.better-auth.com/)
- **Database:** MongoDB 
- **Forms & validation:** react-hook-form + Zod
- **Data fetching:** TanStack React Query
- **Icons / UX:** lucide-react, sonner (toasts)

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (pages)/         # Route groups (no URL path)
│   ├── api/             # API routes
│   └── auth/             # Auth pages (sign in, sign up, etc.)
├── components/
│   ├── ui/               # Reusable UI components
│   └── common/            # Shared components (header, footer, etc.)
├── hooks/                # Custom React hooks
└── lib/                  # Utilities, auth config, db connection
```

## API Routes

All chat routes are protected — they call `requireAuth()` and operate only on data owned by the signed-in user.

### `GET /api/chats`
Returns all chats belonging to the authenticated user, sorted by most recently updated. Accepts an optional `?saved=true` query param to return only chats the user has explicitly saved.

### `POST /api/chats`
Creates a new chat for the authenticated user. To avoid cluttering the chat list, if the user already has an empty, unsaved chat it is returned instead of creating a duplicate. Accepts an optional `{ title, saved }` body; if no title is given it defaults to `"محادثة جديدة"` ("New chat").

### `GET /api/chats/[chatId]`
Fetches a single chat by its ID, scoped to the authenticated user. Returns `404` if the chat doesn't exist or doesn't belong to the user.

### `POST /api/chats/[chatId]`
Updates a chat — currently used to toggle its `saved` status. Expects a JSON body `{ saved: boolean }` and returns `400` if it's missing or not a boolean.

### `GET /api/chats/[chatId]/messages`
Returns all messages belonging to a specific chat (id, role, content, createdAt), scoped to the authenticated user.

### `/api/auth/[...all]`
Catch-all route that delegates `GET`/`POST` auth requests (sign in, sign up, sessions, etc.) to `better-auth`'s Next.js handler.

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (e.g. from [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
git clone https://github.com/Ahmed-Qotb/arab-med-rag-wepsite.git
cd arab-med-rag-wepsite
npm install
```

### Environment variables

Create a `.env.local` file in the project root. At minimum you'll need a MongoDB connection string and the secrets required by `better-auth`, for example:

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
```

> Check `src/lib/` for the exact configuration expected by the auth and database helpers, since required variables may evolve as the project is developed.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
