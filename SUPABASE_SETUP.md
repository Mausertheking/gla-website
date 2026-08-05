# Certificate registry — Supabase setup

**Privacy model:** anyone can *verify a specific certificate code*, but the full
registry is **private** — nobody can list, browse, or download it. Only you see
all records, in the Supabase dashboard.

How it works: the `certificates` table is locked by Row-Level Security so the
public key can't read it. The site verifies a code by calling a locked function,
`verify_cert(code)`, which returns **only the one exact match**. No code → no
data. This is the standard grading-house model (PSA/CGC).

While `assets/js/config.js` is blank, the page uses a small bundled sample set so
everything keeps working until you finish these steps.

---

## Step 1 — Create the Supabase project (~2 min)
Supabase is a hosted Postgres database with an auto-generated API — the "backend"
your static GitHub Pages site can't run itself.
1. Sign up at <https://supabase.com> → **New project**.
2. Name it, set a strong database password, pick a nearby region.
3. Wait ~2 minutes for provisioning. The free tier holds 50,000+ rows easily.

## Step 2 — Create the table, lock it, add the verify function
Open **SQL Editor → New query**, paste all of this, and **Run**:

```sql
-- 1) The table
create table if not exists public.certificates (
  cert         text primary key,          -- e.g. GLA0001005
  title        text not null,
  "set"        text,
  category     text,
  grade        text,
  grade_label  text,
  certified    date,
  holder       text,
  auth_only    boolean not null default false,
  subgrades    jsonb   not null default '{}'::jsonb
);

-- 2) Lock the table: RLS on, and NO policy for the public.
--    => the anon (public) key cannot read, list, or dump this table at all.
alter table public.certificates enable row level security;
revoke all on public.certificates from anon;

-- 3) A locked lookup function. SECURITY DEFINER lets it read the table on the
--    caller's behalf, but it only ever returns the single exact-code match.
create or replace function public.verify_cert(p_cert text)
returns setof public.certificates
language sql
security definer
set search_path = public
as $$
  select * from public.certificates where cert = p_cert limit 1;
$$;

-- 4) Allow the public to CALL the function (not the table).
grant execute on function public.verify_cert(text) to anon;
```

What this achieves:
- **Public verify works** — the site (anon key) can call `verify_cert('GLA…')`.
- **Registry stays private** — the anon key can't `select * from certificates`,
  so it can't be listed or downloaded. Only you (dashboard / service_role) see
  the whole table.

## Step 3 — Connect the site and add your records
**A) Connect.** In **Project Settings → API**, copy the **Project URL** and the
**anon / public** key into `assets/js/config.js`:
```js
window.GLA_CONFIG = {
  supabaseUrl: 'https://YOURPROJECT.supabase.co',
  supabaseAnonKey: 'eyJhbGciOi...anon key...',
  certRpc: 'verify_cert'
};
```
> ⚠️ Use the **anon / public** key only. Never put the **service_role** key in
> the site or the repo — it bypasses RLS and would expose everything. The anon
> key is safe here because it can only call `verify_cert`, never read the table.

**B) Add certificates** (you do this privately, in Supabase):
- **CSV import (bulk):** Table Editor → `certificates` → **Insert → Import from
  CSV**. Headers:
  ```
  cert,title,set,category,grade,grade_label,certified,holder,auth_only,subgrades
  GLA0001005,Doctor Fate — Relic Patch,Warner Bros / DC · Relic Patch Card,Trading Cards,10,Gem Mint,2026-02-14,GLA Premium Slab,false,"{""Centering"":""10"",""Corners"":""10"",""Edges"":""10"",""Surface"":""9.5""}"
  ```
  `subgrades` is a JSON object (as text). `certified` = `YYYY-MM-DD`.
  `auth_only` = `true` for authentication-only items.
- **Or SQL insert (seed the current samples):**
  ```sql
  insert into public.certificates
    (cert,title,"set",category,grade,grade_label,certified,holder,auth_only,subgrades)
  values
    ('GLA0001005','Doctor Fate — Relic Patch','Warner Bros / DC · Relic Patch Card','Trading Cards','10','Gem Mint','2026-02-14','GLA Premium Slab',false,
     '{"Centering":"10","Corners":"10","Edges":"10","Surface":"9.5"}')
  on conflict (cert) do update set
    title=excluded.title,"set"=excluded."set",category=excluded.category,grade=excluded.grade,
    grade_label=excluded.grade_label,certified=excluded.certified,holder=excluded.holder,
    auth_only=excluded.auth_only,subgrades=excluded.subgrades;
  ```

## Step 4 — Test
Open **verify.html** and search `GLA0001005` (or use a QR that links to
`verify.html?cert=GLA0001005`). It returns the record via the function. A wrong
code shows "No record found"; a network/config problem shows "Couldn't reach the
certification database."

Want to double-check the lock worked? In the browser console on your live site:
```js
fetch(GLA_CONFIG.supabaseUrl + '/rest/v1/certificates?select=*',
  { headers: { apikey: GLA_CONFIG.supabaseAnonKey } }).then(r => r.status)
// -> 401/403 or empty: good, the table is NOT publicly readable.
```

---

### How the front end uses it
`assets/js/verify.js` → `lookup()` sends:
```
POST {supabaseUrl}/rest/v1/rpc/verify_cert
  headers: apikey + Authorization: Bearer {anon key}
  body:    { "p_cert": "GLA0001005" }
```
and maps the returned row (`grade_label`→`gradeLabel`, `auth_only`→`authOnly`, …)
into the certificate card. Nothing else changes as the registry grows.

### Managing records later
For now you add/edit certs in the Supabase dashboard. If you want an in-site
**admin page** (log in → issue a cert + auto-generate its QR), that's a small
add-on — ask and I'll build it.
