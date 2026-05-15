# Da Nang Memories — Project Guide

## Overview
Digital memory album for company trip to Da Nang, Vietnam (4 days, 3 nights).
Built with Next.js 15, Tailwind CSS, Framer Motion, Supabase, and Cloudinary.

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # fill in credentials
npm run dev
```

App runs at http://localhost:3000. Works in demo mode (mock data + placeholder images) without any credentials configured.

## Environment Variables
See `.env.local.example`. All services are optional — app falls back to demo mode if not configured.

| Variable | Purpose |
|---|---|
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key (browser) |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service key (server) |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| GOOGLE_AI_API_KEY | Google AI Studio key for Gemini |

## Database Schema (Supabase)

Run this SQL in the Supabase SQL editor:

```sql
-- Enable UUID
create extension if not exists "pgcrypto";

-- Trips
create table trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location text,
  start_date date,
  end_date date,
  created_at timestamptz default now()
);

-- Memory Days
create table memory_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id) on delete cascade,
  day_number integer not null check (day_number between 1 and 10),
  title text,
  date date,
  created_at timestamptz default now()
);

-- Media
create table media (
  id uuid primary key default gen_random_uuid(),
  memory_day_id uuid references memory_days(id) on delete cascade,
  day_number integer not null,
  media_type text not null check (media_type in ('image', 'video')),
  cloudinary_url text not null,
  public_id text,
  uploaded_by text not null,
  caption text,
  created_at timestamptz default now()
);

-- Reactions (optional)
create table reactions (
  id uuid primary key default gen_random_uuid(),
  media_id uuid references media(id) on delete cascade,
  emoji text not null,
  created_by text not null,
  created_at timestamptz default now()
);

-- Seed trip + memory days
insert into trips (title, location, start_date, end_date)
values ('Da Nang Trip 2026', 'Da Nang, Vietnam', '2026-03-15', '2026-03-18');

insert into memory_days (trip_id, day_number, title, date)
select id, 1, 'Departure & First Impressions', '2026-03-15' from trips limit 1;
insert into memory_days (trip_id, day_number, title, date)
select id, 2, 'Golden Bridge & Beach Day', '2026-03-16' from trips limit 1;
insert into memory_days (trip_id, day_number, title, date)
select id, 3, 'Hoi An Adventure', '2026-03-17' from trips limit 1;
insert into memory_days (trip_id, day_number, title, date)
select id, 4, 'Final Moments & Farewell', '2026-03-18' from trips limit 1;
```

## Project Structure

```
src/
  app/
    api/
      media/route.ts      # GET/POST media records
      upload/route.ts     # POST file upload (Cloudinary)
      captions/route.ts   # POST AI caption generation (Gemini)
    globals.css
    layout.tsx
    page.tsx              # Main page (client component)
  components/
    HeroBanner.tsx        # Hero section with animated background
    DayNavigator.tsx      # Sticky day tabs (Day 1-4)
    MediaCarousel.tsx     # Horizontal media carousel
    MediaCard.tsx         # Individual photo/video card
    FullscreenPreview.tsx # Lightbox modal (keyboard nav)
    UploadModal.tsx       # Upload flow (drag&drop, AI caption)
  lib/
    utils.ts              # cn(), formatDate()
    supabase.ts           # Supabase client + admin
    cloudinary.ts         # Cloudinary upload helper
    gemini.ts             # Gemini AI caption generation
    mock-data.ts          # Demo data (no credentials needed)
  types/
    index.ts              # TypeScript interfaces
```

## Key Design Decisions
- **Demo mode**: App fully works without credentials using mock data + picsum.photos
- **Dark only**: Deep `#030712` background, Apple-style cinematic aesthetic
- **Framer Motion**: All transitions (day switch, card entrance, modals)
- **API fallback**: Every API route falls back to mock data on error

## Deployment (EC2 + PM2 + Nginx)

```bash
# On the server
npm run build
pm2 start npm --name "da-nang-memories" -- start

# Nginx config (/etc/nginx/sites-available/da-nang)
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```
