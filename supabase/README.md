# Optional cloud setup

The shipped app deliberately remains local-only until real project credentials exist. The schema here is the backend boundary for adding multi-device accounts and private partner links without putting a privileged database key in the browser.

## Prepare the project

1. Create a Supabase project.
2. Run [`schema.sql`](schema.sql) in the Supabase SQL editor.
3. In Authentication, configure the deployed GitHub Pages URL as the site URL and redirect URL.
4. Copy the project URL and **publishable/anon** key. Never put a `service_role` key in this repository or any browser code.
5. Connect the app to `supabase-js`, use `signUp` / `signInWithPassword`, and read or upsert one `training_snapshots` row per signed-in user.

The table policies use `auth.uid()` so browser clients can access only their own profile and training payload. Partner rows are visible only to the two linked users, and only the invited user can change a pending link's status. A production invitation flow should resolve an email to a user ID inside a server-side function or Edge Function so account email addresses are never exposed to arbitrary clients.

Relevant official references:

- [Password-based authentication](https://supabase.com/docs/guides/auth/passwords)
- [Managing user profile data](https://supabase.com/docs/guides/auth/managing-user-data)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Migration behavior

The first cloud sign-in should offer to upload the current version 4 backup payload. Do not silently merge two histories: duplicate set IDs and conflicting edits need an explicit newest-write or user-choice policy. Keep local storage as an offline cache after cloud sync is enabled.
