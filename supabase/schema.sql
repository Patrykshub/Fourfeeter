-- Fourfeeter Supabase schema.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- Read access is public (anyone visiting the site can view content).
-- Write access (insert/update/delete) requires an authenticated user —
-- since there's a single admin account, "authenticated" is equivalent to "admin" here.

-- Posts (Home + Memories content)
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  image text not null,
  date timestamptz not null default now()
);

alter table posts enable row level security;

create policy "Posts are publicly readable"
  on posts for select
  using (true);

create policy "Only authenticated users can write posts"
  on posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Per-language post translations (pl-PL is required, en-GB/de-DE are optional)
alter table posts add column if not exists title_pl text;
alter table posts add column if not exists title_en text;
alter table posts add column if not exists title_de text;
alter table posts add column if not exists content_pl text;
alter table posts add column if not exists content_en text;
alter table posts add column if not exists content_de text;

update posts set title_pl = title, content_pl = content where title_pl is null;

alter table posts drop column if exists title;
alter table posts drop column if exists content;

alter table posts alter column title_pl set not null;
alter table posts alter column content_pl set not null;

-- Info entries (key/value contact info)
create table if not exists info_entries (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null
);

alter table info_entries enable row level security;

create policy "Info entries are publicly readable"
  on info_entries for select
  using (true);

create policy "Only authenticated users can write info entries"
  on info_entries for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Products (key/value "My products" section on the Info page, with an optional photo)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  image text
);

alter table products enable row level security;

create policy "Products are publicly readable"
  on products for select
  using (true);

create policy "Only authenticated users can write products"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Page banners (background image + optional description for the Memories/Info top section)
create table if not exists page_banners (
  key text primary key,
  image text,
  description text
);

alter table page_banners add column if not exists description text;

alter table page_banners enable row level security;

create policy "Page banners are publicly readable"
  on page_banners for select
  using (true);

create policy "Only authenticated users can write page banners"
  on page_banners for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Per-language page banner descriptions (all three optional — a banner can have no description at all)
alter table page_banners add column if not exists description_pl text;
alter table page_banners add column if not exists description_en text;
alter table page_banners add column if not exists description_de text;

update page_banners set description_pl = description where description_pl is null;

alter table page_banners drop column if exists description;

-- Gallery albums (photo albums shown on the Gallery page)
create table if not exists gallery_albums (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cover_image text,
  created_at timestamptz not null default now()
);

alter table gallery_albums enable row level security;

create policy "Gallery albums are publicly readable"
  on gallery_albums for select
  using (true);

create policy "Only authenticated users can write gallery albums"
  on gallery_albums for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Gallery photos (photos belonging to a gallery album)
create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references gallery_albums(id) on delete cascade,
  image text not null,
  created_at timestamptz not null default now()
);

alter table gallery_photos enable row level security;

create policy "Gallery photos are publicly readable"
  on gallery_photos for select
  using (true);

create policy "Only authenticated users can write gallery photos"
  on gallery_photos for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage: create the bucket manually first —
-- Dashboard -> Storage -> New bucket -> name it "post-images" -> toggle "Public bucket" on.
-- Then run the policies below (Supabase manages bucket objects in storage.objects).

create policy "Public can view post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Authenticated users can upload post images"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

create policy "Authenticated users can delete post images"
  on storage.objects for delete
  using (bucket_id = 'post-images' and auth.role() = 'authenticated');
