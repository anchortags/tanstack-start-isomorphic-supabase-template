-- =============================================================================
-- Users table (public profiles synced with auth.users)
-- =============================================================================
create table
  public.users (
    id uuid primary key references auth.users (id) on delete cascade,
    name text,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

comment on table public.users is 'Public user profiles synced with auth.users';

-- Enable RLS
alter table public.users enable row level security;

-- Users policies
create policy "Users are viewable by everyone" on public.users for
select
  using (true);

create policy "Users can update their own profile" on public.users for
update using (auth.uid () = id)
with
  check (auth.uid () = id);

-- Auto-create profile on signup
create
or replace function public.handle_new_user () returns trigger language plpgsql security definer
set
  search_path = '' as $$
begin
  insert into public.users (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();

-- =============================================================================
-- Posts table
-- =============================================================================
create table
  public.posts (
    id uuid primary key default gen_random_uuid (),
    title text not null,
    content text not null,
    featured boolean not null default false,
    author_id uuid not null references public.users (id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

comment on table public.posts is 'Blog posts created by users';

-- Indexes for common queries
create index posts_author_id_idx on public.posts (author_id);

create index posts_created_at_idx on public.posts (created_at desc);

-- Enable RLS
alter table public.posts enable row level security;

-- =============================================================================
-- Posts RLS Policies
-- =============================================================================
-- Anyone can read posts (public blog)
create policy "Posts are viewable by everyone" on public.posts for
select
  using (true);

-- Authenticated users can create posts
create policy "Authenticated users can create posts" on public.posts for insert to authenticated
with
  check (auth.uid () = author_id);

-- Authors can update their own posts
create policy "Authors can update their own posts" on public.posts for
update to authenticated using (auth.uid () = author_id)
with
  check (auth.uid () = author_id);

-- Authors can delete their own posts
create policy "Authors can delete their own posts" on public.posts for delete to authenticated using (auth.uid () = author_id);

-- =============================================================================
-- Updated_at trigger
-- =============================================================================
create
or replace function public.handle_updated_at () returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_posts_updated_at before
update on public.posts for each row
execute procedure public.handle_updated_at ();

create trigger set_users_updated_at before
update on public.users for each row
execute procedure public.handle_updated_at ();