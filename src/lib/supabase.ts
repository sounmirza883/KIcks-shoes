import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// null when the env vars are missing, so the storefront still browses; callers must handle it.
// Only the public anon/publishable key belongs here. It is safe only because RLS is on (supabase/schema.sql).
// Read before createClient runs: the client strips the URL fragment, and a password-reset link must open the
// "choose a new password" form even if the PASSWORD_RECOVERY event fires before App subscribes.
export const openedFromRecoveryLink = window.location.hash.includes('type=recovery');

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
