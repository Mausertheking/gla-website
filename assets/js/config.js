/* Grading Lab Agency — front-end config.
   ---------------------------------------------------------------------------
   Fill these in with YOUR keys. Everything here is safe to be public.

   Supabase (certificate lookup): use the PUBLIC "anon" key only — never the
   service_role key. The certificates table is locked; the site only calls the
   verify_cert function. See SUPABASE_SETUP.md.

   Contact form: no backend needed — submitting opens the visitor's email app
   with the message pre-filled, addressed to contactEmail below.
   ------------------------------------------------------------------------- */
window.GLA_CONFIG = {
  // Supabase
  supabaseUrl: '',
  supabaseAnonKey: '',
  certRpc: 'verify_cert',

  // Contact form recipient
  contactEmail: 'info.gradinglabagency@gmail.com'
};
