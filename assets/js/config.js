/* Grading Lab Agency — front-end config.
   ---------------------------------------------------------------------------
   Fill these in with YOUR keys. Everything here is safe to be public.

   Supabase (certificate lookup): use the PUBLIC "anon" key only — never the
   service_role key. The certificates table is locked; the site only calls the
   verify_cert function. See SUPABASE_SETUP.md.

   Contact form: enquiries are emailed to contactEmail via FormSubmit
   (free, unlimited, no key). One-time setup: after the first submission,
   click the activation link FormSubmit emails to contactEmail.
   ------------------------------------------------------------------------- */
window.GLA_CONFIG = {
  // Supabase (publishable key is safe to be public; never put the secret key here)
  supabaseUrl: 'https://lgecsarpfviqvjfvyori.supabase.co',
  supabaseAnonKey: 'sb_publishable_xT8U-WRShUnZEBBnLlmdAQ_1iic0IqQ',
  certRpc: 'verify_cert',

  // Contact form recipient (FormSubmit sends enquiries here)
  contactEmail: 'info.gradinglabagency@gmail.com'
};
