# Vaganza Events & Entertainment

Next.js website and secure event administration panel for Vaganza Lisboa.

## Local setup

1. Copy `.env.example` to `.env.local` and provide the required values.
2. Run `npm install`.
3. Run `npm run db:migrate && npm run db:seed`.
4. Run `npm run dev`.

The public site uses safe built-in seed data when `DATABASE_URL` is absent, so builds and previews remain available. Admin writes require PostgreSQL.

## Production environment

- `DATABASE_URL`: Supabase PostgreSQL transaction-pooler connection string
- `AUTH_SECRET`: random secret, at least 32 characters
- `ADMIN_EMAIL`: administrator email
- `ADMIN_PASSWORD_HASH`: bcrypt hash of the administrator password

No secret values belong in Git.
