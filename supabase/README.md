# RepRoot cloud setup

RepRoot is connected to Supabase project `syfiwpmsoruirefeksbk` using its browser-safe publishable key. Authentication sessions and version 4 training snapshots now sync across devices while local storage remains an offline cache.

## Dashboard configuration

1. Run [`schema.sql`](schema.sql) in the Supabase SQL editor.
2. Under **Authentication → URL Configuration**, use `https://manpazito.github.io/RepRoot/` for the production Site URL and allow `https://manpazito.github.io/RepRoot/**` as a redirect URL.
3. Keep email/password authentication enabled.
4. For the initial private rollout, disable **Confirm Email**. Supabase's built-in mailer is restricted and may not deliver to someone outside the project organization. Configure custom SMTP before enabling confirmations and password-recovery email for general users.
5. After the intended users have accounts, optionally disable new user signups in Supabase.

Never add an `sb_secret_` or legacy `service_role` key to browser code. The included `sb_publishable_` key identifies the project but does not bypass row-level security.

## Storage behavior

The browser reads and upserts only the `training_snapshots` row whose `user_id` matches `auth.uid()`. Anonymous reads return no rows and anonymous writes are rejected. The snapshot contains routines, custom exercises, settings, strength/cardio logs, sessions, and an active workout.

Partner links are provisioned by the schema but not yet exposed in the UI. A future invitation flow should resolve email addresses inside a server-side Edge Function rather than exposing account lookup to browser clients.

Official references:

- [Password-based authentication](https://supabase.com/docs/guides/auth/passwords)
- [API key types](https://supabase.com/docs/guides/getting-started/api-keys)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
