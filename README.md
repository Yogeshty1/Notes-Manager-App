# Notes Manager App

Google Keep-like notes app with Node/Express + MongoDB backend and React (CRA) frontend.

## Run locally
- Start MongoDB locally
- Backend: `npm run server` → http://localhost:3001/test
- Frontend: `npm --prefix client run start` → http://localhost:3000

## Deploy on Vercel
Frontend is built from `client/` and API runs from `api/` as serverless functions.

1) Environment variable on Vercel
- `MONGO_URL`: your MongoDB connection string

2) What Vercel uses
- `vercel.json` config
- Builds: `@vercel/static-build` for `client/` (dist: `build`), `@vercel/node` for `api/`

3) Steps
- Push repo to GitHub
- Import into Vercel → add env `MONGO_URL` → Deploy

Optional (CLI):
```
vercel
```