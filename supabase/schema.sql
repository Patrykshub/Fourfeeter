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

-- Page banners (background image for the Memories/Info top section)
create table if not exists page_banners (
  key text primary key,
  image text
);

alter table page_banners enable row level security;

create policy "Page banners are publicly readable"
  on page_banners for select
  using (true);

create policy "Only authenticated users can write page banners"
  on page_banners for all
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
