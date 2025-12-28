create table
  "public"."posts" (
    "id" uuid not null default gen_random_uuid (),
    "title" text not null,
    "content" text not null,
    "featured" boolean not null default false,
    "author_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
  );

alter table "public"."posts" enable row level security;

create table
  "public"."users" (
    "id" uuid not null,
    "name" text,
    "avatar_url" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
  );

alter table "public"."users" enable row level security;

CREATE INDEX posts_author_id_idx ON public.posts USING btree (author_id);

CREATE INDEX posts_created_at_idx ON public.posts USING btree (created_at DESC);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."posts"
add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."users"
add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."posts"
add constraint "posts_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.users (id) ON DELETE CASCADE not valid;

alter table "public"."posts" validate constraint "posts_author_id_fkey";

alter table "public"."users"
add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set
  check_function_bodies = off;

CREATE
OR REPLACE FUNCTION public.handle_new_user () RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET
  search_path TO '' AS $function$
begin
  insert into public.users (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$function$;

CREATE
OR REPLACE FUNCTION public.handle_updated_at () RETURNS trigger LANGUAGE plpgsql AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant
select
  on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant
truncate on table "public"."posts" to "anon";

grant
update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant
select
  on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant
truncate on table "public"."posts" to "authenticated";

grant
update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant
select
  on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant
truncate on table "public"."posts" to "service_role";

grant
update on table "public"."posts" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant
select
  on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant
truncate on table "public"."users" to "anon";

grant
update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant
select
  on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant
truncate on table "public"."users" to "authenticated";

grant
update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant
select
  on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant
truncate on table "public"."users" to "service_role";

grant
update on table "public"."users" to "service_role";

create policy "Authenticated users can create posts" on "public"."posts" as permissive for insert to authenticated
with
  check ((auth.uid () = author_id));

create policy "Authors can delete their own posts" on "public"."posts" as permissive for delete to authenticated using ((auth.uid () = author_id));

create policy "Authors can update their own posts" on "public"."posts" as permissive for
update to authenticated using ((auth.uid () = author_id))
with
  check ((auth.uid () = author_id));

create policy "Posts are viewable by everyone" on "public"."posts" as permissive for
select
  to public using (true);

create policy "Users are viewable by everyone" on "public"."users" as permissive for
select
  to public using (true);

create policy "Users can update their own profile" on "public"."users" as permissive for
update to public using ((auth.uid () = id))
with
  check ((auth.uid () = id));

CREATE TRIGGER set_posts_updated_at BEFORE
UPDATE ON public.posts FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at ();

CREATE TRIGGER set_users_updated_at BEFORE
UPDATE ON public.users FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at ();

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user ();