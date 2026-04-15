-- Idempotent: fixes DBs where `currency` was never added (e.g. migrate skipped or DB restored).
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'USD';
