# Backend - MERN YouTube Clone

## Setup
1. Copy `.env.sample` to `.env` and fill values.
2. `npm install`
3. `npm run dev`

## Endpoints (prefix `/api`)
- `POST /auth/register`
- `POST /auth/login`
- `GET /videos` (query: `q` for search, `category` for filter)
- `GET /videos/:id`
- `POST /videos` (auth)
- `PATCH /videos/:id` (auth & owner)
- `DELETE /videos/:id` (auth & owner)
- `POST /comments/:videoId` (auth) add comment
- `GET /comments/:videoId`
- `PATCH /comments/:commentId` (auth & owner)
- `DELETE /comments/:commentId` (auth & owner)
- `POST /channels` (auth) create channel
- `GET /channels/:id`
- `PATCH /channels/:id` (auth & owner)
- `DELETE /channels/:id` (auth & owner)
- `GET /channels/:id/videos`
