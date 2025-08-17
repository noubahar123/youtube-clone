
# YouTube Clone (MERN)

A fully-functional YouTube-style video platform built with the **MERN stack** (MongoDB, Express, React, Node.js). 
Users can register/login, create channels, upload video metadata, browse/search, watch videos, **like/dislike** (toggled & persisted), and **comment** (add/edit/delete). 
The app is responsive with a mobile-friendly sidebar & theme toggle.

---

## Table of Contents
- [Features](#features)
- [Screens & UX](#screens--ux)
- [Architecture](#architecture)
- [Tech Stack & Requirements](#tech-stack--requirements)
- [Folder Structure](#folder-structure)
- [Setup & Execution](#setup--execution)
  - [1) Backend](#1-backend)
  - [2) Seed Database (optional)](#2-seed-database-optional)
  - [3) Frontend](#3-frontend)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [How to Use](#how-to-use)
- [Testing Guide](#testing-guide)
  - [Manual Test Cases](#manual-test-cases)
  - [cURL / Postman Snippets](#curl--postman-snippets)
- [Troubleshooting & FAQ](#troubleshooting--faq)
- [Roadmap & Known Limitations](#roadmap--known-limitations)

---

## Features

**User & Channel**
- JWT-based **register**/**login**.
- Create a **Channel** (owner-only) and upload video metadata.
- Logout & protected routes on the client.

**Home / Discovery**
- Video **grid** with category chips and search.
- Responsive **Sidebar** (hamburger on mobile; fixed on desktop).

**Video Player**
- Watch videos with poster & controls.
- Channel name + view count under the title.
- **Like / Dislike** with **toggle** semantics and server persistence.
- **Share** button (placeholder; no-op or copy-link).
- **Comments**: add, **edit**, **delete** (author-only).

**Theming / UX**
- **Dark / Light** theme toggle persisted in `localStorage`.
- Smooth transitions, focus states, mobile drawer lock (`no-scroll`).

---

## Screens & UX

- **Header**: brand, search bar, auth buttons, theme toggle.
- **Sidebar**: categories and quick nav; opens/closes on hamburger (mobile), collapses on desktop.
- **Home**: chips, optional banner (can be disabled), video grid.
- **Video Player**: video element, title, channel+views, action row (like/dislike/share), description, comments.
- **Channel Page**: channel info + **Upload Video** (metadata only) if owner; grid of channel videos.
- **Auth Pages**: Sign In / Register.

---

## Architecture

```
React (Vite) ── Axios ──► Express API ──► MongoDB (Mongoose)
   ▲                                  │
   └──────────── JWT in localStorage ◄┘
```

- **Frontend** (React): routes via `react-router-dom`, `axios` instance with `Authorization` header if user is logged in.
- **Backend** (Express): routes for auth, videos, channels, comments; middleware for JWT verification.
- **Database** (MongoDB): Mongoose models for `User`, `Channel`, `Video`, `Comment`.
- **Reactions** (Likes/Dislikes): kept as **arrays of userIds** on `Video` so each user can react once; counts are `array.length`.

---

## Tech Stack & Requirements

- **Node.js**: v18+
- **Frontend**: React 18, React Router, Axios, Tailwind (or utility classes)
- **Backend**: Node, Express, Mongoose, CORS, Morgan, JSON Web Tokens
- **Database**: MongoDB Atlas (or local MongoDB)
- **Tooling**: `nodemon` for dev server

---

## Folder Structure

```
youtube-clone/
├─ frontend/
│  ├─ src/
│  │  ├─ api/axios.js
│  │  ├─ components/
│  │  │  ├─ Header.jsx
│  │  │  ├─ Sidebar.jsx
│  │  │  ├─ ThemeToggle.jsx
│  │  │  ├─ VideoCard.jsx
│  │  │  └─ VideoGrid.jsx
│  │  ├─ context/AuthContext.jsx
│  │  ├─ hooks/useTheme.js
│  │  ├─ pages/
│  │  │  ├─ Home.jsx
│  │  │  ├─ SignIn.jsx
│  │  │  ├─ Register.jsx
│  │  │  ├─ VideoPlayer.jsx
│  │  │  ├─ Channel.jsx
│  │  │  └─ CreateChannel.jsx
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  └─ index.html
└─ backend/
   ├─ src/
   │  ├─ config/
   │  │  ├─ appConfig.js
   │  │  └─ db.js
   │  ├─ middleware/auth.js
   │  ├─ models/
   │  │  ├─ User.js
   │  │  ├─ Channel.js
   │  │  ├─ Video.js
   │  │  └─ Comment.js
   │  ├─ routes/
   │  │  ├─ auth.js
   │  │  ├─ videos.js
   │  │  ├─ channels.js
   │  │  └─ comments.js
   │  ├─ seed.js
   │  └─ server.js (or index.js)
   └─ package.json
```

---

## Setup & Execution

### 1) Backend
```bash
cd backend
npm install
# If using ES Modules (import/export), ensure package.json contains: { "type": "module" }
npm run dev     # typically nodemon src/server.js
# server starts at http://localhost:5000
```

**CORS** is enabled. API base path is `/api` (e.g., `/api/videos`).

### 2) Seed Database (optional)
The seed script creates:
- a default **User**
- a **Channel** owned by that user
- a set of **Videos**

Run:
```bash
node src/seed.js
```

> If you migrated likes/dislikes to arrays, ensure seeds set `likes: []`, `dislikes: []`.

### 3) Frontend
```bash
cd frontend
npm install
npm run dev   # Vite dev server (e.g., http://localhost:5173)
```

**Axios baseURL**: `http://localhost:5000/api` (configured in `src/api/axios.js`).  
It automatically attaches `Authorization: Bearer <token>` if `localStorage.token` exists.

---

## Environment Variables

For convenience, `src/config/appConfig.js` includes constants, but preferred is `.env`:

**Backend `.env`** (or appConfig.js values):
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_super_secret
```

**Frontend** usually doesn’t need env for dev since `axios` baseURL is hard-coded (you can move it to Vite env if desired).

---

## Database Schema

### User
```js
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed),
  avatar: String,
  channels: [ObjectId<Channel>]
}
```

### Channel
```js
{
  channelName: String (unique, required),
  owner: ObjectId<User> (required),
  description: String,
  channelBanner: String,
  subscribers: Number (default 0)
}
```

### Video  (**final recommended schema**)
```js
{
  title: String (required),
  description: String,
  videoUrl: String (required),
  thumbnailUrl: String,
  channel: ObjectId<Channel> (required),
  uploader: ObjectId<User> (required),
  category: String ("All" by default),
  views: Number (default 0),

  // Reactions (per-user)
  likes: [ObjectId<User>],
  dislikes: [ObjectId<User>],

  uploadDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```
> If you previously used numeric `likes/dislikes`, migrate them to arrays or drop & reseed.

### Comment
```js
{
  video: ObjectId<Video> (required),
  user: ObjectId<User> (required),
  text: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Reference

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register` → `{ username, email, password }` → `201`
- `POST /auth/login` → `{ email, password }` → `200 { token }`

### Channels
- `POST /channels` (auth) → create a channel (owner = jwt user)
- `GET /channels/:id` → get channel
- `GET /channels/:id/videos` → videos of channel

### Videos
- `GET /videos` → list with optional query params: `q`, `category`, `page`, `limit`
- `GET /videos/:id` → returns a video and **increments views atomically**
- `POST /videos` (auth) → create video (only channel owner can upload to that channel)
- `PATCH /videos/:id` (auth, uploader-only) → update safe fields
- `DELETE /videos/:id` (auth, uploader-only) → delete

**Reactions**
- `POST /videos/:id/like` (auth)  
  Toggle like for current user; if disliked, removes dislike.  
  **Response**: `{ likes: Number, dislikes: Number }`
- `POST /videos/:id/dislike` (auth)  
  Toggle dislike for current user; if liked, removes like.  
  **Response**: `{ likes: Number, dislikes: Number }`

### Comments
- `GET /comments/:videoId` → list comments for video (newest first)
- `POST /comments/:videoId` (auth) → add comment `{ text }`
- `PATCH /comments/:commentId` (auth, author-only) → edit comment `{ text }`
- `DELETE /comments/:commentId` (auth, author-only) → delete comment

---

## How to Use

1. **Register** a new account or **Sign In**.
2. Click **Create Channel**, fill in details.
3. On your **Channel** page, use **Upload Video** (metadata only: title, description, urls, thumbnail, category).
4. Go to **Home**, browse or **search** videos.
5. Click a video to open the **Video Player** page:
   - Use **👍 Like** / **👎 Dislike** (requires sign-in; toggles and persists).
   - Read description; view **channel** and **views**.
   - **Comments**: add your comment; you can **Edit/Delete** your own comments.
6. Use **Sidebar** hamburger on mobile; **Theme Toggle** for dark/light mode.

---

## Testing Guide

### Manual Test Cases

| ID | Area | Step | Expected |
|---|---|---|---|
| A1 | Auth | Register with new email | 201, redirected to Sign In |
| A2 | Auth | Login with valid creds | 200, token saved in localStorage |
| A3 | Auth | Login with wrong password | Error message shown |
| C1 | Channel | Create Channel (signed in) | Channel appears, owner = current user |
| C2 | Channel | Upload Video (owner) | New video shows on channel & home |
| H1 | Home | Search a keyword | Grid shows filtered videos |
| V1 | Video | Open a video | Player loads, views increment by 1 |
| V2 | Video | Click 👍 once | Likes +1, button count updates |
| V3 | Video | Click 👍 again (toggle) | Likes -1 |
| V4 | Video | Click 👎 after 👍 | Likes -1, Dislikes +1 |
| CM1 | Comments | Add comment (signed in) | Appears at top of list |
| CM2 | Comments | Edit own comment | Text updated |
| CM3 | Comments | Delete own comment | Comment removed |
| CM4 | Comments | Edit/delete others’ comment | 403 Forbidden |
| UI1 | Sidebar | Toggle hamburger on mobile | Drawer opens; body scroll locked |
| UI2 | Theme | Toggle dark/light | Theme persists reload (localStorage) |



## Troubleshooting & FAQ

**500 on /videos/:id/like**
- Old docs stored `likes/dislikes` as numbers. Migrate to arrays or reseed:
  ```js
  db.videos.updateMany({}, { $set: { likes: [], dislikes: [] } })
  ```

**401 Unauthorized on like/dislike/comment**
- Ensure you’re signed in; token exists in `localStorage.token`.
- Axios interceptor attaches `Authorization` header.

**403 on editing/deleting comments**
- Only the **author** can edit/delete their comment.

**Browser error importing backend file**
- Never import `backend` files into `frontend`. Keep client/server code separate.

**"Identifier 'mongoose' has already been declared"**
- Remove duplicate or mixed `import`+`require` in the same file.

**ES Modules vs CommonJS**
- If using `import/export` in backend, add `"type": "module"` to `backend/package.json`.

**Hamburger not working on mobile**
- Ensure you’re toggling `sidebar-open` on body and Sidebar syncs its state (we add/remove body class on click). 
- Prevent event bubbling when opening the drawer and close on overlay click/ESC.

---


