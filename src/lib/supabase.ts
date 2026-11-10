import { createClient } from '@supabase/supabase-js';

// Read as literal process.env.NEXT_PUBLIC_* so Next.js inlines them into the browser bundle.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// null when the env vars are missing, so the storefront still browses; callers must handle it.
// Only the public anon/publishable key belongs here. It is safe only because RLS is on (supabase/schema.sql).
// Read before createClient runs: the client strips the URL fragment, and a password-reset link must open the
// "choose a new password" form even if the PASSWORD_RECOVERY event fires before App subscribes.
// The window guard is for the server prerender, where this module is also evaluated.
export const openedFromRecoveryLink =
  typeof window !== 'undefined' && window.location.hash.includes('type=recovery');

// Not gated on window: a null client on the server would make AccountPage render a different branch than the browser.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
