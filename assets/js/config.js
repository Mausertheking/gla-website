/* Grading Lab Agency — front-end config.
   ---------------------------------------------------------------------------
   Fill these in with YOUR Supabase project's values (Project Settings → API).
   Use the PUBLIC "anon" key only — never the service_role key.

   Privacy model: the certificates TABLE is locked (nobody can read or list it
   through the public key). The site verifies a code by calling a locked
   function (verify_cert) that returns only the single exact match — so anyone
   can verify a code they hold, but the full registry stays private to you in
   the Supabase dashboard. See SUPABASE_SETUP.md.

   While these are blank, the lookup falls back to the bundled sample set so the
   page keeps working offline.
   ------------------------------------------------------------------------- */
window.GLA_CONFIG = {
  supabaseUrl: '',      // e.g. 'https://abcdefgh.supabase.co'
  supabaseAnonKey: '',  // the public anon/public API key
  certRpc: 'verify_cert'
};
